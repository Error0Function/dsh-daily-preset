/** Wait signals and durable consumption over native child runs and the parent Inbox. */
import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'
import type { SessionId as ChildId, UserMessage } from '@deepseek-ai/dsh-session'
import type { Agent } from '@deepseek-ai/dsh-agent'
import type { SubagentRunInfo, SubagentRunEndInfo } from '@deepseek-ai/dsh-subagent'
import type { JsonValue } from '@deepseek-ai/dsh-util-values'
import type {} from '@deepseek-ai/dsh-session-query'
import type { Config } from './index.ts'

type Target = {
  agent_id: string
  label: string
  satisfied: boolean
  signals: Signal[]
}
type Signal = { type: 'message'; message_ids: string[] }
  | { type: 'settled'; run_key: string; stop_reason: string }
type WaitValue = { reason: 'signal' | 'timeout'; targets: Target[]; pending: string[] }
type Consumption = { messages: Set<string>; runs: Set<string> }
type Run = { start: SubagentRunInfo; end?: SubagentRunEndInfo }

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function strings(value: unknown): string[] {
  if (!Array.isArray(value) || !value.every(item => typeof item === 'string')) throw new Error('Invalid dsh-agent-control wait metadata')
  return value
}

function foldConsumption(meta: unknown, state: Consumption): void {
  if (!record(meta) || meta.kind !== 'dsh-agent-control/wait') return
  if (meta.version !== 1) throw new Error('Unsupported dsh-agent-control wait metadata version')
  for (const id of strings(meta.message_ids)) state.messages.add(id)
  for (const key of strings(meta.run_keys)) state.runs.add(key)
}

function metadata(value: JsonValue): JsonValue {
  if (!record(value) || !Array.isArray(value.targets)) throw new Error('Invalid wait result')
  const messageIds: string[] = []
  const runKeys: string[] = []
  for (const target of value.targets) {
    if (!record(target) || !Array.isArray(target.signals)) throw new Error('Invalid wait target result')
    for (const signal of target.signals) {
      if (!record(signal)) throw new Error('Invalid wait signal result')
      if (signal.type === 'message') messageIds.push(...strings(signal.message_ids))
      if (signal.type === 'settled' && typeof signal.run_key === 'string') runKeys.push(signal.run_key)
    }
  }
  return { kind: 'dsh-agent-control/wait', version: 1, message_ids: messageIds, run_keys: runKeys }
}

