/** Recursive catalog display, menu interaction, and keyboard navigation. */
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { CSSProperties, KeyboardEvent, MouseEvent } from 'react'
import type { SessionListState, SessionSummary } from '@deepseek-ai/dsh-api-session-controller/client'
import type { SessionStatusSnapshot } from '@deepseek-ai/dsh-client-ui-session/client'
import { IconChevronDownOutlineRegular, IconChevronRightOutlineRegular, IconRefreshOutlineRegular, StateDot, Tooltip } from '@deepseek-ai/dsh-client-ui-primitives'
import type { SessionId } from '@deepseek-ai/dsh-session/types'
import type { SubagentAddress, SubagentCatalogEntry } from '@deepseek-ai/dsh-subagent/client'
import type { Translate } from './locales.ts'
import { formatTokens, tokenTotal, activityDuration, formatDuration, formatExactDuration } from './metrics.ts'

/** Navigation actions supplied by the native client services. */
export interface CatalogInjected {
  openChild(address: SubagentAddress): void
  openChildAside(address: SubagentAddress): void
  refreshProjection(sessionId: SessionId): void
}

export type Projections = SessionListState['projectionsBySession']
export type Summaries = Readonly<Record<SessionId, SessionSummary>>
export type Statuses = SessionStatusSnapshot

interface RowsProps {
  parentSessionId: SessionId
  projections: Projections
  summaries: Summaries
  statuses: Statuses
  archived: ReadonlySet<SessionId>
  expanded: ReadonlySet<SessionId>
  toggle(sessionId: SessionId): void
  open(address: SubagentAddress): void
  openAside(address: SubagentAddress): void
  refresh(sessionId: SessionId): void
  close(): void
  t: Translate
  level: number
}

