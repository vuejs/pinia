import { NonNullObject, StateTree, GenericStore } from './types'

/**
 * setActiveReq must be called to handle SSR at the top of functions like `fetch`, `setup`, `serverPrefetch` and others
 */
export let activeReq: NonNullObject = {}
export const setActiveReq = (req: NonNullObject | undefined) =>
  req && (activeReq = req)

export const getActiveReq = () => activeReq

/**
 * The api needs more work we must be able to use the store easily in any
 * function by calling `useStore` to get the store Instance and we also need to
 * be able to reset the store instance between requests on the server
 */

export const storesMap = new WeakMap<
  NonNullObject,
  Record<string, GenericStore>
>()

/**
 * A state provider allows to set how states are stored for hydration. e.g. setting a property on a context, getting a property from window
 */
interface StateProvider {
  get(): Record<string, StateTree>
  set(store: GenericStore): any
}

/**
 * Map of initial states used for hydration
 */
export const stateProviders = new WeakMap<NonNullObject, StateProvider>()

export function setStateProvider(stateProvider: StateProvider) {
  stateProviders.set(getActiveReq(), stateProvider)
}

export function getInitialState(id: string): StateTree | undefined {
  const provider = stateProviders.get(getActiveReq())
  return provider && provider.get()[id]
}

export function setInitialState(store: GenericStore): void {
  const provider = stateProviders.get(getActiveReq())
  if (provider) provider.set(store)
}

/**
 * Gets the root state of all active stores. This is useful when reporting an application crash by
 * retrieving the problematic state and send it to your error tracking service.
 * @param req request key
 */
export function getRootState(req: NonNullObject): Record<string, StateTree> {
  const stores = storesMap.get(req)
  if (!stores) return {}
  const rootState = {} as Record<string, StateTree>

  for (const store of Object.values(stores)) {
    rootState[store.id] = store.state
  }

  return rootState
}
