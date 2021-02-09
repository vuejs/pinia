import { createStore, setActiveReq } from '../src'

describe('Getters', () => {
  jest.useFakeTimers()

  const useStore = () => {
    // create a new store
    setActiveReq({})
    return createStore({
      id: 'main',
      state: () => ({
        name: 'Eduardo',
        forCallCheck: 'foo',
        callCount: 0,
      }),
      getters: {
        upperCaseName() {
          return this.name.toUpperCase()
        },
        // works for js users but cannot be typed at the same time as `this`
        // so it will have to be explicitly typed by the user
        // https://github.com/posva/pinia/issues/249
        callCheck(state: any) {
          setImmediate(() => {
            // avoid getting tracked
            state.callCount++
          })
          return state.forCallCheck
        },
        doubleName() {
          return this.upperCaseName
        },
        composed() {
          return this.upperCaseName + ': ok'
        },
        // TODO: I can't figure out how to pass `this` as an argument. Not sure
        // it is possible in this specific scenario
        // upperCaseNameArrow: store => store.name,
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
    getters: {
      fromB() {
        const bStore = useB()
        return this.a + ' ' + bStore.b
      },
    },
  })

  it('adds getters to the store', () => {
    const store = useStore()
    expect(store.upperCaseName).toBe('EDUARDO')
    store.name = 'Ed'
    expect(store.upperCaseName).toBe('ED')
  })

  it('updates the value', () => {
    const store = useStore()
    store.name = 'Ed'
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
    bStore.b = 'c'

    aStore.a = 'b'
    expect(aStore.fromB).toBe('b b')
  })

  it('can use other getters', () => {
    const store = useStore()
    expect(store.composed).toBe('EDUARDO: ok')
    store.name = 'Ed'
    expect(store.composed).toBe('ED: ok')
  })

  it('computes getters correctly', async () => {
    const store = useStore()
    expect(store.callCount).toBe(0)
    expect(store.callCheck).toBe('foo')
    expect(store.callCount).toBe(0)
    jest.runAllImmediates()
    expect(store.callCount).toBe(1)
    expect(store.callCheck).toBe('foo')
    jest.runAllImmediates()
    expect(store.callCount).toBe(1)
    expect(store.callCheck).toBe('foo')
    // changing a different value on the store
    store.name = 'Ed'
    jest.runAllImmediates()
    expect(store.callCount).toBe(1)
    expect(store.callCheck).toBe('foo')
  })
})
