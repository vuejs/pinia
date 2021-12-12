import { createPinia, defineStore, setActivePinia } from '../src'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

describe('Subscriptions', () => {
  const useStore = () => {
    // create a new store
    setActivePinia(createPinia())
    return defineStore({
      id: 'main',
      state: () => ({
        user: 'Eduardo',
        theme: 'black',
      }),
      actions: {
        changeTheme(theme: string) {
          this.theme = theme
        },
        direct(name: string) {
          this.user = name
        },
        patchObject(user: string) {
          this.$patch({ user })
        },
        patchFn(name: string) {
          this.$patch((state) => {
            state.user = name
          })
        },
        async asyncUpperName() {
          return this.user.toUpperCase()
        },
        upperName() {
          return this.user.toUpperCase()
        },
        throws(e: any) {
          throw e
        },
        async rejects(e: any) {
          throw e
        },
      },
    })()
  }

  let store: ReturnType<typeof useStore>
  beforeEach(() => {
    store = useStore()
  })

  it('fires callback when action is called', () => {
    const spy = jest.fn()
    store.$onAction(spy)
    store.direct('Cleiton')
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'direct',
        args: ['Cleiton'],
        store,
      })
    )
  })

  it('removes the callback when unsubscribe is called', () => {
    const spy = jest.fn()
    const unsubscribe = store.$onAction(spy)
    unsubscribe()
    store.direct('Cleiton')
    expect(spy).not.toHaveBeenCalled()
  })

  it('calls after with the returned value', async () => {
    const spy = jest.fn()
    // Cannot destructure because of https://github.com/microsoft/TypeScript/issues/38020
    store.$onAction((context) => {
      if (context.name === 'upperName') {
        context.after((ret) => {
          // @ts-expect-error
          ret * 2
          ret.toUpperCase()
        })
      }
      context.after(spy)
    })
    expect(store.upperName()).toBe('EDUARDO')
    await nextTick()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('EDUARDO')
  })

  it('case1：calls multiple after with the resolved value', async () => {
    const spy = jest.fn()
    let afterCount = 0
    store.$onAction(({ after }) => {
      after(() => {
        afterCount++
        spy()
      })
    })
    store.$onAction(({ after }) => {
      after(() => {
        afterCount++
        spy()
      })
    })
    await expect(store.asyncUpperName()).resolves.toBe('EDUARDO')
    expect(spy).toHaveBeenCalledTimes(2)
    expect(afterCount).toBe(2)
  })

  it('case2：calls multiple after with the resolved value', async () => {
    const spy = jest.fn()
    let afterCount = 0
    store.$onAction(({ after }) => {
      after(() => {
        afterCount++
        spy()
      })
      after(() => {
        afterCount++
        spy()
      })
    })
    await expect(store.asyncUpperName()).resolves.toBe('EDUARDO')
    expect(spy).toHaveBeenCalledTimes(2)
    expect(afterCount).toBe(2)
  })

  it('case3：Parent and child components exist at the same time', async () => {
    const pinia = createPinia()
    const spy1 = jest.fn()
    const spy2 = jest.fn()
    let s1AfterCount = 0
    let s2AfterCount = 0

    const wrapper = mount(
      {
        setup() {
          store.$onAction(({ after }) => {
            after(() => {
              s1AfterCount++
              spy1()
            })
          })
        },
        template: `<p/>`,
      },
      { global: { plugins: [pinia] } }
    )

    store.$onAction(({ after }) => {
      after(() => {
        s2AfterCount++
        spy2()
      })
    })

    expect(spy1).toHaveBeenCalledTimes(0)
    expect(spy2).toHaveBeenCalledTimes(0)

    store.changeTheme('white')

    expect(s1AfterCount).toBe(1)
    expect(s2AfterCount).toBe(1)

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)

    wrapper.unmount()
    await nextTick()

    store.changeTheme('pink')

    expect(s1AfterCount).toBe(1)
    expect(s2AfterCount).toBe(2)

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(2)
  })

  it('listeners are not affected when unsubscribe is called multiple times', () => {
    const func1 = jest.fn()
    const func2 = jest.fn()
    const unsubscribe1 = store.$onAction(func1)
    store.$onAction(func2)
    unsubscribe1()
    unsubscribe1()
    store.direct('Cleiton')
    expect(func1).not.toHaveBeenCalled()
    expect(func2).toHaveBeenCalledTimes(1)
  })

  describe('multiple store instances', () => {
    const useStore = defineStore({
      id: 'main',
      state: () => ({
        name: 'Eduardo',
      }),

      actions: {
        changeName(name: string) {
          this.name = name
        },
      },
    })

    it('triggers subscribe only once', async () => {
      setActivePinia(createPinia())
      const s1 = useStore()
      const s2 = useStore()

      expect(s2).toBe(s1)

      const spy1 = jest.fn()
      const spy2 = jest.fn()

      s1.$onAction(spy1)
      s2.$onAction(spy2)

      expect(spy1).toHaveBeenCalledTimes(0)
      expect(spy2).toHaveBeenCalledTimes(0)

      s1.changeName('Edu')

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
            s1.$onAction(spy1)
          },
          template: `<p/>`,
        },
        { global: { plugins: [pinia] } }
      )

      const s1 = useStore()
      const s2 = useStore()

      s2.$onAction(spy2)

      expect(spy1).toHaveBeenCalledTimes(0)
      expect(spy2).toHaveBeenCalledTimes(0)

      s1.changeName('Cleiton')

      expect(spy2).toHaveBeenCalledTimes(1)
      expect(spy1).toHaveBeenCalledTimes(1)

      s1.changeName('other')
      expect(spy1).toHaveBeenCalledTimes(2)
      expect(spy2).toHaveBeenCalledTimes(2)

      wrapper.unmount()
      await nextTick()

      s1.changeName('again')
      expect(spy1).toHaveBeenCalledTimes(2)
      expect(spy2).toHaveBeenCalledTimes(3)
    })
  })
})
