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
 * Base type for the context passed to a subscription callback.
 *
 * @internal
 */
export interface _SubscriptionCallbackMutationBase {
  /**
   * Type of the mutation.
   */
  type: MutationType

  /**
   * `id` of the store doing the mutation.
   */
  storeId: string
}

/**
 * Context passed to a subscription callback when directly mutating the state of
 * a store with `store.someState = newValue` or `store.$state.someState =
 * newValue`.
 */
export interface SubscriptionCallbackMutationDirect
  extends _SubscriptionCallbackMutationBase {
  type: MutationType.direct

  /**
   * DEV ONLY. Different mutation calls.
   */
  events: DebuggerEvent
}

/**
 * Context passed to a subscription callback when `store.$patch()` is called
 * with an object.
 */
export interface SubscriptionCallbackMutationPatchObject<S>
  extends _SubscriptionCallbackMutationBase {
  type: MutationType.patchObject

  /**
   * DEV ONLY. Array for patch calls.
   */
  events: DebuggerEvent[]

  /**
   * Object passed to `store.$patch()`.
   */
  payload: DeepPartial<S>
}

/**
 * Context passed to a subscription callback when `store.$patch()` is called
 * with a function.
 */
export interface SubscriptionCallbackMutationPatchFunction
  extends _SubscriptionCallbackMutationBase {
  type: MutationType.patchFunction

  /**
   * DEV ONLY. Array of all the mutations done inside of the callback.
   */
  events: DebuggerEvent[]

  /**
   * Object passed to `store.$patch()`.
   */
  // payload: DeepPartial<UnwrapRef<S>>
}

/**
 * Context object passed to a subscription callback.
 */
export type SubscriptionCallbackMutation<S> =
  | SubscriptionCallbackMutationDirect
  | SubscriptionCallbackMutationPatchObject<S>
  | SubscriptionCallbackMutationPatchFunction

export type UnwrapPromise<T> = T extends Promise<infer V> ? V : T

/**
 * Callback of a subscription
 */
export type SubscriptionCallback<S> = (
  /**
   * Object with information relative to the store mutation that triggered the
   * subscription.
   */
  mutation: SubscriptionCallbackMutation<S>,

  /**
   * State of the store when the subscription is triggered. Same as
   * `store.$state`.
   */
  state: UnwrapRef<S>
) => void

/**
 * Context object passed to callbacks of `store.$onAction(context => {})`
 */
export type StoreOnActionListenerContext<
  Id extends string,
  S extends StateTree,
  G extends GettersTree<S>,
  A /* extends ActionsTree */
> = {
  [Name in keyof A]: {
    /**
     * Name of the action
     */
    name: Name

    /**
     * Store that is invoking the action
     */
    store: Store<Id, S, G, A>

    /**
     * Parameters passed to the action
     */
    args: A[Name] extends _Method ? Parameters<A[Name]> : unknown[]

    /**
     * Sets up a hook once the action is finished. It receives the return value of
     * the action, if it's a Promise, it will be unwrapped.
     */
    after: (
      callback: A[Name] extends _Method
        ? (resolvedReturn: UnwrapPromise<ReturnType<A[Name]>>) => void
        : () => void
    ) => void

    /**
     * Sets up a hook if the action fails.
     */
    onError: (callback: (error: unknown) => void) => void
  }
}[keyof A]

/**
 * Argument of `store.$onAction()`
 */
export type StoreOnActionListener<
  Id extends string = string,
  S extends StateTree = StateTree,
  G extends GettersTree<S> = GettersTree<S>,
  A /* extends ActionsTree */ = ActionsTree
> = (context: StoreOnActionListenerContext<Id, S, G, A>) => void

/**
 * Base store with state and functions
 * @internal
 */
export interface StoreWithState<
  Id extends string,
  S extends StateTree,
  G extends GettersTree<StateTree> = GettersTree<S>,
  A /* extends ActionsTree */ = ActionsTree
