import fs from 'node:fs/promises'
import process from 'node:process'
import { x } from 'tinyexec'

const tagSince = 'v6.0.0'

const dryRun = process.argv.includes('--dry')
if (dryRun) {
  console.log('Dry run')
}
else {
  console.log('Publishing...')
}

const tags = (await x('git', ['tag', '--sort=-creatordate'], { nodeOptions: { cwd: 'vite' } }))
  .stdout
  .trim()
  .split('\n')
  .filter(i => i.startsWith('v'))// Exclude sub packages tag

console.log({ tags })

async function releaseForTag(tag: string) {
  console.log(`Build for ${tag}...`)

  await x('git', ['checkout', tag], { nodeOptions: { cwd: 'vite' } })
  await x('pnpm', ['install', '--frozen-lockfile'], { nodeOptions: { cwd: 'vite', stdio: 'inherit' } })

  await fs.rm('vite/packages/plugin-legacy', { recursive: true, force: true })
  await fs.rm('vite/packages/create-vite', { recursive: true, force: true })
  await fs.rm('vite/playground', { recursive: true, force: true })
  await fs.rm('vite/docs', { recursive: true, force: true })

  // @keep-sorted
  const keepBundling = [
    'chokidar',
    'dep-types',
    'postcss-import',
    'postcss-load-config',
    'postcss-modules',
    'types',
  ]

  const packageJSON = JSON.parse(await fs.readFile('vite/packages/vite/package.json', 'utf-8'))
  const deps = packageJSON.dependencies
  const version = packageJSON.version
  const sha = (await x('git', ['rev-parse', 'HEAD'], { nodeOptions: { cwd: 'vite' } })).stdout.trim()
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

  await fs.writeFile('vite/packages/vite/package.json', JSON.stringify(packageJSON, null, 2))
  await fs.writeFile(
    'vite/packages/vite/README.md',
    `
# vite-unbundled

A mirror of [vite](https://github.com/vitejs/vite) with unbundled dependencies, maintain by [Anthony Fu](https://github.com/antfu).

Script repo: https://github.com/antfu/vite-unbundled

This version is deviated from the original vite version \`${version}\` at commit [\`${sha}\`](https://github.com/vitejs/vite/commit/${sha}).
`,
    'utf-8',
  )

  const rootPackageJSON = JSON.parse(await fs.readFile('vite/package.json', 'utf-8'))
  delete rootPackageJSON.devDependencies.vite
  delete rootPackageJSON.pnpm.overrides.vite
  await fs.writeFile('vite/package.json', JSON.stringify(rootPackageJSON, null, 2))

  await x('pnpm', ['build'], { nodeOptions: { cwd: 'vite/packages/vite', stdio: 'inherit' } })

  if (dryRun) {
    console.log('Dry run, skip publish')
  }
  else {
    console.log('Publishing...')
    await x('pnpm', ['publish', '-r', '--access', 'public', '--no-git-checks'], {
      nodeOptions: { cwd: 'vite/packages/vite', stdio: 'inherit', env: process.env },
    })
  }
}

const newTags = tags
  .reverse()
  .slice(tags.indexOf(tagSince))

const publishedVersions = await x('npm', ['view', 'vite-unbundled', 'versions', '--json']).then(i => JSON.parse(i.stdout))
const missingVersions = newTags.filter(i => !publishedVersions.includes(i.replace('v', '')))

for (const tag of missingVersions) {
  await releaseForTag(tag)
}
