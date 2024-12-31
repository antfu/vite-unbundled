import fs from 'node:fs/promises'
import { x } from 'tinyexec'

const packageJSON = JSON.parse(await fs.readFile('clone/packages/vite/package.json', 'utf-8'))
if (packageJSON.name !== 'vite-unbundled') {
  throw new Error('Invalid package.json')
}
x('pnpm', ['publish', '--access', 'public', '--no-git-checks'], {
  nodeOptions: { cwd: 'clone/packages/vite', stdio: 'inherit' },
})
