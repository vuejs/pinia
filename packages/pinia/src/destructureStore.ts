import { toRaw, toRef } from 'vue'
import { StoreActions } from './store'
import { StoreToRefs } from './storeToRefs'
import { Store } from './types'

export function destructureStore<S extends Store>(
  store: S
): StoreToRefs<S> & StoreActions<S> {
  const _store = toRaw(store)

  return Object.entries(_store).reduce(
    (acc, [key, value]) => {
      if (typeof value === 'function') {
        ;(acc as any)[key] = value
      } else {
        ;(acc as any)[key] = toRef(_store, key as keyof S)
      }

      return acc
    },
    {} as StoreToRefs<S> & StoreActions<S>
  )
}
