import fs from 'node:fs/promises'
import { x } from 'tinyexec'

await fs.rm('clone', { recursive: true, force: true })
await x('git', ['clone', 'https://github.com/vitejs/vite', 'clone', '--depth=1'], { nodeOptions: { stdio: 'inherit' } })
await fs.rm('clone/packages/plugin-legacy', { recursive: true, force: true })
await fs.rm('clone/packages/create-vite', { recursive: true, force: true })
await fs.rm('clone/playground', { recursive: true, force: true })
await fs.rm('clone/docs', { recursive: true, force: true })

// @keep-sorted
const keepBundling = [
  'chokidar',
  'dep-types',
  'postcss-import',
  'postcss-load-config',
  'postcss-modules',
  'types',
]

const packageJSON = JSON.parse(await fs.readFile('clone/packages/vite/package.json', 'utf-8'))
const deps = packageJSON.dependencies
const version = packageJSON.version
const sha = (await x('git', ['rev-parse', 'HEAD'], { nodeOptions: { cwd: 'clone' } })).stdout.trim()
for (const [key, value] of Object.entries(packageJSON.devDependencies)) {
  if (keepBundling.includes(key) || packageJSON.peerDependencies[key] || deps[key]) {
    continue
  }
  deps[key] = value
  delete packageJSON.devDependencies[key]
}
packageJSON.name = 'vite-unbundled'
packageJSON.repository = {
  type: 'git',
  url: 'git+https://github.com/antfu/vite-unbundled.git',
}
packageJSON.bugs = {
  url: 'https://github.com/antfu/vite-unbundled/issues',
}
packageJSON.meta = {
  original: {
    sha,
    version,
  },
}
// For testing
packageJSON.version = `${version}-0`

await fs.writeFile('clone/packages/vite/package.json', JSON.stringify(packageJSON, null, 2))
await fs.writeFile(
  'clone/packages/vite/README.md',
  `
# vite-unbundled

A mirror of [vite](https://github.com/vitejs/vite) with unbundled dependencies, maintain by [Anthony Fu](https://github.com/antfu).

Script repo: https://github.com/antfu/vite-unbundled

This version is deviated from the original vite version \`${version}\` at commit [\`${sha}\`](https://github.com/vitejs/vite/commit/${sha}).
`,
  'utf-8',
)

const rootPackageJSON = JSON.parse(await fs.readFile('clone/package.json', 'utf-8'))
delete rootPackageJSON.devDependencies.vite
delete rootPackageJSON.pnpm.overrides.vite
await fs.writeFile('clone/package.json', JSON.stringify(rootPackageJSON, null, 2))

await x('pnpm', ['install'], { nodeOptions: { cwd: 'clone', stdio: 'inherit' } })
await x('pnpm', ['build'], { nodeOptions: { cwd: 'clone/packages/vite', stdio: 'inherit' } })

console.log({
  sha,
  version,
})