/** Create a wait tool and release its listeners and timers when the mounting scope unloads. */
export function createWaitTool(ctx: Context, config: Config,
  children: (parent: Agent, ids: readonly string[], signal: AbortSignal) => Promise<Map<ChildId, string>>) {
  const disposal = new AbortController()
  ctx.effect(() => () => disposal.abort(new Error('dsh-agent-control unloaded')))
  const runs = new Map<ChildId, Run>()
  const states = new WeakMap<Agent, Promise<Consumption>>()
  const wake = new Set<(id: ChildId) => void>()
  const notify = (id: ChildId): void => { for (const listener of wake) listener(id) }
  ctx.on('subagent/start', info => { runs.set(info.id, { start: info }); notify(info.id) })
  ctx.on('subagent/end', info => {
    const run = runs.get(info.id)
    if (run?.start.runId === info.runId) run.end = info
    notify(info.id)
  })
  ctx.on('session/event', (session, event) => {
    if (event.type === 'agent/inbox/spliced' || event.type === 'turn/end') notify(session.id)
  })

  async function consumption(parent: Agent, signal: AbortSignal): Promise<Consumption> {
    let pending = states.get(parent)
    if (pending === undefined) {
      pending = (async () => {
        const state: Consumption = { messages: new Set(), runs: new Set() }
        const observation = await ctx.sessionQuery.observeSession(parent.id, { signal, projectionMode: 'none' })
        try {
          for (const event of observation.events) if (event.type === 'tool/result' && !event.data.message.isError) foldConsumption(event.data.meta, state)
        } finally { observation[Symbol.dispose]() }
        return state
      })()
      states.set(parent, pending)
      void pending.catch(() => { states.delete(parent) })
    }
    return pending
  }

  async function terminal(id: ChildId, state: Consumption, signal: AbortSignal): Promise<Signal | undefined> {
    const run = runs.get(id)
    if (run !== undefined && run.end === undefined) return undefined
    if (ctx.agents.get(id)?.status === 'running') return undefined
    const observation = await ctx.sessionQuery.observeSession(id, { signal, projectionMode: 'all' })
    try {
      const inbox = observation.projections?.values.inbox
      if (!record(inbox) || !Array.isArray(inbox['next-turn']) || !Array.isArray(inbox['next-step'])) {
        throw new Error(`Inbox projection is unavailable for child ${id}`)
      }
      if (inbox['next-turn'].length > 0 || inbox['next-step'].length > 0) return undefined
      const boundary = observation.events.findLast(event => event.type === 'turn/start' || event.type === 'turn/end')
      if (boundary?.type !== 'turn/end') return undefined
      // Durable end positions survive Host restart; idle without an end never qualifies.
      const key = `${id}:${boundary.seq}`
      if (state.runs.has(key)) return undefined
      if (runs.get(id) !== run || ctx.agents.get(id)?.status === 'running') return undefined
      return { type: 'settled', run_key: key, stop_reason: run?.end?.stopReason ?? boundary.data.reason.kind }
    } finally { observation[Symbol.dispose]() }
  }

  const tool = defineTool({
    name: 'wait_agent',
    description: 'Wait for selected children to send new messages or settle their runs. OR returns when any target qualifies; '
      + 'AND records qualifying targets until all qualify. Waiting suspends your sampling while children continue. '
      + 'Timeout returns satisfied and pending targets. New messages are delivered to your next step.',
    parameters: {
      agent_ids: { type: 'array', required: true, description: 'One or more distinct direct child IDs.', items: { type: 'string' } },
      mode: { type: 'string', enum: ['or', 'and'], description: 'or (default): any target; and: every target.' },
      wake_on: { type: 'array', description: 'Signals per target; defaults to both. Any selected signal qualifies that target.', items: { type: 'string', enum: ['message', 'settled'] } },
      timeout_minutes: { type: 'number', description: `Timeout in minutes: ${config.minTimeoutMinutes}–${config.maxTimeoutMinutes}, defaults to ${config.defaultTimeoutMinutes}. Signals return immediately.` },
    },
    output: { schema: { type: 'json' }, render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }], presentationMeta: (_args, value) => metadata(value) },
    isConcurrencySafe: () => false,
    async execute(args, execution) {
      const parent = execution.agent
      if (parent === undefined) throw new Error('wait_agent requires a parent Agent')
      const minutes = args.timeout_minutes ?? config.defaultTimeoutMinutes
      if (!Number.isFinite(minutes) || minutes < config.minTimeoutMinutes || minutes > config.maxTimeoutMinutes) {
        throw new Error(`timeout_minutes must be between ${config.minTimeoutMinutes} and ${config.maxTimeoutMinutes}`)
      }
      const signal = AbortSignal.any([execution.signal, disposal.signal])
      signal.throwIfAborted()
      const selected = await children(parent, args.agent_ids, signal)
      const state = await consumption(parent, signal)
      const wanted = new Set(args.wake_on ?? ['message', 'settled'])
      if (wanted.size === 0) throw new Error('wake_on must select a signal')
      const mode = args.mode ?? 'or'
      const targets = new Map<ChildId, Target>([...selected].map(([id, label]) => [id, { agent_id: id, label, satisfied: false, signals: [] }]))
      let dirty = true
      let timedOut = false
      let pulse: (() => void) | undefined
      const notifyWait = (id: ChildId): void => {
        if (id !== parent.id && !selected.has(id)) return
        dirty = true
        pulse?.()
      }
      wake.add(notifyWait)
      const timer = setTimeout(() => { timedOut = true; pulse?.() }, minutes * 60000)
      const abort = (): void => { pulse?.() }
      signal.addEventListener('abort', abort, { once: true })
      try {
        while (true) {
          signal.throwIfAborted()
          dirty = false
          const pendingMessages: readonly UserMessage[] = [...parent.inbox.nextTurn, ...parent.inbox.nextStep]
          await Promise.all([...targets].map(async ([id, target]) => {
            if (target.satisfied) return
            if (wanted.has('message')) {
              const messages = pendingMessages.filter(message => message.source.kind === 'agent-message'
                && message.source.senderSessionId === id && !state.messages.has(message.id))
              if (messages.length > 0) target.signals.push({ type: 'message', message_ids: messages.map(message => message.id) })
            }
            if (wanted.has('settled') && target.signals.length === 0) {
              const settled = await terminal(id, state, signal)
              if (settled !== undefined) target.signals.push(settled)
            }
            target.satisfied = target.signals.length > 0
          }))
          signal.throwIfAborted()
          const rows = [...targets.values()]
          const satisfied = mode === 'and' ? rows.every(target => target.satisfied) : rows.some(target => target.satisfied)
          if (satisfied || timedOut) {
            const value: WaitValue = { reason: satisfied ? 'signal' : 'timeout', targets: rows, pending: rows.filter(target => !target.satisfied).map(target => target.agent_id) }
            foldConsumption(metadata(value), state)
            return value
          }
          if (dirty) continue
          await new Promise<void>(resolve => { pulse = resolve; if (dirty || timedOut || signal.aborted) resolve() })
          pulse = undefined
        }
      } finally {
        clearTimeout(timer)
        signal.removeEventListener('abort', abort)
        wake.delete(notifyWait)
      }
    },
  })

  return { tool, forget: (id: ChildId): void => { runs.delete(id) } }
}
