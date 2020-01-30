import { createStore, getRootState } from '../src'

describe('Store', () => {
  const useA = createStore({
    id: 'a',
    state: () => ({ a: 'a' }),
  })

  const useB = createStore({
    id: 'b',
    state: () => ({ b: 'b' }),
  })

  it('works with no stores', () => {
    expect(getRootState({})).toEqual({})
  })

  it('retrieves the root state of one store', () => {
    const req = {}
    useA(req)
    expect(getRootState(req)).toEqual({
      a: { a: 'a' },
    })
  })

  it('does not mix up different requests', () => {
    const req1 = {}
    const req2 = {}
    useA(req1)
    useB(req2)
    expect(getRootState(req1)).toEqual({
      a: { a: 'a' },
    })
    expect(getRootState(req2)).toEqual({
      b: { b: 'b' },
    })
  })

  it('can hold multiple stores', () => {
    const req1 = {}
    useA(req1)
    useB(req1)
    expect(getRootState(req1)).toEqual({
      a: { a: 'a' },
      b: { b: 'b' },
    })
  })
})
