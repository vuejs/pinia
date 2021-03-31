import { createPinia, defineStore, PiniaPlugin } from '../src'
import { createLocalVue, mount } from '@vue/test-utils'
import Vue from 'vue'

declare module '../src' {
  export interface PiniaCustomProperties<Id> {
    n: number
    // uid: App['_uid']
    hasPinia: boolean
    idFromPlugin: Id
  }
}

describe('store plugins', () => {
  const useStore = defineStore({
    id: 'test',

    actions: {
      incrementN() {
        return this.n++
      },
    },

    getters: {
      doubleN() {
        return this.n * 2
      },
    },
  })
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
    // @ts-expect-error: n is a number
    store.n.notExisting
    // @ts-expect-error: it should always be 'test'
    store.idFromPlugin == 'hello'
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

  it('can be used in actions', () => {
    const pinia = createPinia()
    pinia.Vue = Vue
    mount({ template: '<p/>' }, { localVue })

    // must call use after installing the plugin
    pinia.use(() => {
      return { n: 20 }
    })

    const store = useStore(pinia)

    expect(store.incrementN()).toBe(20)
  })

  it('can be used in getters', () => {
    const pinia = createPinia()
    pinia.Vue = Vue
    mount({ template: '<p/>' }, { localVue })

    // must call use after installing the plugin
    pinia.use(() => {
      return { n: 20 }
    })

    const store = useStore(pinia)
    expect(store.doubleN).toBe(40)
  })
})
