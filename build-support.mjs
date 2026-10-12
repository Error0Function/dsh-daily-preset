/** Compile Host and Client modules against the explicitly selected DSH source SDK. */
import { createRequire } from 'node:module'
import { readFile, mkdir, realpath, lstat, symlink, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

/** Resolve the explicitly selected same-version DSH source SDK. */
export function sdkRoot() {
  if (!process.env.DSH_REPO) throw new Error('Set DSH_REPO to the same-version DSH source checkout before building.')
  return resolve(process.env.DSH_REPO)
}

/** Link SDK dependencies without replacing existing installations. */
async function prepare(entryUrl, extraDependencies) {
  const directory = dirname(fileURLToPath(entryUrl))
  const repo = sdkRoot()
  const aggregate = join(repo, 'node_modules/.pnpm/node_modules')
  const requireSdk = createRequire(join(aggregate, 'package.json'))
  const manifest = JSON.parse(await readFile(join(directory, 'package.json'), 'utf8'))
  const dependencies = { ...manifest.peerDependencies, ...manifest.dependencies,
    ...Object.fromEntries(['@types/node', 'typescript', ...extraDependencies].map(name => [name, '*'])) }
  for (const [name, spec] of Object.entries(dependencies)) {
    const destination = join(directory, 'node_modules', name)
    const existing = await lstat(destination).catch(error => { if (error.code !== 'ENOENT') throw error })
    if (existing !== undefined) continue
    const source = spec.startsWith('link:') ? await realpath(join(directory, spec.slice(5)))
      : await realpath(join(repo, 'node_modules', name)).catch(error => {
        if (error.code !== 'ENOENT') throw error
        return realpath(join(aggregate, name))
      })
    await mkdir(dirname(destination), { recursive: true })
    await symlink(source, destination, process.platform === 'win32' ? 'junction' : 'dir')
  }
  return { directory, manifest, requireSdk }
}

/** Run the selected compiler program in its owning plugin directory. */
function typecheck({ directory, requireSdk }, config) {
  const result = spawnSync(process.execPath, [requireSdk.resolve('typescript/bin/tsc'), '-p', join(directory, config)],
    { cwd: directory, encoding: 'utf8', windowsHide: true })
  if (result.status !== 0) throw new Error(result.stdout + result.stderr)
}

/** Compile one Host module, preserving existing dependency links. */
export async function buildPlugin(entryUrl, config = 'tsconfig.json', entries = ['src/index.ts'], options = {}) {
  const environment = await prepare(entryUrl, [])
  typecheck(environment, config)
  const { directory, manifest, requireSdk } = environment
  await requireSdk('esbuild').build({
    entryPoints: entries.map(entry => join(directory, entry)), outdir: join(directory, 'lib'),
    bundle: true, format: 'esm', platform: 'node', target: 'node22', packages: 'external',
    tsconfig: join(directory, config), ...options,
  })
  process.stdout.write(`Built ${manifest.name}\n`)
}

/** Compile and register a browser module, optionally embedding bundled CSS under a named variable. */
export async function buildClient(entryUrl, { cssVariable, ...options } = {}) {
  const environment = await prepare(entryUrl, ['@types/react', '@types/react-dom'])
  typecheck(environment, 'tsconfig.client.json')
  const { directory, manifest, requireSdk } = environment
  const client = await requireSdk('esbuild').build({
    entryPoints: [join(directory, 'src/client.tsx')], outfile: join(directory, 'lib/client-bundle.js'),
    bundle: true, format: 'cjs', platform: 'browser', target: 'es2022', jsx: 'automatic', write: false,
    tsconfig: join(directory, 'tsconfig.client.json'),
    external: ['react', 'react/jsx-runtime', '@deepseek-ai/dsh-client-ui-primitives'], ...options,
  })
  const javascript = client.outputFiles.find(file => file.path.endsWith('.js'))
  if (javascript === undefined) throw new Error('Expected bundled client JavaScript output')
  let prelude = ''
  if (cssVariable !== undefined) {
    const stylesheet = client.outputFiles.find(file => file.path.endsWith('.css'))
    if (stylesheet === undefined) throw new Error('Expected bundled client CSS output')
    prelude = `var ${cssVariable}=${JSON.stringify(stylesheet.text)};`
  }
  await mkdir(join(directory, 'lib'), { recursive: true })
  await writeFile(join(directory, 'lib/client.js'),
    `window.__ModuleLoader__.load({id:${JSON.stringify(manifest.name)},factory:(require)=>{var module={exports:{}};var exports=module.exports;${prelude}\n`
    + javascript.text + '\nreturn module.exports;}});\n')
  process.stdout.write(`Built Client for ${manifest.name}\n`)
}
