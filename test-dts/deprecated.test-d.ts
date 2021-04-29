import { createStore, expectType } from './'

const useDeprecated = createStore({
  id: 'name',
  state: () => ({ a: 'on' as 'on' | 'off', nested: { counter: 0 } }),
  getters: {
    upper: (state) => state.a.toUpperCase(),
  },
})

const deprecatedStore = useDeprecated()

expectType<{ a: 'on' | 'off' }>(deprecatedStore.$state)
expectType<number>(deprecatedStore.nested.counter)
expectType<'on' | 'off'>(deprecatedStore.a)

// @ts-expect-error
deprecatedStore.nonExistant

// @ts-expect-error
deprecatedStore.nonExistant.stuff
