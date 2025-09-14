import { describe, it, expect, vi } from 'vitest'
import { reactive, ref, shallowRef, computed, nextTick, watchEffect } from 'vue'
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

  describe('shallowRef reactivity', () => {
    const useShallowRefStore = () => {
      setActivePinia(createPinia())
      return defineStore('shallowRef', () => {
        const counter = shallowRef({ count: 0 })
        const counter2 = shallowRef({ count: 0 })
        const counter3 = shallowRef({ count: 0 })
        const nestedCounter = shallowRef({
          nested: { count: 0 },
          simple: 1,
        })

        return { counter, counter2, counter3, nestedCounter }
      })()
    }

    it('triggers reactivity when patching shallowRef with object syntax', async () => {
      const store = useShallowRefStore()
      const watcherSpy = vi.fn()

      // Create a computed that depends on the shallowRef
      const doubleCount = computed(() => store.counter.count * 2)

      // Watch the computed to verify reactivity
      const stopWatcher = watchEffect(() => {
        watcherSpy(doubleCount.value)
      })

      expect(watcherSpy).toHaveBeenCalledWith(0)
      watcherSpy.mockClear()

      // Patch using object syntax - this should trigger reactivity
      store.$patch({ counter: { count: 1 } })

      await nextTick()

      expect(store.counter.count).toBe(1)
      expect(doubleCount.value).toBe(2)
      expect(watcherSpy).toHaveBeenCalledWith(2)

      stopWatcher()
    })

    it('triggers reactivity when patching nested properties in shallowRef', async () => {
      const store = useShallowRefStore()
      const watcherSpy = vi.fn()

      const nestedCount = computed(() => store.nestedCounter.nested.count)

      const stopWatcher = watchEffect(() => {
        watcherSpy(nestedCount.value)
      })

      expect(watcherSpy).toHaveBeenCalledWith(0)
      watcherSpy.mockClear()

      // Patch nested properties
      store.$patch({
        nestedCounter: {
          nested: { count: 5 },
          simple: 2,
        },
      })

      await nextTick()

      expect(store.nestedCounter.nested.count).toBe(5)
      expect(store.nestedCounter.simple).toBe(2)
      expect(nestedCount.value).toBe(5)
      expect(watcherSpy).toHaveBeenCalledWith(5)

      stopWatcher()
    })

    it('works with function syntax (baseline test)', async () => {
      const store = useShallowRefStore()
      const watcherSpy = vi.fn()

      const doubleCount = computed(() => store.counter2.count * 2)

      const stopWatcher = watchEffect(() => {
        watcherSpy(doubleCount.value)
      })

      expect(watcherSpy).toHaveBeenCalledWith(0)
      watcherSpy.mockClear()

      // Function syntax should work (this was already working)
      store.$patch((state) => {
        state.counter2 = { count: state.counter2.count + 1 }
      })

      await nextTick()

      expect(store.counter2.count).toBe(1)
      expect(doubleCount.value).toBe(2)
      expect(watcherSpy).toHaveBeenCalledWith(2)

      stopWatcher()
    })

    it('works with direct assignment (baseline test)', async () => {
      const store = useShallowRefStore()
      const watcherSpy = vi.fn()

      const doubleCount = computed(() => store.counter3.count * 2)

      const stopWatcher = watchEffect(() => {
        watcherSpy(doubleCount.value)
      })

      expect(watcherSpy).toHaveBeenCalledWith(0)
      watcherSpy.mockClear()

      // Direct assignment should work (this was already working)
      store.counter3 = { count: 3 }

      await nextTick()

      expect(store.counter3.count).toBe(3)
      expect(doubleCount.value).toBe(6)
      expect(watcherSpy).toHaveBeenCalledWith(6)

      stopWatcher()
    })

    it('handles partial updates correctly', async () => {
      const store = useShallowRefStore()

      // Set initial state with multiple properties
      store.nestedCounter = {
        nested: { count: 10 },
        simple: 20,
      }

      // Patch only one property
      store.$patch({
        nestedCounter: {
          nested: { count: 15 },
          // Note: simple is not included, should remain unchanged
        },
      })

      expect(store.nestedCounter.nested.count).toBe(15)
      expect(store.nestedCounter.simple).toBe(20) // Should remain unchanged
    })

    it('works with multiple shallowRefs in single patch', async () => {
      const store = useShallowRefStore()
      const watcherSpy1 = vi.fn()
      const watcherSpy2 = vi.fn()

      const count1 = computed(() => store.counter.count)
      const count2 = computed(() => store.counter2.count)

      const stopWatcher1 = watchEffect(() => {
        watcherSpy1(count1.value)
      })

      const stopWatcher2 = watchEffect(() => {
        watcherSpy2(count2.value)
      })

      watcherSpy1.mockClear()
      watcherSpy2.mockClear()

      // Patch multiple shallowRefs at once
      store.$patch({
        counter: { count: 10 },
        counter2: { count: 20 },
      })

      await nextTick()

      expect(store.counter.count).toBe(10)
      expect(store.counter2.count).toBe(20)
      expect(watcherSpy1).toHaveBeenCalledWith(10)
      expect(watcherSpy2).toHaveBeenCalledWith(20)

      stopWatcher1()
      stopWatcher2()
    })
  })
})
