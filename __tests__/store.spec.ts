import { createStore } from '../src'

describe('Store', () => {
  const useStore = createStore('main', () => ({
    // TODO: the boolean cas shouldn't be necessary
    // https://www.typescriptlang.org/play/#code/MYewdgzgLgBCMF4YG8CwAoGWYEMBcMUATgK4CmGAvhhiAHQ6IwBmOANhBehqJLMETI4oZJgAoAlIgB8MMclwFi5GJQk10vaDGBMBQkZI3AGTVhzJA
    a: true as boolean,
    nested: {
      foo: 'foo',
      a: { b: 'string' },
    },
  })).bind(null, true) // force always a fresh instance

  it('sets the initial state', () => {
    const store = useStore()
    expect(store.state).toEqual({
      a: true,
      nested: {
        foo: 'foo',
        a: { b: 'string' },
      },
    })
  })

  it('can replace its state', () => {
    const store = useStore()
    store.state = {
      a: false,
      nested: {
        foo: 'bar',
        a: {
          b: 'hey',
        },
      },
    }
    expect(store.state).toEqual({
      a: false,
      nested: {
        foo: 'bar',
        a: { b: 'hey' },
      },
    })
  })

  it('do not share the state between same id store', () => {
    const store = useStore()
    const store2 = useStore()
    expect(store.state).not.toBe(store2.state)
    store.state.nested.a.b = 'hey'
    expect(store2.state.nested.a.b).toBe('string')
  })
})
