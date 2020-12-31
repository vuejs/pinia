import { createPinia, defineStore, setActivePinia } from '../src'

describe('Getters', () => {
  const useStore = () => {
    // create a new store
    setActivePinia(createPinia())
    return defineStore({
      id: 'main',
      state: () => ({
        name: 'Eduardo',
      }),
      getters: {
        upperCaseName() {
          return this.name.toUpperCase()
        },
        doubleName() {
          return this.upperCaseName
        },
        composed() {
          return this.upperCaseName + ': ok'
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

  it('supports changing between applications', () => {
    const pinia1 = createPinia()
    const pinia2 = createPinia()
    setActivePinia(pinia1)
    const aStore = useA()

    // simulate a different applications
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
})
