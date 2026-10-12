// src/index.ts
import { Service } from "@deepseek-ai/cordis";
import z from "@deepseek-ai/schemastery";
var name = "daily-mode-settings";
var Config = z.object({
  childModel: z.union([
    z.const(null),
    z.object({ provider: z.string().min(1).required(), model: z.string().min(1).required(), effort: z.string().min(1) })
  ]).default(null).volatile()
});
var DailyModeSettings = class extends Service {
  constructor(ctx, config) {
    super(ctx, "dailyModeSettings");
    this.config = config;
    ctx.inject(["settings"], (child) => {
      child.effect(() => child.settings.configure({ auto: false }, ctx.fiber));
    });
  }
  config;
  /** Loader schema for the default-exported service plugin. */
  static Config = Config;
  /** @returns a detached current selection, or null to inherit the parent. */
  current() {
    const value = this.config.childModel.get();
    return value === null ? null : { ...value };
  }
};
var index_default = DailyModeSettings;
export {
  Config,
  DailyModeSettings,
  index_default as default,
  name
};
