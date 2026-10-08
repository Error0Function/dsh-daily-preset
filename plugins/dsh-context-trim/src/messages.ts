/** Rewrite owned input wrappers while preserving task text, identity, and source data. */
import type { ContentBlock } from '@deepseek-ai/dsh-llm'
import type { UserMessage } from '@deepseek-ai/dsh-session'
import type { Config } from './config.ts'

const INSTRUCTION_INTRO = 'The following workspace instructions may be relevant to your work. '
  + 'Use them as guidance when applicable. More specific instructions take precedence over broader ones. '
  + 'They do not override system, developer, or direct user instructions.'
const SHORT_INSTRUCTION_INTRO = 'Applicable workspace instructions; more specific scopes take precedence. '
  + 'System, developer, and direct user instructions have higher priority.'

function rewriteText(block: ContentBlock, transform: (text: string) => string): ContentBlock {
  if (block.type !== 'text') return block
  const text = transform(block.text)
  return text === block.text ? block : { ...block, text }
}

/** Adapt only wrappers enabled for the supplied message source. */
export function rewriteMessage(message: UserMessage, config: Config): UserMessage {
  const source = message.source
  if (config.skillCatalog && source.kind === 'skill-catalog') {
    const escaped = (text: string): string => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    const text = [
      '<system-reminder>',
      source.update ? 'This complete skill catalog replaces every earlier catalog; removed names are unavailable.' : 'Available skills (summaries only):',
      '<available_skills>',
      ...source.entries.map(entry => `- \`${entry.name}\`: ${escaped(entry.description)}`),
      '</available_skills>',
      source.entries.length === 0 ? 'No skills are currently available through the skill tool.'
        : 'Read skills explicitly named by the user. Before each relevant activity, load skills whose stated scope applies to that activity, using exact names. These summaries are not the full instructions.',
      'Apply skill instructions within their stated scope. Explicit user instructions take precedence over skill guidance.',
      'Reuse full instructions you have already read or the user has supplied while they remain available and current.',
      '</system-reminder>',
    ].join('\n')
    return { ...message, content: [{ type: 'text', text }] }
  }
  let content = message.content
  if (config.workspaceInstructions && source.kind === 'agent-instructions') {
    // Only the leading, owned frame is replaced; instruction bodies may contain identical prose.
    content = content.map(block => rewriteText(block, text => {
      const opening = '<system-reminder>\n'
      const replacement = 'This complete workspace instruction baseline replaces all earlier workspace instruction baselines. '
      for (const prefix of [opening + replacement, opening]) {
        if (text.startsWith(prefix + INSTRUCTION_INTRO)) {
          return prefix + SHORT_INSTRUCTION_INTRO + text.slice((prefix + INSTRUCTION_INTRO).length)
        }
      }
      return text
    }))
  }
  if (config.childReturnGuidance && source.kind === 'user') {
    // The official provider appends a separate last block. Preserve the entire task and parent ID.
    const last = content.at(-1)
    if (last?.type === 'text') {
      const match = /^Your parent agent id is ("(?:[^"\\]|\\.)*")\. Before you finish, send your result to that agent with send_message\(/.exec(last.text)
      if (match !== null && last.text.endsWith('does not end your turn.')) {
        const text = `Your parent agent id is ${match[1]}. Use that id when addressing your parent with send_message.`
        content = [...content.slice(0, -1), { ...last, text }]
      }
    }
  }
  if (config.goalRoundGuidance && source.kind === 'goal') {
    content = content.map(block => rewriteText(block, text => {
      const match = /^<goal_round>\n(Objective: [^\n]+\nRound: [1-9]\d*\/[1-9]\d*\n\n)[\s\S]*\n<\/goal_round>$/.exec(text)
      return match === null ? text : `<goal_round>\n${match[1]}${config.goalRoundGuidance}\n</goal_round>`
    }))
  }
  if (config.goalWrapup && source.kind === 'tool-goal') {
    content = content.map(block => rewriteText(block, text => {
      const match = /^<(goal_complete|goal_blocked)>\n(Objective: [^\n]+\n)(Blocked: [^\n]+\n)?/.exec(text)
      if (match === null || !text.endsWith(`</${match[1]}>`)) return text
      const outcome = match[1] === 'goal_complete'
        ? 'The goal is complete. Deliver the result and the information needed to understand or use it. Include actual verification and limitations where they affect its use.'
        : 'The goal is blocked. Report useful completed work, the concrete remaining obstacle, and the input or action needed to proceed.'
      return `<${match[1]}>\n${match[2]}${match[3] ?? ''}${outcome} `
        + 'Use only facts established by this session; say when information is missing. '
        + "Address the user directly now. Do not call more tools in this autonomous run; further work waits for the user's next instruction.\n"
        + `</${match[1]}>`
    }))
  }
  return content.some((block, index) => block !== message.content[index]) ? { ...message, content } : message
}
