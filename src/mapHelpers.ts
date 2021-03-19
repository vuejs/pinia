import { GenericStoreDefinition, Store, StoreDefinition } from './types'

type StoreObject<S> = S extends StoreDefinition<
  infer Ids,
  infer State,
  infer Getters,
  infer Actions
>
  ? {
      [Id in Ids]: () => Store<Ids, State, Getters, Actions>
    }
  : {}

type Spread<A extends readonly any[]> = A extends [infer L, ...infer R]
  ? StoreObject<L> & Spread<R>
  : unknown

export function mapStores<Stores extends unknown[]>(
  ...stores: [...Stores]
): Spread<Stores> {
  return stores.reduce((reduced, useStore) => {
    // @ts-ignore
    reduced[useStore.$id] = function () {
      return (useStore as GenericStoreDefinition)((this as any).$pinia)
    }
    return reduced
  }, {} as Spread<Stores>)
}
