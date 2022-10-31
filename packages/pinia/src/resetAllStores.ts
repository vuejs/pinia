import { getActivePinia } from './rootStore'

/**
 * Resets all injected stores
 */
export function resetAllStores() {
  const pinia = getActivePinia()

  pinia?._s.forEach((store) => {
    store.$reset()
  })
}
