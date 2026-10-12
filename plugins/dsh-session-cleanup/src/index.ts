/** Permanent archived-session cleanup before native session services activate. */
import { readFile } from 'node:fs/promises'
import { isAbsolute, resolve } from 'node:path'
import { performance } from 'node:perf_hooks'
import { Context, Service } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { withFileLock, writeFileAtomic } from '@deepseek-ai/dsh-atomic-write'
import { workspaceDomainSpec } from '@deepseek-ai/dsh-workspace'
import type { Domain } from '@deepseek-ai/dsh-storage-domain'
import { SessionId } from '@deepseek-ai/dsh-session'
import { projectionCacheDomainSpec } from '@deepseek-ai/dsh-session-projection-cache'
import type {} from '@deepseek-ai/dsh-session-persistence'
import { clientRequestSchema } from '@deepseek-ai/dsh-client-connection'
import { queueSchema, type Queue, type State } from './protocol.ts'
import { deleteLogs, missing } from './session-files.ts'

declare module '@deepseek-ai/cordis' {
  interface Context { sessionCleanup: SessionCleanup }
}

/** Paths and lock timing are supplied by the user's bundle configuration. */
export interface Config { sessionRoot: string; queueFile: string; lockWaitMs: number }
const HOST = `${process.pid}:${performance.timeOrigin}`
/** Cleanup service doubles as the configured startup dependency. */
export default class SessionCleanup extends Service {
  static inject = ['storageDomain']
  static Config: z<Config> = z.object({
    sessionRoot: z.string().required(), queueFile: z.string().required(),
    lockWaitMs: z.number().step(1).min(1).default(30000),
  })
  private readonly root: string
  private readonly queueFile: string

  constructor(ctx: Context, private readonly config: Config) {
    super(ctx, 'sessionCleanup')
    if (!isAbsolute(config.sessionRoot) || !isAbsolute(config.queueFile)) throw new Error('Session cleanup requires absolute sessionRoot and queueFile paths')
    this.root = resolve(config.sessionRoot)
    this.queueFile = resolve(config.queueFile)
  }

  /** Complete cold cleanup, then expose authenticated user-only endpoints. */
  protected async [Service.init](): Promise<void> {
    const request = await this.readQueue()
    if (request !== undefined && request.pendingIds.length > 0
      && request.requestedHost !== HOST && request.lastAttemptHost !== HOST
      && this.ctx.get('sessionPersistence') === undefined && this.ctx.get('workspaceRegistry') === undefined) {
      await withFileLock(this.queueFile, () => this.cleanAtStartup(), { waitMs: this.config.lockWaitMs })
    }
    this.ctx.inject(['workspaceRegistry', 'connection', 'sessionPersistence'], ctx => {
      for (const action of ['state', 'schedule']) {
        ctx.effect(() => ctx.connection.fetch.register({
          path: `/api/session-cleanup/${action}`, methods: ['POST'], requestBody: 'buffered',
          fetch: async request => {
            const message = clientRequestSchema.parse(await request.json())
            let result
            try {
              if (message.method !== `session-cleanup/${action}`) throw new Error('RPC endpoint does not match its route')
              if (action === 'schedule') await this.schedule(ctx)
              result = { ok: true, value: await this.state(ctx) }
            } catch (error) {
              result = { ok: false, error: { code: 'session-cleanup/failed', message: error instanceof Error ? error.message : String(error), details: {} } }
            }
            return Response.json({ type: 'server-response', rpcId: message.rpcId, result })
          },
        }))
      }
    })
  }

  private async readQueue(): Promise<Queue | undefined> {
    let text: string
    try { text = await readFile(this.queueFile, 'utf8') }
    catch (error) { if (missing(error)) return undefined; throw error }
    const queue = queueSchema.parse(JSON.parse(text))
    if (resolve(queue.sessionRoot) !== this.root) throw new Error('Pending cleanup names a different session root; restore sessionRoot before continuing')
    return queue
  }

