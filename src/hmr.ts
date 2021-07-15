import { Pinia } from './rootStore'
import { Store, StoreDefinition, _Method } from './types'

/**
 * Setups the hot module replacement for a `useStore` in a Vite environment.
 *
 * @param useStore - function created by defineStore
 */
export function setupViteHMR(
  useStore: StoreDefinition<string, any, any, any>,
  acceptUpdate: _Method,
  invalidateUpdate: _Method,
  data: any
) {
  const initialUseStore = useStore
  // @ts-ignore: this would require importing vite types
  // import.meta.hot.accept((newModule) => {

  acceptUpdate((newModule) => {
    // @ts-ignore
    // if (!import.meta.hot) {
    //   throw new Error('import.meta.hot disappeared')
    // }

    const pinia: Pinia | undefined =
      (import.meta as any).hot.data.pinia || initialUseStore._pinia

    if (!pinia) {
      // this store is still not used
      return
    }

    // preserve the pinia instance across loads
    // @ts-ignore
    // import.meta.hot.data.pinia = pinia
    data.pinia = pinia

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
          // @ts-ignore
          // return import.meta.hot.invalidate()
          return invalidateUpdate()
        }

        const existingStore: Store = pinia._s.get(id)!
        if (!existingStore) {
          console.log(`skipping hmr because store doesn't exist yet`)
          return
        }
        useStore(pinia, existingStore)
      }
    }
  })
}

export const isUseStore = (fn: any): fn is StoreDefinition => {
  return typeof fn === 'function' && typeof fn.$id === 'string'
}

export function acceptHMRUpdate(
  initialUseStore: StoreDefinition<string, any, any, any>,
  hot: any
) {
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

        const existingStore: Store = pinia._s.get(id)!
        if (!existingStore) {
          console.log(`skipping hmr because store doesn't exist yet`)
          return
        }
        useStore(pinia, existingStore)
      }
    }
  }
}
