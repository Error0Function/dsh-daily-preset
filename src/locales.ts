/** Daily settings copy, shared by browser and desktop. */
export const en = {
  nav: 'Daily mode', model: 'Child agent model', inherit: 'Inherit parent model and effort',
  description: 'Choose from configured models. Output limits and context size use the selected model settings.',
  timing: 'Changes apply when a child starts its next run, including existing sessions. Active runs keep their current model and effort until they finish.',
  effort: 'Reasoning effort', defaultEffort: 'Model default', missing: 'The selected model or effort is unavailable. Choose an available option.',
  unavailable: 'These settings cannot be edited through this connection.', loadFailed: 'Unable to load models',
  partial: 'Some model providers could not be loaded.', retry: 'Retry', saved: 'Daily mode settings saved', saveFailed: 'Unable to save settings',
  loading: 'Loading daily mode settings',
}
/** Translation keys owned by the daily settings page. */
export type CopyKey = keyof typeof en
/** Chinese dictionary matching the English keys. */
export const zh: Record<CopyKey, string> = {
  nav: '日用模式', model: '子 Agent 模型', inherit: '继承主 Agent 的模型和 effort',
  description: '从已配置的模型中选择。输出上限和上下文大小沿用所选模型的设置。',
  timing: '修改在子 Agent 下一次开始运行时生效，已有会话也会采用新设置。正在运行的子 Agent 保持当前模型和 effort，直到本次运行结束。',
  effort: '推理强度', defaultEffort: '模型默认值', missing: '所选模型或 effort 已不可用，请选择可用选项。',
  unavailable: '当前连接无法编辑这些设置。', loadFailed: '无法加载模型列表', partial: '部分模型提供方加载失败。',
  retry: '重试', saved: '日用模式设置已保存', saveFailed: '无法保存设置', loading: '正在加载日用模式设置',
}
