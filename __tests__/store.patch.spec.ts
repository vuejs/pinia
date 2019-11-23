import { createStore } from '../src'

describe('store.patch', () => {
  function buildStore() {
    return createStore('main', () => ({
      // TODO: the boolean cas shouldn't be necessary
      // https://www.typescriptlang.org/play/#code/MYewdgzgLgBCMF4YG8CwAoGWYEMBcMUATgK4CmGAvhhiAHQ6IwBmOANhBehqJLMETI4oZJgAoAlIgB8MMclwFi5GJQk10vaDGBMBQkZI3AGTVhzJA
      a: true as boolean,
      nested: {
        foo: 'foo',
        a: { b: 'string' },
      },
    }))
  }

  it('patches a property without touching the rest', () => {
    const store = buildStore()
    store.patch({ a: false })
    expect(store.state).toEqual({
      a: false,
      nested: {
        foo: 'foo',
        a: { b: 'string' },
      },
    })
  })

  it('patches a nested property without touching the rest', () => {
    const store = buildStore()
    store.patch({ nested: { foo: 'bar' } })
    expect(store.state).toEqual({
      a: true,
      nested: {
        foo: 'bar',
        a: { b: 'string' },
      },
    })
    store.patch({ nested: { a: { b: 'hello' } } })
    expect(store.state).toEqual({
      a: true,
      nested: {
        foo: 'bar',
        a: { b: 'hello' },
      },
    })
  })

  it('patches multiple properties at the same time', () => {
    const store = buildStore()
    store.patch({ a: false, nested: { foo: 'hello' } })
    expect(store.state).toEqual({
      a: false,
      nested: {
        foo: 'hello',
        a: { b: 'string' },
      },
    })
  })
})
