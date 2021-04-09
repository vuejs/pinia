import { ComponentInstance } from '@vue/devtools-api'
import {
  GenericStore,
  GenericStoreDefinition,
  Method,
  StateTree,
  Store,
  StoreDefinition,
} from './types'

/**
 * Interface to allow customizing map helpers. Extend this interface with the
 * following properties:
 *
 * - `suffix`: string. Affects the suffix of `mapStores()`, defaults to `Store`.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface MapStoresCustomization {
  // cannot be added or it wouldn't be able to be extended
  // suffix?: string
}

type StoreObject<S> = S extends StoreDefinition<
  infer Ids,
  infer State,
  infer Getters,
  infer Actions
>
  ? {
      [Id in `${Ids}${'suffix' extends keyof MapStoresCustomization
        ? MapStoresCustomization['suffix']
        : 'Store'}`]: () => Store<
        Id extends `${infer RealId}${'suffix' extends keyof MapStoresCustomization
          ? MapStoresCustomization['suffix']
          : 'Store'}`
          ? RealId
          : string,
        State,
        Getters,
        Actions
      >
    }
  : {}

type Spread<A extends readonly any[]> = A extends [infer L, ...infer R]
  ? StoreObject<L> & Spread<R>
  : unknown

function getCachedStore<
  Id extends string = string,
  S extends StateTree = StateTree,
  G = Record<string, Method>,
  A = Record<string, Method>
>(
  vm: ComponentInstance,
  useStore: StoreDefinition<Id, S, G, A>
): Store<Id, S, G, A> {
  const cache = '_pStores' in vm ? vm._pStores : (vm._pStores = {})
  const id = useStore.$id
  return (cache[id] || (cache[id] = useStore(vm.$pinia))) as Store<Id, S, G, A>
}

export let mapStoreSuffix = 'Store'

/**
 * Changes the suffix added by `mapStores()`. Can be set to an empty string.
 * Defaults to `"Store"`. Make sure to extend the MapStoresCustomization
 * interface if you need are using TypeScript.
 *
 * @param suffix - new suffix
 */
export function setMapStoreSuffix(
  suffix: 'suffix' extends keyof MapStoresCustomization
    ? MapStoresCustomization['suffix']
    : string // could be 'Store' but that would be annoying for JS
): void {
  mapStoreSuffix = suffix
}

/**
 * Allows using stores without the composition API (`setup()`) by generating an
 * object to be spread in the `computed` field of a component. It accepts a list
 * of store definitions.
 *
 * @example
 * ```js
 * export default {
 *   computed: {
 *     // other computed properties
 *     ...mapStores(useUserStore, useCartStore)
 *   },
 *
 *   created() {
 *     this.userStore // store with id "user"
 *     this.cartStore // store with id "cart"
 *   }
 * }
 * ```
 *
 * @param stores - list of stores to map to an object
 */
export function mapStores<Stores extends GenericStoreDefinition[]>(
  ...stores: [...Stores]
): Spread<Stores> {
  return stores.reduce((reduced, useStore) => {
    // @ts-ignore: $id is added by defineStore
    reduced[useStore.$id + mapStoreSuffix] = function (this: Vue) {
      return getCachedStore(this, useStore)
    }
    return reduced
  }, {} as Spread<Stores>)
}

type MapStateReturn<S extends StateTree, G> = {
  [key in keyof S | keyof G]: () => Store<string, S, G, {}>[key]
}

type MapStateObjectReturn<
  Id extends string,
  S extends StateTree,
  G,
  A,
  T extends Record<
    string,
    keyof S | keyof G | ((store: Store<Id, S, G, A>) => any)
  >
> = {
  [key in keyof T]: () => T[key] extends (store: GenericStore) => infer R
    ? R
    : T[key] extends keyof S | keyof G
    ? Store<Id, S, G, A>[T[key]]
    : never
}

/**
 * Allows using state and getters from one store without using the composition
 * API (`setup()`) by generating an object to be spread in the `computed` field
 * of a component. The values of the object are the state properties/getters
 * while the keys are the names of the resulting computed properties.
 * Optionally, you can also pass a custom function that will receive the store
 * as its first argument. Note that while it has access to the component
 * instance via `this`, it won't be typed.
 *
 * @example
 * ```js
 * export default {
 *   computed: {
 *     // other computed properties
 *     // useCounterStore has a state property named `count` and a getter `double`
 *     ...mapState(useCounterStore, {
 *       n: 'count',
 *       triple: store => store.n * 3,
 *       // note we can't use an arrow function if we want to use `this`
 *       custom(store) {
 *         return this.someComponentValue + store.n
 *       },
 *       doubleN: 'double'
 *     })
 *   },
 *
 *   created() {
 *     this.n // 2
 *     this.doubleN // 4
 *   }
 * }
 * ```
 *
 * @param useStore - store to map from
 * @param keyMapper - object of state properties or getters
 */
