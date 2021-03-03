import { createPinia, defineStore, PiniaPlugin } from '../src'
import { createLocalVue, mount } from '@vue/test-utils'
import Vue from 'vue'

declare module '../src' {
  export interface PiniaCustomProperties {
    n: number
    // uid: App['_uid']
    hasPinia: boolean
  }
}

describe('store plugins', () => {
  const useStore = defineStore({ id: 'test' })
  const localVue = createLocalVue()
  localVue.use(PiniaPlugin)

  it('adds properties to stores', () => {
    const pinia = createPinia()
    pinia.Vue = Vue
    mount({ template: '<p/>' }, { localVue })

    // must call use after installing the plugin
    pinia.use(() => {
      return { n: 20 }
    })

    const store = useStore(pinia)

    expect(store.n).toBe(20)
  })

  it('can install plugins before installing pinia', () => {
    const pinia = createPinia()
    pinia.Vue = Vue

    pinia.use(() => ({ n: 1 }))
    pinia.use((pinia) => ({ hasPinia: !!pinia }))

    mount({ template: '<p/>' }, { localVue })

    pinia.use((app) => ({ hasPinia: !!app }))

    const store = useStore(pinia)

    expect(store.n).toBe(1)
    expect(store.hasPinia).toBe(true)
  })
})
