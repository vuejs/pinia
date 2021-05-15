import { createPinia, defineStore, PiniaPlugin } from '../src'
import { createLocalVue, mount } from '@vue/test-utils'
import VueCompositionAPI, {
  watch,
  nextTick,
  defineComponent,
  onUnmounted,
  ref,
  Ref,
} from '@vue/composition-api'

describe('Store Lifespan', () => {
  function defineMyStore() {
    return defineStore({
      id: 'main',
      state: () => ({
        a: true,
        n: 0,
        aRef: ref(0),
        nested: {
          foo: 'foo',
          a: { b: 'string' },
        },
      }),
      getters: {
        double(state) {
          return state.n * 2
        },
        notA(state) {
          return !state.a
        },
      },
    })
  }

  const localVue = createLocalVue()
  localVue.use(VueCompositionAPI)
  const pinia = createPinia()
  localVue.use(PiniaPlugin)

  it('state reactivity outlives component life', async () => {
    const useStore = defineMyStore()

    const inComponentWatch = jest.fn()

    // FIXME: remove when the bug is fixed in VTU
    // https://github.com/vuejs/vue-test-utils/issues/1799
    let setupCalled = false

    const Component = defineComponent({
      render: (h) => h('p'),
      setup() {
        // console.log('setup called')
        if (!setupCalled) {
          const store = useStore()
          watch(() => store.n, inComponentWatch)
          store.n++
          setupCalled = true

          onUnmounted(() => {
            setupCalled = false
          })
        }
      },
    })

    let wrapper = mount(Component, { localVue, pinia })

    await nextTick()
    wrapper.destroy()
    await nextTick()

    expect(inComponentWatch).toHaveBeenCalledTimes(1)

    let store = useStore()

    store.n++
    await nextTick()
    expect(inComponentWatch).toHaveBeenCalledTimes(1)

    wrapper = mount(Component, { localVue, pinia })
    await nextTick()
    wrapper.destroy()
    await nextTick()

    expect(inComponentWatch).toHaveBeenCalledTimes(2)

    store = useStore()

    store.n++
    await nextTick()
    expect(inComponentWatch).toHaveBeenCalledTimes(2)
  })

  it('ref in state reactivity outlives component life', async () => {
    let n: Ref<number>
    const globalWatch = jest.fn()
    const destroy = watch(() => pinia.state.value.a?.n, globalWatch)

    const useStore = defineStore({
      id: 'a',
      state: () => {
        n = n || ref(0)
        return { n }
      },
    })

    const Component = defineComponent({
      // @ts-expect-error
      render: () => null,
      setup() {
        const store = useStore()
        store.n++
      },
    })

    const options = {
      pinia,
      localVue,
    }

    let wrapper = mount(Component, options)
    await wrapper.destroy()

    expect(globalWatch).toHaveBeenCalledTimes(1)

    let store = useStore()
    store.n++
    await nextTick()
    expect(globalWatch).toHaveBeenCalledTimes(2)

    wrapper = mount(Component, options)
    await wrapper.destroy()

    expect(globalWatch).toHaveBeenCalledTimes(3)

    store = useStore()
    store.n++
    await nextTick()
    expect(globalWatch).toHaveBeenCalledTimes(4)

    destroy()
  })
})
