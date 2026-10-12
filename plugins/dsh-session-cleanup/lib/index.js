// plugins/dsh-session-cleanup/src/index.ts
import { readFile } from "node:fs/promises";
import { isAbsolute as isAbsolute2, resolve as resolve3 } from "node:path";
import { performance } from "node:perf_hooks";
import { Service } from "@deepseek-ai/cordis";
import z2 from "@deepseek-ai/schemastery";
import { withFileLock, writeFileAtomic } from "@deepseek-ai/dsh-atomic-write";
import { workspaceDomainSpec } from "@deepseek-ai/dsh-workspace";
import { SessionId as SessionId2 } from "@deepseek-ai/dsh-session";
import { projectionCacheDomainSpec } from "@deepseek-ai/dsh-session-projection-cache";
import { clientRequestSchema } from "@deepseek-ai/dsh-client-connection";

// plugins/dsh-session-cleanup/src/protocol.ts
import { z } from "zod";
var ids = z.array(z.string().min(1)).refine((value) => new Set(value).size === value.length, "Session IDs must be unique");
var resultSchema = z.object({ deleted: z.number().int().min(0), skipped: z.number().int().min(0), failed: z.number().int().min(0) }).strict();
var queueSchema = z.object({
  version: z.literal(1),
  sessionRoot: z.string().min(1),
  requestedHost: z.string().min(1),
  pendingIds: ids,
  lastAttemptHost: z.string().optional(),
  lastResult: resultSchema.optional(),
  errors: z.array(z.string()).default([])
}).strict();
var stateSchema = z.object({
  archivedCount: z.number().int().min(0),
  pendingCount: z.number().int().min(0),
  lastResult: resultSchema.optional(),
  errors: z.array(z.string())
}).strict();

// plugins/dsh-session-cleanup/src/session-files.ts
import { lstat, readdir, realpath, rmdir, unlink } from "node:fs/promises";
import { isAbsolute, relative, resolve as resolve2, join as join3, sep } from "node:path";
import { SessionId } from "@deepseek-ai/dsh-session";

// ../../../../../Program-Files-Portable/deepseek-harness/packages/session/session-persistence-jsonl/src/format.ts
import {
  SESSION_FORMAT_VERSION,
  KNOWN_SESSION_EVENT_TYPES,
  SessionLogOffset
} from "@deepseek-ai/dsh-session";
import { parseSessionFormatLogFilename, sessionFormatLogFilename, SessionFormatUnsupportedMigrationError } from "@deepseek-ai/dsh-session-format";
import { sessionFormatCatalog } from "@deepseek-ai/dsh-session-format-catalog";
import { assertV4RowAdmission, assertReleasedV4Relationships } from "@deepseek-ai/dsh-session-format-v3-to-v4";
import {
  SessionFormatUnsupportedError,
  sessionFormatVersionRefusal
} from "@deepseek-ai/dsh-session-persistence";
var HEADER_REQUIRED_KEYS = ["type", "version", "id", "createdAt", "isSeeded", "delegationDepth"];
var HEADER_OPTIONAL_KEYS = ["cwd", "parentSession", "origin", "agentPreset"];
var HEADER_KEYS = /* @__PURE__ */ new Set([...HEADER_REQUIRED_KEYS, ...HEADER_OPTIONAL_KEYS]);
function encodeSegment(raw) {
  if (raw.length === 0) throw new Error("cannot encode an empty path segment");
  if (raw === ".") return "~002E";
  if (raw === "..") return "~002E~002E";
  let out = "";
  for (let i = 0; i < raw.length; i++) {
    const code = raw.charCodeAt(i);
    const ch = String.fromCharCode(code);
    if (ch !== "~" && /^[A-Za-z0-9._-]$/.test(ch)) {
      out += ch;
    } else {
      out += "~" + code.toString(16).toUpperCase().padStart(4, "0");
    }
  }
  return out;
}

// ../../../../../Program-Files-Portable/deepseek-harness/packages/session/session-persistence-jsonl/src/lease.ts
import { mkdir, open, stat } from "node:fs/promises";
import { join as join2 } from "node:path";
import { tryLockExclusive } from "@deepseek-ai/node-addon-system/flock";
import { SessionAlreadyOwnedError } from "@deepseek-ai/dsh-session-persistence";

