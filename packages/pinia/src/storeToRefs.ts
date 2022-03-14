import {
  isReactive,
  isRef,
  isVue2,
  toRaw,
  toRef,
  ToRefs,
  toRefs,
} from 'vue-demi'
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
  if (__DEV__ && isVue2) {
    console.warn(
      '[Pinia]: "storeToRefs()" currently only works on Vue 3 until https://github.com/vuejs/pinia/issues/852 is fixed. Please, use "toRefs()" (from vue) instead. This will FAIL in production if not changed.'
    )
    // @ts-expect-error: toRefs include methods and others
    return toRefs(store)
  }

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
