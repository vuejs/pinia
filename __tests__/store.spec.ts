import { createStore, setActiveReq, setStateProvider } from '../src'

describe('Store', () => {
  let req: object
  const useStore = () => {
    // create a new store
    req = {}
    setActiveReq(req)
    return createStore('main', () => ({
      a: true,
      nested: {
        foo: 'foo',
        a: { b: 'string' },
      },
    }))()
  }

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

  it('can hydrate the state', () => {
    setActiveReq({})
    const useStore = createStore('main', () => ({
      a: true,
      nested: {
        foo: 'foo',
        a: { b: 'string' },
      },
    }))

    setStateProvider({
      set: () => {},
      get: () => ({
        main: {
          a: false,
          nested: {
            foo: 'bar',
            a: { b: 'string' },
          },
        },
      }),
    })

    const store = useStore()

    expect(store.state).toEqual({
      a: false,
      nested: {
        foo: 'bar',
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