export function mapState<
  Id extends string,
  S extends StateTree,
  G,
  A,
  KeyMapper extends Record<
    string,
    keyof S | keyof G | ((store: Store<Id, S, G, A>) => any)
  >
>(
  useStore: StoreDefinition<Id, S, G, A>,
  keyMapper: KeyMapper
): MapStateObjectReturn<Id, S, G, A, KeyMapper>
/**
 * Allows using state and getters from one store without using the composition
 * API (`setup()`) by generating an object to be spread in the `computed` field
 * of a component.
 *
 * @example
 * ```js
 * export default {
 *   computed: {
 *     // other computed properties
 *     ...mapState(useCounterStore, ['count', 'double'])
 *   },
 *
 *   created() {
 *     this.count // 2
 *     this.double // 4
 *   }
 * }
 * ```
 *
 * @param useStore - store to map from
 * @param keys - array of state properties or getters
 */
export function mapState<Id extends string, S extends StateTree, G, A>(
  useStore: StoreDefinition<Id, S, G, A>,
  keys: Array<keyof S | keyof G>
): MapStateReturn<S, G>
/**
 * Allows using state and getters from one store without using the composition
 * API (`setup()`) by generating an object to be spread in the `computed` field
 * of a component.
 *
 * @param useStore - store to map from
 * @param keysOrMapper - array or object
 */
export function mapState<
  Id extends string,
  S extends StateTree,
  G,
  A,
  KeyMapper extends Record<
    string,
    keyof S | keyof G | ((store: Store<Id, S, G, A>) => any)
  >
>(
  useStore: StoreDefinition<Id, S, G, A>,
  keysOrMapper: Array<keyof S | keyof G> | KeyMapper
): MapStateReturn<S, G> | MapStateObjectReturn<Id, S, G, A, KeyMapper> {
  return Array.isArray(keysOrMapper)
    ? keysOrMapper.reduce((reduced, key) => {
        reduced[key] = function (this: ComponentInstance) {
          return getCachedStore(this, useStore)[key]
        } as () => any
        return reduced
      }, {} as MapStateReturn<S, G>)
    : Object.keys(keysOrMapper).reduce((reduced, key: keyof KeyMapper) => {
        reduced[key] = function (this: ComponentInstance) {
          const store = getCachedStore(this, useStore)
          const storeKey = keysOrMapper[key]
          // for some reason TS is unable to infer the type of storeKey to be a
          // function
          return typeof storeKey === 'function'
            ? (storeKey as (store: Store<Id, S, G, A>) => any).call(this, store)
            : store[storeKey as keyof S | keyof G]
        }
        return reduced
      }, {} as MapStateObjectReturn<Id, S, G, A, KeyMapper>)
}

/**
 * Alias for `mapState()`. You should use `mapState()` instead.
 * @deprecated use `mapState()` instead.
 */
export const mapGetters = mapState

type MapActionsReturn<A> = {
  [key in keyof A]: Store<string, StateTree, {}, A>[key]
}

type MapActionsObjectReturn<A, T extends Record<string, keyof A>> = {
  [key in keyof T]: Store<string, StateTree, {}, A>[T[key]]
}

/**
 * Allows directly using actions from your store without using the composition
 * API (`setup()`) by generating an object to be spread in the `methods` field
 * of a component. The values of the object are the actions while the keys are
 * the names of the resulting methods.
 *
 * @example
 * ```js
 * export default {
 *   methods: {
 *     // other methods properties
 *     // useCounterStore has two actions named `increment` and `setCount`
 *     ...mapActions(useCounterStore, { moar: 'increment', setIt: 'setCount' })
 *   },
 *
 *   created() {
 *     this.moar()
 *     this.setIt(2)
 *   }
 * }
 * ```
 *
 * @param useStore - store to map from
 * @param keyMapper - object to define new names for the actions
 */
export function mapActions<
  Id extends string,
  S extends StateTree,
  G,
  A,
  KeyMapper extends Record<string, keyof A>
>(
  useStore: StoreDefinition<Id, S, G, A>,
  keyMapper: KeyMapper
): MapActionsObjectReturn<A, KeyMapper>
/**
 * Allows directly using actions from your store without using the composition
 * API (`setup()`) by generating an object to be spread in the `methods` field
 * of a component.
 *
 * @example
 * ```js
 * export default {
 *   methods: {
 *     // other methods properties
 *     ...mapActions(useCounterStore, ['increment', 'setCount'])
 *   },
 *
 *   created() {
 *     this.increment()
 *     this.setCount(2) // pass arguments as usual
 *   }
 * }
 * ```
 *
 * @param useStore - store to map from
 * @param keys - array of action names to map
 */
