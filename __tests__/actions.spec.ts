import { createStore, setActiveReq } from '../src'

describe('Store', () => {
  const useStore = () => {
    // create a new store
    setActiveReq({})
    return createStore({
      id: 'main',
      state: () => ({
        a: true,
        nested: {
          foo: 'foo',
          a: { b: 'string' },
        },
      }),
      actions: {
        toggle() {
          this.state.a = !this.state.a
        },

        setFoo(foo: string) {
          this.patch({ nested: { foo } })
        },

        combined() {
          this.toggle()
          this.setFoo('bar')
        },
      },
    })()
  }

  it('can use the store as this', () => {
    const store = useStore()
    expect(store.state.a).toBe(true)
    store.toggle()
    expect(store.state.a).toBe(false)
  })

  it('can call other actions', () => {
    const store = useStore()
    expect(store.state.a).toBe(true)
    expect(store.state.nested.foo).toBe('foo')
    store.combined()
    expect(store.state.a).toBe(false)
    expect(store.state.nested.foo).toBe('bar')
  })
})
