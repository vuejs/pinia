import {
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

/**
 * Allows using stores without the composition API (`setup()`) by generating an object to be spread in the `computed` field of a component.
 *
 * @example
 * ```js
 * export default {
 *   computed: {
 *     // other computed properties
 *     ...mapStores(useUserStore, useCartStore)
 *   },

 *   created() {
 *     this.userStore // store with id "user"
 *     this.cartStore // store with id "cart"
 *   }
 * }
 * ```
 *
 * @param stores - list of stores to map to an object
 */
export function mapStores<Stores extends unknown[]>(
  ...stores: [...Stores]
): Spread<Stores> {
  return stores.reduce((reduced, useStore) => {
    // @ts-ignore: $id is added by defineStore
    reduced[useStore.$id + 'Store'] = function () {
      return (useStore as GenericStoreDefinition)((this as any).$pinia)
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
        // @ts-ignore: too complicated for TS
        reduced[key] = function () {
          return useStore((this as any).$pinia)[key]
        }
        return reduced
      }, {} as MapStateReturn<S, G>)
    : Object.keys(keysOrMapper).reduce((reduced, key: keyof KeyMapper) => {
        reduced[key] = function () {
          return useStore((this as any).$pinia)[keysOrMapper[key]]
        }
        return reduced
      }, {} as MapStateObjectReturn<S, G, KeyMapper>)
}

/**
 * Alias for `mapState()`. You should use `mapState()` instead.
 */
export const mapGetters = mapState
