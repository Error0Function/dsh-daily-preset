/** Replace native header slots with archive-filtered session views on both clients. */
import { useMemo } from 'react'
import type { Context } from '@deepseek-ai/cordis'
import type { SessionListState } from '@deepseek-ai/dsh-api-session-controller/client'
import type { PropsLocale, PropsRuntime, InjectFace } from '@deepseek-ai/dsh-client-ui-slots'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type { SubagentAddress } from '@deepseek-ai/dsh-subagent/client'
import { SubagentHeaderLineage } from '@deepseek-ai/dsh-client-ui-subagent/src/client/SubagentHeaderLineage.tsx'
import type { SubagentHeaderLineageProps } from '@deepseek-ai/dsh-client-ui-subagent/src/client/SubagentHeaderLineage.tsx'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-client-ui-session/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar-right/client'
import type {} from '@deepseek-ai/dsh-client-ui-subagent/client'
import type {} from '@deepseek-ai/dsh-token-meter/client'
import type {} from '@deepseek-ai/dsh-client-ui-workspace/client'
import { registerStyles } from '../../../src/client-effects.tsx'
import { CatalogMenu, type CatalogInjected, type Projections } from './catalog.tsx'
import { NS, en, zh } from './locales.ts'
import { styles } from './styles.ts'

declare const ARCHIVE_LINEAGE_CSS: string
const SUBAGENT_CHAT_ADDRESS = 'dsh-resource://subagentchat/session/'
/** Client services used to replace the built-in catalog action. */
export const inject = ['slots', 'locale', 'uiWorkspace', 'sessions', 'sidebarRight']
type CatalogProps = PropsRuntime<'conversation.session.header.actions'>
  & PropsLocale<typeof NS> & InjectFace<CatalogInjected>

function subagentChatAddress(address: SubagentAddress): string {
  const query = new URLSearchParams({ parent: address.parentSessionId, mode: address.mode })
  return `${SUBAGENT_CHAT_ADDRESS}${encodeURIComponent(address.childSessionId)}?${query}`
}

type ArchivedLineageProps = SubagentHeaderLineageProps & {
  useWorkspaces: CatalogProps['useWorkspaces']
}

function filterArchivedCatalogs(projections: Projections, archived: ReadonlySet<SessionId>): Projections {
  let changed = false
  const filtered = Object.fromEntries(Object.entries(projections).map(([id, snapshot]) => {
    const entries = snapshot.values.subagentCatalog
    if (entries === undefined) return [id, snapshot]
    const visible = entries.filter(entry => !archived.has(entry.id))
    if (visible.length === entries.length) return [id, snapshot]
    changed = true
    return [id, { ...snapshot, values: { ...snapshot.values, subagentCatalog: visible } }]
  }))
  return changed ? filtered as Projections : projections
}

/** Keep the native breadcrumb and sibling switcher while filtering archived catalog entries. */
function ArchivedSubagentLineage(props: ArchivedLineageProps) {
  const archivePhase = props.useWorkspaces(state => state.phase)
  const archivedIds = props.useWorkspaces(state => state.archivedSessionIds)
  const archived = useMemo(() => new Set(archivedIds), [archivedIds])
  const sessionState = props.useSessions(state => state)
  const filteredState = useMemo<SessionListState>(() => ({
    ...sessionState,
    projectionsBySession: filterArchivedCatalogs(sessionState.projectionsBySession, archived),
  }), [sessionState, archived])
  const useSessions: SubagentHeaderLineageProps['useSessions'] = selector => selector(filteredState)
  if (archivePhase !== 'ready') return null
  return <SubagentHeaderLineage {...props} useSessions={useSessions} />
}

/** Replace the built-in header catalog action with one that omits archived IDs. */
function ArchivedCatalogAction(props: CatalogProps) {
  const { sessionId, useSessions, useSessionStatus, useWorkspaces, openChild, openChildAside, refreshProjection } = props
  const isChild = useSessions(state => state.byId[sessionId]?.origin === 'subagent')
  const projections = useSessions(state => state.projectionsBySession)
  const summaries = useSessions(state => state.byId)
  const statuses = useSessionStatus(state => state)
  const archivePhase = useWorkspaces(state => state.phase)
  const archivedIds = useWorkspaces(state => state.archivedSessionIds)
  const archived = useMemo(() => new Set(archivedIds), [archivedIds])
  const catalog = projections[sessionId]
  const entries = (catalog?.values.subagentCatalog ?? []).filter(entry => !archived.has(entry.id))
  if (isChild || archivePhase !== 'ready' || (entries.length === 0 && catalog?.state !== 'error')) return null
  return <CatalogMenu
    key={sessionId}
    {...props}
    sessionId={sessionId}
    entries={entries}
    projections={projections}
    summaries={summaries}
    statuses={statuses}
    archived={archived}
    openChild={openChild}
    openChildAside={openChildAside}
    refreshProjection={refreshProjection}
  />
}

/** Register the filtered header action and its scoped visual styles. */
export function apply(ctx: Context): void {
  ctx.effect(() => ctx.locale.register(NS, { en, zh }), 'agent archive filter dictionaries')
  registerStyles(ctx, `${styles}\n${ARCHIVE_LINEAGE_CSS}`, 'agent archive filter styles')
  const catalogActions = (): CatalogInjected => ({
    openChild: address => ctx.uiWorkspace.openSession(address),
    openChildAside: address => ctx.sidebarRight.openResource(subagentChatAddress(address), { kind: 'subagentchat', preferNewPane: true }),
    refreshProjection: sessionId => { void ctx.sessions.refreshProjections(sessionId) },
  })
  ctx.slots.inject('conversation.session.header.lineage', () => ctx.slots.register({
    name: 'conversation.session.header.lineage',
    priority: -100,
    locale: 'subagent',
    inject: catalogActions,
  }, ArchivedSubagentLineage))
  ctx.slots.inject('conversation.session.header.actions', () => ctx.slots.register({
    name: 'conversation.session.header.actions',
    id: 'subagent-catalog',
    priority: -100,
    order: -30,
    locale: NS,
    inject: catalogActions,
  }, ArchivedCatalogAction))
}
