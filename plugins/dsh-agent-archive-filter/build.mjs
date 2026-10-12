/** Compile the Host stub and embed native lineage styles in the shared browser module. */
import { buildPlugin, buildClient } from '../../build-support.mjs'

await buildPlugin(import.meta.url, 'tsconfig.host.json')
await buildClient(import.meta.url, {
  cssVariable: 'ARCHIVE_LINEAGE_CSS',
  loader: { '.module.css': 'local-css' },
  external: ['react', 'react/jsx-runtime', 'react-dom', '@deepseek-ai/dsh-client-ui-primitives'],
})