// ../../../../../Program-Files-Portable/deepseek-harness/packages/session/session-persistence-jsonl/src/win32.ts
import { createHash } from "node:crypto";
import { join, parse, resolve, toNamespacedPath } from "node:path";
var WAIT_OBJECT_0 = 0;
var WAIT_TIMEOUT = 258;
var ERROR_FILE_NOT_FOUND = 2;
var ERROR_PATH_NOT_FOUND = 3;
var ERROR_ACCESS_DENIED = 5;
var ERROR_NOT_SAME_DEVICE = 17;
var ERROR_SHARING_VIOLATION = 32;
var ERROR_FILE_EXISTS = 80;
var ERROR_INVALID_NAME = 123;
var ERROR_ALREADY_EXISTS = 183;
var bindings;
async function win32() {
  if (bindings !== void 0) return bindings;
  const koffi = (await import("koffi")).default;
  const kernel32 = koffi.load("kernel32.dll");
  bindings = {
    moveFileExW: kernel32.func("__stdcall", "MoveFileExW", "int", ["str16", "str16", "uint"]),
    createSemaphoreW: kernel32.func("__stdcall", "CreateSemaphoreW", "intptr", ["void*", "int", "int", "str16"]),
    waitForSingleObject: kernel32.func("__stdcall", "WaitForSingleObject", "uint", ["intptr", "uint"]),
    releaseSemaphore: kernel32.func("__stdcall", "ReleaseSemaphore", "int", ["intptr", "int", "void*"]),
    closeHandle: kernel32.func("__stdcall", "CloseHandle", "int", ["intptr"]),
    getLastError: kernel32.func("__stdcall", "GetLastError", "uint", [])
  };
  return bindings;
}
function errnoCode(win32Code) {
  switch (win32Code) {
    case ERROR_FILE_NOT_FOUND:
    case ERROR_PATH_NOT_FOUND:
      return "ENOENT";
    case ERROR_ACCESS_DENIED:
      return "EACCES";
    case ERROR_NOT_SAME_DEVICE:
      return "EXDEV";
    case ERROR_SHARING_VIOLATION:
      return "EBUSY";
    case ERROR_FILE_EXISTS:
    case ERROR_ALREADY_EXISTS:
      return "EEXIST";
    case ERROR_INVALID_NAME:
      return "EINVAL";
    default:
      return "EIO";
  }
}
function win32Error(syscall, win32Code, path, dest) {
  const code = errnoCode(win32Code);
  const error = new Error(`${syscall} ${code} (Win32 ${win32Code}): ${path} -> ${dest}`);
  error.code = code;
  error.errno = win32Code;
  error.syscall = syscall;
  error.path = path;
  error.dest = dest;
  error.win32Code = win32Code;
  return error;
}
async function acquireLockHandleWin32(path) {
  const api = await win32();
  const name = `Local\\dsh-session-lock-${createHash("sha256").update(resolve(path).toLowerCase()).digest("hex")}`;
  const handle = api.createSemaphoreW(null, 1, 1, name);
  if (handle === 0) throw win32Error("CreateSemaphoreW", api.getLastError(), path, name);
  const wait = api.waitForSingleObject(handle, 0);
  if (wait === WAIT_OBJECT_0) return handle;
  api.closeHandle(handle);
  if (wait === WAIT_TIMEOUT) throw win32Error("WaitForSingleObject", ERROR_SHARING_VIOLATION, path, name);
  throw win32Error("WaitForSingleObject", api.getLastError(), path, name);
}
async function releaseLockHandleWin32(handle) {
  const api = await win32();
  const released = api.releaseSemaphore(handle, 1, null);
  const closed = api.closeHandle(handle);
  if (released === 0 || closed === 0) throw win32Error("ReleaseSemaphore", api.getLastError(), `handle:${handle}`, `handle:${handle}`);
}

