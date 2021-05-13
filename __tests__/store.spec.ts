import { defineComponent } from '@vue/composition-api'
import { createLocalVue, mount } from '@vue/test-utils'
import { MutationType } from '../src'
import Vue from 'vue'
import {
  createPinia,
  defineStore,
  Pinia,
  PiniaPlugin,
  setActivePinia,
} from '../src'

describe('Store', () => {
  let pinia: Pinia
  const useStore = () => {
    // create a new store
    pinia = createPinia()
    // this is done by Vue.install(pinia)
    pinia.Vue = Vue
    setActivePinia(pinia)
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
    expect(spy).not.toHaveBeenCalled()
    store.$reset()
    store.$state.nested.foo = 'bar'
    expect(spy).toHaveBeenCalledTimes(2)
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
    const pinia = createPinia()
    pinia.Vue = Vue
    setActivePinia(pinia)
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

    pinia.state.value = {
      main: {
        a: false,
        nested: {
          foo: 'bar',
          a: { b: 'string' },
        },
      },
    }

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
        type: MutationType.direct,
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
        type: MutationType.patchObject,
      },
      store.$state
    )
  })

  it('reuses stores from parent components', () => {
    let s1, s2
    const useStore = defineStore({ id: 'one' })
    const pinia = createPinia()
    pinia.Vue = Vue
    const localVue = createLocalVue()
    localVue.use(PiniaPlugin)

    const Child = defineComponent({
      setup() {
        s2 = useStore()
      },
      template: `<p>child</p>`,
    })

    mount(
      defineComponent({
        setup() {
          s1 = useStore()
          return { s1 }
        },
        components: { Child },
        template: `<child/>`,
      }),
      { localVue, pinia }
    )

    expect(s1).toBeDefined()
    expect(s1).toBe(s2)
  })
})
