/** Tool schema projection and shared file guidance; execution schemas stay untouched. */
import type { ToolSchema } from '@deepseek-ai/dsh-llm'
import type { PromptAssembly } from '@deepseek-ai/dsh-system-prompt'
import type { ToolRule } from './config.ts'

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** Project explicitly selected descriptions, optional parameters, and property ordering. */
export function projectTool(tool: ToolSchema, rule: ToolRule): ToolSchema {
  const parameters = structuredClone(tool.parameters)
  if (!record(parameters.properties)) throw new Error(`DCT: ${tool.name} has no object parameter properties`)
  const properties = parameters.properties
  const required = Array.isArray(parameters.required) ? parameters.required : []
  const references = new Set([...Object.keys(rule.parameterDescriptions), ...rule.hideParameters, ...rule.parameterOrder])
  for (const key of references) {
    if (!Object.hasOwn(properties, key)) throw new Error(`DCT: unknown parameter ${tool.name}.${key}`)
    if (!record(properties[key])) throw new Error(`DCT: ${tool.name}.${key} has no editable description`)
  }
  for (const key of rule.hideParameters) {
    if (required.includes(key)) throw new Error(`DCT: cannot hide required parameter ${tool.name}.${key}`)
    delete properties[key]
  }
  for (const [key, description] of Object.entries(rule.parameterDescriptions)) {
    if (rule.hideParameters.includes(key)) throw new Error(`DCT: hidden parameter ${tool.name}.${key} also has a description rule`)
    properties[key] = { ...properties[key] as Record<string, unknown>, description }
  }
  const ordered = [...rule.parameterOrder, ...Object.keys(properties).filter(key => !rule.parameterOrder.includes(key))]
  if (ordered.some(key => !Object.hasOwn(properties, key))) throw new Error(`DCT: cannot order a hidden parameter of ${tool.name}`)
  parameters.properties = Object.fromEntries(ordered.map(key => [key, properties[key]]))
  return { ...tool, ...(rule.description === undefined ? {} : { description: rule.description }), parameters }
}

/** Merge the five native file-tool sections at their first original position. */
export function mergeFileGuidance(assembly: PromptAssembly): void {
  const names = new Set(assembly.tools.map(tool => tool.name))
  const sourceNames = new Set(['tool:read', 'tool:write', 'tool:edit', 'tool:glob', 'tool:grep'])
  const first = assembly.sections.findIndex(section => sourceNames.has(section.name))
  if (first < 0) return
  const visible = ['glob', 'grep', 'read', 'edit', 'write'].filter(name => names.has(name))
  const text = [
    visible.length > 0 ? `Prefer ${visible.join('/')} for file work.` : '',
    names.has('read') && (names.has('edit') || names.has('write'))
      ? 'Read an existing file before changing it unless you just created or edited it in this session.' : '',
  ].filter(Boolean).join(' ')
  const position = assembly.sections.slice(0, first).filter(section => !sourceNames.has(section.name)).length
  assembly.sections = assembly.sections.filter(section => !sourceNames.has(section.name))
  if (text) assembly.sections.splice(position, 0, { name: 'dct:files', text, interpolate: false })
}
