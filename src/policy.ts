/** Full access and user-selected child routes, frozen for each active run. */
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type { Agent } from '@deepseek-ai/dsh-agent'
import { ReasoningEffortId } from '@deepseek-ai/dsh-llm'
import type { LlmCallConfig } from '@deepseek-ai/dsh-llm'
import type {} from '@deepseek-ai/dsh-tools'
import type {} from '@deepseek-ai/dsh-system-prompt'
import type {} from '@deepseek-ai/dsh-permission-presets'
import type {} from '@deepseek-ai/dsh-session-query'
import { foldRequestHeader } from '@deepseek-ai/dsh-session'
import type {} from './index.ts'
import type { ChildModel } from './settings-types.ts'

/** Loader identity. */
export const name = 'daily-mode-policy'
/** Official permissions, parent observations, and native request resolution. */
export const inject = ['permissionPresets', 'tools', 'systemPrompt', 'dailyModeSettings', 'agents', 'sessionQuery']
/** Full-access preset used by this composition. */
export interface Config { permissionPreset: string }
/** The selected preset must resolve to full access without approval. */
export const Config: z<Config> = z.object({ permissionPreset: z.string().default('danger-full-access') })

/** Preserve the parent's resolved route while leaving adapter-default output limits native. */
function parentRoute(header: ReturnType<typeof foldRequestHeader>, options?: Agent['options']): LlmCallConfig {
  const config = header?.config ?? options
  if (config?.provider === undefined || config.model === undefined) throw new Error('Daily mode cannot resolve the parent model for this child')
  const route = header === undefined ? { provider: config.provider, model: config.model,
    ...(config.reasoningEffort === undefined ? {} : { reasoningEffort: config.reasoningEffort }),
    ...(config.maxTokens === undefined ? {} : { maxTokens: config.maxTokens }) } : { ...header.config }
  if (header?.adapterDefaults?.maxTokens === true) delete route.maxTokens
  return route
}

/** Read the same parent request from its live instance or a disposable durable observation. */
async function inheritParentRoute(ctx: Context, parentId: Agent['id'], signal: AbortSignal): Promise<LlmCallConfig> {
  const parent = ctx.agents.get(parentId)
  if (parent !== undefined) return parentRoute(parent.session.requestHeader(), parent.options)
  const observation = await ctx.sessionQuery.observeSession(parentId, { signal })
  try { return parentRoute(foldRequestHeader(observation.events)) }
  finally { observation[Symbol.dispose]() }
}

/**
 * Apply daily policy and choose each child's route at the beginning of a run.
 * @param ctx - daily composition, including its children.
 * @param config - configured full-access preset name.
 */
export function apply(ctx: Context, config: Config): void {
  const preset = ctx.permissionPresets.resolve(config.permissionPreset)
  if (preset.sandbox !== 'danger-full-access' || preset.approval !== 'never') throw new Error('Daily mode requires danger-full-access and approval never')
  ctx.tools.presentAs('native')
  const selections = new WeakMap<Agent, ChildModel | null>()
  const routes = new WeakMap<Agent, LlmCallConfig>()
  ctx.on('agent/created', async ({ agent }) => { ctx.permissionPresets.set(agent.session, config.permissionPreset) })
  ctx.on('agent/status', ({ agent, status }) => {
    if (status === 'running') selections.set(agent, ctx.dailyModeSettings.current())
    else { selections.delete(agent); routes.delete(agent) }
  })
  ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
    if (context.agent !== undefined) ctx.permissionPresets.set(context.agent.session, config.permissionPreset)
    return next()
  }, true)
  ctx.on('agent/request', async ({ agent, signal }, next) => {
    const proposed = await next()
    const parentId = agent.session.header.parentSession
    if (parentId === undefined) return proposed
    const frozen = routes.get(agent)
    if (frozen !== undefined) return frozen
    const selection = selections.has(agent) ? selections.get(agent)! : ctx.dailyModeSettings.current()
    let route: LlmCallConfig
    if (selection !== null) {
      route = { provider: selection.provider, model: selection.model,
        ...(selection.effort === undefined ? {} : { reasoningEffort: ReasoningEffortId(selection.effort) }) }
    } else {
      route = await inheritParentRoute(ctx, parentId, signal)
    }
    routes.set(agent, route)
    return route
  }, true)
}
