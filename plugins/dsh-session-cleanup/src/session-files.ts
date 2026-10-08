/** Checked JSONL generation removal under the configured root and native write lease. */
import { lstat, readdir, realpath, rmdir, unlink } from 'node:fs/promises'
import { isAbsolute, relative, resolve, join, sep } from 'node:path'
import { SessionId } from '@deepseek-ai/dsh-session'
import { encodeSegment } from 'dsh-jsonl-format'
import { SessionWriteLease } from 'dsh-jsonl-lease'

/** Detect a missing filesystem entry without treating other failures as absence. */
export const missing = (error: unknown): boolean => error instanceof Error && 'code' in error && error.code === 'ENOENT'

/** Require every removed path to be a descendant of the configured session root. */
function contained(root: string, path: string): void {
  const part = relative(root, resolve(path))
  if (part === '' || part === '..' || part.startsWith(`..${sep}`) || isAbsolute(part)) {
    throw new Error(`Session cleanup refuses a path outside its root: ${path}`)
  }
}

/** Remove a checked directory without traversing symbolic links or junctions. */
async function removeDirectory(root: string, path: string): Promise<void> {
  contained(root, path)
  const info = await lstat(path)
  if (info.isSymbolicLink()) { await unlink(path); return }
  if (!info.isDirectory()) { await unlink(path); return }
  for (const entry of await readdir(path)) await removeDirectory(root, join(path, entry))
  await rmdir(path)
}

/** Delete all generations for one exact ID under real project/session directories. */
export async function deleteLogs(root: string, id: string): Promise<void> {
  let canonical: string
  try { canonical = await realpath(root) }
  catch (error) { if (missing(error)) return; throw error }
  for (const entry of await readdir(canonical, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const target = resolve(canonical, entry.name, encodeSegment(id))
    contained(canonical, target)
    let info
    try { info = await lstat(target) }
    catch (error) { if (missing(error)) continue; throw error }
    if (info.isSymbolicLink() || !info.isDirectory()) throw new Error(`Session directory is not a real directory: ${target}`)
    const lease = await SessionWriteLease.acquire(target, SessionId(id))
    try { await removeDirectory(canonical, target) }
    finally { await lease.release() }
  }
}
