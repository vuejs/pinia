import {
  expectType,
  createPinia,
  defineStore,
  mapStores,
  ActionsTree,
} from './'
import { App, ref, Ref } from 'vue'

declare module '../dist/pinia' {
  export interface MapStoresCustomization {
    suffix: 'Store'
  }

  export interface PiniaCustomProperties<Id, S, G, A> {
    $actions: Array<keyof A>
    myState: number

    set canBeARef(value: number | Ref<number>)
    get canBeARef(): number
  }

  export interface PiniaCustomStateProperties<S> {
    myState: number
    stateOnly: number
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
  expectType<ActionsTree>(context.options.actions)
  expectType<string>(context.store.$id)
  expectType<App>(context.app)

  expectType<number>(context.store.$state.myState)
  expectType<number>(context.store.myState)

  expectType<number>(context.store.canBeARef)
  // it can be set to both a ref and a number
  context.store.canBeARef = ref(2)
  context.store.canBeARef = 3
  // @ts-expect-error
  context.store.canBeARef = 'eou'

  return {
    $actions: Object.keys(context.options.actions || {}),
  }
})

const useStore = defineStore({
  id: 'main',
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

  getters: {
    two(state): boolean {
      expectType<number>(this.myState)
      expectType<number>(state.myState)
      expectType<number>(state.stateOnly)

      // @ts-expect-error
      this.stateOnly

      return true
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
