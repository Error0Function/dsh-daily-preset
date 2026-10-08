/** Catalog translations and the locale namespace shared by the view and metrics. */
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
export const NS = 'agentArchiveFilter'
export type CopyKey = 'tree' | 'loading' | 'loadError' | 'retry' | 'running' | 'inactive' | 'completed' | 'oneShot' | 'continuable' | 'unknown' | 'count' | 'countOne' | 'countRunning' | 'countRunningOne' | 'expand' | 'collapse' | 'openSidebar' | 'openSidebarAria' | 'tokenThousand' | 'tokenMillion' | 'tokenTotal' | 'durationSeconds' | 'durationMinutes' | 'durationHours' | 'durationDays' | 'durationDaysHours' | 'durationMonths' | 'durationMonthsDays' | 'durationYears' | 'durationYearsMonths' | 'durationExactDays' | 'durationExactTitle'
export const zh: Record<CopyKey, string> = {
  tree: '子智能体会话', loading: '正在加载子智能体…', loadError: '无法加载子智能体', retry: '重试',
  running: '正在运行', inactive: '当前未运行', completed: '已完成', oneShot: '一次性',
  continuable: '可继续', unknown: '模式未知', count: '{count} 个子智能体', countOne: '{count} 个子智能体',
  countRunning: '{count} 个子智能体，正在运行', countRunningOne: '{count} 个子智能体，正在运行', expand: '展开 {label} 的下级子智能体',
  collapse: '收起 {label} 的下级子智能体', openSidebar: '在侧边栏打开', openSidebarAria: '在侧边栏打开 {label}',
  tokenThousand: '{value}K', tokenMillion: '{value}M', tokenTotal: '{value} tok',
  durationSeconds: '{seconds}秒', durationMinutes: '{minutes}分{seconds}秒', durationHours: '{hours}小时{minutes}分{seconds}秒',
  durationDays: '{days}天', durationDaysHours: '{days}天{hours}小时', durationMonths: '约{months}个月', durationMonthsDays: '约{months}个月{days}天',
  durationYears: '约{years}年', durationYearsMonths: '约{years}年{months}个月', durationExactDays: '{days}天{hours}小时{minutes}分{seconds}秒',
  durationExactTitle: '总活跃耗时：{duration}',
}
export const en: Record<CopyKey, string> = {
  tree: 'Subagent sessions', loading: 'Loading subagents…', loadError: 'Unable to load subagents', retry: 'Retry',
  running: 'running', inactive: 'not running', completed: 'completed', oneShot: 'one-shot',
  continuable: 'continuable', unknown: 'unknown mode', count: '{count} subagents', countOne: '{count} subagent',
  countRunning: '{count} subagents running', countRunningOne: '{count} subagent running', expand: 'Expand descendants of {label}',
  collapse: 'Collapse descendants of {label}', openSidebar: 'Open in sidebar', openSidebarAria: 'Open {label} in sidebar',
  tokenThousand: '{value}K', tokenMillion: '{value}M', tokenTotal: '{value} tok',
  durationSeconds: '{seconds}s', durationMinutes: '{minutes}m {seconds}s', durationHours: '{hours}h {minutes}m {seconds}s',
  durationDays: '{days}d', durationDaysHours: '{days}d {hours}h', durationMonths: '~{months}mo', durationMonthsDays: '~{months}mo {days}d',
  durationYears: '~{years}y', durationYearsMonths: '~{years}y {months}mo', durationExactDays: '{days}d {hours}h {minutes}m {seconds}s',
  durationExactTitle: 'Total active duration: {duration}',
}

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap { agentArchiveFilter: CopyKey }
}

/** Translation function passed by the native slot renderer. */
export type Translate = PropsLocale<typeof NS>['t']
