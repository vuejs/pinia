// @ts-check
// `dist/pinia.js` must run in plain Node, where no bundler defines
// `__VUE_PROD_DEVTOOLS__`: unguarded, `__USE_DEVTOOLS__` throws a
// ReferenceError inside `createPinia()` (#3167). Needs a built `dist/`, so
// `test:dist` only runs after `build`.

// set before importing: with NODE_ENV=production `__DEV__` is false, so the
// `__VUE_PROD_DEVTOOLS__` side of `__USE_DEVTOOLS__` is actually evaluated.
// static imports are hoisted, hence the dynamic ones below
process.env.NODE_ENV = 'production'

const { createApp } = await import('vue')
const { createPinia, defineStore } = await import('../dist/pinia.js')

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
  throw new Error(`expected counter.n to be 1, got ${counter.n}`)
}
