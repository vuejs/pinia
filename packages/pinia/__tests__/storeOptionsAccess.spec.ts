import { describe, it, expect } from 'vitest'
import { createPinia, defineStore, StoreDefinition } from '../src'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'

// Extend the types to test the new functionality
declare module '../src' {
  export interface DefineStoreOptionsBase<S, Store> {
    stores?: Record<string, StoreDefinition>
    customOption?: string
    debounce?: Record<string, number>
  }

  export interface PiniaCustomProperties<Id, S, G, A> {
    readonly stores: any
    readonly customOption: any
    readonly debounce: any
  }
}

describe('Store Options Access', () => {
  it('allows plugins to access custom store options with proper typing', async () => {
    // Create some stores to be used in the stores option
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
      actions: {
        setName(name: string) {
          this.name = name
        },
      },
    })

    // Create a store with custom options
    const useMainStore = defineStore('main', {
      state: () => ({ value: 0 }),
      actions: {
        setValue(val: number) {
          this.value = val
        },
      },
      // Custom options that should be accessible in plugins
      stores: {
        counter: useCounterStore,
        user: useUserStore,
      },
      customOption: 'test-value',
      debounce: {
        setValue: 300,
      },
    })

    const pinia = createPinia()
    mount({ template: 'none' }, { global: { plugins: [pinia] } })

    let mainStorePluginContext: any = null

    // Plugin that accesses the custom options
    pinia.use((context) => {
      // Only capture the context for the main store (which has custom options)
      if (context.store.$id === 'main') {
        mainStorePluginContext = context
      }

      // Access the stores option from context.options
      const storesOption = context.options.stores
      const customOptionValue = context.options.customOption
      const debounceOption = context.options.debounce

      return {
        get stores() {
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
        get customOption() {
          return customOptionValue
        },
        get debounce() {
          return debounceOption
        },
      }
    })

    const store = useMainStore()

    // Verify that the plugin context has access to the options for the main store
    expect(mainStorePluginContext).toBeTruthy()
    expect(mainStorePluginContext.options.stores).toBeDefined()
    expect(mainStorePluginContext.options.stores.counter).toBe(useCounterStore)
    expect(mainStorePluginContext.options.stores.user).toBe(useUserStore)
    expect(mainStorePluginContext.options.customOption).toBe('test-value')
    expect(mainStorePluginContext.options.debounce).toEqual({ setValue: 300 })

    // Verify that the store has access to the custom properties
    expect(store.stores).toBeDefined()
    expect(store.stores.counter).toBeDefined()
    expect(store.stores.user).toBeDefined()
    expect(store.customOption).toBe('test-value')
    expect(store.debounce).toEqual({ setValue: 300 })

    // Verify that the stores are properly instantiated
    expect(store.stores.counter.count).toBe(0)
    expect(store.stores.user.name).toBe('John')

    // Test that the stores work correctly
    store.stores.counter.increment()
    expect(store.stores.counter.count).toBe(1)

    store.stores.user.setName('Jane')
    expect(store.stores.user.name).toBe('Jane')
  })

  it('works with setup stores', async () => {
    const useHelperStore = defineStore('helper', () => {
      const value = ref(42)
      return { value }
    })

    const useSetupStore = defineStore(
      'setup',
      () => {
        const count = ref(0)
        const increment = () => count.value++
        return { count, increment }
      },
      {
        stores: {
          helper: useHelperStore,
        },
        customOption: 'setup-test',
      }
    )

    const pinia = createPinia()
    mount({ template: 'none' }, { global: { plugins: [pinia] } })

    let setupStorePluginContext: any = null

    pinia.use((context) => {
      // Only capture the context for the setup store (which has custom options)
      if (context.store.$id === 'setup') {
        setupStorePluginContext = context
      }

      const storesOption = context.options.stores
      const customOptionValue = context.options.customOption

      return {
        get stores() {
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
        get customOption() {
          return customOptionValue
        },
      }
    })

    const store = useSetupStore()

    // Verify plugin context
    expect(setupStorePluginContext.options.stores).toBeDefined()
    expect(setupStorePluginContext.options.stores.helper).toBe(useHelperStore)
    expect(setupStorePluginContext.options.customOption).toBe('setup-test')

    // Verify store properties
    expect(store.stores).toBeDefined()
    expect(store.stores.helper).toBeDefined()
    expect(store.stores.helper.value).toBe(42)
    expect(store.customOption).toBe('setup-test')
  })

  it('handles stores without custom options', async () => {
    const useSimpleStore = defineStore('simple', {
      state: () => ({ value: 1 }),
    })

    const pinia = createPinia()
    mount({ template: 'none' }, { global: { plugins: [pinia] } })

    pinia.use((context) => {
      const storesOption = context.options.stores
      const customOptionValue = context.options.customOption

      return {
        get stores() {
          return storesOption
            ? Object.freeze(
                Object.entries(storesOption).reduce<Record<string, any>>(
                  (acc, [name, definition]) => {
                    acc[name] = definition()
                    return acc
                  },
                  {}
                )
              )
            : {}
        },
        get customOption() {
          return customOptionValue
        },
      }
    })

    const store = useSimpleStore()

    // Should have empty stores and undefined customOption
    expect(store.stores).toEqual({})
    expect(store.customOption).toBeUndefined()
  })

  it('maintains backward compatibility', async () => {
    const useCompatStore = defineStore('compat', {
      state: () => ({ count: 0 }),
      actions: {
        increment() {
          this.count++
        },
      },
    })

    const pinia = createPinia()
    mount({ template: 'none' }, { global: { plugins: [pinia] } })

    // Plugin that doesn't use the new functionality
    pinia.use(({ store }) => {
      return {
        pluginProperty: 'test',
      } as any
    })

    const store = useCompatStore()

    // Should work as before
    expect((store as any).pluginProperty).toBe('test')
    expect(store.count).toBe(0)
    store.increment()
    expect(store.count).toBe(1)
  })
})
