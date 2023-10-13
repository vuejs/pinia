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

  it('provides a pinia to children components', async () => {
    const pinia = createPinia()
    const useA = defineMyStore()
    let nestedA!: ReturnType<typeof useA>

    const ChildComponent = defineComponent({
      template: 'no',
      setup() {
        // should use the provided pinia by the parent
        const store = useA()
        nestedA = store
        expect(store.n).toBe(0)
      },
    })
    mount(
      {
        template: '<ChildComponent />',
        components: { ChildComponent },
        setup() {
          providePinia(createPinia())
          const store = useA()
          expect(store.n).toBe(0)
          store.n++
        },
      },
      { global: { plugins: [pinia] } }
    )

    const store = useA()
    // should be the parent one
    expect(store).not.toBe(nestedA)
    expect(store.n).toBe(1)
  })

  it('should be able to use plugins', async () => {
    const pinia = createPinia()
    const useA = defineMyStore()

    // @ts-expect-error: type not defined
    pinia.use(() => ({ parent: true }))

    const ChildComponent = defineComponent({
      template: 'no',
      setup() {
        // should use the provided pinia by the parent
        const store = useA()
        // @ts-expect-error: not defined
        expect(store.parent).toBeUndefined()
        // @ts-expect-error: not defined
        expect(store.child).toBe(true)
      },
    })
    mount(
      {
        template: '<ChildComponent />',
        components: { ChildComponent },
        setup() {
          const pinia = createPinia()
          // @ts-expect-error: type not defined
          pinia.use(() => ({ child: true }))
          providePinia(pinia)
          const store = useA()
          // @ts-expect-error: not defined
          expect(store.child).toBeUndefined()
          // @ts-expect-error: not defined
          expect(store.parent).toBe(true)
        },
      },
      { global: { plugins: [pinia] } }
    )
  })
})
