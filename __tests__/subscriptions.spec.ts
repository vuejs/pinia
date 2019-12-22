import { createStore } from '../src'

describe('Subscriptions', () => {
  const useStore = createStore('main', () => ({
    name: 'Eduardo',
  })).bind(null, true)

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
})
