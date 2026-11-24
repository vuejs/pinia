import { computed, ref } from 'vue'
import {
  defineStore,
  mapStores,
  mapActions,
  mapState,
  mapWritableState,
} from './'
import { describe, it, expectTypeOf } from 'vitest'

describe('mapHelpers', () => {
  const useOptionsStore = defineStore('name', {
    state: () => ({ a: 'on' as 'on' | 'off', nested: { counter: 0 } }),
    getters: {
      upper: (state) => state.a.toUpperCase(),
    },
    actions: {
      toggleA() {
        this.a = this.a === 'off' ? 'on' : 'off'
      },

      setToggle(a: 'on' | 'off') {
        return (this.a = a)
      },
    },
  })

  const useSetupStore = defineStore('setupStore', () => {
    const a = ref('on' as 'on' | 'off')
    const upper = computed(() => a.value.toUpperCase())
    const writableUpper = computed({
      get: () => a.value.toUpperCase(),
      set: (v: 'on' | 'off') => (a.value = v),
    })
    function toggleA() {
      a.value = a.value === 'off' ? 'on' : 'off'
    }
    function setToggle(aVal: 'on' | 'off') {
      return (a.value = aVal)
    }
    return { a, upper, writableUpper, toggleA, setToggle }
  })

  const useCounter = defineStore('counter', { state: () => ({ n: 0 }) })

  const useStoreDos = defineStore('dos', { state: () => ({}) })

  type MainStore = ReturnType<typeof useOptionsStore>
  type DosStore = ReturnType<typeof useStoreDos>
  type CounterStore = ReturnType<typeof useCounter>

  describe('mapStores', () => {
    it('should map stores correctly', () => {
      const computedStores = mapStores(useOptionsStore, useStoreDos, useCounter)
      expectTypeOf<{
        nameStore: () => MainStore
        dosStore: () => DosStore
        counterStore: () => CounterStore
      }>(computedStores)
    })
  })

  describe('mapState', () => {
    it('should map state correctly for store with no getters', () => {
      expectTypeOf<{
        n: () => number
      }>(mapState(useCounter, ['n']))
    })

    it('should map state correctly for store with getters', () => {
      expectTypeOf<{
        a: () => 'on' | 'off'
        upper: () => string
      }>(mapState(useOptionsStore, ['a', 'upper']))
    })

    it('should map state with new keys', () => {
      expectTypeOf<{
        newA: () => 'on' | 'off'
        newUpper: () => string
      }>(mapState(useOptionsStore, { newA: 'a', newUpper: 'upper' }))
    })

    it('should map state with function keys', () => {
      expectTypeOf<{
        newA: () => 'on' | 'off'
        newUpper: () => string
      }>(
        mapState(useOptionsStore, {
          newA: (store) => {
            expectTypeOf<string>(store.upper)
            return store.a
          },
          newUpper: 'upper',
        })
      )
    })

    it('should map state for setup store', () => {
      const setupStoreWithState = mapState(useSetupStore, ['a'])
      expectTypeOf(setupStoreWithState).toEqualTypeOf<{
        a: () => 'on' | 'off'
      }>()

      const setupStoreWithGetters = mapState(useSetupStore, ['a', 'upper'])
      expectTypeOf(setupStoreWithGetters).toEqualTypeOf<{
        a: () => 'on' | 'off'
        upper: () => string
      }>()
    })
  })

  describe('mapActions', () => {
    it('should map actions correctly', () => {
      expectTypeOf<{
        setToggle: (a: 'on' | 'off') => 'on' | 'off'
        toggleA: () => void
      }>(mapActions(useOptionsStore, ['setToggle', 'toggleA']))

      expectTypeOf<{
        newSetToggle: (a: 'on' | 'off') => 'on' | 'off'
        newToggleA: () => void
      }>(
        mapActions(useOptionsStore, {
          newSetToggle: 'setToggle',
          newToggleA: 'toggleA',
        })
      )
    })
  })

  describe('mapWritableState', () => {
    it('should map writable state correctly', () => {
      expectTypeOf<{
        a: {
          get: () => 'on' | 'off'
          set: (v: 'on' | 'off') => any
        }
      }>(mapWritableState(useOptionsStore, ['a']))

      expectTypeOf<{
        newA: {
          get: () => 'on' | 'off'
          set: (v: 'on' | 'off') => any
        }
      }>(mapWritableState(useOptionsStore, { newA: 'a' }))

      expectTypeOf<{
        foo: {
          get: () => 'on' | 'off'
          set: (v: 'on' | 'off') => any
        }
      }>(mapWritableState(useSetupStore, { foo: 'a' }))

      expectTypeOf<{
        a: {
          get: () => 'on' | 'off'
          set: (v: 'on' | 'off') => any
        }
      }>(mapWritableState(useSetupStore, ['a']))

      expectTypeOf<{
        writableUpper: {
          get: () => string
          set: (v: 'on' | 'off') => any
        }
      }>(mapWritableState(useSetupStore, ['writableUpper']))
    })
  })
})

