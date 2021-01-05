import { createPinia, defineStore } from '../src'
import { mount } from '@vue/test-utils'
import { App } from 'vue'

declare module '../src' {
  export interface PiniaCustomProperties {
    n: number
    uid: App['_uid']
    hasApp: boolean
  }
}

describe('store plugins', () => {
  const useStore = defineStore({ id: 'test' })
  it('adds properties to stores', () => {
    const pinia = createPinia()

    mount({ template: 'none' }, { global: { plugins: [pinia] } })

    // must call use after installing the plugin
    pinia.use((app) => {
      return { n: 20, uid: app._uid }
    })

    const store = useStore(pinia)

    expect(store.n).toBe(20)
    expect(store.uid).toBeDefined()
  })

  it('can install plugins before installing pinia', () => {
    const pinia = createPinia()

    pinia.use(() => ({ n: 1 }))
    pinia.use((app) => ({ uid: app._uid }))

    mount({ template: 'none' }, { global: { plugins: [pinia] } })

    pinia.use((app) => ({ hasApp: !!app }))

    const store = useStore(pinia)

    expect(store.n).toBe(1)
    expect(store.uid).toBeDefined()
    expect(store.hasApp).toBe(true)
  })
})
