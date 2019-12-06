import { Store, StoreGetter, StateTree, StoreGetters } from './types'
import { CombinedStore } from './store'

export type CombinedState<
  S extends Record<
    string,
    (
      ...args: any[]
    ) => CombinedStore<
      string,
      StateTree,
      Record<string, StoreGetter<StateTree>>
    >
  >
> = {
  [k in keyof S]: S[k] extends (
    ...args: any[]
  ) => CombinedStore<
    string,
    infer State,
    Record<string, StoreGetter<infer State>>
  >
    ? State
    : never
}

export type CombinedGetters<
  S extends Record<
    string,
    (
      ...args: any[]
    ) => CombinedStore<
      string,
      StateTree,
      Record<string, StoreGetter<StateTree>>
    >
  >
> = {
  [k in keyof S]: S[k] extends (
    ...args: any[]
  ) => CombinedStore<string, infer State, infer Getters>
    ? StoreGetters<State, Getters>
    : never
}

export function pinia<
  S extends Record<
    string,
    (
      ...args: any[]
    ) => CombinedStore<
      string,
      StateTree,
      Record<string, StoreGetter<StateTree>>
    >
  >
>(stores: S): Store<'', CombinedState<S>> & CombinedGetters<S> {
  // TODO: implement if makes sense

  // @ts-ignore
  return {}
}
