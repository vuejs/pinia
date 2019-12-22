import { Ref } from '@vue/composition-api'

interface JSONSerializable {
  toJSON(): string
}

export type StateTreeValue =
  | string
  | symbol
  | number
  | boolean
  | null
  | void
  | Function
  | StateTree
  | StateTreeArray
  | JSONSerializable

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StateTree
  extends Record<string | number | symbol, StateTreeValue> {}

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

// symbol is not allowed yet https://github.com/Microsoft/TypeScript/issues/1863
// export interface StateTree {
//   [x: number]: StateTreeValue
//   [x: symbol]: StateTreeValue
//   [x: string]: StateTreeValue
// }

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface StateTreeArray extends Array<StateTreeValue> {}

export interface StoreGetter<S extends StateTree, T = any> {
  (state: S): T
}

type TODO = any
// type StoreMethod = TODO
export type DeepPartial<T> = { [K in keyof T]?: DeepPartial<T[K]> }
// type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> }

export type SubscriptionCallback<S> = (
  mutation: { storeName: string; type: string; payload: DeepPartial<S> },
  state: S
) => void

export type StoreGetters<
  S extends StateTree,
  G extends Record<string, StoreGetter<S>>
> = {
  [k in keyof G]: G[k] extends StoreGetter<S, infer V> ? Ref<V> : never
}

export interface Store<Id extends string, S extends StateTree> {
  /**
   * Unique identifier of the store
   */
  id: Id

  /**
   * State of the Store
   */
  state: S

  /**
   * Applies a state patch to current state. Allows passing nested values
   * @param partialState patch to apply to the state
   */
  patch(partialState: DeepPartial<S>): void

  /**
   * Resets the store to its initial state by removing all subscriptions and
   * building a new state object
   */
  reset(): void

  /**
   * Setups a callback to be called whenever the state changes.
   * @param callback callback that is called whenever the state
   * @returns function that removes callback from subscriptions
   */
  subscribe(callback: SubscriptionCallback<S>): () => void
}

export interface DevtoolHook {
  on(
    event: string,
    callback: (targetState: Record<string, StateTree>) => void
  ): void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(event: string, ...payload: any[]): void
}

// add the __VUE_DEVTOOLS_GLOBAL_HOOK__ variable to the global namespace
declare global {
  interface Window {
    __VUE_DEVTOOLS_GLOBAL_HOOK__?: DevtoolHook
  }
  namespace NodeJS {
    interface Global {
      __VUE_DEVTOOLS_GLOBAL_HOOK__?: DevtoolHook
    }
  }
}
