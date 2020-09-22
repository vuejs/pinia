import { createStore, expectType } from './'

const useStore = createStore({
  id: 'name',
  state: () => ({ a: 'on' as 'on' | 'off', nested: { counter: 0 } }),
  getters: {
    upper() {
      return this.a.toUpperCase()
    },
  },
})

const store = useStore()

// FIXME: this should not be there anymore
expectType<{ a: 'on' | 'off' }>(store.state)
expectType<number>(store.nested.counter)
expectType<'on' | 'off'>(store.a)

// @ts-expect-error
store.nonExistant

// @ts-expect-error
store.nonExistant.stuff
