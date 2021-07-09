import { reactive, ref } from 'vue'
import {
  createPinia,
  defineSetupStore,
  defineStore,
  setActivePinia,
} from '../src'

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

  describe('skipping nested objects', () => {
    const useStore = () => {
      // create a new store
      setActivePinia(createPinia())
      return defineStore({
        id: 'main',
        state: () => ({
          arr: [] as any[],
          item: { a: 0, b: 0 } as null | { a: number; b?: number },
        }),
      })()
    }

    it('ref', () => {
      const store = useStore()
      const item = ref({ a: 1, b: 1 })
      const oldItem = store.item
      // @ts-expect-error: because it's a ref
      store.$patch({ item })
      expect(oldItem).toEqual({ a: 0, b: 0 })
      expect(store.item).toEqual({ a: 1, b: 1 })
    })

    it('nested ref', () => {
      const store = useStore()
      const item = ref({ nested: { a: 1, b: 1 } })
      const oldItem = store.item
      store.$patch({ item: item.value.nested })
      expect(oldItem).toEqual({ a: 0, b: 0 })
      expect(store.item).toEqual({ a: 1, b: 1 })
    })

    it('reactive', () => {
      const store = useStore()
      const item = reactive({ a: 1, b: 1 })
      const oldItem = store.item
      store.$patch({ item })
      expect(oldItem).toEqual({ a: 0, b: 0 })
      expect(store.item).toEqual({ a: 1, b: 1 })
    })

    it('from store', () => {
      const store = useStore()
      store.arr.push({ a: 1, b: 1 })
      const oldItem = store.item
      store.$patch({ item: store.arr[0] })
      expect(oldItem).toEqual({ a: 0, b: 0 })
      expect(store.item).toEqual({ a: 1, b: 1 })
    })
  })
})
