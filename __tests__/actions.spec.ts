import { defineStore, setActiveReq } from '../src'

describe('Actions', () => {
  const useStore = () => {
    // create a new store
    setActiveReq({})
    return defineStore({
      id: 'main',
      state: () => ({
        a: true,
        nested: {
          foo: 'foo',
          a: { b: 'string' },
        },
      }),
      getters: {
        nonA(): boolean {
          return !this.a
        },
        otherComputed() {
          return this.nonA
        },
      },
      actions: {
        async getNonA() {
          return this.nonA
        },
        toggle() {
          return (this.a = !this.a)
        },

        setFoo(foo: string) {
          this.$patch({ nested: { foo } })
        },

        combined() {
          this.toggle()
          this.setFoo('bar')
        },
      },
    })()
  }

  const useB = defineStore({
    id: 'B',
    state: () => ({ b: 'b' }),
  })

  const useA = defineStore({
    id: 'A',
    state: () => ({ a: 'a' }),
    actions: {
      swap() {
        const bStore = useB()
        const b = bStore.$state.b
        bStore.$state.b = this.$state.a
        this.$state.a = b
      },
    },
  })

  it('can use the store as this', () => {
    const store = useStore()
    expect(store.$state.a).toBe(true)
    store.toggle()
    expect(store.$state.a).toBe(false)
  })

  it('store is forced as the context', () => {
    const store = useStore()
    expect(store.$state.a).toBe(true)
    store.toggle.call(null)
    expect(store.$state.a).toBe(false)
  })

  it('can call other actions', () => {
    const store = useStore()
    expect(store.$state.a).toBe(true)
    expect(store.$state.nested.foo).toBe('foo')
    store.combined()
    expect(store.$state.a).toBe(false)
    expect(store.$state.nested.foo).toBe('bar')
  })

  it('supports being called between requests', () => {
    const req1 = {}
    const req2 = {}
    setActiveReq(req1)
    const aStore = useA()

    // simulate a different request
    setActiveReq(req2)
    const bStore = useB()
    bStore.$state.b = 'c'

    aStore.swap()
    expect(aStore.$state.a).toBe('b')
    // a different instance of b store was used
    expect(bStore.$state.b).toBe('c')
  })

  it('can force the req', () => {
    const req1 = {}
    const req2 = {}
    const aStore = useA(req1)

    let bStore = useB(req2)
    bStore.$state.b = 'c'

    aStore.swap()
    expect(aStore.$state.a).toBe('b')
    // a different instance of b store was used
    expect(bStore.$state.b).toBe('c')
    bStore = useB(req1)
    expect(bStore.$state.b).toBe('a')
  })
})