function CatalogRows({
  parentSessionId, projections, summaries, statuses, archived, expanded,
  toggle, open, openAside, refresh, close, t, level,
}: RowsProps) {
  const snapshot = projections[parentSessionId]
  const entries = (snapshot?.values.subagentCatalog ?? []).filter(entry => !archived.has(entry.id))
  const running = entries.some(entry => statuses.get(entry.id)?.running ?? summaries[entry.id]?.running ?? false)
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!running) return
    const timer = setInterval(() => setNow(Date.now()), 1_000)
    return () => clearInterval(timer)
  }, [running])
  const loading = snapshot === undefined
    || (snapshot.state === 'loading' && entries.length === 0)
    || (snapshot.state === 'idle' && snapshot.values.subagentCatalog === undefined)
  const reserveDisclosure = entries.some(entry => {
    const child = projections[entry.id]
    const childEntries = (child?.values.subagentCatalog ?? []).filter(candidate => !archived.has(candidate.id))
    const childReady = child !== undefined && child.state !== 'loading' && child.state !== 'error'
      && !(child.state === 'idle' && child.values.subagentCatalog === undefined)
    return !childReady || childEntries.length > 0
  })
  return <>
    {loading && <div className="dsh-agent-archive-filter-notice">{t('loading')}</div>}
    {snapshot?.state === 'error' && <div className="dsh-agent-archive-filter-error">
      <span>{snapshot.error?.message ?? t('loadError')}</span>
      <button type="button" className="dsh-agent-archive-filter-refresh" onClick={() => refresh(parentSessionId)}>
        <IconRefreshOutlineRegular size={14} />{t('retry')}
      </button>
    </div>}
    {entries.map((entry: SubagentCatalogEntry) => {
      const childSnapshot = projections[entry.id]
      const childEntries = (childSnapshot?.values.subagentCatalog ?? []).filter(child => !archived.has(child.id))
      const childLoading = childSnapshot === undefined
        || (childSnapshot.state === 'loading' && childEntries.length === 0)
        || (childSnapshot.state === 'idle' && childSnapshot.values.subagentCatalog === undefined)
      const knownLeaf = childSnapshot !== undefined && !childLoading && childSnapshot.state !== 'error' && childEntries.length === 0
      const isExpanded = expanded.has(entry.id)
      const summary = summaries[entry.id]
      const running = statuses.get(entry.id)?.running ?? summary?.running ?? false
      const label = entry.label ?? String(entry.id)
      const activity = running ? t('running')
        : summary?.projectionValues?.subagentTiming?.lastTurnCompleted === true ? t('completed')
          : t('inactive')
      const mode = entry.mode === 'one-shot' ? t('oneShot')
        : entry.mode === 'continuable' ? t('continuable') : t('unknown')
      const secondary = [summary?.title, mode, activity].filter(value => value !== undefined).join(' · ')
      const totalTokens = tokenTotal(summary?.projectionValues?.tokenUsage)
      const durationMs = activityDuration(summary, running, now)
      const tokenMetric = totalTokens === undefined ? undefined : t('tokenTotal', { value: formatTokens(totalTokens, t) })
      const durationMetric = durationMs === undefined ? undefined : {
        compact: formatDuration(durationMs, t), exact: formatExactDuration(durationMs, t),
      }
      const metrics = [tokenMetric, durationMetric?.exact].filter(value => value !== undefined).join(' · ')
      const address: SubagentAddress = { parentSessionId, childSessionId: entry.id, mode: entry.mode }
      const activate = (): void => { open(address); close() }
      const activateAside = (event: MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault()
        event.stopPropagation()
        openAside(address)
        close()
      }
      const onKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          event.stopPropagation()
          activate()
        } else if (event.key === 'ArrowRight' && !knownLeaf && !isExpanded) {
          event.preventDefault()
          event.stopPropagation()
          toggle(entry.id)
        } else if (event.key === 'ArrowLeft' && isExpanded) {
          event.preventDefault()
          event.stopPropagation()
          toggle(entry.id)
        }
      }
      const toggleDisclosure = (event: MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault()
        event.stopPropagation()
        toggle(entry.id)
      }
      return <div key={entry.id} className="dsh-agent-archive-filter-node">
        <div
          role="treeitem"
          tabIndex={0}
          aria-level={level}
          aria-label={[label, secondary, metrics].filter(value => value !== '').join(' ')}
          {...knownLeaf ? {} : { 'aria-expanded': isExpanded }}
          className="dsh-agent-archive-filter-row"
          onClick={activate}
          onKeyDown={onKeyDown}
        >
          {knownLeaf
            ? reserveDisclosure && <span className="dsh-agent-archive-filter-disclosure-space" />
            : <button type="button" tabIndex={-1}
              className={`dsh-agent-archive-filter-disclosure ${isExpanded ? 'dsh-agent-archive-filter-disclosure-open' : ''}`}
              aria-label={t(isExpanded ? 'collapse' : 'expand', { label })} onClick={toggleDisclosure}>
              <IconChevronRightOutlineRegular />
            </button>}
          <div className="dsh-agent-archive-filter-clickarea">
            <span className="dsh-agent-archive-filter-activity">
              <StateDot state={running ? 'ongoing' : activity === t('completed') ? 'done' : 'idle'} />
            </span>
            <span className="dsh-agent-archive-filter-content">
              <span className="dsh-agent-archive-filter-label">{label}</span>
              <span className="dsh-agent-archive-filter-summary">{secondary}</span>
            </span>
            {metrics !== '' && <span className="dsh-agent-archive-filter-metrics">
              {tokenMetric !== undefined && <span className="dsh-agent-archive-filter-metric-token">{tokenMetric}</span>}
              {durationMetric !== undefined && <span className="dsh-agent-archive-filter-metric-duration"
                title={t('durationExactTitle', { duration: durationMetric.exact })}>{durationMetric.compact}</span>}
            </span>}
            <Tooltip label={t('openSidebar')} side="bottom" align="end">
              <button type="button" tabIndex={-1} className="dsh-agent-archive-filter-sidebar"
                aria-label={t('openSidebarAria', { label })} onClick={activateAside}
                onKeyDown={event => event.stopPropagation()}>
                <IconChevronRightOutlineRegular />
              </button>
            </Tooltip>
          </div>
        </div>
        {isExpanded && !knownLeaf && <div role="group" className="dsh-agent-archive-filter-children"
          aria-busy={childLoading || undefined}>
          {childSnapshot === undefined ? <div className="dsh-agent-archive-filter-notice">{t('loading')}</div>
            : <CatalogRows
              parentSessionId={entry.id}
              projections={projections}
              summaries={summaries}
              statuses={statuses}
              archived={archived}
              expanded={expanded}
              toggle={toggle}
              open={open}
              openAside={openAside}
              refresh={refresh}
              close={close}
              t={t}
              level={level + 1}
            />}
        </div>}
      </div>
    })}
  </>
}

