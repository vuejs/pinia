import { createStore, setActiveReq } from '../src'

describe('Subscriptions', () => {
  const useStore = () => {
    // create a new store
    setActiveReq({})
    return createStore({
      id: 'main',
      state: () => ({
        name: 'Eduardo',
      }),
    })()
  }

  let store: ReturnType<typeof useStore>
  beforeEach(() => {
    store = useStore()
  })

  it('fires callback when patch is applied', () => {
    const spy = jest.fn()
    store.subscribe(spy)
    store.state.name = 'Cleiton'
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('unsubscribes callback when unsubscribe is called', () => {
    const spy = jest.fn()
    const unsubscribe = store.subscribe(spy)
    unsubscribe()
    store.state.name = 'Cleiton'
    expect(spy).not.toHaveBeenCalled()
  })

  it('listeners are not affected when unsubscribe is called multiple times', () => {
    const func1 = jest.fn()
    const func2 = jest.fn()
    const unsubscribe1 = store.subscribe(func1)
    store.subscribe(func2)
    unsubscribe1()
    unsubscribe1()
    store.state.name = 'Cleiton'
    expect(func1).not.toHaveBeenCalled()
    expect(func2).toHaveBeenCalledTimes(1)
  })
})
