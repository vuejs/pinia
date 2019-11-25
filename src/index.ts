import { ref, watch } from '@vue/composition-api'
import { Ref } from '@vue/composition-api/dist/reactivity'
import {
  StateTree,
  Store,
  SubscriptionCallback,
  DeepPartial,
  isPlainObject,
} from './types'
import { devtoolPlugin } from './devtools'

function innerPatch<T extends StateTree>(
  target: T,
  patchToApply: DeepPartial<T>
): T {
  // TODO: get all keys
  for (const key in patchToApply) {
    const subPatch = patchToApply[key]
    const targetValue = target[key]
    if (isPlainObject(targetValue) && isPlainObject(subPatch)) {
      target[key] = innerPatch(targetValue, subPatch)
    } else {
      // @ts-ignore
      target[key] = subPatch
    }
  }

  return target
}

/**
 * NOTE: by allowing users to name stores correctly, they can nest them the way
 * they want, no? like user/cart
 */

/**
 * Creates a store instance
 * @param id unique identifier of the store, like a name. eg: main, cart, user
 * @param initialState initial state applied to the store, Must be correctly typed to infer typings
 */

export function createStore<Id extends string, S extends StateTree>(
  id: Id,
  buildState: () => S
  // methods: Record<string | symbol, StoreMethod>
): Store<Id, S> {
  const state: Ref<S> = ref(buildState())
  function replaceState(newState: S) {
    state.value = newState
  }

  let isListening = true
  const subscriptions: SubscriptionCallback<S>[] = []

  watch(
    () => state.value,
    state => {
      if (isListening) {
        subscriptions.forEach(callback => {
          callback({ storeName: id, type: '🧩 in place', payload: {} }, state)
        })
      }
    },
    {
      deep: true,
      flush: 'sync',
    }
  )

  function patch(partialState: DeepPartial<S>): void {
    isListening = false
    innerPatch(state.value, partialState)
    isListening = true
    subscriptions.forEach(callback => {
      callback(
        { storeName: id, type: '⤵️ patch', payload: partialState },
        state.value
      )
    })
  }

  function subscribe(callback: SubscriptionCallback<S>): void {
    subscriptions.push(callback)
    // TODO: return function to remove subscription
  }

  const store: Store<Id, S> = {
    id,
    // it is replaced below by a getter
    state: state.value,

    patch,
    subscribe,
    replaceState: (newState: S) => {
      isListening = false
      replaceState(newState)
      isListening = true
    },
  }

  // make state access invisible
  Object.defineProperty(store, 'state', {
    get: () => state.value,
  })

  // Devtools injection hue hue
  devtoolPlugin(store)

  return store
}

/**
 * The api needs more work we must be able to use the store easily in any
 * function by calling `useStore` to get the store Instance and we also need to
 * be able to reset the store instance between requests on the server
 */

/**
 *
 * @param id id of the store we are creating
 * @param buildState function that returns a state
 */

export function makeStore<Id extends string, S extends StateTree>(
  id: Id,
  buildState: () => S
) {
  let store: Store<Id, S> | undefined

  function useStore(): Store<Id, S> {
    if (!store) store = createStore(id, buildState)

    return store
  }

  function clear(): void {
    store = undefined
  }

  return {
    useStore,
    clear,
  }
}

// export const store = createStore('main', initialState)
// export const cartStore = createStore('cart', {
//   items: ['thing 1'],
// })

// store.patch({
//   toggle: 'off',
//   nested: {
//     a: {
//       b: {
//         c: 'one',
//       },
//     },
//   },
// })
