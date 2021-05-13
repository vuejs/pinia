import { createPinia, defineStore, MutationType, setActivePinia } from '../src'
import { mount } from '@vue/test-utils'

describe('Subscriptions', () => {
  const useStore = () => {
    // create a new store
    setActivePinia(createPinia())
    return defineStore({
      id: 'main',
      state: () => ({
        name: 'Eduardo',
      }),
    })()
  }

  let store: ReturnType<typeof useStore>
  beforeEach(() => {
    store = useStore()
  })

  it('fires callback when patch is applied', () => {
    const spy = jest.fn()
    store.$subscribe(spy)
    store.$state.name = 'Cleiton'
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        storeName: 'main',
        storeId: 'main',
        type: MutationType.direct,
      }),
      store.$state
    )
  })

  it('subscribe to changes done via patch', () => {
    const store = useStore()
    const spy = jest.fn()
    store.$subscribe(spy)

    const patch = { name: 'Cleiton' }
    store.$patch(patch)

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: patch,
        storeName: 'main',
        storeId: 'main',
        type: MutationType.patchObject,
      }),
      store.$state
    )
  })

  it('unsubscribes callback when unsubscribe is called', () => {
    const spy = jest.fn()
    const unsubscribe = store.$subscribe(spy)
    unsubscribe()
    store.$state.name = 'Cleiton'
    expect(spy).not.toHaveBeenCalled()
  })

  it('listeners are not affected when unsubscribe is called multiple times', () => {
    const func1 = jest.fn()
    const func2 = jest.fn()
    const unsubscribe1 = store.$subscribe(func1)
    store.$subscribe(func2)
    unsubscribe1()
    unsubscribe1()
    store.$state.name = 'Cleiton'
    expect(func1).not.toHaveBeenCalled()
    expect(func2).toHaveBeenCalledTimes(1)
  })

  describe('multiple', () => {
    const useStore = defineStore({
      id: 'main',
      state: () => ({
        name: 'Eduardo',
      }),
    })

    it('triggers subscribe only once', async () => {
      setActivePinia(createPinia())
      const s1 = useStore()
      const s2 = useStore()

      const spy1 = jest.fn()
      const spy2 = jest.fn()

      s1.$subscribe(spy1)
      s2.$subscribe(spy2)

      expect(spy1).toHaveBeenCalledTimes(0)
      expect(spy2).toHaveBeenCalledTimes(0)

      s1.name = 'Edu'

      expect(spy1).toHaveBeenCalledTimes(1)
      expect(spy2).toHaveBeenCalledTimes(1)
    })

    it('removes on unmount', async () => {
      const pinia = createPinia()
      const spy1 = jest.fn()
      const spy2 = jest.fn()

      const wrapper = mount(
        {
          setup() {
            const s1 = useStore()
            s1.$subscribe(spy1)
          },
          template: `<p/>`,
        },
        { global: { plugins: [pinia] } }
      )

      const s1 = useStore()
      const s2 = useStore()

      s2.$subscribe(spy2)

      expect(spy1).toHaveBeenCalledTimes(0)
      expect(spy2).toHaveBeenCalledTimes(0)

      s1.name = 'Edu'

      expect(spy2).toHaveBeenCalledTimes(1)
      expect(spy1).toHaveBeenCalledTimes(1)

      s1.$patch({ name: 'a' })
      expect(spy1).toHaveBeenCalledTimes(2)
      expect(spy2).toHaveBeenCalledTimes(2)

      await wrapper.unmount()

      s1.$patch({ name: 'b' })
      expect(spy1).toHaveBeenCalledTimes(2)
      expect(spy2).toHaveBeenCalledTimes(3)
    })
  })
})
