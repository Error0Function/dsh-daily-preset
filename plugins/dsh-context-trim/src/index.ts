/** Scoped assembly, call-denial, and pre-step listeners for explicit presentation rules. */
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-agent'
import type {} from '@deepseek-ai/dsh-tools'
import type {} from '@deepseek-ai/dsh-system-prompt'
import type {} from '@deepseek-ai/dsh-tool-skill'
import type {} from '@deepseek-ai/dsh-agent-instructions'
import type {} from '@deepseek-ai/dsh-tool-goal'
import type {} from '@deepseek-ai/dsh-goal-round-driver'
import type {} from '@deepseek-ai/dsh-goal'
import { validateRules, type Config } from './config.ts'
import { projectTool, mergeFileGuidance } from './tools.ts'
import { rewriteMessage } from './messages.ts'

export { Config, type ToolRule } from './config.ts'
/** Loader identity. */
export const name = 'context-trim'
/** Services supplying the public assembly and execution events. */
export const inject = ['tools', 'systemPrompt']

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function rewriteNamed<T extends { name: string; text: string }>(items: T[], rules: Record<string, string | null>): T[] {
  return items.flatMap(item => {
    if (!Object.hasOwn(rules, item.name)) return [item]
    const text = rules[item.name]
    return text === null ? [] : [{ ...item, text }]
  })
}

/**
 * Install scoped presentation and explicit call-denial rules.
 * @param ctx - standing Agent composition.
 * @param config - explicitly selected tools, sections, contexts, and owned message wrappers.
 */
export function apply(ctx: Context, config: Config): void {
  if (Object.keys(config.activeGoalSections).length > 0) {
    ctx.inject(['goals'], scoped => install(scoped, config))
  } else {
    install(ctx, config)
  }
}

function install(ctx: Context, config: Config): void {
  const usesGoalState = Object.keys(config.activeGoalSections).length > 0
  validateRules(config)
  const rules = new Map(config.tools.map(rule => [rule.name, rule]))
  ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
    const assembly = await next()
    const child = context.agent?.session.header.parentSession !== undefined
    if (assembly.tools.some(tool => tool.name === 'run_code')) throw new Error('DCT supports native tools only; PTC and both presentations are unsupported.')
    assembly.tools = assembly.tools.flatMap(tool => {
      const rule = rules.get(tool.name)
      if (rule?.hide) return []
      const projected = rule === undefined ? tool : projectTool(tool, rule)
      const description = child ? config.childToolDescriptions[tool.name] : undefined
      return [description === undefined ? projected : { ...projected, description }]
    })
    const activeGoalSections = usesGoalState && context.agent !== undefined && ctx.goals.get(context.agent)?.phase === 'active'
      ? config.activeGoalSections : {}
    const sectionRules = { ...config.sections, ...activeGoalSections, ...(child ? config.childSections : {}) }
    assembly.sections = rewriteNamed(assembly.sections, sectionRules)
    assembly.contexts = rewriteNamed(assembly.contexts, config.contexts)
    const names = new Set(assembly.tools.map(tool => tool.name))
    assembly.sections = assembly.sections.filter(section => {
      const tool = config.sectionTools[section.name]
      if (tool !== undefined && !names.has(tool)) return false
      return !config.tools.some(rule => rule.hide && section.name === `tool:${rule.name}`)
    })
    if (config.mergeFileGuidance) mergeFileGuidance(assembly)
    return assembly
  }, true)
  ctx.on('tools/pre-execute', async (execution, next) => {
    const decision = await next()
    if (decision.kind === 'deny' || decision.kind === 'cancel') return decision
    const rule = rules.get(execution.name)
    if (rule?.hide) return { kind: 'deny', reason: `DCT: ${execution.name} is hidden in this mode.` }
    if (rule !== undefined && record(execution.arguments)) {
      const hidden = rule.hideParameters.find(key => Object.hasOwn(execution.arguments as Record<string, unknown>, key))
      if (hidden !== undefined) return { kind: 'deny', reason: `DCT: ${execution.name}.${hidden} is hidden in this mode.` }
    }
    return decision
  }, true)
  ctx.on('agent/pre-step', async ({ agent }, next) => {
    const decision = await next()
    if (decision.kind === 'reject') return decision
    const child = agent.session.header.parentSession !== undefined
    return { ...decision, messages: decision.messages.flatMap(message => {
      if (config.skillCatalog && message.source.kind === 'skill-catalog' && rules.get('skill')?.hide) return []
      return [rewriteMessage(message, { ...config, childReturnGuidance: config.childReturnGuidance && child })]
    }) }
  }, true)
}