function menuPosition(trigger: HTMLButtonElement): CSSProperties {
  const rect = trigger.getBoundingClientRect()
  const width = Math.min(336, window.innerWidth - 32)
  return {
    top: rect.bottom + 5,
    left: Math.min(Math.max(16, rect.left), window.innerWidth - width - 16),
  }
}

/** Display the filtered recursive catalog with native navigation and statistics. */
export function CatalogMenu({
  sessionId, entries, projections, summaries, statuses, archived,
  openChild, openChildAside, refreshProjection, t,
}: CatalogInjected & {
  t: Translate
  sessionId: SessionId
  entries: readonly SubagentCatalogEntry[]
  projections: Projections
  summaries: Summaries
  statuses: Statuses
  archived: ReadonlySet<SessionId>
}) {
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<CSSProperties>()
  const [expanded, setExpanded] = useState<ReadonlySet<SessionId>>(() => new Set())
  const rootRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const hoverOpenTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const pinnedRef = useRef(false)
  const runningCount = entries.filter(entry => statuses.get(entry.id)?.running ?? summaries[entry.id]?.running ?? false).length
  const countKey = entries.length === 1 ? 'countOne' : 'count'
  const runningKey = runningCount === 1 ? 'countRunningOne' : 'countRunning'
  const cancelHoverClose = (): void => {
    if (hoverCloseTimer.current === undefined) return
    clearTimeout(hoverCloseTimer.current)
    hoverCloseTimer.current = undefined
  }
  const cancelHoverOpen = (): void => {
    if (hoverOpenTimer.current === undefined) return
    clearTimeout(hoverOpenTimer.current)
    hoverOpenTimer.current = undefined
  }
  const changeOpen = (next: boolean, restoreFocus = false): void => {
    cancelHoverOpen()
    cancelHoverClose()
    const trigger = triggerRef.current
    if (next) {
      if (trigger === null) return
      setOpen(true)
      setPosition(menuPosition(trigger))
    } else {
      pinnedRef.current = false
      setOpen(false)
      setPosition(undefined)
      setExpanded(new Set())
    }
    if (restoreFocus) queueMicrotask(() => triggerRef.current?.focus())
  }
  const scheduleHoverOpen = (): void => {
    cancelHoverOpen()
    cancelHoverClose()
    if (open) return
    hoverOpenTimer.current = setTimeout(() => {
      hoverOpenTimer.current = undefined
      changeOpen(true)
    }, 150)
  }
  const scheduleHoverClose = (): void => {
    cancelHoverOpen()
    cancelHoverClose()
    if (pinnedRef.current) return
    hoverCloseTimer.current = setTimeout(() => {
      hoverCloseTimer.current = undefined
      changeOpen(false)
    }, 120)
  }
  const closeBranch = (root: SessionId): void => {
    const closing = new Set<SessionId>()
    const visit = (parentSessionId: SessionId): void => {
      if (closing.has(parentSessionId) || !expanded.has(parentSessionId)) return
      closing.add(parentSessionId)
      for (const entry of projections[parentSessionId]?.values.subagentCatalog ?? []) {
        if (!archived.has(entry.id)) visit(entry.id)
      }
    }
    visit(root)
    setExpanded(current => new Set([...current].filter(id => !closing.has(id))))
  }
  const toggle = (childId: SessionId): void => {
    if (expanded.has(childId)) closeBranch(childId)
    else {
      setExpanded(current => new Set(current).add(childId))
      refreshProjection(childId)
    }
  }
  const focusAt = (index: number): void => {
    const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="treeitem"]:not([aria-disabled="true"])')
    if (items === undefined || items.length === 0) return
    items[(index + items.length) % items.length]?.focus()
  }
  const navigate = (event: KeyboardEvent<HTMLDivElement>): void => {
    const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="treeitem"]:not([aria-disabled="true"])')
    const index = items === undefined ? -1 : [...items].indexOf(document.activeElement as HTMLElement)
    if (event.key === 'Escape') {
      event.preventDefault()
      changeOpen(false, true)
    } else if (event.key === 'Home') {
      event.preventDefault()
      focusAt(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      if (items !== undefined) focusAt(items.length - 1)
    } else if (event.key === 'ArrowDown') {
      event.preventDefault()
      focusAt(index + 1)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      focusAt(index < 0 ? (items?.length ?? 0) - 1 : index - 1)
    }
  }
  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent): void => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target) && !menuRef.current?.contains(event.target)) changeOpen(false)
    }
    const reposition = (): void => {
      const trigger = triggerRef.current
      if (trigger !== null) setPosition(menuPosition(trigger))
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('scroll', reposition, true)
    window.addEventListener('resize', reposition)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('scroll', reposition, true)
      window.removeEventListener('resize', reposition)
    }
  }, [open])
  useEffect(() => () => {
    cancelHoverOpen()
    cancelHoverClose()
  }, [])
  return <div ref={rootRef} className="dsh-agent-archive-filter" onKeyDown={navigate} onMouseLeave={scheduleHoverClose}>
    <button
      ref={triggerRef}
      onMouseEnter={scheduleHoverOpen}
      type="button"
      className="dsh-agent-archive-filter-trigger"
      aria-haspopup="tree"
      aria-expanded={open}
      aria-label={t(runningCount > 0 ? runningKey : countKey, { count: runningCount > 0 ? runningCount : entries.length })}
      onClick={() => {
        cancelHoverOpen()
        cancelHoverClose()
        pinnedRef.current = true
        if (!open) changeOpen(true)
      }}
      onKeyDown={event => {
        if (event.key === 'ArrowDown') {
          event.preventDefault()
          if (!open) changeOpen(true)
          queueMicrotask(() => focusAt(0))
        }
      }}
    >
      {runningCount > 0 && <span className="dsh-agent-archive-filter-trigger-activity"><StateDot state="ongoing" /></span>}
      <span className="dsh-agent-archive-filter-trigger-count">{t(countKey, { count: entries.length })}</span>
      <IconChevronDownOutlineRegular className={open ? 'dsh-agent-archive-filter-trigger-open' : undefined} />
    </button>
    {open && position !== undefined && createPortal(<div
      ref={menuRef}
      className="dsh-agent-archive-filter-menu"
      style={position}
      onMouseEnter={cancelHoverClose}
      onMouseLeave={scheduleHoverClose}
    >
      <div className="dsh-agent-archive-filter-menu-body" role="tree" aria-label={t('tree')}>
        <CatalogRows
          parentSessionId={sessionId}
          projections={projections}
          summaries={summaries}
          statuses={statuses}
          archived={archived}
          expanded={expanded}
          toggle={toggle}
          open={openChild}
          openAside={openChildAside}
          refresh={refreshProjection}
          close={() => changeOpen(false)}
          t={t}
          level={1}
        />
      </div>
    </div>, document.body)}
  </div>
}
