/** Existing token totals and active-duration formatting for catalog rows. */
import type { SessionProjectionMap, SessionSummary } from '@deepseek-ai/dsh-api-session-controller/client'
import type { Translate } from './locales.ts'

/** Use the native thousand/million scale and rounding for a row's token total. */
export function formatTokens(value: number, t: Translate): string {
  const scaled = (next: number): string => next >= 100
    ? String(Math.round(next))
    : String(Math.round(next * 10) / 10)
  if (value < 1_000) return String(value)
  if (value < 1_000_000) return t('tokenThousand', { value: scaled(value / 1_000) })
  return t('tokenMillion', { value: scaled(value / 1_000_000) })
}

/** Include cached input in the cumulative total; absence stays unknown. */
export function tokenTotal(usage: SessionProjectionMap['tokenUsage'] | undefined): number | undefined {
  return usage === undefined
    ? undefined
    : usage.uncachedInputTokens + usage.outputTokens + usage.cacheReadTokens + usage.cacheWriteTokens
}

/** Combine settled time with the active interval, extending to now only while running. */
export function activityDuration(summary: SessionSummary | undefined, running: boolean, now: number): number | undefined {
  const timing = summary?.projectionValues?.subagentTiming
  if (timing === undefined) return undefined
  if (timing.active === undefined) return timing.settledMs
  const end = running ? now : timing.active.through
  return timing.settledMs + Math.max(0, end - timing.active.since)
}

interface DurationParts {
  seconds: number
  minutes: number
  hours: number
  days: number
  totalMinutes: number
  totalHours: number
}

function splitDuration(ms: number): DurationParts {
  const totalSeconds = Math.floor(Math.max(0, ms) / 1_000)
  const totalMinutes = Math.floor(totalSeconds / 60)
  const totalHours = Math.floor(totalMinutes / 60)
  return {
    seconds: totalSeconds % 60,
    minutes: totalMinutes % 60,
    hours: totalHours % 24,
    days: Math.floor(totalHours / 24),
    totalMinutes,
    totalHours,
  }
}

/** Display compact active time, with approximate months and years at larger scales. */
export function formatDuration(ms: number, t: Translate): string {
  const { seconds, minutes, hours, days, totalMinutes, totalHours } = splitDuration(ms)
  if (days >= 365) {
    const years = Math.floor(days / 365)
    const months = Math.floor((days % 365) / 30)
    return months === 0 ? t('durationYears', { years }) : t('durationYearsMonths', { years, months })
  }
  if (days >= 30) {
    const months = Math.floor(days / 30)
    const remainingDays = days % 30
    return remainingDays === 0 ? t('durationMonths', { months }) : t('durationMonthsDays', { months, days: remainingDays })
  }
  if (days > 0) return hours === 0 ? t('durationDays', { days }) : t('durationDaysHours', { days, hours })
  if (totalHours > 0) return t('durationHours', {
    hours: totalHours, minutes: String(minutes).padStart(2, '0'), seconds: String(seconds).padStart(2, '0'),
  })
  if (totalMinutes > 0) return t('durationMinutes', { minutes: totalMinutes, seconds: String(seconds).padStart(2, '0') })
  return t('durationSeconds', { seconds })
}

/** Preserve whole seconds in hover text and accessible row names. */
export function formatExactDuration(ms: number, t: Translate): string {
  const { seconds, minutes, hours, days } = splitDuration(ms)
  return days === 0 ? formatDuration(ms, t) : t('durationExactDays', {
    days, hours: String(hours).padStart(2, '0'), minutes: String(minutes).padStart(2, '0'), seconds: String(seconds).padStart(2, '0'),
  })
}