// ../../../../../Program-Files-Portable/deepseek-harness/packages/session/session-persistence-jsonl/src/lease.ts
var LEASE_FILENAME = "session.lock";
function isLockContention(error) {
  const code = error?.code;
  return code === "EAGAIN" || code === "EWOULDBLOCK";
}
var SessionWriteLease = class _SessionWriteLease {
  constructor(held) {
    this.held = held;
  }
  held;
  released = false;
  /**
   * Acquire the session directory's kernel write lock.
   * @param dir - the session's artifact directory (created if absent).
   * @param id - the session the lock guards, for error identities.
   * @returns the held lock.
   * @throws {SessionAlreadyOwnedError} while another holder keeps the lock.
   */
  static async acquire(dir, id) {
    const path = join2(dir, LEASE_FILENAME);
    await mkdir(dir, { recursive: true, mode: 448 });
    if (process.platform === "win32") {
      let handle;
      try {
        handle = await acquireLockHandleWin32(path);
      } catch (error) {
        if (error?.code === "EBUSY") throw new SessionAlreadyOwnedError(id);
        throw error;
      }
      return new _SessionWriteLease({ kind: "win32", handle });
    }
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const handle = await open(path, "w");
      try {
        try {
          await tryLockExclusive(handle.fd);
        } catch (error) {
          if (isLockContention(error)) throw new SessionAlreadyOwnedError(id);
          throw error;
        }
        const held = await handle.stat({ bigint: true });
        const current = await stat(path, { bigint: true }).catch((error) => {
          if (error?.code === "ENOENT") return void 0;
          throw error;
        });
        if (current !== void 0 && current.ino === held.ino && current.dev === held.dev) {
          return new _SessionWriteLease({ kind: "posix", handle });
        }
      } catch (error) {
        await handle.close();
        throw error;
      }
      await handle.close();
    }
    throw new SessionAlreadyOwnedError(id);
  }
  /**
   * Release the kernel lock by closing its descriptor or handle. The POSIX
   * lock file is never removed: every acquired lock belongs to a
   * materialized or materializing session, and keeping the file preserves
   * the stable inode later lockers verify against. Idempotent.
   */
  async release() {
    if (this.released) return;
    this.released = true;
    if (this.held.kind === "win32") {
      await releaseLockHandleWin32(this.held.handle);
      return;
    }
    await this.held.handle.close();
  }
};

