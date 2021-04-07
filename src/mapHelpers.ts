import type Vue from 'vue'
import {
  GenericStore,
  GenericStoreDefinition,
  Method,
  StateTree,
  Store,
  StoreDefinition,
} from './types'

type StoreObject<S> = S extends StoreDefinition<
  infer Ids,
  infer State,
  infer Getters,
  infer Actions
>
  ? {
      [Id in `${Ids}Store`]: () => Store<Id, State, Getters, Actions>
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
>(vm: Vue, useStore: StoreDefinition<Id, S, G, A>): Store<Id, S, G, A> {
  const cache = vm._pStores || (vm._pStores = {})
  const id = useStore.$id
  return (cache[id] || (cache[id] = useStore(vm.$pinia))) as Store<Id, S, G, A>
}

/**
 * Allows using stores without the composition API (`setup()`) by generating an
 * object to be spread in the `computed` field of a component. it accepts a list
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
    reduced[useStore.$id + 'Store'] = function (this: Vue) {
      return getCachedStore(this, useStore)
    }
    return reduced
  }, {} as Spread<Stores>)
}

type MapStateReturn<S extends StateTree, G> = {
  [key in keyof S | keyof G]: () => Store<string, S, G, {}>[key]
}

type MapStateObjectReturn<
  S extends StateTree,
  G,
  T extends Record<string, keyof S | keyof G>
> = {
  [key in keyof T]: () => Store<string, S, G, {}>[T[key]]
}

export function mapState<Id extends string, S extends StateTree, G, A>(
  useStore: StoreDefinition<Id, S, G, A>,
  keys: Array<keyof S | keyof G>
): MapStateReturn<S, G>
export function mapState<
  Id extends string,
  S extends StateTree,
  G,
  A,
  KeyMapper extends Record<string, keyof S | keyof G>
>(
  useStore: StoreDefinition<Id, S, G, A>,
  keyMapper: KeyMapper
): MapStateObjectReturn<S, G, KeyMapper>
export function mapState<
  Id extends string,
  S extends StateTree,
  G,
  A,
  KeyMapper extends Record<string, keyof S | keyof G>
>(
  useStore: StoreDefinition<Id, S, G, A>,
  keysOrMapper: Array<keyof S | keyof G> | KeyMapper
): MapStateReturn<S, G> | MapStateObjectReturn<S, G, KeyMapper> {
  return Array.isArray(keysOrMapper)
    ? keysOrMapper.reduce((reduced, key) => {
        // @ts-ignore: sorry TS
        reduced[key] = function (this: Vue) {
          return getCachedStore(this, useStore)[key]
        }
        return reduced
      }, {} as MapStateReturn<S, G>)
    : Object.keys(keysOrMapper).reduce((reduced, key: keyof KeyMapper) => {
        reduced[key] = function (this: Vue) {
          return getCachedStore(this, useStore)[keysOrMapper[key]]
        }
        return reduced
      }, {} as MapStateObjectReturn<S, G, KeyMapper>)
}

/**
 * Alias for `mapState()`. You should use `mapState()` instead.
 */
export const mapGetters = mapState
