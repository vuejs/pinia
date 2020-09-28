import { defineStore, setActiveReq } from '../src'
import { computed } from 'vue'

describe('State', () => {
  const useStore = () => {
    // create a new store
    setActiveReq({})
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
})
