import { createPinia, defineStore, providePinia } from '../src'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

describe('Multiple Roots', () => {
  function defineMyStore() {
    return defineStore({
      id: 'main',
      state: () => ({
        n: 0,
      }),
    })
  }

  it('uses the same root in child components by default', () => {
    expect.assertions(2)
    const pinia = createPinia()
    const useStore = defineMyStore()

    const ChildComponent = defineComponent({
      template: 'no',
      setup() {
        const store = useStore()
        expect(store.n).toBe(1)
      },
    })

    mount(
      {
        template: '<ChildComponent />',
        components: { ChildComponent },
        setup() {
          const store = useStore()
          expect(store.n).toBe(0)
          store.n++
        },
      },
      { global: { plugins: [pinia] } }
    )
  })

  it('can use a new pinia root for all child components', async () => {
    expect.assertions(2)
    const pinia = createPinia()
    const useStore = defineMyStore()

    const ChildComponent = defineComponent({
      template: 'no',
      setup() {
        const store = useStore()
        expect(store.n).toBe(0)
      },
    })
    mount(
      {
        template: '<ChildComponent />',
        components: { ChildComponent },
        setup() {
          providePinia(createPinia())
          const store = useStore()
          expect(store.n).toBe(0)
          store.n++
        },
      },
      { global: { plugins: [pinia] } }
    )
  })

  it('state is shared between child components', async () => {
    expect.assertions(3)
    const pinia = createPinia()
    const useStore = defineMyStore()

    const ChildComponent = defineComponent({
      template: 'no',
      props: { counter: { type: Number, required: true } },
      setup(props: { counter: number }) {
        const store = useStore()
        expect(store.n).toBe(props.counter)
        store.n++
      },
    })
    mount(
      {
        template:
          '<ChildComponent :counter="0" /><ChildComponent :counter="1" />',
        components: { ChildComponent },
        setup() {
          const store = useStore()
          expect(store.n).toBe(0)
          store.n++
          providePinia(createPinia())
        },
      },
      { global: { plugins: [pinia] } }
    )
  })
})
