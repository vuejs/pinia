import { createPinia, defineStore, PiniaPlugin } from '../src'
import { createLocalVue, mount } from '@vue/test-utils'

declare module '../src' {
  export interface PiniaCustomProperties<Id> {
    pluginN: number
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
        return this.pluginN++
      },
    },

    getters: {
      doubleN: (state) => state.pluginN * 2,
    },
  })
  const localVue = createLocalVue()
  localVue.use(PiniaPlugin)

  it('adds properties to stores', () => {
    const pinia = createPinia()
    mount({ template: '<p/>' }, { localVue, pinia })

    // must call use after installing the plugin
    pinia.use(() => {
      return { pluginN: 20 }
    })

    const store = useStore()

    expect(store.pluginN).toBe(20)
    // @ts-expect-error: n is a number
    store.pluginN.notExisting
    // @ts-expect-error: it should always be 'test'
    store.idFromPlugin == 'hello'
  })

  it('can install plugins before installing pinia', () => {
    const pinia = createPinia()

    pinia.use(() => ({ pluginN: 1 }))
    pinia.use((pinia) => ({ hasPinia: !!pinia }))

    mount({ template: '<p/>' }, { localVue, pinia })

    pinia.use((app) => ({ hasPinia: !!app }))

    const store = useStore()

    expect(store.pluginN).toBe(1)
    expect(store.hasPinia).toBe(true)
  })

  it('can be used in actions', () => {
    const pinia = createPinia()
    mount({ template: '<p/>' }, { localVue, pinia })

    // must call use after installing the plugin
    pinia.use(() => {
      return { pluginN: 20 }
    })

    const store = useStore()

    expect(store.incrementN()).toBe(20)
  })

  it('can be used in getters', () => {
    const pinia = createPinia()
    mount({ template: '<p/>' }, { localVue, pinia })

    // must call use after installing the plugin
    pinia.use(() => {
      return { pluginN: 20 }
    })

    const store = useStore()
    expect(store.doubleN).toBe(40)
  })
})
