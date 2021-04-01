import { createPinia, defineStore, setActivePinia } from '../src'

describe('store.$patch', () => {
  const useStore = () => {
    // create a new store
    setActivePinia(createPinia())
    return defineStore({
      id: 'main',
      state: () => ({
        a: true,
        nested: {
          foo: 'foo',
          a: { b: 'string' },
        },
        list: [] as number[],
      }),
    })()
  }

  it('patches a property without touching the rest', () => {
    const store = useStore()
    store.$patch({ a: false })
    expect(store.$state).toEqual({
      a: false,
      nested: {
        foo: 'foo',
        a: { b: 'string' },
      },
      list: [],
    })
  })

  it('patches using a function', () => {
    const store = useStore()
    store.$patch((state) => {
      expect(state).toBe(store.$state)
      state.a = !state.a
      state.list.push(1)
    })
    expect(store.$state).toEqual({
      a: false,
      nested: {
        foo: 'foo',
        a: { b: 'string' },
      },
      list: [1],
    })
  })

  it('patches a nested property without touching the rest', () => {
    const store = useStore()
    store.$patch({ nested: { foo: 'bar' } })
    expect(store.$state).toEqual({
      a: true,
      nested: {
        foo: 'bar',
        a: { b: 'string' },
      },
      list: [],
    })
    store.$patch({ nested: { a: { b: 'hello' } } })
    expect(store.$state).toEqual({
      a: true,
      nested: {
        foo: 'bar',
        a: { b: 'hello' },
      },
      list: [],
    })
  })

  it('patches multiple properties at the same time', () => {
    const store = useStore()
    store.$patch({ a: false, nested: { foo: 'hello' } })
    expect(store.$state).toEqual({
      a: false,
      nested: {
        foo: 'hello',
        a: { b: 'string' },
      },
      list: [],
    })
  })
})
