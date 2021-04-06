import { GenericStoreDefinition, Store, StoreDefinition } from './types'

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
