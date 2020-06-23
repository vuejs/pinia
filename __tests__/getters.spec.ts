import { createStore, setActiveReq } from '../src'

describe('Getters', () => {
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
        composed: (state, { upperCaseName }) =>
          (upperCaseName.value as string) + ': ok',
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
    expect(store.upperCaseName).toBe('EDUARDO')
    store.state.name = 'Ed'
    expect(store.upperCaseName).toBe('ED')
  })

  it('updates the value', () => {
    const store = useStore()
    store.state.name = 'Ed'
    expect(store.upperCaseName).toBe('ED')
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
    expect(aStore.fromB).toBe('b b')
  })

  it('can use other getters', () => {
    const store = useStore()
    expect(store.composed).toBe('EDUARDO: ok')
    store.state.name = 'Ed'
    expect(store.composed).toBe('ED: ok')
  })
})
