/** Copy owned by the user-facing archived-session cleanup extension. */
export const en = {
  title: 'Session cleanup', description: 'Permanently delete archived sessions across all workspaces after restarting the app and Host.',
  clear: 'Clear archived sessions ({count})', confirm: 'Permanently delete {count} sessions', cancel: 'Cancel',
  pending: '{count} sessions are scheduled for deletion after restarting the app and Host.',
  finished: 'Last cleanup: {deleted} deleted, {skipped} skipped after unarchiving.',
  failed: '{count} sessions could not be deleted and will be retried on the next Host restart.',
  loadFailed: 'Could not load session cleanup status', actionFailed: 'Could not schedule session cleanup',
}
/** Keys shared by the English and Chinese dictionaries. */
export type CopyKey = keyof typeof en
/** Chinese settings copy. */
export const zh: Record<CopyKey, string> = {
  title: '会话清理', description: '重启应用及 Host 后，永久删除所有工作区的已归档会话',
  clear: '清空已归档会话（{count}）', confirm: '确认永久删除 {count} 个会话', cancel: '取消',
  pending: '已安排删除 {count} 个会话，重启应用及 Host 后完成',
  finished: '上次清理：删除 {deleted} 个，因取消归档跳过 {skipped} 个',
  failed: '{count} 个会话未能删除，下一次 Host 重启时重试',
  loadFailed: '无法加载会话清理状态', actionFailed: '未能保存会话清理请求',
}
