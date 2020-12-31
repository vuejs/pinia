import { createPinia, defineStore, setActivePinia } from '../src'
import { mount } from '@vue/test-utils'
import { watch, nextTick, ref } from 'vue'

describe('Store Lifespan', () => {
  function defineMyStore() {
    return defineStore({
      id: 'main',
      state: () => ({
        a: true,
        n: 0,
        nested: {
          foo: 'foo',
          a: { b: 'string' },
        },
      }),
      getters: {
        double() {
          return this.n * 2
        },
        notA() {
          return !this.a
        },
      },
    })
  }

  const pinia = createPinia()
  // let pinia: object

  // const useStore = () => {
  //   // create a new store
  //   pinia = {}
  //   setActivePinia(pinia)
  //   return defineMyStore()()
  // }

  it('bug report', async () => {
    const inComponentWatch = jest.fn()

    const n = ref(0)

    const wrapper = mount(
      {
        render: () => null,
        setup() {
          watch(() => n.value, inComponentWatch)
          n.value++
        },
      },
      {
        global: {
          plugins: [pinia],
        },
      }
    )

    await wrapper.unmount()

    expect(inComponentWatch).toHaveBeenCalledTimes(1)

    // store!.n++
    n.value++
    await nextTick()
    expect(inComponentWatch).toHaveBeenCalledTimes(1)
  })

  it('state reactivity outlives component life', async () => {
    const useStore = defineMyStore()
    setActivePinia(createPinia())

    const inComponentWatch = jest.fn()

    let store: ReturnType<typeof useStore>

    const n = ref(0)

    const wrapper = mount(
      {
        render: () => null,
        setup() {
          store = useStore()
          // watch(() => store.n, inComponentWatch)
          watch(() => n.value, inComponentWatch)
          store.n++
          n.value++
        },
      },
      {
        global: {
          plugins: [pinia],
        },
      }
    )

    await wrapper.unmount()

    expect(inComponentWatch).toHaveBeenCalledTimes(1)

    // store!.n++
    n.value++
    await nextTick()
    expect(inComponentWatch).toHaveBeenCalledTimes(1)
  })
})
