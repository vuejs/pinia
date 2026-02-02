import type { Pinia } from './rootStore'
import type { StoreGeneric } from './types'

declare module 'vue' {
  // This seems to be needed to not break auto import types based on the order
  // https://github.com/vuejs/pinia/pull/2730
  interface GlobalComponents {}
  interface ComponentCustomProperties {
    /**
     * Access to the application's Pinia
     */
    $pinia: Pinia

    /**
     * Cache of stores instantiated by the current instance. Used by devtools to
     * list currently used stores. Used internally by Pinia.
     *
     * @internal
     */
    _pStores?: Record<string, StoreGeneric>
  }
}

// normally this is only needed in .d.ts files
export {}
