import { createPinia, defineStore, setActivePinia } from '../src'
import { computed, nextTick, ref, watch } from 'vue'

function expectType<T>(value: T): void {}

describe('store with setup syntax', () => {
  const useStore = defineStore('main', () => {
    const name = ref('Eduardo')
    const counter = ref(0)
    function increment(amount = 1) {
      counter.value += amount
    }
    const double = computed(() => counter.value * 2)

    return { name, counter, increment, double }
  })

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should extract the $state', () => {
    const store = useStore()
    expectType<{ name: string; counter: number }>(store.$state)
    expect(store.$state).toEqual({ name: 'Eduardo', counter: 0 })
    expect(store.name).toBe('Eduardo')
    expect(store.counter).toBe(0)
    expect(store.double).toBe(0)
    store.increment()
    expect(store.counter).toBe(1)
    expect(store.double).toBe(2)
    expect(store.$state).toEqual({ name: 'Eduardo', counter: 1 })
    expect(store.$state).not.toHaveProperty('double')
    expect(store.$state).not.toHaveProperty('increment')
  })

  it('can store a function', () => {
    const store = defineStore('main', () => {
      const fn = ref(() => {})
      function action() {}
      return { fn, action }
    })()
    expectType<{ fn: () => void }>(store.$state)
    expect(store.$state).toEqual({ fn: expect.any(Function) })
    expect(store.fn).toEqual(expect.any(Function))
    store.action()
  })

  it('can directly access state at the store level', () => {
    const store = useStore()

    expect(store.name).toBe('Eduardo')
    store.name = 'Ed'
    expect(store.name).toBe('Ed')
  })

  it('state is reactive', () => {
    const store = useStore()
    const upperCased = computed(() => store.name.toUpperCase())
    expect(upperCased.value).toBe('EDUARDO')
    store.name = 'Ed'
    expect(upperCased.value).toBe('ED')
  })

  it('state can be watched', async () => {
    const store = useStore()
    const spy = jest.fn()
    watch(() => store.name, spy)
    expect(spy).not.toHaveBeenCalled()
    store.name = 'Ed'
    await nextTick()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('unwraps refs', () => {
    const name = ref('Eduardo')
    const counter = ref(0)
    const double = computed({
      get: () => counter.value * 2,
      set(val) {
        counter.value = val / 2
      },
    })

    const pinia = createPinia()
    setActivePinia(pinia)
    const useStore = defineStore({
      id: 'main',
      state: () => ({
        name,
        counter,
        double,
      }),
    })

    const store = useStore()

    expect(store.name).toBe('Eduardo')
    expect(store.$state.name).toBe('Eduardo')
    expect(pinia.state.value.main).toEqual({
      name: 'Eduardo',
      counter: 0,
      double: 0,
    })

    name.value = 'Ed'
    expect(store.name).toBe('Ed')
    expect(store.$state.name).toBe('Ed')
    expect(pinia.state.value.main.name).toBe('Ed')

    store.name = 'Edu'
    expect(store.name).toBe('Edu')

    store.$patch({ counter: 2 })
    expect(store.counter).toBe(2)
    expect(counter.value).toBe(2)
  })
})
