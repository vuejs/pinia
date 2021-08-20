import { defineStore, createPinia, setActivePinia, Pinia } from '../src'

describe('Getters', () => {
  jest.useFakeTimers()

  let pinia: Pinia
  const useStore = () => {
    // create a new store
    pinia = createPinia()
    setActivePinia(pinia)
    return defineStore({
      id: 'main',
      state: () => ({
        name: 'Eduardo',
        forCallCheck: 'foo',
        callCount: 0,
      }),
      getters: {
        upperCaseName(): string {
          return this.name.toUpperCase()
        },
        callCheck(state) {
          setTimeout(() => {
            // avoid getting tracked
            // toRaw(state).callCount++
            state.callCount++
          }, 0)
          return state.forCallCheck
        },
        doubleName(): string {
          return this.upperCaseName
        },
        composed(): string {
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
      fromB(): string {
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
    const pinia1 = createPinia()
    const pinia2 = createPinia()
    setActivePinia(pinia1)
    const aStore = useA()

    // simulate a different request
    setActivePinia(pinia2)
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
    jest.runAllTimers()
    expect(store.callCount).toBe(1)
    expect(store.callCheck).toBe('foo')
    jest.runAllTimers()
    expect(store.callCount).toBe(1)
    expect(store.callCheck).toBe('foo')
    // changing a different value on the store
    store.name = 'Ed'
    jest.runAllTimers()
    expect(store.callCount).toBe(1)
    expect(store.callCheck).toBe('foo')
  })
})
