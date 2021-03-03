import Vue from 'vue'
import { defineStore, setActivePinia, createPinia, Pinia } from '../src'

describe('Subscriptions', () => {
  let pinia: Pinia
  const useStore = () => {
    pinia = createPinia()
    pinia.Vue = Vue
    // create a new store
    setActivePinia(pinia)
    return defineStore({
      id: 'main',
      state: () => ({
        name: 'Eduardo',
      }),
    })()
  }

  let store: ReturnType<typeof useStore>
  beforeEach(() => {
    store = useStore()
  })

  it('fires callback when patch is applied', () => {
    const spy = jest.fn()
    store.$subscribe(spy)
    store.$state.name = 'Cleiton'
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('unsubscribes callback when unsubscribe is called', () => {
    const spy = jest.fn()
    const unsubscribe = store.$subscribe(spy)
    unsubscribe()
    store.$state.name = 'Cleiton'
    expect(spy).not.toHaveBeenCalled()
  })

  it('listeners are not affected when unsubscribe is called multiple times', () => {
    const func1 = jest.fn()
    const func2 = jest.fn()
    const unsubscribe1 = store.$subscribe(func1)
    store.$subscribe(func2)
    unsubscribe1()
    unsubscribe1()
    store.$state.name = 'Cleiton'
    expect(func1).not.toHaveBeenCalled()
    expect(func2).toHaveBeenCalledTimes(1)
  })
})
