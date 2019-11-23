import { createStore } from '../src'

describe('Store', () => {
  function buildStore() {
    return createStore('main', () => ({
      a: true as boolean,
      nested: {
        foo: 'foo',
        a: { b: 'string' },
      },
    }))
  }

  it('sets the initial state', () => {
    const store = buildStore()
    expect(store.state).toEqual({
      a: true,
      nested: {
        foo: 'foo',
        a: { b: 'string' },
      },
    })
  })

  it('can replace its state', () => {
    const store = buildStore()
    store.replaceState({
      a: false,
      nested: {
        foo: 'bar',
        a: {
          b: 'hey',
        },
      },
    })
    expect(store.state).toEqual({
      a: false,
      nested: {
        foo: 'bar',
        a: { b: 'hey' },
      },
    })
  })

  it('do not share the state between same id store', () => {
    const store = buildStore()
    const store2 = buildStore()
    expect(store.state).not.toBe(store2.state)
    store.state.nested.a.b = 'hey'
    expect(store2.state.nested.a.b).toBe('string')
  })
})
