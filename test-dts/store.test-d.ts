import { createStore, expectType } from './'

const useStore = createStore({
  id: 'name',
  state: () => ({ a: 'on' as 'on' | 'off', nested: { counter: 0 } }),
  getters: {
    upper: state => state.a.toUpperCase(),
  },
})

const store = useStore()

expectType<{ a: 'on' | 'off' }>(store.state)
// expectType<number>(store.nested.counter)

// not yet @ts-expect-error
// store.nonExistant

// @ts-expect-error
store.nonExistant.stuff
