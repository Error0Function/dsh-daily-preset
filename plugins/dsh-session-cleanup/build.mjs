/** Compile cleanup with the target SDK's native JSONL encoding and write lease. */
import { join } from 'node:path'
import { buildPlugin, buildClient, sdkRoot } from '../../build-support.mjs'

const repo = sdkRoot()
await buildPlugin(import.meta.url, 'tsconfig.host.json', ['src/index.ts'], {
  external: ['@deepseek-ai/*'],
  alias: {
    'dsh-jsonl-format': join(repo, 'packages/session/session-persistence-jsonl/src/format.ts'),
    'dsh-jsonl-lease': join(repo, 'packages/session/session-persistence-jsonl/src/lease.ts'),
  },
})
await buildClient(import.meta.url)
