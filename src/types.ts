import { ComputedRef, DebuggerEvent, Ref, UnwrapRef } from 'vue-demi'
import { Pinia } from './rootStore'

/**
 * Generic state of a Store
 */
export type StateTree = Record<string | number | symbol, any>

export function isPlainObject<S extends StateTree>(
  value: S | unknown
): value is S
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

/**
 * Recursive `Partial<T>`. Used by {@link Store.$patch}.
 *
 * @internal
 */
export type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> }
// type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> }

// TODO: can we change these to numbers?
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

type _StoreOnActionListenerContext<Store, ActionName extends string, A> = {
  /**
   * Name of the action
   */
  name: ActionName

  /**
   * Store that is invoking the action
   */
  store: Store

  /**
   * Parameters passed to the action
   */
  args: A extends Record<ActionName, _Method>
    ? Parameters<A[ActionName]>
    : unknown[]

  /**
   * Sets up a hook once the action is finished. It receives the return value
   * of the action, if it's a Promise, it will be unwrapped. Can return a
   * value (other than `undefined`) to **override** the returned value.
   */
  after: (
    callback: A extends Record<ActionName, _Method>
      ? (
          resolvedReturn: UnwrapPromise<ReturnType<A[ActionName]>>
          // allow the after callback to override the return value
        ) =>
          | void
          | ReturnType<A[ActionName]>
          | UnwrapPromise<ReturnType<A[ActionName]>>
      : () => void
  ) => void

  /**
   * Sets up a hook if the action fails. Return `false` to catch the error and
   * stop it fro propagating.
   */
  onError: (callback: (error: unknown) => unknown | false) => void
}

/**
 * Context object passed to callbacks of `store.$onAction(context => {})`
 * TODO: should have only the Id, the Store and Actions to generate the proper object
 */
export type StoreOnActionListenerContext<
  Id extends string,
  S extends StateTree,
  G /* extends GettersTree<S> */,
  A /* extends ActionsTree */
> = ActionsTree extends A
  ? _StoreOnActionListenerContext<StoreGeneric, string, ActionsTree>
  : {
      [Name in keyof A]: Name extends string
        ? _StoreOnActionListenerContext<Store<Id, S, G, A>, Name, A>
        : never
    }[keyof A]

/**
 * Argument of `store.$onAction()`
 */
export type StoreOnActionListener<
  Id extends string,
  S extends StateTree,
  G /* extends GettersTree<S> */,
  A /* extends ActionsTree */
> = (
  context: StoreOnActionListenerContext<
    Id,
    S,
    G,
    // {} creates a type of never due to how StoreOnActionListenerContext is defined
    {} extends A ? ActionsTree : A
  >
) => void

/**
 * Properties of a store.
 */
export interface StoreProperties<Id extends string> {
  /**
   * Unique identifier of the store
   */
  $id: Id

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
   * Used by devtools plugin to retrieve properties added with plugins. Removed
   * in production. Can be used by the user to add property keys of the store
   * that should be displayed in devtools.
   *
   * @internal
   */
  _customProperties: Set<string>

  /**
   * Handles a HMR replacement of this store. Dev Only.
   *
   * @internal
   */
  _hotUpdate(useStore: StoreGeneric): void

  /**
   * Allows pausing some of the watching mechanisms while the store is being
   * patched with a newer version.
   *
   * @internal
   */
  _hotUpdating: boolean

  /**
   * Payload of the hmr update. Dev only.
   *
   * @internal
   */
  _hmrPayload: {
    state: string[]
    hotState: Ref<StateTree>
    actions: ActionsTree
    getters: ActionsTree
  }
}

/**
 * Base store with state and functions
 * @internal
 */
export interface StoreWithState<
  Id extends string,
  S extends StateTree,
  G /* extends GettersTree<StateTree> */,
  A /* extends ActionsTree */
> extends StoreProperties<Id> {
  /**
   * State of the Store. Setting it will replace the whole state.
   */
  $state: UnwrapRef<S> & PiniaCustomStateProperties<S>

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
   * TODO: make this options only
   */
  $reset(): void

  /**
   * Setups a callback to be called whenever the state changes. It also returns
   * a function to remove the callback. Note than when calling
   * `store.$subscribe()` inside of a component, it will be automatically
   * cleanup up when the component gets unmounted unless `detached` is set to
   * true.
   *
   * @param callback - callback passed to the watcher
   * @param detached - detach the subscription from the context this is called from
   * @returns function that removes the watcher
   */
  $subscribe(callback: SubscriptionCallback<S>, detached?: boolean): () => void

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
   * up when the component gets unmounted unless `detached` is set to true.
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
   * @param detached - detach the subscription from the context this is called from
   * @returns function that removes the watcher
   */
  $onAction(
    callback: StoreOnActionListener<Id, S, G, A>,
    detached?: boolean
  ): () => void
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
  readonly [k in keyof G]: G[k] extends (...args: any[]) => infer R
    ? R
    : UnwrapRef<G[k]>
}

