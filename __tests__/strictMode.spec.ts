import { createPinia, defineStore, setActivePinia } from '../src'

describe('Strict mode', () => {
  const useStore = defineStore({
    id: 'main',
    strict: true,
    state: () => ({
      a: true,
      nested: {
        foo: 'foo',
        a: { b: 'string' },
      },
    }),
  })

  it('cannot change the state directly', () => {
    setActivePinia(createPinia())
    const store = useStore()
    // @ts-expect-error
    store.a = false
    // @ts-expect-error
    store.nested.foo = 'bar'

    // TODO: should direct $state be allowed?
    // this could be an escape hatch if we want one
    store.$state.a = false

    store.$patch({ a: false })
    store.$patch({ nested: { foo: 'bar' } })
  })
})
