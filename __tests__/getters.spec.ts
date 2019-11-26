import { createStore } from '../src'

describe('Store', () => {
  const useStore = createStore(
    'main',
    () => ({
      name: 'Eduardo',
    }),
    {
      upperCaseName: ({ name }) => name.toUpperCase(),
    }
  ).bind(null, true)

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
