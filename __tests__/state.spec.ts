import { createPinia, defineStore, setActivePinia } from '../src'
import { computed, nextTick, watch } from 'vue'

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
})
