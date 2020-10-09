import {
  createPinia,
  defineStore,
  setActiveReq,
  setStateProvider,
} from '../src'
import { mount } from '@vue/test-utils'
import { getCurrentInstance } from 'vue'

describe('Store', () => {
  let req: object
  const useStore = () => {
    // create a new store
    req = {}
    setActiveReq(req)
    return defineStore({
      id: 'main',
      state: () => ({
        a: true,
        nested: {
          foo: 'foo',
          a: { b: 'string' },
        },
      }),
    })()
  }

  it('sets the initial state', () => {
    const store = useStore()
    expect(store.$state).toEqual({
      a: true,
      nested: {
        foo: 'foo',
        a: { b: 'string' },
      },
    })
  })

  it('can be reset', () => {
    const store = useStore()
    store.$state.a = false
    const spy = jest.fn()
    store.$subscribe(spy)
    store.$reset()
    store.$state.nested.foo = 'bar'
    expect(spy).not.toHaveBeenCalled()
    expect(store.$state).toEqual({
      a: true,
      nested: {
        foo: 'bar',
        a: { b: 'string' },
      },
    })
  })

  it('can create an empty state if no state option is provided', () => {
    const store = defineStore({ id: 'some' })()

    expect(store.$state).toEqual({})
  })

  it('can hydrate the state', () => {
    setActiveReq({})
    const useStore = defineStore({
      id: 'main',
      state: () => ({
        a: true,
        nested: {
          foo: 'foo',
          a: { b: 'string' },
        },
      }),
    })

    setStateProvider(() => ({
      main: {
        a: false,
        nested: {
          foo: 'bar',
          a: { b: 'string' },
        },
      },
    }))

    const store = useStore()

    expect(store.$state).toEqual({
      a: false,
      nested: {
        foo: 'bar',
        a: { b: 'string' },
      },
    })
  })

  it('can replace its state', () => {
    const store = useStore()
    store.$state = {
      a: false,
      nested: {
        foo: 'bar',
        a: {
          b: 'hey',
        },
      },
    }
    expect(store.$state).toEqual({
      a: false,
      nested: {
        foo: 'bar',
        a: { b: 'hey' },
      },
    })
  })

  it('do not share the state between same id store', () => {
    const store = useStore()
    const store2 = useStore()
    expect(store.$state).not.toBe(store2.$state)
    store.$state.nested.a.b = 'hey'
    expect(store2.$state.nested.a.b).toBe('string')
  })

  it('subscribe to changes', () => {
    const store = useStore()
    const spy = jest.fn()
    store.$subscribe(spy)

    store.$state.a = false

    expect(spy).toHaveBeenCalledWith(
      {
        payload: {},
        storeName: 'main',
        type: expect.stringContaining('in place'),
      },
      store.$state
    )
  })

  it('subscribe to changes done via patch', () => {
    const store = useStore()
    const spy = jest.fn()
    store.$subscribe(spy)

    const patch = { a: false }
    store.$patch(patch)

    expect(spy).toHaveBeenCalledWith(
      {
        payload: patch,
        storeName: 'main',
        type: expect.stringContaining('patch'),
      },
      store.$state
    )
  })

  it('should outlive components', () => {
    let store: ReturnType<typeof useStore> | undefined

    const wrapper = mount(
      {
        setup() {
          store = useStore()

          return { store }
        },

        template: `a: {{ store.a }}`,
      },
      {
        global: {
          plugins: [createPinia()],
        },
      }
    )

    expect(wrapper.html()).toBe('a: true')

    if (!store) throw new Error('no store')

    const spy = jest.fn()
    store.$subscribe(spy)

    expect(spy).toHaveBeenCalledTimes(0)
    store.a = !store.a
    expect(spy).toHaveBeenCalledTimes(1)

    wrapper.unmount()
    store.a = !store.a
    expect(spy).toHaveBeenCalledTimes(2)
  })

  it.skip('should not break getCurrentInstance', () => {
    let store: ReturnType<typeof useStore> | undefined

    let i1: any = {}
    let i2: any = {}
    const wrapper = mount(
      {
        setup() {
          i1 = getCurrentInstance()
          store = useStore()
          i2 = getCurrentInstance()

          return { store }
        },

        template: `a: {{ store.a }}`,
      },
      {
        global: {
          plugins: [createPinia()],
        },
      }
    )

    expect(i1 === i2).toBe(true)

    wrapper.unmount()
  })
})
