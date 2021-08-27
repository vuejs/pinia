import { createPinia, defineStore, setActivePinia } from '../src'
import { computed, nextTick, reactive, ref, watch } from 'vue'

describe('State', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const useStore = defineStore('main', {
    state: () => ({
      name: 'Eduardo',
      counter: 0,
      nested: { n: 0 },
    }),
  })

  it('can directly access state at the store level', () => {
    const store = useStore()
    expect(store.name).toBe('Eduardo')
    store.name = 'Ed'
    expect(store.name).toBe('Ed')
  })

  it('state is reactive', () => {
    const store = useStore()
    const upperCased = computed(() => store.name.toUpperCase())
    expect(upperCased.value).toBe('EDUARDO')
    store.name = 'Ed'
    expect(upperCased.value).toBe('ED')
  })

  it('can be set with patch', () => {
    const pinia = createPinia()
    const store = useStore(pinia)

    store.$patch({ name: 'a' })

    expect(store.name).toBe('a')
    expect(store.$state.name).toBe('a')
    expect(pinia.state.value.main.name).toBe('a')
  })

  it('can be set on store', () => {
    const pinia = createPinia()
    const store = useStore(pinia)

    store.name = 'a'

    expect(store.name).toBe('a')
    expect(store.$state.name).toBe('a')
    expect(pinia.state.value.main.name).toBe('a')
  })

  it('can be set on store.$state', () => {
    const pinia = createPinia()
    const store = useStore(pinia)

    store.$state.name = 'a'

    expect(store.name).toBe('a')
    expect(store.$state.name).toBe('a')
    expect(pinia.state.value.main.name).toBe('a')
  })

  it('can be nested set with patch', () => {
    const pinia = createPinia()
    const store = useStore(pinia)

    store.$patch({ nested: { n: 3 } })

    expect(store.nested.n).toBe(3)
    expect(store.$state.nested.n).toBe(3)
    expect(pinia.state.value.main.nested.n).toBe(3)
  })

  it('can be nested set on store', () => {
    const pinia = createPinia()
    const store = useStore(pinia)

    store.nested.n = 3

    expect(store.nested.n).toBe(3)
    expect(store.$state.nested.n).toBe(3)
    expect(pinia.state.value.main.nested.n).toBe(3)
  })

  it('can be nested set on store.$state', () => {
    const pinia = createPinia()
    const store = useStore(pinia)

    store.$state.nested.n = 3

    expect(store.nested.n).toBe(3)
    expect(store.$state.nested.n).toBe(3)
    expect(pinia.state.value.main.nested.n).toBe(3)
  })

  // it('watch', () => {
  //   setActivePinia(createPinia())
  //   defineStore({
  //     id: 'main',
  //     state: () => ({
  //       name: 'Eduardo',
  //       counter: 0,
  //     }),
  //   })()
  // })

  it('state can be watched', async () => {
    const store = useStore()
    const spy = jest.fn()
    watch(() => store.name, spy)
    expect(spy).not.toHaveBeenCalled()
    store.name = 'Ed'
    await nextTick()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('state can be watched when a ref is given', async () => {
    const store = useStore()
    const spy = jest.fn()
    watch(() => store.name, spy)
    expect(spy).not.toHaveBeenCalled()
    const nameRef = ref('Ed')
    // @ts-expect-error
    store.$state.name = nameRef
    await nextTick()
    expect(spy).toHaveBeenCalledTimes(1)
  })

  it('can be given a ref', () => {
    const pinia = createPinia()
    const store = useStore(pinia)

    // If the ref is directly set to the store, it won't work,
    // it must be set into the `store.$state` so it connects to pinia
    // store.name = ref('Ed')

    // @ts-expect-error
    store.$state.name = ref('Ed')

    expect(store.name).toBe('Ed')
    expect(store.$state.name).toBe('Ed')
    expect(pinia.state.value.main.name).toBe('Ed')

    store.name = 'Other'
    expect(store.name).toBe('Other')
    expect(store.$state.name).toBe('Other')
    expect(pinia.state.value.main.name).toBe('Other')
  })

  it('unwraps refs', () => {
    const name = ref('Eduardo')
    const counter = ref(0)
    const double = computed({
      get: () => counter.value * 2,
      set(val) {
        counter.value = val / 2
      },
    })

    const pinia = createPinia()
    setActivePinia(pinia)
    const useStore = defineStore({
      id: 'main',
      state: () => ({
        name,
        counter,
        double,
      }),
    })

    const store = useStore()

    expect(store.name).toBe('Eduardo')
    expect(store.$state.name).toBe('Eduardo')
    expect(pinia.state.value.main).toEqual({
      name: 'Eduardo',
      double: 0,
      counter: 0,
    })

    name.value = 'Ed'
    expect(store.name).toBe('Ed')
    expect(store.$state.name).toBe('Ed')
    expect(pinia.state.value.main.name).toBe('Ed')

    store.name = 'Edu'
    expect(store.name).toBe('Edu')

    store.$patch({ counter: 2 })
    expect(store.counter).toBe(2)
    expect(counter.value).toBe(2)
  })

  it('can reset the state', () => {
    const store = useStore()
    store.name = 'Ed'
    store.nested.n++
    store.$reset()
    expect(store.$state).toEqual({
      counter: 0,
      name: 'Eduardo',
      nested: {
        n: 0,
      },
    })
  })

  it('can reset the state of an empty store', () => {
    const store = defineStore('a', {})(createPinia())
    expect(store.$state).toEqual({})
    store.$reset()
    expect(store.$state).toEqual({})
  })

  it('can hydrate refs', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    pinia.state.value.main = {
      stuff: 1,
      a: 2,
      // nested: { a: 2 },
      state: {
        count: 5,
        a: 2,
        // nested: { a: 2 },
      },
    }

    const stuff = ref(2)
    const useStore = defineStore('main', () => {
      const a = ref(0)
      // const nested = ref({ a })
      const state = reactive({
        a,
        // nested,
        count: 0,
      })
      return {
        stuff,
        a,
        // nested,
        state,
        double: computed(() => stuff.value * 2),
      }
    })

    const store = useStore()

    expect(stuff.value).toBe(1)
    expect(store.$state).toEqual({
      stuff: 1,
      a: 2,
      // nested: { a: 2 },
      state: {
        // nested: { a: 2 },
        count: 5,
        a: 2,
      },
    })
    expect(store.stuff).toBe(1)
    expect(store.double).toBe(2)
    expect(store.a).toBe(2)
    expect(store.state).toEqual({
      // nested: { a: 2 },
      a: 2,
      count: 5,
    })

    store.a = 0
    expect(store.a).toBe(0)
    expect(store.state).toEqual({
      // nested: { a: 0 },
      a: 0,
      count: 5,
    })

    store.stuff = 5
    expect(store.stuff).toBe(5)
    expect(stuff.value).toBe(5)
    expect(store.$state.stuff).toBe(5)
    expect(store.double).toBe(10)

    stuff.value = 15
    expect(store.stuff).toBe(15)
    expect(stuff.value).toBe(15)
    expect(store.$state.stuff).toBe(15)
    expect(store.double).toBe(30)
  })
})
