import {
  defineStore,
  expectType,
  PiniaCustomOptionsProperties,
  Store,
  StoreDefinition,
  StoreGeneric,
} from './'

// Recreate the plugin from https://github.com/vuejs/pinia/issues/1247: a
// plugin adds a `stores` option to `DefineStoreOptionsBase` and exposes the
// instantiated stores on `this.stores`, typed from the store options.
declare module './' {
  export interface DefineStoreOptionsBase<S, Store> {
    stores?: Record<string, StoreDefinition>
    marker?: string
  }

  export interface PiniaCustomOptionsProperties<O> {
    readonly stores: O extends { stores?: infer Stores }
      ? {
          [K in keyof Stores]: Stores[K] extends StoreDefinition
            ? ReturnType<Stores[K]>
            : never
        }
      : Record<string, Store>
    readonly marker: O extends { marker?: infer M } ? M : undefined
  }
}

const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++
    },
  },
})

const useUserStore = defineStore('user', {
  state: () => ({ name: 'initial' }),
  actions: {
    setName(name: string) {
      this.name = name
    },
  },
})

const useMainStore = defineStore('main', {
  state: () => ({ value: 0 }),
  stores: {
    counter: useCounterStore,
    user: useUserStore,
  },
  marker: 'main-marker',
})

const usePlainStore = defineStore('plain', {
  state: () => ({ value: 0 }),
})

// the `stores` option is exposed on the store instance through the plugin
// property, typed from the options passed to defineStore()
expectType<StoreGeneric>(useMainStore().stores.counter)
expectType<StoreGeneric>(useMainStore().stores.user)
useMainStore().stores.counter.increment()
useMainStore().stores.user.setName('other')

// a non-record option is readable with its augmented type
expectType<string | undefined>(useMainStore().marker)

// stores without a custom option still expose the plugin property
expectType<string | undefined>(usePlainStore().marker)

// `PiniaCustomOptionsProperties` is exported and usable standalone: with no
// custom options it resolves to the fallback shapes
expectType<PiniaCustomOptionsProperties<{}>>({ stores: {}, marker: undefined })
expectType<PiniaCustomOptionsProperties<{ marker: 'x' }>>({
  stores: {},
  marker: 'x',
})