// plugins/dsh-session-cleanup/src/session-files.ts
var missing = (error) => error instanceof Error && "code" in error && error.code === "ENOENT";
function contained(root, path) {
  const part = relative(root, resolve2(path));
  if (part === "" || part === ".." || part.startsWith(`..${sep}`) || isAbsolute(part)) {
    throw new Error(`Session cleanup refuses a path outside its root: ${path}`);
  }
}
async function removeDirectory(root, path) {
  contained(root, path);
  const info = await lstat(path);
  if (info.isSymbolicLink()) {
    await unlink(path);
    return;
  }
  if (!info.isDirectory()) {
    await unlink(path);
    return;
  }
  for (const entry of await readdir(path)) await removeDirectory(root, join3(path, entry));
  await rmdir(path);
}
async function deleteLogs(root, id) {
  let canonical;
  try {
    canonical = await realpath(root);
  } catch (error) {
    if (missing(error)) return;
    throw error;
  }
  for (const entry of await readdir(canonical, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const target = resolve2(canonical, entry.name, encodeSegment(id));
    contained(canonical, target);
    let info;
    try {
      info = await lstat(target);
    } catch (error) {
      if (missing(error)) continue;
      throw error;
    }
    if (info.isSymbolicLink() || !info.isDirectory()) throw new Error(`Session directory is not a real directory: ${target}`);
    const lease = await SessionWriteLease.acquire(target, SessionId(id));
    try {
      await removeDirectory(canonical, target);
    } finally {
      await lease.release();
    }
  }
}

// plugins/dsh-session-cleanup/src/index.ts
var HOST = `${process.pid}:${performance.timeOrigin}`;
var SessionCleanup = class extends Service {
  constructor(ctx, config) {
    super(ctx, "sessionCleanup");
    this.config = config;
    if (!isAbsolute2(config.sessionRoot) || !isAbsolute2(config.queueFile)) throw new Error("Session cleanup requires absolute sessionRoot and queueFile paths");
    this.root = resolve3(config.sessionRoot);
    this.queueFile = resolve3(config.queueFile);
  }
  config;
  static inject = ["storageDomain"];
  static Config = z2.object({
    sessionRoot: z2.string().required(),
    queueFile: z2.string().required(),
    lockWaitMs: z2.number().step(1).min(1).default(3e4)
  });
  root;
  queueFile;
  /** Complete cold cleanup, then expose authenticated user-only endpoints. */
  async [Service.init]() {
    const request = await this.readQueue();
    if (request !== void 0 && request.pendingIds.length > 0 && request.requestedHost !== HOST && request.lastAttemptHost !== HOST && this.ctx.get("sessionPersistence") === void 0 && this.ctx.get("workspaceRegistry") === void 0) {
      await withFileLock(this.queueFile, () => this.cleanAtStartup(), { waitMs: this.config.lockWaitMs });
    }
    this.ctx.inject(["workspaceRegistry", "connection", "sessionPersistence"], (ctx) => {
      for (const action of ["state", "schedule"]) {
        ctx.effect(() => ctx.connection.fetch.register({
          path: `/api/session-cleanup/${action}`,
          methods: ["POST"],
          requestBody: "buffered",
          fetch: async (request2) => {
            const message = clientRequestSchema.parse(await request2.json());
            let result;
            try {
              if (message.method !== `session-cleanup/${action}`) throw new Error("RPC endpoint does not match its route");
              if (action === "schedule") await this.schedule(ctx);
              result = { ok: true, value: await this.state(ctx) };
            } catch (error) {
              result = { ok: false, error: { code: "session-cleanup/failed", message: error instanceof Error ? error.message : String(error), details: {} } };
            }
            return Response.json({ type: "server-response", rpcId: message.rpcId, result });
          }
        }));
      }
    });
  }
  async readQueue() {
    let text;
    try {
      text = await readFile(this.queueFile, "utf8");
    } catch (error) {
      if (missing(error)) return void 0;
      throw error;
    }
    const queue = queueSchema.parse(JSON.parse(text));
    if (resolve3(queue.sessionRoot) !== this.root) throw new Error("Pending cleanup names a different session root; restore sessionRoot before continuing");
    return queue;
  }
  async saveQueue(queue) {
    await writeFileAtomic(this.queueFile, `${JSON.stringify(queue, null, 2)}
`, { mode: 384 });
  }
  async state(ctx) {
    const queue = await this.readQueue();
    const archived = new Set(await this.existingArchived(ctx));
    return {
      archivedCount: archived.size,
      pendingCount: queue?.pendingIds.filter((id) => archived.has(id)).length ?? 0,
      ...queue?.lastResult === void 0 ? {} : { lastResult: queue.lastResult },
      errors: queue?.errors ?? []
    };
  }
  async schedule(ctx) {
    await withFileLock(this.queueFile, async () => {
      const prior = await this.readQueue();
      const ids2 = await this.existingArchived(ctx);
      if (ids2.length === 0) throw new Error("No archived sessions are available to clear");
      await this.saveQueue({
        version: 1,
        sessionRoot: this.root,
        requestedHost: HOST,
        pendingIds: [.../* @__PURE__ */ new Set([...prior?.pendingIds ?? [], ...ids2])],
        errors: []
      });
    }, { waitMs: this.config.lockWaitMs });
  }
  /** Deleted-ID archive markers hide retained parent catalogs without counting as sessions. */
  async existingArchived(ctx) {
    const existing = new Set((await ctx.sessionPersistence.list()).map((snapshot) => snapshot.header.id));
    return ctx.workspaceRegistry.archivedSessionIds.filter((id) => existing.has(id));
  }
  async cleanAtStartup() {
    const queue = await this.readQueue();
    if (queue === void 0 || queue.pendingIds.length === 0 || queue.requestedHost === HOST || queue.lastAttemptHost === HOST) return;
    const domain = await this.ctx.storageDomain.open(workspaceDomainSpec);
    try {
      const archived = new Set(domain.global.get().archivedSessionIds);
      const removed = /* @__PURE__ */ new Set();
      const pending = [];
      const errors = [];
      let skipped = 0;
      for (const id of queue.pendingIds) {
        if (!archived.has(id)) {
          skipped++;
          continue;
        }
        try {
          await deleteLogs(this.root, id);
          removed.add(id);
        } catch (error) {
          pending.push(id);
          errors.push(`${id}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      try {
        await this.removeAccounting(domain, removed);
      } catch (error) {
        pending.push(...removed);
        errors.push(error instanceof Error ? error.message : String(error));
        removed.clear();
      }
      await this.saveQueue({
        ...queue,
        pendingIds: pending,
        lastAttemptHost: HOST,
        lastResult: { deleted: removed.size, skipped, failed: pending.length },
        errors
      });
      if (errors.length > 0) this.ctx.logger.warn(`Archived-session cleanup has ${pending.length} pending sessions: ${errors.join("; ")}`);
    } finally {
      await domain.close();
    }
  }
  async removeAccounting(domain, removed) {
    if (removed.size === 0) return;
    const cache = await this.ctx.storageDomain.open(projectionCacheDomainSpec);
    try {
      for (const id of removed) await cache.table("sessions").delete(SessionId2(id));
    } finally {
      await cache.close();
    }
    const table = domain.table("workspaces");
    for (const [key, record] of table.entries()) {
      if (!record.sessionIds.some((id) => removed.has(id))) continue;
      await table.update(key, (current) => ({ ...current, sessionIds: current.sessionIds.filter((id) => !removed.has(id)), updatedAt: (/* @__PURE__ */ new Date()).toISOString() }));
    }
    const state = domain.global.get();
    await domain.global.set({
      ...state,
      pinnedSessionIds: state.pinnedSessionIds.filter((id) => !removed.has(id))
    });
  }
};
export {
  SessionCleanup as default
};
