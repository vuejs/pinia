import {
  createPinia,
  defineStore,
  mapActions,
  mapGetters,
  mapState,
  mapStores,
  mapWritableState,
  setMapStoreSuffix,
} from '../src'
import { mount } from '@vue/test-utils'
import { nextTick, defineComponent } from 'vue'

describe('Map Helpers', () => {
  const useCartStore = defineStore({ id: 'cart' })
  const useStore = defineStore({
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
    actions: {
      doubleCount() {
        this.n = this.n * 2
      },
    },
  })

  describe('mapStores', () => {
    it('mapStores computes only once when mapping one store', async () => {
      const pinia = createPinia()
      const fromStore = jest.fn(function () {
        // @ts-ignore
        return this.mainStore
      })
      const Component = defineComponent({
        template: `<p @click="fromStore.n++">{{ fromStore.n }}</p>`,
        computed: {
          ...mapStores(useStore),
          fromStore,
        },
      })

      const wrapper = mount(Component, { global: { plugins: [pinia] } })
      // const store = useStore()
      // const other = useCartStore()
      expect(wrapper.vm.mainStore).toBeDefined()
      expect(wrapper.text()).toBe('0')
      await nextTick()
      expect(fromStore).toHaveBeenCalledTimes(1)

      await wrapper.trigger('click')
      expect(wrapper.text()).toBe('1')
      expect(fromStore).toHaveBeenCalledTimes(1)
      await wrapper.trigger('click')
      expect(wrapper.text()).toBe('2')
      expect(fromStore).toHaveBeenCalledTimes(1)
    })

    it('mapStores computes only once when mapping multiple stores', async () => {
      const pinia = createPinia()
      const fromStore = jest.fn(function () {
        // @ts-ignore
        return this.mainStore
      })
      const Component = defineComponent({
        template: `<p @click="fromStore.n++">{{ mainStore.n }} {{ fromStore.n }} {{ cartStore.$id }}</p>`,
        computed: {
          ...mapStores(useStore, useCartStore),
          fromStore,
        },
      })

      const wrapper = mount(Component, { global: { plugins: [pinia] } })
      expect(wrapper.text()).toBe('0 0 cart')
      await nextTick()
      expect(fromStore).toHaveBeenCalledTimes(1)

      await wrapper.trigger('click')
      expect(wrapper.text()).toBe('1 1 cart')
      expect(fromStore).toHaveBeenCalledTimes(1)
      await wrapper.trigger('click')
      expect(wrapper.text()).toBe('2 2 cart')
      expect(fromStore).toHaveBeenCalledTimes(1)
    })

    it('can set custom suffix', async () => {
      const pinia = createPinia()
      setMapStoreSuffix('')
      const Component = defineComponent({
        template: `<p @click="main.n++">{{ main.n }}</p>`,
        computed: {
          ...mapStores(useStore),
        },
      })

      const wrapper = mount(Component, { global: { plugins: [pinia] } })
      // const store = useStore()
      // const other = useCartStore()
      // @ts-expect-error: by default this shouldn't exist
      expect(wrapper.vm.main).toBeDefined()
      expect(wrapper.vm.mainStore).not.toBeDefined()
      expect(wrapper.text()).toBe('0')
      await nextTick()

      await wrapper.trigger('click')
      expect(wrapper.text()).toBe('1')
      await wrapper.trigger('click')
      expect(wrapper.text()).toBe('2')
    })
  })

  it('mapGetters', () => {
    expect(mapGetters).toBe(mapState)
  })

  describe('mapState', () => {
    async function testComponent(
      computedProperties: any,
      template: string,
      expectedText: string
    ) {
      const pinia = createPinia()
      const Component = defineComponent({
        template: `<p>${template}</p>`,
        computed: {
          ...computedProperties,
        },
      })

      const wrapper = mount(Component, { global: { plugins: [pinia] } })

      expect(wrapper.text()).toBe(expectedText)
    }

    it('array', async () => {
      await testComponent(
        mapState(useStore, ['n', 'a']),
        `{{ n }} {{ a }}`,
        `0 true`
      )
    })

    it('object', async () => {
      await testComponent(
        mapState(useStore, { count: 'n', myA: 'a' }),
        `{{ count }} {{ myA }}`,
        `0 true`
      )
    })

    it('object with functions', async () => {
      await testComponent(
        mapState(useStore, { triple: (state) => (state.n + 1) * 3, myA: 'a' }),
        `{{ triple }} {{ myA }}`,
        `3 true`
      )
    })

    it('uses component context', async () => {
      const pinia = createPinia()
      let vm
      const Component = defineComponent({
        template: `<p>{{ n }}</p>`,
        computed: {
          ...mapState(useStore, {
            n(store) {
              vm = this
              return store.n
            },
          }),
        },
      })

      const wrapper = mount(Component, { global: { plugins: [pinia] } })
      expect(vm).toBe(wrapper.vm)
    })

    it('getters', async () => {
      await testComponent(
        mapState(useStore, ['double', 'notA', 'a']),
        `{{ a }} {{ notA }} {{ double }}`,
        `true false 0`
      )
    })
  })

  describe('mapActions', () => {
    const useStore = defineStore({
      id: 'main',
      state: () => ({ n: 0 }),
      actions: {
        increment() {
          this.n++
        },
        setN(newN: number) {
          return (this.n = newN)
        },
      },
    })

    it('array', () => {
      const pinia = createPinia()
      const Component = defineComponent({
        template: `<p></p>`,
        methods: {
          ...mapActions(useStore, ['increment', 'setN']),
        },
      })

      const wrapper = mount(Component, { global: { plugins: [pinia] } })

      expect(wrapper.vm.increment()).toBe(undefined)
      expect(wrapper.vm.setN(4)).toBe(4)
    })

    it('object', () => {
      const pinia = createPinia()
      const Component = defineComponent({
        template: `<p></p>`,
        methods: {
          ...mapActions(useStore, { inc: 'increment', set: 'setN' }),
        },
      })

      const wrapper = mount(Component, { global: { plugins: [pinia] } })

      expect(wrapper.vm.inc()).toBe(undefined)
      expect(wrapper.vm.set(4)).toBe(4)
    })
  })

  describe('mapWritableState', () => {
    async function testComponent(
      computedProperties: any,
      template: string,
      expectedText: string,
      expectedText2: string
    ) {
      const pinia = createPinia()
      const Component = defineComponent({
        template: `<p>${template}</p>`,
        computed: {
          ...computedProperties,
        },
        methods: Object.keys(computedProperties).reduce((methods, name) => {
          // @ts-ignore
          methods['set_' + name] = function (v: any) {
            // @ts-ignore
            this[name] = v
          }
          return methods
        }, {}),
      })

      const wrapper = mount(Component, { global: { plugins: [pinia] } })

      expect(wrapper.text()).toBe(expectedText)

      for (const key in computedProperties) {
        // @ts-ignore
        wrapper.vm['set_' + key]('replaced')
      }

      await nextTick()

      expect(wrapper.text()).toBe(expectedText2)
    }

    it('array', async () => {
      await testComponent(
        mapWritableState(useStore, ['n', 'a']),
        `{{ n }} {{ a }}`,
        `0 true`,
        'replaced replaced'
      )
    })

    it('object', async () => {
      await testComponent(
        mapWritableState(useStore, { count: 'n', myA: 'a' }),
        `{{ count }} {{ myA }}`,
        `0 true`,
        'replaced replaced'
      )
    })
  })
})
