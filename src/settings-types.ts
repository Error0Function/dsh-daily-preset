/** User-selected route; null follows the parent's current model and effort. */
export interface ChildModel {
  provider: string
  model: string
  effort?: string
}

/** Native settings namespace values shared by the Host and settings page. */
export interface SettingsValues { childModel: ChildModel | null }
