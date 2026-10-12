/** Scoped styles and operation notices shared by the bundle's client modules. */
import type { ReactNode } from 'react'
import type { Context } from '@deepseek-ai/cordis'
import type { PropsRuntime, InjectFace } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import { createSnapshotStore, type ObservableSnapshot } from '@deepseek-ai/dsh-client-store'
import { Toast } from '@deepseek-ai/dsh-client-ui-primitives'

interface Notice { text: string; seq: number }
type NoticeProps = PropsRuntime<'shell.overlay'> & InjectFace<{
  hooks: { notice: ObservableSnapshot<Notice | null> }
  dismiss(): void
  icon?: ReactNode
}>

function OperationNotice({ useNotice, dismiss, icon }: NoticeProps) {
  const notice = useNotice(value => value)
  return notice === null ? null : <Toast key={notice.seq} text={notice.text} onDone={dismiss}
    {...icon === undefined ? {} : { icon }} />
}

/** Mount a stylesheet for exactly the lifetime of the client plugin. */
export function registerStyles(ctx: Context, css: string, label?: string): void {
  ctx.effect(() => {
    const style = document.createElement('style')
    style.textContent = css
    document.head.append(style)
    return () => style.remove()
  }, label)
}

/** Register an app-wide notice and return a publisher scoped to this plugin. */
export function registerNotice(ctx: Context, id: string, icon?: ReactNode): (text: string) => void {
  const notices = createSnapshotStore<Notice | null>(null)
  let seq = 0
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay', id,
    inject: () => ({ hooks: { notice: notices }, dismiss: () => { notices.set(null) }, ...(icon === undefined ? {} : { icon }) }),
  }, OperationNotice))
  return text => { notices.set({ text, seq: ++seq }) }
}