  private async saveQueue(queue: Queue): Promise<void> {
    await writeFileAtomic(this.queueFile, `${JSON.stringify(queue, null, 2)}\n`, { mode: 0o600 })
  }

  private async state(ctx: Context): Promise<State> {
    const queue = await this.readQueue()
    const archived = new Set<string>(await this.existingArchived(ctx))
    return {
      archivedCount: archived.size,
      pendingCount: queue?.pendingIds.filter(id => archived.has(id)).length ?? 0,
      ...(queue?.lastResult === undefined ? {} : { lastResult: queue.lastResult }),
      errors: queue?.errors ?? [],
    }
  }

  private async schedule(ctx: Context): Promise<void> {
    await withFileLock(this.queueFile, async () => {
      const prior = await this.readQueue()
      const ids = await this.existingArchived(ctx)
      if (ids.length === 0) throw new Error('No archived sessions are available to clear')
      await this.saveQueue({
        version: 1, sessionRoot: this.root, requestedHost: HOST,
        pendingIds: [...new Set([...(prior?.pendingIds ?? []), ...ids])], errors: [],
      })
    }, { waitMs: this.config.lockWaitMs })
  }

  /** Deleted-ID archive markers hide retained parent catalogs without counting as sessions. */
  private async existingArchived(ctx: Context): Promise<string[]> {
    const existing = new Set((await ctx.sessionPersistence.list()).map(snapshot => snapshot.header.id))
    return ctx.workspaceRegistry.archivedSessionIds.filter(id => existing.has(id))
  }

  private async cleanAtStartup(): Promise<void> {
    const queue = await this.readQueue()
    if (queue === undefined || queue.pendingIds.length === 0 || queue.requestedHost === HOST || queue.lastAttemptHost === HOST) return
    const domain = await this.ctx.storageDomain.open(workspaceDomainSpec)
    try {
      const archived = new Set<string>(domain.global.get().archivedSessionIds)
      const removed = new Set<string>()
      const pending: string[] = []
      const errors: string[] = []
      let skipped = 0
      for (const id of queue.pendingIds) {
        if (!archived.has(id)) { skipped++; continue }
        try { await deleteLogs(this.root, id); removed.add(id) }
        catch (error) {
          pending.push(id)
          errors.push(`${id}: ${error instanceof Error ? error.message : String(error)}`)
        }
      }
      try { await this.removeAccounting(domain, removed) }
      catch (error) {
        pending.push(...removed)
        errors.push(error instanceof Error ? error.message : String(error))
        removed.clear()
      }
      await this.saveQueue({
        ...queue, pendingIds: pending, lastAttemptHost: HOST,
        lastResult: { deleted: removed.size, skipped, failed: pending.length }, errors,
      })
      if (errors.length > 0) this.ctx.logger.warn(`Archived-session cleanup has ${pending.length} pending sessions: ${errors.join('; ')}`)
    } finally { await domain.close() }
  }

  private async removeAccounting(domain: Domain<typeof workspaceDomainSpec>, removed: ReadonlySet<string>): Promise<void> {
    if (removed.size === 0) return
    const cache = await this.ctx.storageDomain.open(projectionCacheDomainSpec)
    try {
      for (const id of removed) await cache.table('sessions').delete(SessionId(id))
    } finally { await cache.close() }
    const table = domain.table('workspaces')
    for (const [key, record] of table.entries()) {
      if (!record.sessionIds.some(id => removed.has(id))) continue
      await table.update(key, current => ({ ...current, sessionIds: current.sessionIds.filter(id => !removed.has(id)), updatedAt: new Date().toISOString() }))
    }
    const state = domain.global.get()
    await domain.global.set({
      ...state,
      pinnedSessionIds: state.pinnedSessionIds.filter(id => !removed.has(id)),
    })
  }
}
