import { beforeEach, describe, it, expect, vi } from 'vitest'
import { computed, reactive, ref, toRefs, watch } from 'vue'
import {
  createPinia,
  defineStore,
  DefineStoreOptions,
  setActivePinia,
  StateTree,
} from '../src'

function defineOptions<
  O extends Omit<DefineStoreOptions<string, StateTree, any, any>, 'id'>,
>(options: O): O {
  return options
}

describe('HMR', () => {
  const baseOptions = defineOptions({
    state: () => ({
      n: 0,
      arr: [],
      nestedArr: {
        arr: [],
      },
      nested: {
        a: 'a',
      },
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

  describe('Setup store', () => {
    const baseSetup = () => {
      const state = reactive({
        n: 0,
        arr: [],
        nestedArr: {
          arr: [],
        },
        nested: {
          a: 'a',
        },
      })

      function increment(amount = 1) {
        state.n += amount
      }

      const double = computed(() => state.n * 2)

      return { ...toRefs(state), increment, double }
    }

    describe('state', () => {
      it('adds new state properties', () => {
        const useStore = defineStore('id', baseSetup)
        const store: any = useStore()
        store.n++

        // simulate a hmr
        defineStore('id', () => {
          const state = reactive({
            newOne: 'hey',
            n: 0,
          })

          function increment(amount = 1) {
            state.n += amount
          }

          const double = computed(() => state.n * 2)

          return { ...toRefs(state), increment, double }
        })(null, store)

        expect(store.$state).toEqual({ n: 1, newOne: 'hey' })
        expect(store.n).toBe(1)
        expect(store.newOne).toBe('hey')

        defineStore('id', () => {
          const state = reactive({
            other: 'new',
            n: 0,
          })

          function increment(amount = 1) {
            state.n += amount
          }

          const double = computed(() => state.n * 2)

          return { ...toRefs(state), increment, double }
        })(null, store)

        expect(store.$state).toEqual({ n: 1, other: 'new' })
        expect(store.n).toBe(1)
        expect(store).not.toHaveProperty('newOne')
        expect(store.other).toBe('new')
      })

      it('keeps state reactive', () => {
        const useStore = defineStore('id', baseSetup)
        const store: any = useStore()

        const directSpy = vi.fn()
        const $stateSpy = vi.fn()

        watch(() => store.n, directSpy, { flush: 'sync' })
        watch(() => store.$state.n, $stateSpy, { flush: 'sync' })

        // simulate a hmr
        defineStore('id', () => {
          const state = reactive({
            newOne: 'hey',
            n: 0,
          })

          function increment(amount = 1) {
            state.n += amount
          }

          const double = computed(() => state.n * 2)

          return { ...toRefs(state), increment, double }
        })(null, store)

        expect(directSpy).toHaveBeenCalledTimes(0)
        expect($stateSpy).toHaveBeenCalledTimes(0)

        store.n++
        expect(directSpy).toHaveBeenCalledTimes(1)
        expect($stateSpy).toHaveBeenCalledTimes(1)
        store.$state.n++
        expect(directSpy).toHaveBeenCalledTimes(2)
        expect($stateSpy).toHaveBeenCalledTimes(2)

        defineStore('id', () => {
          const state = reactive({
            other: 'new',
            n: 0,
          })

          function increment(amount = 1) {
            state.n += amount
          }

          const double = computed(() => state.n * 2)

          return { ...toRefs(state), increment, double }
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

    describe('actions', () => {
      it('adds new actions', () => {
        const useStore = defineStore('id', baseSetup)
        const store: any = useStore()

        // simulate a hmr
        defineStore('id', () => {
          const data = baseSetup()
          function decrement() {
            data.n.value--
          }
          return { ...data, decrement }
        })(null, store)

        store.increment()
        expect(store.n).toBe(1)
        expect(store.$state.n).toBe(1)
        store.decrement()
        expect(store.n).toBe(0)
        expect(store.$state.n).toBe(0)

        defineStore('id', baseSetup)(null, store)

        store.increment()
        expect(store.n).toBe(1)
        expect(store.$state.n).toBe(1)
        expect(store).not.toHaveProperty('decrement')
      })
    })

    describe('getters', () => {
      it('adds new getters properties', () => {
        const useStore = defineStore('id', baseSetup)
        const store: any = useStore()
        expect(store.double).toBe(0)

        // simulate a hmr
        defineStore('id', () => {
          const data = baseSetup()
          const triple = computed(() => data.n.value * 3)
          return { ...data, triple }
        })(null, store)

        store.n = 3
        expect(store.double).toBe(6)
        expect(store.triple).toBe(9)

        defineStore('id', baseSetup)(null, store)

        store.n = 4
        expect(store.double).toBe(8)
        expect(store).not.toHaveProperty('triple')
      })

      it('keeps getters reactive', () => {
        const useStore = defineStore('id', baseSetup)
        const store: any = useStore()

        const spy = vi.fn()

        watch(
          () => {
            return store.double
          },
          spy,
          { flush: 'sync' }
        )

        // simulate a hmr
        defineStore('id', () => {
          const data = baseSetup()
          data.n.value = 2
          // @ts-expect-error: not defined
          data.newThing = ref(true)
          return data
        })(null, store)

        // n isn't changed
        expect(spy).toHaveBeenCalledTimes(0)

        store.n++
        // expect(store.double).toBe(6)
        expect(spy).toHaveBeenCalledTimes(1)

        defineStore('id', baseSetup)(null, store)

        store.n++
        // expect(store.double).toBe(8)
        expect(spy).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('Options store', () => {
    describe('state', () => {
      it('adds new state properties', () => {
        const useStore = defineStore('id', baseOptions)
        const store: any = useStore()
        store.n++

        // simulate a hmr
        defineStore('id', {
          ...baseOptions,
          state: () => ({ newOne: 'hey', n: 0 }),
        })(null, store)

        expect(store.$state).toEqual({ n: 1, newOne: 'hey' })
        expect(store.n).toBe(1)
        expect(store.newOne).toBe('hey')

        defineStore('id', {
          ...baseOptions,
          state: () => ({ other: 'new', n: 0 }),
        })(null, store)

        expect(store.$state).toEqual({ n: 1, other: 'new' })
        expect(store.n).toBe(1)
        expect(store).not.toHaveProperty('newOne')
        expect(store.other).toBe('new')
      })

      it('patches nested objects', () => {
        const useStore = defineStore('id', baseOptions)
        const store: any = useStore()

        // simulate a hmr
        defineStore('id', {
          ...baseOptions,
          state: () => ({ nested: { a: 'b', b: 'b' } }),
        })(null, store)

        expect(store.$state).toEqual({ nested: { a: 'a', b: 'b' } })

        defineStore('id', {
          ...baseOptions,
          state: () => ({ nested: { b: 'c' } }),
        })(null, store)
        // removes the nested a
        expect(store.$state).toEqual({ nested: { b: 'b' } })
      })

      it('skips arrays', () => {
        const useStore = defineStore('id', baseOptions)
        const store: any = useStore()

        // simulate a hmr
        defineStore('id', {
          ...baseOptions,
          state: () => ({ arr: [2] }),
        })(null, store)

        expect(store.$state).toEqual({ arr: [] })

        defineStore('id', {
          ...baseOptions,
          state: () => ({ arr: [1] }),
        })(null, store)
        expect(store.$state).toEqual({ arr: [] })
      })

      it('skips nested arrays', () => {
        const useStore = defineStore('id', baseOptions)
        const store: any = useStore()

        // simulate a hmr
        defineStore('id', {
          ...baseOptions,
          state: () => ({ nestedArr: { arr: [2] } }),
        })(null, store)

        expect(store.$state).toEqual({ nestedArr: { arr: [] } })

        defineStore('id', {
          ...baseOptions,
          state: () => ({ nestedArr: { arr: [1] } }),
        })(null, store)
        expect(store.$state).toEqual({ nestedArr: { arr: [] } })
      })

      it('keeps state reactive', () => {
        const useStore = defineStore('id', baseOptions)
        const store: any = useStore()

        const directSpy = vi.fn()
        const $stateSpy = vi.fn()

        watch(() => store.n, directSpy, { flush: 'sync' })
        watch(() => store.$state.n, $stateSpy, { flush: 'sync' })

        // simulate a hmr
        defineStore('id', {
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

        defineStore('id', {
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

    describe('actions', () => {
      it('adds new actions', () => {
        const useStore = defineStore('id', baseOptions)
        const store: any = useStore()

        // simulate a hmr
        defineStore('id', {
          ...baseOptions,
          actions: {
            ...baseOptions.actions,
            decrement() {
              this.n--
            },
          },
        })(null, store)

        store.increment()
        expect(store.n).toBe(1)
        expect(store.$state.n).toBe(1)
        store.decrement()
        expect(store.n).toBe(0)
        expect(store.$state.n).toBe(0)

        defineStore('id', baseOptions)(null, store)

        store.increment()
        expect(store.n).toBe(1)
        expect(store.$state.n).toBe(1)
        expect(store).not.toHaveProperty('decrement')
      })
    })

    describe('getters', () => {
      it('adds new getters properties', () => {
        const useStore = defineStore('id', baseOptions)
        const store: any = useStore()
        expect(store.double).toBe(0)

        // simulate a hmr
        defineStore('id', {
          ...baseOptions,
          getters: {
            ...baseOptions.getters,
            triple: (state) => state.n * 3,
          },
        })(null, store)

        store.n = 3
        expect(store.double).toBe(6)
        expect(store.triple).toBe(9)

        defineStore('id', baseOptions)(null, store)

        store.n = 4
        expect(store.double).toBe(8)
        expect(store).not.toHaveProperty('triple')
      })

      it('keeps getters reactive', () => {
        const useStore = defineStore('id', baseOptions)
        const store: any = useStore()

        const spy = vi.fn()

        watch(
          () => {
            return store.double
          },
          spy,
          { flush: 'sync' }
        )

        // simulate a hmr
        defineStore('id', {
          ...baseOptions,
          state: () => ({ n: 2, newThing: true }),
        })(null, store)

        // n isn't changed
        expect(spy).toHaveBeenCalledTimes(0)

        store.n++
        // expect(store.double).toBe(6)
        expect(spy).toHaveBeenCalledTimes(1)

        defineStore('id', baseOptions)(null, store)

        store.n++
        // expect(store.double).toBe(8)
        expect(spy).toHaveBeenCalledTimes(2)
      })
    })
  })
})
