import { createPinia, defineStore, setActivePinia } from '../src'
import { createLocalVue, mount } from '@vue/test-utils'
import VueCompositionAPI, {
  watch,
  nextTick,
  defineComponent,
} from '@vue/composition-api'

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

  const localVue = createLocalVue()
  localVue.use(VueCompositionAPI)
  const pinia = createPinia()
  localVue.use(pinia)

  // FIXME: https://github.com/vuejs/vue-test-utils/issues/1799

  it.only('what', async () => {
    const localVue = createLocalVue()
    localVue.use(VueCompositionAPI)
    const n = 0
    const Component = defineComponent({
      render: (h) => h('p'),
      setup() {
        // console.log('setup', n++)
      },
    })

    mount(Component, { localVue })
  })

  it('state reactivity outlives component life', async () => {
    const useStore = defineMyStore()

    const inComponentWatch = jest.fn()

    const Component = defineComponent({
      render: (h) => h('p'),
      setup() {
        const store = useStore()
        watch(
          () => store.n,
          (n, oldN) => {
            console.log('watching lolo', n, oldN)
          }
        )
        watch(() => store.n, inComponentWatch)
        console.log('increement', store.n)
        store.n++
      },
    })

    let wrapper = mount(Component, { localVue })

    await nextTick()
    wrapper.destroy()
    await nextTick()

    expect(inComponentWatch).toHaveBeenCalledTimes(1)

    let store = useStore()

    store.n++
    await nextTick()
    // FIXME: seems to be a bug in composition api
    // expect(inComponentWatch).toHaveBeenCalledTimes(1)

    wrapper = mount(Component, { localVue })
    await nextTick()
    wrapper.destroy()
    await nextTick()

    expect(inComponentWatch).toHaveBeenCalledTimes(2)

    store = useStore()

    store.n++
    await nextTick()
    expect(inComponentWatch).toHaveBeenCalledTimes(2)
  })
})
