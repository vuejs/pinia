import { mapStores } from 'dist/pinia'
import { App } from 'vue'
import { expectType, createPinia, defineStore } from '.'

declare module '../dist/pinia' {
  export interface MapStoresCustomization {
    suffix: 'Store'
  }

  export interface PiniaCustomProperties<Id, S, G, A> {
    $actions: Array<keyof A>
  }

  export interface PiniaCustomStateProperties<S> {
    myState: number
  }

  export interface DefineStoreOptions<Id, S, G, A> {
    debounce?: {
      // Record<keyof A, number>
      [k in keyof A]?: number
    }
  }
}

const pinia = createPinia()

pinia.use((context) => {
  expectType<string>(context.options.id)
  expectType<string>(context.store.$id)
  expectType<App>(context.app)

  expectType<number>(context.store.$state.myState)
  expectType<number>(context.store.myState)

  return {
    $actions: Object.keys(context.options.actions || {}),
  }
})

const useStore = defineStore({
  id: 'main',
  state: () => ({}),
  actions: {
    one() {},
    two() {
      this.one()
      expectType<number>(this.$state.myState)
      expectType<number>(this.myState)
    },
    three() {
      this.two()
    },
  },

  debounce: {
    one: 200,
    two: 300,
    // three: 100
  },
})

type Procedure = (...args: any[]) => any

function debounce<F extends Procedure>(fn: F, time: number = 200) {
  return fn
}

expectType<{
  mainStore: () => ReturnType<typeof useStore>
}>(mapStores(useStore))

pinia.use(({ options, store }) => {
  if (options.debounce) {
    return Object.keys(options.debounce).reduce((debouncedActions, action) => {
      debouncedActions[action] = debounce(
        store[action],
        options.debounce![action as keyof typeof options['actions']]
      )
      return debouncedActions
    }, {} as Record<string, (...args: any[]) => any>)
  }
})
