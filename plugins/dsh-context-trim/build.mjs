/** Compile this plugin using the source deployment selected by DSH_REPO. */
import { buildPlugin } from '../../build-support.mjs'
await buildPlugin(import.meta.url)