export function mapActions<Id extends string, S extends StateTree, G, A>(
  useStore: StoreDefinition<Id, S, G, A>,
  keys: Array<keyof A>
): MapActionsReturn<A>
/**
 * Allows directly using actions from your store without using the composition
 * API (`setup()`) by generating an object to be spread in the `methods` field
 * of a component.
 *
 * @param useStore - store to map from
 * @param keysOrMapper - array or object
 */
export function mapActions<
  Id extends string,
  S extends StateTree,
  G,
  A,
  KeyMapper extends Record<string, keyof A>
>(
  useStore: StoreDefinition<Id, S, G, A>,
  keysOrMapper: Array<keyof A> | KeyMapper
): MapActionsReturn<A> | MapActionsObjectReturn<A, KeyMapper> {
  return Array.isArray(keysOrMapper)
    ? keysOrMapper.reduce((reduced, key) => {
        reduced[key] = function (this: ComponentInstance, ...args: any[]) {
          return (getCachedStore(this, useStore)[key] as Method)(...args)
        } as Store<string, StateTree, {}, A>[keyof A]
        return reduced
      }, {} as MapActionsReturn<A>)
    : Object.keys(keysOrMapper).reduce((reduced, key: keyof KeyMapper) => {
        reduced[key] = function (this: ComponentInstance, ...args: any[]) {
          return getCachedStore(this, useStore)[keysOrMapper[key]](...args)
        } as Store<string, StateTree, {}, A>[keyof KeyMapper[]]
        return reduced
      }, {} as MapActionsObjectReturn<A, KeyMapper>)
}

type MapWritableStateReturn<S extends StateTree> = {
  [key in keyof S]: {
    get: () => Store<string, S, {}, {}>[key]
    set: (value: Store<string, S, {}, {}>[key]) => any
  }
}

type MapWritableStateObjectReturn<
  S extends StateTree,
  T extends Record<string, keyof S>
> = {
  [key in keyof T]: {
    get: () => Store<string, S, {}, {}>[T[key]]
    set: (value: Store<string, S, {}, {}>[T[key]]) => any
  }
}

/**
 * Same as `mapState()` but creates computed setters as well so the state can be
 * modified. Differently from `mapState()`, only `state` properties can be
 * added.
 *
 * @param useStore - store to map from
 * @param keyMapper - object of state properties
 */
export function mapWritableState<
  Id extends string,
  S extends StateTree,
  G,
  A,
  KeyMapper extends Record<string, keyof S>
>(
  useStore: StoreDefinition<Id, S, G, A>,
  keyMapper: KeyMapper
): MapWritableStateObjectReturn<S, KeyMapper>
/**
 * Allows using state and getters from one store without using the composition
 * API (`setup()`) by generating an object to be spread in the `computed` field
 * of a component.
 *
 * @param useStore - store to map from
 * @param keys - array of state properties
 */
export function mapWritableState<Id extends string, S extends StateTree, G, A>(
  useStore: StoreDefinition<Id, S, G, A>,
  keys: Array<keyof S>
): MapWritableStateReturn<S>
/**
 * Allows using state and getters from one store without using the composition
 * API (`setup()`) by generating an object to be spread in the `computed` field
 * of a component.
 *
 * @param useStore - store to map from
 * @param keysOrMapper - array or object
 */
export function mapWritableState<
  Id extends string,
  S extends StateTree,
  G,
  A,
  KeyMapper extends Record<string, keyof S>
>(
  useStore: StoreDefinition<Id, S, G, A>,
  keysOrMapper: Array<keyof S> | KeyMapper
): MapWritableStateReturn<S> | MapWritableStateObjectReturn<S, KeyMapper> {
  return Array.isArray(keysOrMapper)
    ? keysOrMapper.reduce((reduced, key) => {
        reduced[key] = {
          get(this: ComponentInstance) {
            return getCachedStore(this, useStore)[key]
          },
          set(value) {
            // it's easier to type it here as any
            return (getCachedStore(this, useStore)[key] = value as any)
          },
        }
        return reduced
      }, {} as MapWritableStateReturn<S>)
    : Object.keys(keysOrMapper).reduce((reduced, key: keyof KeyMapper) => {
        // @ts-ignore
        reduced[key] = {
          get(this: ComponentInstance) {
            return getCachedStore(this, useStore)[keysOrMapper[key]]
          },
          set(value) {
            // it's easier to type it here as any
            return (getCachedStore(this, useStore)[
              keysOrMapper[key]
            ] = value as any)
          },
        }
        return reduced
      }, {} as MapWritableStateObjectReturn<S, KeyMapper>)
}
