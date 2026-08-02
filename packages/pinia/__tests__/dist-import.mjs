// @ts-check
// Ensures the built `dist/pinia.js` works when imported directly in Node
// without a bundler injecting compile-time defines (#3167): if
// `__VUE_PROD_DEVTOOLS__` is left unguarded in the dist output, evaluating
// `__USE_DEVTOOLS__` throws a ReferenceError. Requires `dist/` to be built,
// so it runs after the build, as part of `test:dts`.
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const script = `
import { createApp } from 'vue'
import { createPinia, defineStore } from './dist/pinia.js'

const pinia = createPinia()
createApp({}).use(pinia)
const useCounterStore = defineStore('counter', {
  state: () => ({ n: 0 }),
  actions: {
    increment() {
      this.n++
    },
  },
})
const counter = useCounterStore(pinia)
counter.increment()
if (counter.n !== 1) {
  throw new Error(\`expected counter.n to be 1, got \${counter.n}\`)
}
`

// with NODE_ENV=production, __DEV__ is false at runtime, so the
// __VUE_PROD_DEVTOOLS__ side of the __USE_DEVTOOLS__ define is evaluated
for (const NODE_ENV of ['production', undefined]) {
  const env = { ...process.env }
  delete env.NODE_ENV
  if (NODE_ENV) env.NODE_ENV = NODE_ENV
  const { status, stderr } = spawnSync(
    process.execPath,
    ['--input-type=module', '-e', script],
    {
      cwd: fileURLToPath(new URL('..', import.meta.url)),
      env,
      encoding: 'utf-8',
    }
  )
  if (status !== 0) {
    console.error(stderr)
    console.error(
      `Importing dist/pinia.js in Node (NODE_ENV=${NODE_ENV}) failed`
    )
    process.exit(1)
  }
}
