/** Parent tools for child waiting, archival, and archive-aware native listings. */
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'
import { SessionId } from '@deepseek-ai/dsh-session'
import type { SessionId as ChildId } from '@deepseek-ai/dsh-session'
import type { Agent } from '@deepseek-ai/dsh-agent'
import type { JsonValue } from '@deepseek-ai/dsh-util-values'
import type {} from '@deepseek-ai/dsh-workspace'
import { createWaitTool } from './wait.ts'

/** Loader identity. */
export const name = 'agent-control'
/** Native services; this plugin creates no child sessions or transport protocol. */
export const inject = ['tools', 'subagents', 'agents', 'sessions', 'sessionQuery', 'workspaceRegistry']

/** Deployment-selected wait duration limits. */
export interface Config {
  minTimeoutMinutes: number
  defaultTimeoutMinutes: number
  maxTimeoutMinutes: number
  hideArchived: boolean
}

/** Minutes are exposed to the model; Node timers use milliseconds internally. */
export const Config: z<Config> = z.object({
  minTimeoutMinutes: z.number().min(0).default(10),
  defaultTimeoutMinutes: z.number().min(0).default(10),
  maxTimeoutMinutes: z.number().min(0).default(60),
  hideArchived: z.boolean().default(true),
})

/**
 * Register wait, archive, and an archive-aware native child listing.
 * @param ctx - standing parent composition inherited by its children.
 * @param config - wait time limits and archive visibility.
 */
export function apply(ctx: Context, config: Config): void {
  const limits = [config.minTimeoutMinutes, config.defaultTimeoutMinutes, config.maxTimeoutMinutes]
  if (limits.some(value => !Number.isFinite(value) || value <= 0)
    || config.minTimeoutMinutes > config.defaultTimeoutMinutes || config.defaultTimeoutMinutes > config.maxTimeoutMinutes
    || config.maxTimeoutMinutes * 60000 > 2147483647) throw new Error('Invalid agent-control wait duration configuration')

  const waiter = createWaitTool(ctx, config, children)
  ctx.tools.register(waiter.tool)

  async function children(parent: Agent, ids: readonly string[], signal: AbortSignal, allowArchived = false): Promise<Map<ChildId, string>> {
    if (ids.length === 0 || new Set(ids).size !== ids.length) throw new Error('Select one or more distinct child IDs')
    const catalog = await ctx.subagents.listChildren(parent.id, signal)
    const result = new Map<ChildId, string>()
    for (const raw of ids) {
      const id = SessionId(raw)
      const child = catalog.find(entry => entry.id === id)
      if (child === undefined || ('kind' in child && child.kind === 'diagnostic') || child.mode !== 'continuable') {
        throw new Error(`Not an available direct continuable child: ${raw}`)
      }
      if (!allowArchived && ctx.workspaceRegistry.archivedSessionIds.includes(id)) throw new Error(`Child is archived: ${raw}`)
      result.set(id, child.label)
    }
    return result
  }

  ctx.tools.register(defineTool({
    name: 'archive_agent',
    description: 'Stop and archive your child agent, releasing its live runtime while preserving its session history.',
    parameters: {
      agent_id: { type: 'string', required: true, description: 'A direct continuable child ID.' },
      reason: { type: 'string', description: 'Optional short reason recorded with this call.' },
    },
    output: { schema: { type: 'json' }, render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }] },
    isConcurrencySafe: () => false,
    async execute(args, execution) {
      const parent = execution.agent
      if (parent === undefined) throw new Error('archive_agent requires a parent Agent')
      const selected = await children(parent, [args.agent_id], execution.signal, true)
      const id = SessionId(args.agent_id)
      execution.signal.throwIfAborted()
      await ctx.workspaceRegistry.archiveSession(id, { stopActivity: true })
      await ctx.subagents.drainContinuableChildren(parent, [id])
      waiter.forget(id)
      return { agent_id: id, label: selected.get(id)!, archived: true }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'list_agents',
    description: 'List your continuable children with their IDs, nicknames, and current activity. Inactive does not mean successful completion.',
    parameters: {
      scope: { type: 'string', enum: ['children', 'descendants'], description: 'children (default): direct children; descendants: the full tree with parent and depth.' },
    },
    output: { schema: { type: 'json' }, render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }] },
    isConcurrencySafe: () => true,
    async execute(args, execution) {
      const parent = execution.agent
      if (parent === undefined) throw new Error('list_agents requires an Agent')
      const descendants = args.scope === 'descendants'
      const catalog = descendants
        ? await ctx.subagents.listDescendants(parent.id, execution.signal)
        : await ctx.subagents.listChildren(parent.id, execution.signal)
      const archived = new Set(ctx.workspaceRegistry.archivedSessionIds)
      const result: JsonValue[] = []
      for (const entry of catalog) {
        if (config.hideArchived && archived.has(entry.id)) continue
        const position: Record<string, JsonValue> = {}
        if ('parentId' in entry) { position.parent = entry.parentId; position.depth = entry.depth }
        if ('kind' in entry && entry.kind === 'diagnostic') {
          result.push({ kind: 'diagnostic', id: entry.id, reason: entry.reason, ...position })
          continue
        }
        if (entry.mode !== 'continuable') continue
        result.push({ kind: 'child', id: entry.id, label: entry.label, status: ctx.agents.get(entry.id)?.status === 'running' ? 'running' : 'inactive', ...position })
      }
      return result
    },
  }))
}
