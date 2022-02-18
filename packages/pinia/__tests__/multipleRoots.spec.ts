import { createPinia, defineStore, providePinia } from '../src'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

describe('Multiple Roots', () => {
  function defineMyStore() {
    return defineStore('main', {
      state: () => ({
        n: 0,
      }),
    })
  }

  it('uses the same root in child components by default', () => {
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

    const store = useStore()
    expect(store.n).toBe(1)
  })

  it('can use a new pinia root for all child components', async () => {
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

    const store = useStore()
    expect(store.n).toBe(0)
  })
})
