import { defineStore } from './'

const store = defineStore('subscribe', {
  state: () => ({ n: 0 }),
})()

store.$subscribe(() => {}, {
  detached: true,
  flush: 'sync',
  immediate: true,
  deep: true,
})

// @ts-expect-error: once is not supported
store.$subscribe(() => {}, { once: true })
