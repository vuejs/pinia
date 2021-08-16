import { computed, ref, ToRefs } from 'vue'
import { createPinia, defineStore, setActivePinia, storeToRefs } from '../src'

describe('storeToRefs', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  function objectOfRefs<O extends Record<any, any>>(o: O): ToRefs<O> {
    return Object.keys(o).reduce((newO, key) => {
      // @ts-expect-error: we only need to match
      newO[key] = expect.objectContaining({ value: o[key] })
      return newO
    }, {} as ToRefs<O>)
  }

  it('empty state', () => {
    expect(storeToRefs(defineStore('a', {})())).toEqual({})
    expect(storeToRefs(defineStore('a', () => {})())).toEqual({})
    expect(storeToRefs(defineStore({ id: 'a' })())).toEqual({})
  })

  it('empty getters', () => {
    expect(
      storeToRefs(
        defineStore('a', {
          state: () => ({ n: 0 }),
        })()
      )
    ).toEqual(objectOfRefs({ n: 0 }))
    expect(
      storeToRefs(
        defineStore('a', () => {
          return { n: ref(0) }
        })()
      )
    ).toEqual(objectOfRefs({ n: 0 }))
  })

  it('contains getters', () => {
    expect(
      storeToRefs(
        defineStore('a', {
          state: () => ({ n: 1 }),
          getters: {
            double: (state) => state.n * 2,
          },
        })()
      )
    ).toEqual(objectOfRefs({ n: 1, double: 2 }))
    expect(
      storeToRefs(
        defineStore('a', () => {
          const n = ref(0)
          const double = computed(() => n.value * 2)
          return { n, double }
        })()
      )
    ).toEqual(objectOfRefs({ n: 1, double: 2 }))
  })

  it('contain plugin states', () => {
    const pinia = createPinia()
    // directly push because no app
    pinia._p.push(() => ({
      // @ts-expect-error: cannot set a ref yet
      pluginN: ref(20),
      // should not appear in refs
      shared: 10,
    }))
    setActivePinia(pinia)

    expect(
      storeToRefs(
        defineStore('a', {
          state: () => ({ n: 0 }),
        })()
      )
    ).toEqual(objectOfRefs({ n: 0, pluginN: 20 }))
    expect(
      storeToRefs(
        defineStore('a', () => {
          return { n: ref(0) }
        })()
      )
    ).toEqual(objectOfRefs({ n: 0, pluginN: 20 }))
  })

  tds(() => {
    const store1 = defineStore('a', () => {
      const n = ref(0)
      const double = computed(() => n.value * 2)
      return { n, double }
    })()

    storeToRefs(store1).double
  })

  function tds(_fn: Function) {}
})
