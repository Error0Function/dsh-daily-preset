/** Native daily-mode settings page for the browser and desktop clients. */
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react'
import type { Context } from '@deepseek-ai/cordis'
import type { ModelCatalog } from '@deepseek-ai/dsh-api-remotes/client'
import type {} from '@deepseek-ai/dsh-api-remotes/client'
import type { ConfigForm } from '@deepseek-ai/dsh-client-ui-settings/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-layout/client'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type { PropsRuntime, PropsLocale, PropsRenderSlots, InjectFace } from '@deepseek-ai/dsh-client-ui-slots'
import { Button, StateDot } from '@deepseek-ai/dsh-client-ui-primitives'
import type {} from './client-contract.ts'
import type { ChildModel, SettingsValues } from './settings-types.ts'
import { en, zh, type CopyKey } from './locales.ts'
import { registerNotice, registerStyles } from './client-effects.tsx'
import { styles } from './styles.ts'

const NS = 'settings.daily'
declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap { 'settings.daily': CopyKey }
}
/** Native configuration, model directory, locale, and settings render services. */
export const inject = ['slots', 'locale', 'remote', 'remote.session', 'configForms']

interface PageInjected {
  form: ConfigForm<SettingsValues>
  loadCatalog(): Promise<ModelCatalog>
  watchCatalog(refresh: () => void): () => void
  notify(text: string): void
}
type PageProps = PropsRuntime<'settings.section'> & PropsLocale<typeof NS> & PropsRenderSlots<'settings.daily.item'> & InjectFace<PageInjected>
/** Atomic model/effort edits use the Host's configuration revision and persistence. */
function DailySettings({ form, loadCatalog, watchCatalog, notify, t, renderSlot }: PageProps) {
  const subscribe = useCallback((listener: () => void) => form.subscribe(listener), [form])
  const getSnapshot = useCallback(() => form.getSnapshot(), [form])
  const snapshot = useSyncExternalStore(subscribe, getSnapshot)
  const [catalog, setCatalog] = useState<ModelCatalog>()
  const [error, setError] = useState<string>()
  const [busy, setBusy] = useState(false)
  const [reload, setReload] = useState(0)
  useEffect(() => {
    let active = true
    let generation = 0
    const refresh = (): void => {
      const current = ++generation
      void loadCatalog().then(value => {
        if (active && current === generation) { setCatalog(value); setError(undefined) }
      }).catch((failure: unknown) => {
        if (active && current === generation) setError(failure instanceof Error ? failure.message : String(failure))
      })
    }
    refresh()
    const dispose = watchCatalog(refresh)
    return () => { active = false; dispose() }
  }, [loadCatalog, watchCatalog, reload])
  const choice = snapshot.value?.childModel ?? null
  const options = catalog?.groups.flatMap(group => group.models.map(model => ({ group, model, key: JSON.stringify([group.id, model.id]) }))) ?? []
  const selected = choice === null ? undefined : options.find(option => option.group.id === choice.provider && option.model.id === choice.model)
  const efforts = selected?.model.reasoning?.efforts ?? []
  const missing = choice !== null && catalog !== undefined && (selected === undefined || (choice.effort !== undefined && !efforts.some(effort => effort.id === choice.effort)))
  const writable = snapshot.status === 'ready' && snapshot.writable && !busy
  const save = async (value: ChildModel | null): Promise<void> => {
    setBusy(true)
    try {
      if (!await form.set('childModel', value)) throw new Error(t('saveFailed'))
      notify(t('saved'))
    } catch (failure) { notify(`${t('saveFailed')}: ${failure instanceof Error ? failure.message : String(failure)}`) }
    finally { setBusy(false) }
  }
  if (snapshot.status === 'loading' || (catalog === undefined && error === undefined)) return <div className="dsh-daily-loading" aria-label={t('loading')}><StateDot state="ongoing" /></div>
  return <div className="dsh-daily-settings">
    <section className="dsh-daily-card">
      <label className="dsh-daily-label" htmlFor="dsh-daily-model">{t('model')}</label>
      <div className="dsh-daily-description">{t('description')}</div>
      <select id="dsh-daily-model" className="dsh-daily-select" disabled={!writable || catalog === undefined}
        value={choice === null ? '' : JSON.stringify([choice.provider, choice.model])}
        onChange={event => {
          const option = options.find(value => value.key === event.currentTarget.value)
          void save(option === undefined ? null : { provider: option.group.id, model: option.model.id })
        }}>
        <option value="">{t('inherit')}</option>
        {choice !== null && selected === undefined && <option value={JSON.stringify([choice.provider, choice.model])} disabled>{choice.provider} / {choice.model}</option>}
        {catalog?.groups.map(group => <optgroup key={group.id} label={group.name}>
          {options.filter(option => option.group.id === group.id).map(option => <option key={option.key} value={option.key}>{option.model.name}</option>)}
        </optgroup>)}
      </select>
      {choice !== null && efforts.length > 0 && <>
        <label className="dsh-daily-label" htmlFor="dsh-daily-effort">{t('effort')}</label>
        <select id="dsh-daily-effort" className="dsh-daily-select" disabled={!writable} value={choice.effort ?? ''}
          onChange={event => { const effort = event.currentTarget.value; void save({ provider: choice.provider, model: choice.model, ...(effort === '' ? {} : { effort }) }) }}>
          <option value="">{t('defaultEffort')}</option>
          {choice.effort !== undefined && !efforts.some(effort => effort.id === choice.effort) && <option value={choice.effort} disabled>{choice.effort}</option>}
          {efforts.map(effort => <option key={effort.id} value={effort.id}>{effort.name}</option>)}
        </select>
      </>}
      <div className="dsh-daily-description">{t('timing')}</div>
      {missing && <div role="alert" className="dsh-daily-error">{t('missing')}</div>}
      {snapshot.status === 'unavailable' && <div role="alert">{t('unavailable')}</div>}
      {error !== undefined && <div role="alert" className="dsh-daily-error">{t('loadFailed')}: {error} <Button size="sm" onClick={() => setReload(value => value + 1)}>{t('retry')}</Button></div>}
      {catalog !== undefined && catalog.failures.length > 0 && <div className="dsh-daily-description">{t('partial')} {catalog.failures.map(failure => `${failure.name}: ${failure.message}`).join('; ')}</div>}
    </section>
    {renderSlot('settings.daily.item', {})}
  </div>
}

