import { describe, it, expect } from 'vitest'
import { effect, reactive, ref, shallowRef } from 'vue'
import { createPinia, defineStore, Pinia, setActivePinia } from '../src'

describe('store.$patch', () => {
  const useStore = () => {
    // create a new store
    setActivePinia(createPinia())
    return defineStore('main', {
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

  const useArrayStore = () => {
    // create a new store
    setActivePinia(createPinia())
    return defineStore('main', {
      state: () => ({
        items: [{ id: 0 }],
        currentItem: { id: 1 },
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

    expect(store.a).toBe(false)
  })

  it('replaces whole arrays', () => {
    const store = useStore()
    store.$patch({ list: [1, 2] })
    expect(store.$state.list).toEqual([1, 2])
    expect(store.list).toEqual([1, 2])
  })

  it('can patch an item that has been copied to an array', () => {
    const store = useArrayStore()
    store.$state.currentItem = { id: 2 }
    // NOTE: a patch of an object is always recursive, writing in the object, in
    // place.
    //store.$patch({ currentItem: { id: 2 } })
    store.items.push(store.currentItem)
    // store.$patch({ currentItem: { id: 3 } })
    store.$state.currentItem = { id: 3 }

    expect(store.$state.items).toEqual([{ id: 0 }, { id: 2 }])
    expect(store.items).toEqual([{ id: 0 }, { id: 2 }])
  })

  it('replaces whole nested arrays', () => {
    const store = useStore()
    // @ts-expect-error: new state
    store.$patch({ nested: { list: [1, 2] } })
    expect(store.$state.nested).toEqual({
      foo: 'foo',
      a: { b: 'string' },
      list: [1, 2],
    })
    // @ts-expect-error: new state
    store.$patch({ nested: { list: [] } })
    expect(store.$state.nested).toEqual({
      foo: 'foo',
      a: { b: 'string' },
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
    const useStore = (pinia?: Pinia) => {
      // create a new store
      setActivePinia(pinia || createPinia())
      return defineStore('main', {
        state: () => ({
          arr: [] as any[],
          name: 'Eduardo',
          item: { a: 0, b: 0 } as null | { a: number; b?: number },
        }),
      })()
    }
    // const useStore = (pinia?: Pinia) => {
    //   // create a new store
    //   setActivePinia(pinia || createPinia())
    //   return defineStore('main', () => {
    //     const arr = ref([] as any[])
    //     const item = ref({ a: 0, b: 0 } as null | { a: number; b?: number })

    //     return { arr, item }
    //   })()
    // }

    it('ref of primitive', () => {
      const pinia = createPinia()
      const store = useStore(pinia)
      const name = ref('Edu')
      // @ts-expect-error: because it's a ref
      store.$patch({ name })
      expect(pinia.state.value.main.name).toEqual('Edu')
      expect(store.$state.name).toEqual('Edu')
      expect(store.name).toEqual('Edu')
    })

    it('ref of object', () => {
      const pinia = createPinia()
      const store = useStore(pinia)
      const item = ref({ a: 1, b: 1 })
      const oldItem = store.item
      // @ts-expect-error: because it's a ref
      store.$state.item = item
      expect(oldItem).toEqual({ a: 0, b: 0 })
      expect(pinia.state.value.main.item).toEqual({ a: 1, b: 1 })
      expect(store.$state.item).toEqual({ a: 1, b: 1 })
      expect(store.item).toEqual({ a: 1, b: 1 })

      // @ts-expect-error: because it's a ref
      store.$patch({ item: ref({ a: 2, b: 2 }) })
      expect(pinia.state.value.main.item).toEqual({ a: 2, b: 2 })
      expect(store.$state.item).toEqual({ a: 2, b: 2 })
      expect(store.item).toEqual({ a: 2, b: 2 })
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

  describe('shallowRef state reactivity (#2861)', () => {
    const useShallowStore = () => {
      setActivePinia(createPinia())
      return defineStore('shallow-main', () => {
        const counter = shallowRef({ count: 0 })
        return { counter }
      })()
    }

    it('triggers effects when a nested key is patched with the object syntax', () => {
      const store = useShallowStore()
      let runs = 0
      effect(() => {
        // reads the shallow ref through the store proxy: tracks the ref itself
        void store.counter
        runs++
      })
      expect(runs).toBe(1)
      expect(store.counter.count).toBe(0)

      store.$patch({ counter: { count: 1 } })

      expect(store.counter.count).toBe(1)
      // the merge mutates the raw value in place, so the ref must be triggered
      expect(runs).toBe(2)
    })

    it('triggers every patched shallow key in one $patch call', () => {
      setActivePinia(createPinia())
      const store = defineStore('shallow-multi', () => {
        const a = shallowRef({ n: 0 })
        const b = shallowRef({ n: 0 })
        return { a, b }
      })()
      let runs = 0
      effect(() => {
        void store.a
        void store.b
        runs++
      })
      expect(runs).toBe(1)

      store.$patch({ a: { n: 1 }, b: { n: 2 } })

      expect(store.a.n).toBe(1)
      expect(store.b.n).toBe(2)
      // one synchronous re-run per triggered shallow ref
      expect(runs).toBe(3)
    })

    it('leaves deep refs to their own reactivity', () => {
      setActivePinia(createPinia())
      const store = defineStore('deep-ref', () => {
        const counter = ref({ count: 0 })
        return { counter }
      })()
      let runs = 0
      effect(() => {
        // tracks both the ref and its inner reactive property
        void store.counter.count
        runs++
      })
      expect(runs).toBe(1)

      store.$patch({ counter: { count: 1 } })

      expect(store.counter.count).toBe(1)
      // the inner mutation triggers on its own — an extra triggerRef would
      // re-run this effect a second time
      expect(runs).toBe(2)
    })

    it('replaces non-plain shallow values through the ref set', () => {
      setActivePinia(createPinia())
      const store = defineStore('shallow-map', () => {
        const entries = shallowRef(new Map([['a', 1]]))
        return { entries }
      })()
      let runs = 0
      effect(() => {
        void store.entries
        runs++
      })
      expect(runs).toBe(1)

      const next = new Map([['b', 2]])
      store.$patch({ entries: next })

      // a Map patch cannot merge into a Map value: it unwraps to a ref set,
      // which triggers on its own — no manual triggerRef expected
      expect(store.entries).toBe(next)
      expect(runs).toBe(2)
    })

    it('does not double-trigger when the patch value is reactive', () => {
      setActivePinia(createPinia())
      const store = defineStore('shallow-reactive', () => {
        const counter = shallowRef({ count: 0 })
        return { counter }
      })()
      let runs = 0
      effect(() => {
        void store.counter
        runs++
      })
      expect(runs).toBe(1)

      const patchValue = reactive({ count: 5 })
      store.$patch({ counter: patchValue })

      // deep reactive containers normalize assigned values via toRaw, so the
      // ref holds the raw target, not the proxy
      expect(store.counter).toEqual({ count: 5 })
      // the unwrap-set already triggers; an extra triggerRef would re-run
      // this synchronous effect a second time
      expect(runs).toBe(2)
    })
  })
})
