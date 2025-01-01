import { x } from 'tinyexec'

await x('git', ['checkout', '.'], { nodeOptions: { cwd: 'vite', stdio: 'inherit' } })
await x('git', ['pull'], { nodeOptions: { cwd: 'vite', stdio: 'inherit' } })
