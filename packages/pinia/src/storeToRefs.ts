import { isReactive, isRef, toRaw, toRef, ToRefs } from 'vue-demi'
import { StoreGetters, StoreState } from './store'
import type { PiniaCustomStateProperties, StoreGeneric } from './types'

/**
 * Creates an object of references with all the state, getters, and plugin-added
 * state properties of the store. Similar to `toRefs()` but specifically
 * designed for Pinia stores so methods and non reactive properties are
 * completely ignored.
 *
 * @param store - store to extract the refs from
 */
export function storeToRefs<SS extends StoreGeneric>(
  store: SS
): ToRefs<
  StoreState<SS> & StoreGetters<SS> & PiniaCustomStateProperties<StoreState<SS>>
> {
  store = toRaw(store)

  const refs = {} as ToRefs<
    StoreState<SS> &
      StoreGetters<SS> &
      PiniaCustomStateProperties<StoreState<SS>>
  >
  for (const key in store) {
    const value = store[key]
    if (isRef(value) || isReactive(value)) {
      // @ts-expect-error: the key is state or getter
      refs[key] =
        // ---
        toRef(store, key)
    }
  }

  return refs
}
