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
        upperCaseName(store) {
          return store.name.toUpperCase()
        },
        doubleName(): string {
          return this.upperCaseName
        },
        composed(): string {
          return this.upperCaseName + ': ok'
        },
        arrowUpper: (state) => {
          // @ts-expect-error
          state.nope
          state.name.toUpperCase()
        },
      },
      actions: {
        o() {
          // @ts-expect-error it should type getters
          this.arrowUper.toUpperCase()
          this.o().toUpperCase()
          return 'a string'
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
      fromB(): string {
        const bStore = useB()
        return this.a + ' ' + bStore.b
      },
    },
  })

  it('adds getters to the store', () => {
    const store = useStore()
    expect(store.upperCaseName).toBe('EDUARDO')

    // @ts-expect-error
    store.nope

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
