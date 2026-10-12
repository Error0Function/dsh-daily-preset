/** Compile the daily bundle and its internal Host and Client modules in load order. */
import { buildPlugin, buildClient } from './build-support.mjs'

await import('./plugins/dsh-context-trim/build.mjs')
await import('./plugins/dsh-agent-control/build.mjs')
await buildPlugin(import.meta.url, 'tsconfig.host.json', ['src/index.ts', 'src/policy.ts'])
await buildClient(import.meta.url)
await import('./plugins/dsh-agent-archive-filter/build.mjs')
await import('./plugins/dsh-session-cleanup/build.mjs')
