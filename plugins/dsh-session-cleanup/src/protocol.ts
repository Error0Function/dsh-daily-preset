/** JSON values exchanged by the cleanup widget and persisted pending request. */
import { z } from 'zod'

const ids = z.array(z.string().min(1)).refine(value => new Set(value).size === value.length, 'Session IDs must be unique')
/** Summary of the last startup attempt; failed targets remain pending. */
export const resultSchema = z.object({ deleted: z.number().int().min(0), skipped: z.number().int().min(0), failed: z.number().int().min(0) }).strict()
/** Durable one-shot request, tied to its data root and requesting Host. */
export const queueSchema = z.object({
  version: z.literal(1), sessionRoot: z.string().min(1), requestedHost: z.string().min(1),
  pendingIds: ids, lastAttemptHost: z.string().optional(), lastResult: resultSchema.optional(),
  errors: z.array(z.string()).default([]),
}).strict()
/** UI state returned without session contents or credentials. */
export const stateSchema = z.object({
  archivedCount: z.number().int().min(0), pendingCount: z.number().int().min(0),
  lastResult: resultSchema.optional(), errors: z.array(z.string()),
}).strict()
/** Stored request parsed at the filesystem boundary. */
export type Queue = z.infer<typeof queueSchema>
/** State parsed by the browser at the RPC boundary. */
export type State = z.infer<typeof stateSchema>
