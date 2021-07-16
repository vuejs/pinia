import { watch } from 'vue'
import {
  createPinia,
  defineSetupStore,
  defineStore,
  DefineStoreOptions,
  setActivePinia,
  StateTree,
} from '../src'

function defineOptions<
  O extends DefineStoreOptions<string, StateTree, any, any>
>(options: O): O {
  return options
}

describe('HMR', () => {
  const baseOptions = defineOptions({
    id: 'main',
    state: () => ({
      n: 0,
    }),

    actions: {
      increment(amount = 1) {
        // @ts-ignore
        this.n += amount
      },
    },

    getters: {
      double: (state: any) => state.n * 2,
    },
  })

  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds new state properties', () => {
    const useStore = defineStore(baseOptions)
    const store: any = useStore()
    store.n++

    // simulate a hmr
    defineStore({
      ...baseOptions,
      state: () => ({ newOne: 'hey', n: 0 }),
    })(null, store)

    expect(store.$state).toEqual({ n: 1, newOne: 'hey' })
    expect(store.n).toBe(1)
    expect(store.newOne).toBe('hey')

    defineStore({
      ...baseOptions,
      state: () => ({ other: 'new', n: 0 }),
    })(null, store)
  })

  it('keeps state reactive', () => {
    const useStore = defineStore(baseOptions)
    const store: any = useStore()

    const directSpy = jest.fn()
    const $stateSpy = jest.fn()

    watch(() => store.n, directSpy, { flush: 'sync' })
    watch(() => store.$state.n, $stateSpy, { flush: 'sync' })

    // simulate a hmr
    defineStore({
      ...baseOptions,
      state: () => ({ newOne: 'hey', n: 0 }),
    })(null, store)

    expect(directSpy).toHaveBeenCalledTimes(0)
    expect($stateSpy).toHaveBeenCalledTimes(0)

    store.n++
    expect(directSpy).toHaveBeenCalledTimes(1)
    expect($stateSpy).toHaveBeenCalledTimes(1)

    store.$state.n++
    expect(directSpy).toHaveBeenCalledTimes(2)
    expect($stateSpy).toHaveBeenCalledTimes(2)

    defineStore({
      ...baseOptions,
      state: () => ({ other: 'new', n: 0 }),
    })(null, store)

    store.n++
    expect(directSpy).toHaveBeenCalledTimes(3)
    expect($stateSpy).toHaveBeenCalledTimes(3)

    store.$state.n++
    expect(directSpy).toHaveBeenCalledTimes(4)
    expect($stateSpy).toHaveBeenCalledTimes(4)
  })

  it.todo('handles nested objects updates')
})
