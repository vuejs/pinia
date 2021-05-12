import { DebuggerEvent, UnwrapRef } from 'vue'
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

/**
 * Possible types for SubscriptionCallback
 */
export enum MutationType {
  /**
   * Direct mutation of the state:
   *
   * - `store.name = 'new name'`
   * - `store.$state.name = 'new name'`
   * - `store.list.push('new item')`
   */
  direct = 'direct',

  /**
   * Mutated the state with `$patch` and an object
   *
   * - `store.$patch({ name: 'newName' })`
   */
  patchObject = 'patch object',

  /**
   * Mutated the state with `$patch` and a function
   *
   * - `store.$patch(state => state.name = 'newName')`
   */
  patchFunction = 'patch function',

  // maybe reset? for $state = {} and $reset
}

/**
 * Context object passed to callbacks of `store.$onAction(context => {})`
 */
export interface StoreOnActionListenerContext {
  /**
   * Sets up a hook once the action is finished. It receives the return value of
   * the action, if it's a Promise, it will be unwrapped.
   */
  after: (callback: (resolvedReturn: unknown) => void) => void

  /**
   * Sets up a hook if the action fails.
   */
  onError: (callback: (error: unknown) => void) => void

  // TODO: pass generics
  /**
   * Store that is invoking the action
   */
  store: GenericStore

  /**
   * Name of the action
   */
  name: string

  /**
   * Parameters passed to the action
   */
  args: any[]
}

/**
 * Argument of `store.$onAction()`
 */
export type StoreOnActionListener = (
  context: StoreOnActionListenerContext
) => void

/**
 * Callback of a subscription
 */
export type SubscriptionCallback<S> = (
  // TODO: make type an enumeration
  // TODO: payload should be optional
  mutation: {
    storeName: string
    type: MutationType

    /**
     * DEV ONLY. Array for patch calls and single values for direct edits
     */
    events?: DebuggerEvent[] | DebuggerEvent

    payload: DeepPartial<UnwrapRef<S>>
  },
  state: UnwrapRef<S>
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
  $state: UnwrapRef<S>

  /**
   * Private property defining the pinia the store is attached to.
   *
   * @internal
   */
  _p: Pinia

  /**
   * Used by devtools plugin to retrieve getters. Removed in production.
   *
   * @internal
   */
  _getters?: string[]

  /**
   * Applies a state patch to current state. Allows passing nested values
   *
   * @param partialState - patch to apply to the state
   */
  $patch(partialState: DeepPartial<UnwrapRef<S>>): void

  /**
   * Group multiple changes into one function. Useful when mutating objects like
   * Sets or arrays and applying an object patch isn't practical, e.g. appending
   * to an array.
   *
   * @param stateMutator - function that mutates `state`, cannot be async
   */
  $patch<F extends (state: UnwrapRef<S>) => void>(
    // this prevents the user from using `async` which isn't allowed
    stateMutator: ReturnType<F> extends Promise<any> ? never : F
  ): void

  /**
   * Resets the store to its initial state by building a new state object.
   */
  $reset(): void

  /**
   * Setups a callback to be called whenever the state changes. It also returns
   * a function to remove the callback. Note than when calling
   * `store.$subscribe()` inside of a component, it will be automatically
   * cleanup up when the component gets unmounted.
   *
   * @param callback - callback passed to the watcher
   * @param onTrigger - DEV ONLY watcher debugging
   * (https://v3.vuejs.org/guide/reactivity-computed-watchers.html#watcher-debugging)
   * @returns function that removes the watcher
   */
  $subscribe(
    callback: SubscriptionCallback<S>,
    onTrigger?: (event: DebuggerEvent) => void
  ): () => void

  /**
   * Array of registered action subscriptions.
   *
   * @internal
   */
  _as: StoreOnActionListener[]

  /**
   * @alpha Please send feedback at https://github.com/posva/pinia/issues/240
   * Setups a callback to be called every time an action is about to get
   * invoked. The callback receives an object with all the relevant information
   * of the invoked action:
   * - `store`: the store it is invoked on
   * - `name`: The name of the action
   * - `args`: The parameters passed to the action
   *
   * On top of these, it receives two functions that allow setting up a callback
   * once the action finishes or when it fails.
   *
   * It also returns a function to remove the callback. Note than when calling
   * `store.$onAction()` inside of a component, it will be automatically cleanup
   * up when the component gets unmounted.
   *
   * @example
   *
   *```js
   *store.$onAction(({ after, onError }) => {
   *  // Here you could share variables between all of the hooks as well as
   *  // setting up watchers and clean them up
   *  after(() => {
   *    // can be used to cleanup side effects
   *  })
   *  onError((error) => {
   *    // can be used to pass up errors
   *  })
   *})
   *```
   *
   * @param callback - callback called before every action
   * @returns function that removes the watcher
   */
  $onAction(callback: StoreOnActionListener): () => void
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
  UnwrapRef<S> &
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
  ((state: UnwrapRef<S>) => any) | (() => any)
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
  getters?: G &
    ThisType<UnwrapRef<S> & StoreWithGetters<G> & PiniaCustomProperties>
  /**
   * Optional object of actions.
   */
  actions?: A &
    ThisType<
      A &
        UnwrapRef<S> &
        StoreWithState<Id, S> &
        StoreWithGetters<G> &
        PiniaCustomProperties
    >
}
