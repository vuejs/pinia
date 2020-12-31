import { createPinia, defineStore, getRootState } from '../src'

describe('Root State', () => {
  const useA = defineStore({
    id: 'a',
    state: () => ({ a: 'a' }),
  })

  const useB = defineStore({
    id: 'b',
    state: () => ({ b: 'b' }),
  })

  it('works with no stores', () => {
    expect(getRootState(createPinia())).toEqual({})
  })

  it('retrieves the root state of one store', () => {
    const pinia = createPinia()
    useA(pinia)
    expect(getRootState(pinia)).toEqual({
      a: { a: 'a' },
    })
  })

  it('does not mix up different applications', () => {
    const pinia1 = createPinia()
    const pinia2 = createPinia()
    useA(pinia1)
    useB(pinia2)
    expect(getRootState(pinia1)).toEqual({
      a: { a: 'a' },
    })
    expect(getRootState(pinia2)).toEqual({
      b: { b: 'b' },
    })
  })

  it('can hold multiple stores', () => {
    const pinia1 = createPinia()
    useA(pinia1)
    useB(pinia1)
    expect(getRootState(pinia1)).toEqual({
      a: { a: 'a' },
      b: { b: 'b' },
    })
  })
})