/**
 * Store type to build a store
 */
export type Store<
  Id extends string = string,
  S extends StateTree = {},
  G /* extends GettersTree<S>*/ = {},
  // has the actions without the context (this) for typings
  A /* extends ActionsTree */ = {}
> = StoreWithState<Id, S, G, A> &
  UnwrapRef<S> &
  StoreWithGetters<G> &
  // StoreWithActions<A> &
  (ActionsTree extends A ? {} : A) &
  PiniaCustomProperties<Id, S, G, A> &
  PiniaCustomStateProperties<S>
/**
 * Generic and type-unsafe version of Store. Doesn't fail on access with
 * strings, making it much easier to write generic functions that do not care
 * about the kind of store that is passed.
 */
export type StoreGeneric = Store<
  string,
  StateTree,
  GettersTree<StateTree>,
  ActionsTree
>

/**
 * Generic and type-unsafe version of Store. Doesn't fail on access with
 * strings, making it much easier to write generic functions that do not care
 * about the kind of store that is passed.
 * @deprecated Use `StoreGeneric` instead
 */
export type GenericStore<
  Id extends string = string,
  S extends StateTree = StateTree,
  G /* extends GettersTree<S> */ = GettersTree<S>,
  // has the actions without the context (this) for typings
  A /* extends ActionsTree */ = ActionsTree
> = StoreWithState<Id, S, G, A> &
  UnwrapRef<S> &
  StoreWithGetters<G> &
  A &
  PiniaCustomProperties<Id, S, G, A> &
  PiniaCustomStateProperties<S>

/**
 * Return type of `defineStore()`. Function that allows instantiating a store.
 */
export interface StoreDefinition<
  Id extends string = string,
  S extends StateTree = StateTree,
  G /* extends GettersTree<S>*/ = GettersTree<S>,
  A /* extends ActionsTree */ = ActionsTree
> {
  /**
   * Returns a store, creates it if necessary.
   *
   * @param pinia - Pinia instance to retrieve the store
   * @param hot - dev only hot module replacement
   */
  (pinia?: Pinia | null | undefined, hot?: StoreGeneric): Store<Id, S, G, A>

  /**
   * Id of the store. Used by map helpers.
   */
  $id: Id

  /**
   * Dev only pinia for HMR.
   *
   * @internal
   */
  _pinia?: Pinia
}

/**
 * Properties that are added to every store by `pinia.use()`.
 */
export interface PiniaCustomProperties<
  Id extends string = string,
  S extends StateTree = StateTree,
  G /* extends GettersTree<S> */ = GettersTree<S>,
  A /* extends ActionsTree */ = ActionsTree
> {}

/**
 * Properties that are added to every `store.$state` by `pinia.use()`.
 */
export interface PiniaCustomStateProperties<S extends StateTree = StateTree> {}

/**
 * Type of an object of Getters that infers the argument.
 *
 * @internal
 */
export type GettersTree<S extends StateTree> = Record<
  string,
  | ((state: UnwrapRef<S> & UnwrapRef<PiniaCustomStateProperties<S>>) => any)
  | (() => any)
>

/**
 * Type of an object of Actions.
 *
 * @internal
 */
export type ActionsTree = Record<string, _Method>

/**
 * @internal
 */
type _SpreadStateFromStore<SS, K extends readonly any[]> = K extends readonly [
  infer A,
  ...infer Rest
]
  ? A extends string | number | symbol
    ? SS extends Record<A, _Method | ComputedRef<any>>
      ? _SpreadStateFromStore<SS, Rest>
      : SS extends Record<A, any>
      ? Record<A, UnwrapRef<SS[A]>> & _SpreadStateFromStore<SS, Rest>
      : never
    : {}
  : {}

/**
 * @internal
 */
type _SpreadPropertiesFromObject<
  SS,
  K extends readonly any[],
  T
