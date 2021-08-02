import { isRef, isReactive } from 'vue-demi'
import { Pinia } from './rootStore'
import { isPlainObject, StoreDefinition, StoreGeneric, _Method } from './types'

/**
 * Checks if a function is a `StoreDefinition`
 *
 * @param fn - object to test
 * @returns true if `fn` is a StoreDefinition
 */
export const isUseStore = (fn: any): fn is StoreDefinition => {
  return typeof fn === 'function' && typeof fn.$id === 'string'
}

/**
 * Mutates in place `newState` with `oldState` to _hot update_ it. It will
 * remove any key not existing in `newState` and recursively merge plain
 * objects.
 *
 * @param newState - new state object to be patched
 * @param oldState - old state that should be used to patch newState
 * @returns - newState
 */
export function patchObject(
  newState: Record<string, any>,
  oldState: Record<string, any>
): Record<string, any> {
  // no need to go through symbols because they cannot be serialized anyway
  for (const key in oldState) {
    const subPatch = oldState[key]

    // skip the whole sub tree
    if (!(key in newState)) {
      continue
    }

    const targetValue = newState[key]
    if (
      isPlainObject(targetValue) &&
      isPlainObject(subPatch) &&
      !isRef(subPatch) &&
      !isReactive(subPatch)
    ) {
      newState[key] = patchObject(targetValue, subPatch)
    } else {
      // objects are either a bit more complex (e.g. refs) or primitives, so we
      // just set the whole thing
      newState[key] = subPatch
    }
  }

  return newState
}

/**
 * Creates an _accept_ function to pass to `import.meta.hot` in Vite applications.
 *
 * @example
 * ```js
 * const useUser = defineStore(...)
 * if (import.meta.hot) {
 *   import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot))
 * }
 * ```
 *
 * @param initialUseStore - return of the defineStore to hot update
 * @param hot - `import.meta.hot`
 */
export function acceptHMRUpdate(initialUseStore: StoreDefinition, hot: any) {
  return (newModule: any) => {
    const pinia: Pinia | undefined = hot.data.pinia || initialUseStore._pinia

    if (!pinia) {
      // this store is still not used
      return
    }

    // preserve the pinia instance across loads
    hot.data.pinia = pinia

    // console.log('got data', newStore)
    for (const exportName in newModule) {
      const useStore = newModule[exportName]
      // console.log('checking for', exportName)
      if (isUseStore(useStore) && pinia._s.has(useStore.$id)) {
        // console.log('Accepting update for', useStore.$id)
        const id = useStore.$id

        if (id !== initialUseStore.$id) {
          console.warn(
            `The id of the store changed from "${initialUseStore.$id}" to "${id}". Reloading.`
          )
          // return import.meta.hot.invalidate()
          return hot.invalidate()
        }

        const existingStore: StoreGeneric = pinia._s.get(id)!
        if (!existingStore) {
          console.log(`skipping hmr because store doesn't exist yet`)
          return
        }
        useStore(pinia, existingStore)
      }
    }
  }
}
