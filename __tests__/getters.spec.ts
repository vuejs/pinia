import { createStore } from '../src'

describe('Store', () => {
  function buildStore() {
    return createStore(
      'main',
      () => ({
        name: 'Eduardo',
      }),
      {
        upperCaseName: ({ name }) => name.toUpperCase(),
      }
    )
  }

  it('adds getters to the store', () => {
    const store = buildStore()
    expect(store.upperCaseName.value).toBe('EDUARDO')
    store.state.name = 'Ed'
    expect(store.upperCaseName.value).toBe('ED')
  })

  it('updates the value', () => {
    const store = buildStore()
    store.state.name = 'Ed'
    expect(store.upperCaseName.value).toBe('ED')
  })
})
