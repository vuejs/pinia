import { Store, StoreGetter, StateTree, StoreGetters } from './types'
import { CombinedStore, buildStore } from './store'

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

function buildCombinedStore<
  S extends Record<
    string,
    CombinedStore<string, StateTree, Record<string, StoreGetter<StateTree>>>
  >
>(stores: S): Store<'', CombinedState<S>> & CombinedGetters<S> {
  const state = {}
  for (const name in stores) {
    const store = stores[name]
    Object.defineProperty(state, name, {
      get: () => store.state,
    })
  }

  // @ts-ignore
  return {
    state,
  }
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
  const state = {}
  for (const name in stores) {
    const store = stores[name]()
    Object.defineProperty(state, name, {
      get: () => store.state,
    })
  }

  // @ts-ignore
  return {
    state,
  }
}
