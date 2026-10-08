/** Global, volatile user settings for the daily composition. */
import { Service } from '@deepseek-ai/cordis'
import type { Context, Volatile } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import type {} from '@deepseek-ai/dsh-settings'
import type { ChildModel } from './settings-types.ts'

declare module '@deepseek-ai/cordis' {
  interface Context { dailyModeSettings: DailyModeSettings }
}

/** Loader identity. */
export const name = 'daily-mode-settings'
/** Atomic route settings; omitted effort uses the selected model's default. */
export interface Config { childModel: Volatile<ChildModel | null> }
/** Only native model routing settings are editable. */
export const Config: z<Config> = z.object({
  childModel: z.union([
    z.const(null),
    z.object({ provider: z.string().min(1).required(), model: z.string().min(1).required(), effort: z.string().min(1) }),
  ]).default(null).volatile(),
})

/** Samples native volatile configuration without keeping a second settings file. */
export class DailyModeSettings extends Service {
  /** Loader schema for the default-exported service plugin. */
  static Config = Config
  constructor(ctx: Context, private readonly config: Config) {
    super(ctx, 'dailyModeSettings')
    ctx.inject(['settings'], child => { child.effect(() => child.settings.configure({ auto: false }, ctx.fiber)) })
  }

  /** @returns a detached current selection, or null to inherit the parent. */
  current(): ChildModel | null {
    const value = this.config.childModel.get()
    return value === null ? null : { ...value }
  }
}

export default DailyModeSettings
