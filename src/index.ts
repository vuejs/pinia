export {
  setActivePinia,
  createPinia,
  Pinia,
  PiniaStorePlugin,
} from './rootStore'
export { defineStore } from './store'
export {
  StateTree,
  Store,
  StoreWithGetters,
  StoreWithActions,
  StoreWithState,
  PiniaCustomProperties,
  DefineStoreOptions,
} from './types'

export {
  mapActions,
  mapStores,
  mapState,
  mapGetters,
  MapStoresCustomization,
} from './mapHelpers'

// TODO: remove in beta
export { createStore } from './deprecated'
