/** Two-click cleanup control in Daily Mode Settings, shared by Web and Desktop. */
import { useEffect, useState } from 'react'
import type { Context } from '@deepseek-ai/cordis'
import type { ClientConnectionRpc, ConnectionHandle } from '@deepseek-ai/dsh-client-connection/client'
import type {} from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '../../../src/client-contract.ts'
import type { PropsLocale, PropsRuntime, InjectFace } from '@deepseek-ai/dsh-client-ui-slots'
import { Button, IconWarningOutlineRegular } from '@deepseek-ai/dsh-client-ui-primitives'
import { en, zh, type CopyKey } from './locales.ts'
import { stateSchema, type State } from './protocol.ts'
import { registerNotice, registerStyles } from '../../../src/client-effects.tsx'
import { styles } from './styles.ts'

const NS = 'session-cleanup'
declare module '@deepseek-ai/cordis' {
  interface Context { connection: ConnectionHandle }
}
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap { 'session-cleanup': CopyKey }
}
/** Client services used by the settings row and app-wide error notice. */
export const inject = ['slots', 'locale', 'connection']
interface RowInjected { rpc: ClientConnectionRpc; notify(text: string): void }
type RowProps = PropsRuntime<'settings.daily.item'> & PropsLocale<typeof NS> & InjectFace<RowInjected>
/** Read a validated response through the current authenticated transport. */
async function call(rpc: ClientConnectionRpc, action: 'state' | 'schedule', signal?: AbortSignal): Promise<State> {
  const result = await rpc.call('/api', `session-cleanup/${action}`, {}, signal)
  if (!result.ok) throw new Error(result.error.message)
  return stateSchema.parse(result.value)
}

/** Hold confirmation only while this settings row remains mounted. */
function CleanupRow({ rpc, notify, t }: RowProps) {
  const [state, setState] = useState<State>()
  const [armed, setArmed] = useState(false)
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    const refresh = (): void => {
      void call(rpc, 'state', controller.signal).then(next => { if (!controller.signal.aborted) setState(next) })
        .catch(() => { if (!controller.signal.aborted) notify(t('loadFailed')) })
    }
    refresh()
    window.addEventListener('focus', refresh)
    return () => { controller.abort(); window.removeEventListener('focus', refresh) }
  }, [rpc, notify, t])
  const act = async (): Promise<void> => {
    setBusy(true)
    try {
      const next = await call(rpc, armed ? 'schedule' : 'state')
      setState(next)
      setArmed(!armed && next.archivedCount > 0)
    } catch (error) {
      notify(`${t('actionFailed')}：${error instanceof Error ? error.message : String(error)}`)
      setArmed(false)
    } finally { setBusy(false) }
  }
  return <div className="dsh-session-cleanup-row">
    <div className="dsh-session-cleanup-copy">
      <div className="dsh-session-cleanup-title">{t('title')}</div>
      <div className="dsh-session-cleanup-description">{t('description')}</div>
      <div className="dsh-session-cleanup-description" aria-live="polite">
        {state !== undefined && state.pendingCount > 0 && <div>{t('pending', { count: state.pendingCount })}</div>}
        {state?.lastResult !== undefined && <div>{t('finished', state.lastResult)}</div>}
        {state?.lastResult !== undefined && state.lastResult.failed > 0 && <div role="alert" className="dsh-session-cleanup-error">{t('failed', { count: state.lastResult.failed })}</div>}
        {state?.errors.map(error => <div key={error} className="dsh-session-cleanup-error">{error}</div>)}
      </div>
    </div>
    <div className="dsh-session-cleanup-actions">
      <Button size="sm" variant="outline" disabled={busy || state === undefined || state.archivedCount === 0}
        className={armed ? 'dsh-session-cleanup-confirm' : undefined} onClick={() => { void act() }}>
        {t(armed ? 'confirm' : 'clear', { count: state?.archivedCount ?? 0 })}
      </Button>
      {armed && <Button size="sm" disabled={busy} onClick={() => setArmed(false)}>{t('cancel')}</Button>}
    </div>
  </div>
}

/** Register the one settings row, localized copy, and existing overlay primitive. */
export function apply(ctx: Context): void {
  ctx.effect(() => ctx.locale.register(NS, { en, zh }))
  const notify = registerNotice(ctx, 'session-cleanup.notice', <IconWarningOutlineRegular />)
  registerStyles(ctx, styles)
  ctx.slots.inject('settings.daily.item', () => ctx.slots.register({
    name: 'settings.daily.item', id: 'session-cleanup', order: 90, locale: NS,
    inject: (): RowInjected => ({ rpc: ctx.connection.rpc, notify }),
  }, CleanupRow))
}
