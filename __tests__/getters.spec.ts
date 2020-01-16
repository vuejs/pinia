import { createStore, setActiveReq } from '../src'

describe('Store', () => {
  const useStore = () => {
    // create a new store
    setActiveReq({})
    return createStore({
      id: 'main',
      state: () => ({
        name: 'Eduardo',
      }),
      getters: {
        upperCaseName: ({ name }) => name.toUpperCase(),
      },
    })()
  }

  it('adds getters to the store', () => {
    const store = useStore()
    expect(store.upperCaseName.value).toBe('EDUARDO')
    store.state.name = 'Ed'
    expect(store.upperCaseName.value).toBe('ED')
  })

  it('updates the value', () => {
    const store = useStore()
    store.state.name = 'Ed'
    expect(store.upperCaseName.value).toBe('ED')
  })
})