describe('mapWritableState selected objects', () => {
  const targetSymbol = Symbol('target')
  const aliasSymbol = Symbol('alias')
  interface Address {
    city: string
    visits: number
    readonly code: string
    optional?: string
    'geo.city': string
    7: string
    [targetSymbol]: number
  }
  const address = (): Address => ({
    city: '苏州',
    visits: 3,
    code: 'CN',
    'geo.city': 'literal',
    7: 'number',
    [targetSymbol]: 5,
  })
  const useSurvey = defineStore('survey-types', {
    state: () => ({
      form: { address: address() },
      nullable: null as Address | null,
      optional: undefined as Address | undefined,
    }),
    getters: { upper: (state) => state.form.address.city.toUpperCase() },
  })

  it('infers the full store and precise getters and setters', () => {
    const mapped = mapWritableState(
      useSurvey,
      (store) => {
        expectTypeOf(store).toEqualTypeOf<ReturnType<typeof useSurvey>>()
        expectTypeOf(store.upper).toEqualTypeOf<string>()
        return store.form.address
      },
      ['city', 'visits', 'optional', 'geo.city']
    )
    expectTypeOf(mapped.city.get()).toEqualTypeOf<string>()
    expectTypeOf(mapped.visits.get()).toEqualTypeOf<number>()
    expectTypeOf(mapped.optional.get()).toEqualTypeOf<string | undefined>()
    expectTypeOf(mapped['geo.city'].get()).toEqualTypeOf<string>()
    expectTypeOf(mapped.city.set).parameter(0).toEqualTypeOf<string>()
    expectTypeOf(mapped.visits.set).parameter(0).toEqualTypeOf<number>()
    mapped.city.set('宁波')
    mapped.visits.set(7)
    // @ts-expect-error wrong string value
    mapped.city.set(7)
    // @ts-expect-error wrong number value
    mapped.visits.set('seven')
    // @ts-expect-error unselected property
    mapped.code

    const aliased = mapWritableState(useSurvey, (store) => store.form.address, {
      myCity: 'city',
      visitCount: 'visits',
      numeric: 7,
      symbolic: targetSymbol,
      dotted: 'geo.city',
      [aliasSymbol]: 'city',
    })
    expectTypeOf(aliased.myCity.get()).toEqualTypeOf<string>()
    expectTypeOf(aliased.visitCount.get()).toEqualTypeOf<number>()
    expectTypeOf(aliased.numeric.get()).toEqualTypeOf<string>()
    expectTypeOf(aliased.symbolic.get()).toEqualTypeOf<number>()
    expectTypeOf(aliased.dotted.get()).toEqualTypeOf<string>()
    expectTypeOf(aliased.myCity.set).parameter(0).toEqualTypeOf<string>()
    expectTypeOf(aliased.symbolic.set).parameter(0).toEqualTypeOf<number>()
    // @ts-expect-error symbol component aliases are not enumerated
    aliased[aliasSymbol]
    // @ts-expect-error alias uses the selected property's value type
    aliased.myCity.set(1)
    // @ts-expect-error unknown alias
    aliased.city
  })

  it('rejects readonly keys, missing keys and unhandled nullable targets', () => {
    const select = (store: ReturnType<typeof useSurvey>) => store.form.address
    // @ts-expect-error readonly property
    mapWritableState(useSurvey, select, ['code'])
    // @ts-expect-error readonly property through alias
    mapWritableState(useSurvey, select, { id: 'code' })
    // @ts-expect-error readonly key with an inferred inline selector
    mapWritableState(useSurvey, (store) => store.form.address, ['code'])
    // @ts-expect-error readonly alias with an inferred inline selector
    mapWritableState(useSurvey, (store) => store.form.address, { id: 'code' })
    // @ts-expect-error misspelled property
    mapWritableState(useSurvey, select, ['ctiy'])
    // @ts-expect-error misspelled alias target
    mapWritableState(useSurvey, select, { myCity: 'ctiy' })
    // @ts-expect-error nullable target requires explicit handling
    mapWritableState(useSurvey, (store) => store.nullable, ['city'])
    // @ts-expect-error optional target requires explicit handling
    mapWritableState(useSurvey, (store) => store.optional, { city: 'city' })
    // @ts-expect-error primitive target is not an object
    mapWritableState(useSurvey, (store) => store.upper, ['length'])
    // @ts-expect-error readonly top-level getter remains invalid in old mode
    mapWritableState(useSurvey, ['upper'])
    const handled = mapWritableState(
      useSurvey,
      (store) => {
        if (!store.nullable) throw new Error('missing target')
        return store.nullable
      },
      ['city']
    )
    expectTypeOf(handled.city.get()).toEqualTypeOf<string>()
  })

  it('infers setup store targets and accepts readonly references to mutable objects', () => {
    const useSetup = defineStore('selected-setup-types', () => {
      const form = ref({ address: address() })
      return { form }
    })
    const mapped = mapWritableState(useSetup, (store) => store.form.address, {
      city: 'city',
      visits: 'visits',
    })
    expectTypeOf(mapped.city.get()).toEqualTypeOf<string>()
    expectTypeOf(mapped.visits.set).parameter(0).toEqualTypeOf<number>()
    const selected = (
      store: ReturnType<typeof useSetup>
    ): { readonly address: Address } => store.form
    const mutable = mapWritableState(
      useSetup,
      (store) => selected(store).address,
      ['city']
    )
    expectTypeOf(mutable.city.get()).toEqualTypeOf<string>()
  })
})

describe('mapWritableState non-string target key inference', () => {
  const token = Symbol('target')
  const useKeyed = defineStore('keyed-types', {
    state: () => ({ target: { 7: 'number', [token]: 5 } }),
  })
  const mapped = mapWritableState(useKeyed, (store) => store.target, {
    numbered: 7,
    symbolic: token,
  })
  expectTypeOf(mapped.numbered.get()).toEqualTypeOf<string>()
  expectTypeOf(mapped.symbolic.get()).toEqualTypeOf<number>()
  expectTypeOf(mapped.numbered.set).parameter(0).toEqualTypeOf<string>()
  // @ts-expect-error wrong symbol target value
  mapped.symbolic.set('wrong')

  interface LockedTarget {
    readonly 9: string
    readonly [token]: number
  }
  const lockedTarget = (): LockedTarget => ({ 9: 'locked', [token]: 5 })
  const useLocked = defineStore('locked-keyed-types', {
    state: () => ({ target: lockedTarget() }),
  })
  // @ts-expect-error readonly numeric target
  mapWritableState(useLocked, (store) => store.target, { numeric: 9 })
  // @ts-expect-error readonly symbol target
  mapWritableState(useLocked, (store) => store.target, { symbolic: token })
})
