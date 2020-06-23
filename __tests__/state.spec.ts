import { createStore, setActiveReq } from '../src'

describe('State', () => {
  const useStore = () => {
    // create a new store
    setActiveReq({})
    return createStore({
      id: 'main',
      state: () => ({
        name: 'Eduardo',
        counter: 0,
      }),
    })()
  }

  it('can directly access state at the store level', () => {
    const store = useStore()
    expect(store.name).toBe('Eduardo')
    store.state.name = 'Ed'
    expect(store.name).toBe('Ed')
  })

  it.todo('state is reactive')
})
