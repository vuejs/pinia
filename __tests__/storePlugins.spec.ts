import { createPinia, defineStore, PiniaPlugin } from '../src'
import { createLocalVue, mount } from '@vue/test-utils'
import { ref, set, toRef } from '@vue/composition-api'

declare module '../src' {
  export interface PiniaCustomProperties<Id> {
    pluginN: number
    // uid: App['_uid']
    hasPinia: boolean
    idFromPlugin: Id
    someRef: number
    globalA: string
    globalB: string
    notShared: number
    shared: number
  }

  export interface PiniaCustomStateProperties<S> {
    // pluginN: 'test' extends Id ? number : never | undefined
    pluginN: number
    someRef: number
    shared: number
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
    pinia.use(({ store }) => {
      if (!store.$state.hasOwnProperty('pluginN')) {
        set(store.$state, 'pluginN', ref(20))
      }
      set(store, 'pluginN', toRef(store.$state, 'pluginN'))
    })

    const store = useStore()

    expect(store.$state.pluginN).toBe(20)
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

  it('can add refs to state', () => {
    const pinia = createPinia()
    const someRef = ref(0)
    pinia.use(({ store }) => {
      set(store, 'someRef', someRef)
      set(store.$state, 'someRef', someRef)
    })

    mount({ template: '<p/>' }, { localVue, pinia })

    const store = useStore()

    expect(store.someRef).toBe(0)
    expect(store.$state.someRef).toBe(0)
    someRef.value++
    expect(store.someRef).toBe(1)
    expect(store.$state.someRef).toBe(1)
    store.someRef++
    expect(store.someRef).toBe(2)
    expect(store.$state.someRef).toBe(2)
    expect(someRef.value).toBe(2)
  })

  it('shares the same ref among stores', () => {
    const pinia = createPinia()

    mount({ template: '<p/>' }, { localVue, pinia })

    // must call use after installing the plugin
    pinia.use(({ store }) => {
      if (!store.$state.hasOwnProperty('shared')) {
        set(store.$state, 'shared', ref(20))
      }
      set(store, 'notShared', ref(10))
      set(store, 'shared', toRef(store.$state, 'shared'))
    })

    const store = useStore(pinia)
    const store2 = useStore(pinia)

    expect(store.$state.shared).toBe(20)
    expect(store.shared).toBe(20)
    expect(store2.$state.shared).toBe(20)
    expect(store2.shared).toBe(20)

    store.$state.shared = 10
    expect(store.$state.shared).toBe(10)
    expect(store.shared).toBe(10)
    expect(store2.$state.shared).toBe(10)
    expect(store2.shared).toBe(10)

    store.shared = 1
    expect(store.$state.shared).toBe(1)
    expect(store.shared).toBe(1)
    expect(store2.$state.shared).toBe(1)
    expect(store2.shared).toBe(1)

    store.notShared = 5
    expect(store.$state).not.toHaveProperty('notShared')
    expect(store.notShared).toBe(5)
    expect(store2.$state).not.toHaveProperty('notShared')
    expect(store2.notShared).toBe(10)
  })
})
