import { StoreActions } from './store'
import { StoreToRefs, storeToRefs } from './storeToRefs'
import { Store } from './types'

export function destructureStore<S extends Store>(
  store: S
): StoreToRefs<S> & StoreActions<S> {
  const refs = storeToRefs(store)

  const actions = Object.fromEntries(
    Object.entries(store).filter(([, value]) => typeof value === 'function')
  ) as StoreActions<S>

  return { ...refs, ...actions }
}
