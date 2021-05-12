import { createPinia, defineStore, setActivePinia } from '../src'
import { computed, nextTick, ref, watch } from 'vue'

describe('State', () => {
  const useStore = () => {
    // create a new store
    setActivePinia(createPinia())
    return defineStore({
      id: 'main',
      state: () => ({
        name: 'Eduardo',
        counter: 0,
      }),
    })()
  }

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

  // it('watch', () => {
  //   setActivePinia(createPinia())
  //   defineStore({
  //     id: 'main',
  //     state: () => ({
  //       name: 'Eduardo',
  //       counter: 0,
  //     }),
  //   })()
  // })

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

    setActivePinia(createPinia())
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
    name.value = 'Ed'
    expect(store.name).toBe('Ed')
    store.name = 'Edu'
    expect(store.name).toBe('Edu')

    store.$patch({ counter: 2 })
    expect(store.counter).toBe(2)
    expect(counter.value).toBe(2)
  })
})
