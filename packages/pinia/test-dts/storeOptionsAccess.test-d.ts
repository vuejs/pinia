import {
  expectType,
  defineStore,
  StoreDefinition,
  createPinia,
  StoreOptionsAccess,
} from './'

// Test the new store options access functionality
declare module '../dist/pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    stores?: Record<string, StoreDefinition>
    customString?: string
    customNumber?: number
    customObject?: { key: string; value: number }
  }

  export interface PiniaCustomProperties<Id, S, G, A> {
    readonly stores: StoreOptionsAccess<this, 'stores'>
    readonly customString: StoreOptionsAccess<this, 'customString'>
    readonly customNumber: StoreOptionsAccess<this, 'customNumber'>
    readonly customObject: StoreOptionsAccess<this, 'customObject'>
  }
}

// Create test stores
const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  actions: {
    increment() {
      this.count++
    },
  },
})

const useUserStore = defineStore('user', {
  state: () => ({ name: 'John' }),
})

// Test store with custom options
const useMainStore = defineStore('main', {
  state: () => ({ value: 0 }),
  actions: {
    setValue(val: number) {
      this.value = val
    },
  },
  stores: {
    counter: useCounterStore,
    user: useUserStore,
  },
  customString: 'test',
  customNumber: 42,
  customObject: { key: 'test', value: 123 },
})

const pinia = createPinia()

// Test plugin context types
pinia.use((context) => {
  // Test that options are properly typed
  expectType<Record<string, StoreDefinition> | undefined>(
    context.options.stores
  )
  expectType<string | undefined>(context.options.customString)
  expectType<number | undefined>(context.options.customNumber)
  expectType<{ key: string; value: number } | undefined>(
    context.options.customObject
  )

  return {
    get stores() {
      const storesOption = context.options.stores
      if (!storesOption) return {}
      return Object.freeze(
        Object.entries(storesOption).reduce<Record<string, any>>(
          (acc, [name, definition]) => {
            acc[name] = definition()
            return acc
          },
          {}
        )
      )
    },
    get customString() {
      return context.options.customString
    },
    get customNumber() {
      return context.options.customNumber
    },
    get customObject() {
      return context.options.customObject
    },
  }
})

const store = useMainStore()

// Test that store properties are properly typed
expectType<Record<string, any>>(store.stores)
expectType<string | undefined>(store.customString)
expectType<number | undefined>(store.customNumber)
expectType<{ key: string; value: number } | undefined>(store.customObject)

// Test accessing nested store properties
if (store.stores.counter) {
  expectType<any>(store.stores.counter)
}

if (store.stores.user) {
  expectType<any>(store.stores.user)
}

// Test setup store with custom options
const useSetupStore = defineStore(
  'setup',
  () => {
    return { count: 0 }
  },
  {
    customString: 'setup-test',
    customNumber: 100,
  }
)

const setupStore = useSetupStore()
expectType<string | undefined>(setupStore.customString)
expectType<number | undefined>(setupStore.customNumber)

// Test store without custom options
const useSimpleStore = defineStore('simple', {
  state: () => ({ value: 1 }),
})

const simpleStore = useSimpleStore()
expectType<Record<string, any>>(simpleStore.stores)
expectType<string | undefined>(simpleStore.customString)
expectType<number | undefined>(simpleStore.customNumber)
expectType<{ key: string; value: number } | undefined>(simpleStore.customObject)
