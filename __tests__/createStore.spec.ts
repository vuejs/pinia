import { createStore } from '../src'

describe('createStore', () => {
  it('sets the initial state', () => {
    const state = () => ({
      a: true,
      nested: {
        a: { b: 'string' },
      },
    })

    const store = createStore('main', state)
    expect(store.state).toEqual({
      a: true,
      nested: {
        a: { b: 'string' },
      },
    })
  })
})
