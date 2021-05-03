import { Pinia } from './rootStore'

/**
 * Generic state of a Store
 */
export type StateTree = Record<string | number | symbol, any>

/**
 * Object descriptor for Object.defineProperty
 */
export interface StateDescriptor<S extends StateTree> {
  get(): S
  set(newValue: S): void
}

export function isPlainObject(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  o: any
): o is StateTree {
  return (
    o &&
    typeof o === 'object' &&
    Object.prototype.toString.call(o) === '[object Object]' &&
    typeof o.toJSON !== 'function'
  )
}

export type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> }
// type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> }

export type SubscriptionCallback<S> = (
  mutation: { storeName: string; type: string; payload: DeepPartial<S> },
  state: S
) => void

/**
 * Base store with state and functions
 * @internal
 */
export interface StoreWithState<Id extends string, S extends StateTree> {
  /**
   * Unique identifier of the store
   */
  $id: Id

  /**
   * State of the Store. Setting it will replace the whole state.
   */
  $state: S

  /**
   * Private property defining the pinia the store is attached to.
   *
   * @internal
   */
  _p: Pinia

  /**
   * Used by devtools plugin to retrieve getters. Removed in production
   *
   * @internal
   */
  _getters?: string[]

  /**
   * Applies a state patch to current state. Allows passing nested values
   *
   * @param partialState - patch to apply to the state
   */
  $patch(partialState: DeepPartial<S>): void

  /**
   * Group multiple changes into one function. Useful when mutating objects like
   * Sets or arrays and applying an object patch isn't practical, e.g. appending
   * to an array.
   *
   * @param stateMutator - function that mutates `state`, cannot be async
   */
  $patch<F extends (state: S) => void>(
    // this prevents the user from using `async` which isn't allowed
    stateMutator: ReturnType<F> extends Promise<any> ? never : F
  ): void

  /**
   * Resets the store to its initial state by building a new state object.
   */
  $reset(): void

  /**
   * Setups a callback to be called whenever the state changes.
   *
   * @param callback - callback passed to the watcher
   * @returns function that removes the watcher
   */
  $subscribe(callback: SubscriptionCallback<S>): () => void
}

/**
 * Generic type for a function that can infer arguments and return type
 *
 * @internal
 */
export type _Method = (...args: any[]) => any

// export type StoreAction<P extends any[], R> = (...args: P) => R
// export interface StoreAction<P, R> {
//   (...args: P[]): R
// }

// in this type we forget about this because otherwise the type is recursive
/**
 * Store augmented for actions
 *
 * @internal
 */
export type StoreWithActions<A> = {
  [k in keyof A]: A[k] extends (...args: infer P) => infer R
    ? (...args: P) => R
    : never
}

/**
 * Store augmented with getters
 *
 * @internal
 */
export type StoreWithGetters<G> = {
  readonly [k in keyof G]: G[k] extends (...args: any[]) => infer R ? R : never
}

// // in this type we forget about this because otherwise the type is recursive
// export type StoreWithThisGetters<G> = {
//   // TODO: does the infer this as the second argument work?
//   [k in keyof G]: G[k] extends (this: infer This, store?: any) => infer R
//     ? (this: This, store?: This) => R
//     : never
// }

/**
 * Store type to build a store
 */
export type Store<
  Id extends string,
  S extends StateTree,
  G extends GettersTree<S>,
  // has the actions without the context (this) for typings
  A
> = StoreWithState<Id, S> &
  S &
  StoreWithGetters<G> &
  StoreWithActions<A> &
  PiniaCustomProperties<Id, S, G, A>

// TODO: check if it's possible to add = to StoreDefinition and Store and cleanup GenericStore and the other one

/**
 * Return type of `defineStore()`. Function that allows instantiating a store.
 */
export interface StoreDefinition<
  Id extends string,
  S extends StateTree,
  G extends GettersTree<S>,
  A /* extends Record<string, StoreAction> */
> {
  /**
   * Returns a store, creates it if necessary.
   *
   * @param pinia - Pinia instance to retrieve the store
   */
  (pinia?: Pinia | null | undefined): Store<Id, S, G, A>

  /**
   * Id of the store. Used by map helpers.
   */
  $id: Id
}

/**
 * Generic version of Store.
 */
export type GenericStore = Store<
  string,
  StateTree,
  GettersTree<StateTree>,
  Record<string, _Method>
>

/**
 * Generic version of `StoreDefinition`.
 */
export type GenericStoreDefinition = StoreDefinition<
  string,
  StateTree,
  GettersTree<StateTree>,
  Record<string, _Method>
>

/**
 * Properties that are added to every store by `pinia.use()`
 */
export interface PiniaCustomProperties<
  Id extends string = string,
  S extends StateTree = StateTree,
  G extends GettersTree<S> = GettersTree<S>,
  A = Record<string, _Method>
> {}

/**
 * Type of an object of Getters that infers the argument
 *
 * @internal
 */
export type GettersTree<S extends StateTree> = Record<
  string,
  ((state: S) => any) | (() => any)
>

/**
 * Options parameter of `defineStore()`. Can be extended to augment stores with
 * the plugin API.
 */
export interface DefineStoreOptions<
  Id extends string,
  S extends StateTree,
  G extends GettersTree<S>,
  A /* extends Record<string, StoreAction> */
> {
  /**
   * Unique string key to identify the store across the application.
   */
  id: Id
  /**
   * Function to create a fresh state.
   */
  state?: () => S
  /**
   * Optional object of getters.
   */
  getters?: G & ThisType<S & StoreWithGetters<G> & PiniaCustomProperties>
  /**
   * Optional object of actions.
   */
  actions?: A &
    ThisType<
      A &
        S &
        StoreWithState<Id, S> &
        StoreWithGetters<G> &
        PiniaCustomProperties
    >
}