/**
 * Register the localized settings page and its extension slot.
 * @param ctx - native client context for either frontend.
 */
export function apply(ctx: Context): void {
  ctx.effect(() => ctx.locale.register(NS, { en, zh }))
  const notify = registerNotice(ctx, 'daily-mode.notice')
  const loadCatalog = async (): Promise<ModelCatalog> => {
    const result = await ctx.remote.session.modelCatalog()
    if (!result.ok) throw new Error(result.error.message)
    return result.value
  }
  const watchCatalog = (refresh: () => void): (() => void) => {
    const disposers = [ctx.remote.$on('llm/adapters-updated', refresh), ctx.remote.$on('settings/document-updated', refresh),
      ctx.remote.$on('credentials/record-updated', refresh), ctx.remote.$on('credentials/reference-updated', refresh), ctx.on('connection/reset', refresh)]
    return () => { for (const dispose of disposers) dispose() }
  }
  registerStyles(ctx, styles)
  const t = ctx.locale.bind(NS)
  const form = ctx.configForms.get<SettingsValues>('daily-mode-settings')
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section', id: 'daily-mode', order: 15, label: () => t('nav'), locale: NS,
    inject: (): PageInjected => ({ form, loadCatalog, watchCatalog, notify }),
    children: { 'settings.daily.item': { kind: 'list', scope: 'root' } },
  }, DailySettings))
}