> = K extends readonly [infer A, ...infer Rest]
  ? A extends string | number | symbol
    ? SS extends Record<A, T>
      ? Record<A, UnwrapRef<SS[A]>> & _SpreadPropertiesFromObject<SS, Rest, T>
      : _SpreadPropertiesFromObject<SS, Rest, T>
    : {}
  : {}

/**
 * @internal
 */
export type _ExtractStateFromSetupStore<SS> = _SpreadStateFromStore<
  SS,
  _UnionToTuple<keyof SS>
>

/**
 * @internal
 */
export type _ExtractActionsFromSetupStore<SS> = _SpreadPropertiesFromObject<
  SS,
  _UnionToTuple<keyof SS>,
  _Method
>

/**
 * @internal
 */
export type _ExtractGettersFromSetupStore<SS> = _SpreadPropertiesFromObject<
  SS,
  _UnionToTuple<keyof SS>,
  ComputedRef<any>
>

/**
 * Options passed to `defineStore()` that are common between option and setup
 * stores. Extend this interface if you want to add custom options to both kinds
 * of stores.
 */
export interface DefineStoreOptionsBase<S extends StateTree, Store> {
  /**
   * Allows hydrating the store during SSR when there is an available state in
   * pinia.state.
   *
   * @param store - the store
   * @param initialState - initialState
   */
  hydrate?(store: Store, initialState: UnwrapRef<S>): void
}

/**
 * Options parameter of `defineStore()` for option stores. Can be extended to
 * augment stores with the plugin API. @see {@link DefineStoreOptionsBase}.
 */
export interface DefineStoreOptions<
  Id extends string,
  S extends StateTree,
  G /* extends GettersTree<S> */,
  A /* extends Record<string, StoreAction> */
> extends DefineStoreOptionsBase<S, Store<Id, S, G, A>> {
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
    ThisType<UnwrapRef<S> & StoreWithGetters<G> & PiniaCustomProperties> &
    GettersTree<S>

  /**
   * Optional object of actions.
   */
  actions?: A &
    ThisType<
      A &
        UnwrapRef<S> &
        StoreWithState<Id, S, G, A> &
        StoreWithGetters<G> &
        PiniaCustomProperties
    >
}

/**
 * Options parameter of `defineStore()` for setup stores. Can be extended to
 * augment stores with the plugin API. @see {@link DefineStoreOptionsBase}.
 */
export interface DefineSetupStoreOptions<
  Id extends string,
  // NOTE: Passing SS seems to make TS crash
  S extends StateTree,
  G,
  A /* extends ActionsTree */
> extends DefineStoreOptionsBase<S, Store<Id, S, G, A>> {
  /**
   * Extracted actions. Added by useStore(). SHOULD NOT be added by the user when
   * creating the store. Can be used in plugins to get the list of actions in a
   * store defined with a setup function. Note this is always defined
   */
  actions?: A
}

/**
 * Available `options` when creating a pinia plugin.
 */
export interface DefineStoreOptionsInPlugin<
  Id extends string,
  S extends StateTree,
  G,
  A
> extends Omit<DefineStoreOptions<Id, S, G, A>, 'id' | 'actions'> {
  /**
   * Extracted object of actions. Added by useStore() when the store is built
   * using the setup API, otherwise uses the one passed to `defineStore()`.
   * Defaults to an empty object if no actions are defined.
   */
  actions: A

  /**
   * Id of the store. Only available when the options API is used.
   *
   * @deprecated  Use `store.$id` instead.
   */
  id?: Id
}

export type _UnionToTuple<U> = _UnionToTupleRecursively<[], U>

type _Overwrite<T, S extends any> = {
  [P in keyof T]: P extends keyof S ? S[P] : never
}
type _TupleUnshift<T extends any[], X> = T extends any
  ? ((x: X, ...t: T) => void) extends (...t: infer R) => void
    ? R
    : never
  : never
type TuplePush<T extends any[], X> = T extends any
  ? _Overwrite<_TupleUnshift<T, any>, T & { [x: string]: X }>
  : never
type _UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never
type _UnionToOvlds<U> = _UnionToIntersection<
  U extends any ? (f: U) => void : never
>
type _PopUnion<U> = _UnionToOvlds<U> extends (a: infer A) => void ? A : never
/* end helpers */
/* main work */
type _UnionToTupleRecursively<T extends any[], U> = {
  1: T
  0: _PopUnion<U> extends infer SELF
    ? _UnionToTupleRecursively<TuplePush<T, SELF>, Exclude<U, SELF>>
    : never
}[[U] extends [never] ? 1 : 0]
