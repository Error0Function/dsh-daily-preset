/** Authored presentation rules for the mounting composition and its children. */
import z from '@deepseek-ai/schemastery'

/** Presentation changes for one explicitly named tool. */
export interface ToolRule {
  name: string
  description?: string
  parameterDescriptions: Record<string, string>
  hideParameters: string[]
  parameterOrder: string[]
  hide: boolean
}

/** Rules apply only in the composition mounting this plugin and its descendants. */
export interface Config {
  tools: ToolRule[]
  sections: Record<string, string | null>
  /** Child-only replacements layered over the shared section rules. */
  childSections: Record<string, string | null>
  /** Child-only tool descriptions; schemas and execution rules stay shared. */
  childToolDescriptions: Record<string, string>
  /** Explicit section-to-tool links; omit the section when its tool is not visible. */
  sectionTools: Record<string, string>
  /** Explicit section replacements while the current Agent has an active Goal. Requires the goals service. */
  activeGoalSections: Record<string, string>
  contexts: Record<string, string | null>
  mergeFileGuidance: boolean
  skillCatalog: boolean
  workspaceInstructions: boolean
  childReturnGuidance: boolean
  goalWrapup: boolean
  /** Replace the official goal-round guidance while retaining its objective and round header. */
  goalRoundGuidance: string
}

/** Validate authored rules before joining an Agent composition. */
export const Config: z<Config> = z.object({
  tools: z.array(z.object({
    name: z.string().required(),
    description: z.string(),
    parameterDescriptions: z.dict(z.string()).default({}),
    hideParameters: z.array(z.string()).default([]),
    parameterOrder: z.array(z.string()).default([]),
    hide: z.boolean().default(false),
  })).default([]),
  sections: z.dict(z.union([z.string(), z.const(null)])).default({}),
  childSections: z.dict(z.union([z.string(), z.const(null)])).default({}),
  childToolDescriptions: z.dict(z.string()).default({}),
  sectionTools: z.dict(z.string()).default({}),
  activeGoalSections: z.dict(z.string()).default({}),
  contexts: z.dict(z.union([z.string(), z.const(null)])).default({}),
  mergeFileGuidance: z.boolean().default(false),
  skillCatalog: z.boolean().default(false),
  workspaceInstructions: z.boolean().default(false),
  childReturnGuidance: z.boolean().default(false),
  goalWrapup: z.boolean().default(false),
  goalRoundGuidance: z.string().default(''),
})

function unique(values: string[], subject: string): void {
  if (new Set(values).size !== values.length) throw new Error(`DCT: duplicate ${subject}`)
}

/** Validate duplicate tool and parameter references before installing listeners. */
export function validateRules(config: Config): void {
  unique(config.tools.map(rule => rule.name), 'tool rules')
  for (const rule of config.tools) {
    unique(rule.hideParameters, `hidden parameters for ${rule.name}`)
    unique(rule.parameterOrder, `parameter order for ${rule.name}`)
  }
}
