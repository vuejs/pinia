import { GenericStore } from 'dist/src/types'
import { defineStore, expectType, createPinia } from './'

const pinia = createPinia()

pinia.use(({ store }) => {
  expectType<GenericStore>(store)
})

const useStore = defineStore({
  id: 'name',
  state: () => ({ a: 'on' as 'on' | 'off', nested: { counter: 0 } }),
  getters: {
    upper() {
      return this.a.toUpperCase()
    },
  },
})

const store = useStore()

expectType<{ a: 'on' | 'off' }>(store.$state)
expectType<number>(store.nested.counter)
expectType<'on' | 'off'>(store.a)

// @ts-expect-error
store.nonExistant

// @ts-expect-error
store.nonExistant.stuff

// @ts-expect-error cannot return a value
store.$patch(async () => {})
store.$patch(() => {})
store.$patch(() => {
  // return earlier
  return
})
