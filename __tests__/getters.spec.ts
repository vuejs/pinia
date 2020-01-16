import { createStore, setActiveReq } from '../src'

describe('Store', () => {
  const useStore = () => {
    // create a new store
    setActiveReq({})
    return createStore({
      id: 'main',
      state: () => ({
        name: 'Eduardo',
      }),
      getters: {
        upperCaseName: ({ name }) => name.toUpperCase(),
      },
    })()
  }

  const useB = createStore({
    id: 'B',
    state: () => ({ b: 'b' }),
  })

  const useA = createStore({
    id: 'A',
    state: () => ({ a: 'a' }),
    getters: {
      fromB(state) {
        const bStore = useB()
        return state.a + ' ' + bStore.state.b
      },
    },
  })

  it('adds getters to the store', () => {
    const store = useStore()
    expect(store.upperCaseName.value).toBe('EDUARDO')
    store.state.name = 'Ed'
    expect(store.upperCaseName.value).toBe('ED')
  })

  it('updates the value', () => {
    const store = useStore()
    store.state.name = 'Ed'
    expect(store.upperCaseName.value).toBe('ED')
  })

  it('supports changing between requests', () => {
    const req1 = {}
    const req2 = {}
    setActiveReq(req1)
    const aStore = useA()

    // simulate a different request
    setActiveReq(req2)
    const bStore = useB()
    bStore.state.b = 'c'

    aStore.state.a = 'b'
    expect(aStore.fromB.value).toBe('b b')
  })
})
