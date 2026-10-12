/** Build-time imports bundled from this deployment's unchanged JSONL backend. */
declare module 'dsh-jsonl-format' {
  /** Encode a session ID as one collision-free path segment. */
  export function encodeSegment(raw: string): string
}
declare module 'dsh-jsonl-lease' {
  import type { SessionId } from '@deepseek-ai/dsh-session'
  /** Acquire and release the same kernel write lock used by the native backend. */
  export class SessionWriteLease {
    static acquire(dir: string, id: SessionId): Promise<SessionWriteLease>
    release(): Promise<void>
  }
}
