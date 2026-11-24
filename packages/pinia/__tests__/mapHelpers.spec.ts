import { describe, it, expect } from 'vitest'
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
import { nextTick, defineComponent, ref, computed } from 'vue'
import { mockWarn } from './vitest-mock-warn'

describe('Map Helpers', () => {
  const useStore = defineStore('main', {
    state: () => ({
      a: true,
      n: 0,
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
    actions: {
      doubleCount() {
        this.n = this.n * 2
      },
    },
  })

  describe('mapStores', () => {
    mockWarn()

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

    it('should warn when an array is passed', () => {
      mapStores([])
      expect('pass all stores to "mapStores()"').toHaveBeenWarned()
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
    const useStore = defineStore('main', {
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

    it('setup store', async () => {
      const useSetupStore = defineStore('setup', () => {
        const text = ref('initial')

        const textUpper = computed({
          get: () => text.value.toUpperCase(),
          set: (v) => {
            text.value = v
          },
        })

        return { text, textUpper }
      })

      await testComponent(
        mapWritableState(useSetupStore, ['text', 'textUpper']),
        `{{ text }} {{ textUpper }}`,
        `initial INITIAL`,
        'replaced REPLACED'
      )
    })
  })
})

describe('mapWritableState selected objects', () => {
  const targetSymbol = Symbol('target')
  const useSurveyStore = defineStore('survey', {
    state: () => ({
      title: '问卷',
      'form.address.city': '旧字面键',
      form: {
        address: { city: '苏州', visits: 3, 'geo.city': '目标字面键' },
      },
      keyed: { 7: '数字', [targetSymbol]: 5 },
    }),
  })

  it('preserves top-level names and treats dotted keys literally in both modes', () => {
    const pinia = createPinia()
    const Component = defineComponent({
      template: '<p>{{ title }} {{ literal }} {{ city }} {{ dotted }}</p>',
      computed: {
        ...mapWritableState(useSurveyStore, ['title']),
        ...mapWritableState(useSurveyStore, { literal: 'form.address.city' }),
        ...mapWritableState(useSurveyStore, (store) => store.form.address, {
          city: 'city',
          dotted: 'geo.city',
        }),
      },
    })
    const wrapper = mount(Component, { global: { plugins: [pinia] } })
    const store = useSurveyStore(pinia)
    expect(wrapper.vm.title).toBe('问卷')
    wrapper.vm.title = '访谈'
    expect(store.title).toBe('访谈')
    expect(store['form.address.city']).toBe('旧字面键')
    expect(store.form.address.city).toBe('苏州')
    wrapper.vm.literal = '新字面键'
    expect(store['form.address.city']).toBe('新字面键')
    expect(store.form.address.city).toBe('苏州')
    wrapper.vm.dotted = '新的目标字面键'
    expect(store.form.address['geo.city']).toBe('新的目标字面键')
    expect(store.form.address.city).toBe('苏州')
    wrapper.unmount()
  })

  it('keeps JavaScript callable alias objects in the two-argument mode', () => {
    const pinia = createPinia()
    const mapper = Object.assign(() => {}, { caption: 'title' as const })
    const Component = defineComponent({
      template: '<p>{{ caption }}</p>',
      computed: {
        // @ts-expect-error callable mappers are JavaScript-only in the existing API
        ...mapWritableState(useSurveyStore, mapper),
      },
    })
    const wrapper = mount(Component, { global: { plugins: [pinia] } })
    expect(wrapper.vm.caption).toBe('问卷')
    wrapper.vm.caption = '访谈'
    expect(useSurveyStore(pinia).title).toBe('访谈')
    wrapper.unmount()
  })

  it('reads and writes current array targets after replacement', async () => {
    const pinia = createPinia()
    const Component = defineComponent({
      template: '<p>{{ city }} {{ visits }}</p>',
      computed: {
        ...mapWritableState(useSurveyStore, (store) => store.form.address, [
          'city',
          'visits',
        ]),
      },
    })
    const wrapper = mount(Component, { global: { plugins: [pinia] } })
    const store = useSurveyStore(pinia)
    expect(wrapper.text()).toBe('苏州 3')
    wrapper.vm.city = '宁波'
    wrapper.vm.visits = 7
    expect(store.form.address.city).toBe('宁波')
    expect(store.form.address.visits).toBe(7)
    const oldAddress = store.form.address
    store.form.address = { city: '厦门', visits: 11, 'geo.city': '新目标' }
    expect(wrapper.vm.city).toBe('厦门')
    expect(wrapper.vm.visits).toBe(11)
    wrapper.vm.city = '泉州'
    expect(store.form.address.city).toBe('泉州')
    expect(oldAddress.city).toBe('宁波')
    expect(oldAddress.visits).toBe(7)
    await nextTick()
    expect(wrapper.text()).toBe('泉州 11')
    wrapper.unmount()
  })

  it('reads and writes current aliased targets after replacement', async () => {
    const pinia = createPinia()
    const Component = defineComponent({
      template: '<p>{{ myCity }} {{ visitCount }}</p>',
      computed: {
        ...mapWritableState(useSurveyStore, (store) => store.form.address, {
          myCity: 'city',
          visitCount: 'visits',
        }),
      },
    })
    const wrapper = mount(Component, { global: { plugins: [pinia] } })
    const store = useSurveyStore(pinia)
    expect(wrapper.text()).toBe('苏州 3')
    wrapper.vm.myCity = '宁波'
    wrapper.vm.visitCount = 7
    expect(store.form.address.city).toBe('宁波')
    expect(store.form.address.visits).toBe(7)
    const oldAddress = store.form.address
    store.form.address = { city: '厦门', visits: 11, 'geo.city': '新目标' }
    expect(wrapper.vm.myCity).toBe('厦门')
    expect(wrapper.vm.visitCount).toBe(11)
    wrapper.vm.myCity = '泉州'
    expect(store.form.address.city).toBe('泉州')
    expect(oldAddress.city).toBe('宁波')
    expect(oldAddress.visits).toBe(7)
    await nextTick()
    expect(wrapper.text()).toBe('泉州 11')
    wrapper.unmount()
  })

  it('maps number and symbol target keys through string aliases', () => {
    const pinia = createPinia()
    const Component = defineComponent({
      template: '<p>{{ numbered }} {{ symbolic }}</p>',
      computed: {
        ...mapWritableState(useSurveyStore, (store) => store.keyed, {
          numbered: 7,
          symbolic: targetSymbol,
        }),
      },
    })
    const wrapper = mount(Component, { global: { plugins: [pinia] } })
    const store = useSurveyStore(pinia)
    expect(wrapper.text()).toBe('数字 5')
    wrapper.vm.numbered = '新数字'
    wrapper.vm.symbolic = 9
    expect(store.keyed[7]).toBe('新数字')
    expect(store.keyed[targetSymbol]).toBe(9)
    wrapper.unmount()
  })

  it('uses the component Pinia even when another instance is active', () => {
    const piniaA = createPinia()
    const piniaB = createPinia()
    const storeA = useSurveyStore(piniaA)
    const storeB = useSurveyStore(piniaB)
    storeA.form.address.city = '甲城'
    storeB.form.address.city = '乙城'
    const Component = defineComponent({
      template: '<p>{{ city }}</p>',
      computed: {
        ...mapWritableState(useSurveyStore, (store) => store.form.address, [
          'city',
        ]),
      },
    })
    const a = mount(Component, { global: { plugins: [piniaA] } })
    const b = mount(Component, { global: { plugins: [piniaB] } })
    expect(a.vm.city).toBe('甲城')
    expect(b.vm.city).toBe('乙城')
    a.vm.city = '丙城'
    expect(storeA.form.address.city).toBe('丙城')
    expect(storeB.form.address.city).toBe('乙城')
    expect(b.vm.city).toBe('乙城')
    a.unmount()
    b.unmount()
  })

  it('propagates selector errors on both read and write', () => {
    const error = new Error('no address')
    const Component = defineComponent({
      template: '<p/>',
      computed: {
        ...mapWritableState(
          useSurveyStore,
          (store) => {
            if (store.form.address.visits === 3) throw error
            return store.form.address
          },
          ['city']
        ),
      },
    })
    const wrapper = mount(Component, { global: { plugins: [createPinia()] } })
    expect(() => wrapper.vm.city).toThrow(error)
    expect(() => {
      wrapper.vm.city = '不能写入'
    }).toThrow(error)
    wrapper.unmount()
  })

  it('only enumerates own string aliases without changing the result prototype', () => {
    const ignored = Symbol('ignored alias')
    const aliases = { city: 'city', [ignored]: 'visits' } as const
    Object.setPrototypeOf(aliases, { inherited: 'city' })
    Object.defineProperty(aliases, 'hidden', { value: 'visits' })
    const mappings = mapWritableState(
      useSurveyStore,
      (store) => store.form.address,
      aliases
    )
    expect(Object.keys(mappings)).toEqual(['city'])
    expect(Object.getOwnPropertySymbols(mappings)).toEqual([])
    const prototypeNamed = mapWritableState(
      useSurveyStore,
      (store) => store.form.address,
      { ['__proto__']: 'city' }
    )
    expect(Object.getPrototypeOf(prototypeNamed)).toBe(Object.prototype)
    expect(Object.hasOwn(prototypeNamed, '__proto__')).toBe(true)
  })
})