> {
  /**
   * Unique identifier of the store
   */
  $id: Id

  /**
   * State of the Store. Setting it will replace the whole state.
   */
  $state: UnwrapRef<StateTree extends S ? {} : S> &
    PiniaCustomStateProperties<S>

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
   * Used by devtools plugin to retrieve properties added with plugins. Removed in production.
   *
   * @internal
   */
  _customProperties: Set<string>

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
   * @returns function that removes the watcher
   */
  $subscribe(callback: SubscriptionCallback<S>): () => void

  /**
   * Array of registered action subscriptions.Set without the generics to avoid
   * errors between the generic version of Store and specific stores.
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
   *  after((resolvedValue) => {
   *    // can be used to cleanup side effects
   * .  // `resolvedValue` is the value returned by the action, if it's a
   * .  // Promise, it will be the resolved value instead of the Promise
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
  $onAction(callback: StoreOnActionListener<Id, S, G, A>): () => void
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

/**
 * Store type to build a store
 */
export type Store<
  Id extends string = string,
  S extends StateTree = StateTree,
  G extends GettersTree<S> = GettersTree<S>,
  // has the actions without the context (this) for typings
  A /* extends ActionsTree */ = ActionsTree
> = StoreWithState<Id, StateTree extends S ? {} : S, G, A> &
  (StateTree extends S ? {} : UnwrapRef<S>) &
  (GettersTree<S> extends G ? {} : StoreWithGetters<G>) &
  (ActionsTree extends A ? {} : StoreWithActions<A>) &
  PiniaCustomProperties<Id, S, G, A> &
  PiniaCustomStateProperties<S>

/**
 * Generic and type-unsafe version of Store. Doesn't fail on access with
 * strings, making it much easier to write generic functions that do not care
 * about the kind of store that is passed.
 */
export type GenericStore<
  Id extends string = string,
  S extends StateTree = any,
  G extends GettersTree<S> = GettersTree<S>,
  // has the actions without the context (this) for typings
  A /* extends ActionsTree */ = ActionsTree
> = StoreWithState<Id, S, G, A> &
  UnwrapRef<S> &
  StoreWithGetters<G> &
  StoreWithActions<A> &
  PiniaCustomProperties<Id, S, G, A> &
  PiniaCustomStateProperties<S>

/**
 * Return type of `defineStore()`. Function that allows instantiating a store.
 */
export interface StoreDefinition<
  Id extends string = string,
  S extends StateTree = StateTree,
  G extends GettersTree<S> = GettersTree<S>,
  A /* extends ActionsTree */ = ActionsTree
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
 * Properties that are added to every store by `pinia.use()`
 */
export interface PiniaCustomProperties<
  Id extends string = string,
  S extends StateTree = StateTree,
  G extends GettersTree<S> = GettersTree<S>,
  A /* extends ActionsTree */ = ActionsTree
> {}

/**
 * Properties that are added to every `store.$state` by `pinia.use()`
 */
export interface PiniaCustomStateProperties<S extends StateTree = StateTree> {}

/**
 * Type of an object of Getters that infers the argument
 *
 * @internal
 */
export type GettersTree<S extends StateTree> = Record<
  string,
  | ((
      state: UnwrapRef<
        (StateTree extends S ? {} : S) & PiniaCustomStateProperties<S>
      >
    ) => any)
  | (() => any)
>

/**
 * Type of an object of Actions
 *
 * @internal
 */
export type ActionsTree = Record<string, _Method>

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
    ThisType<
      UnwrapRef<StateTree extends S ? {} : S> &
        StoreWithGetters<G> &
        PiniaCustomProperties
    >
  /**
   * Optional object of actions.
   */
  actions?: A &
    ThisType<
      A &
        UnwrapRef<StateTree extends S ? {} : S> &
        StoreWithState<Id, S, G, A> &
        StoreWithGetters<GettersTree<S> extends G ? {} : G> &
        PiniaCustomProperties
    >
}
