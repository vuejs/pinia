export { setActivePinia } from './rootStore'
export { createPinia } from './createPinia'
export type { Pinia, PiniaStorePlugin, PiniaPluginContext } from './rootStore'

export { defineStore } from './store'

export type {
  StateTree,
  Store,
  GenericStore,
  StoreDefinition,
  StoreWithGetters,
  GettersTree,
  _Method,
  StoreWithActions,
  StoreWithState,
  StoreOnActionListener,
  StoreOnActionListenerContext,
  SubscriptionCallback,
  PiniaCustomProperties,
  DefineStoreOptions,
} from './types'
export { MutationType } from './types'

export {
  mapActions,
  mapStores,
  mapState,
  mapWritableState,
  mapGetters,
  setMapStoreSuffix,
} from './mapHelpers'

export type {
  MapStoresCustomization,
  _MapActionsObjectReturn,
  _MapActionsReturn,
  _MapStateObjectReturn,
  _MapStateReturn,
  _MapWritableStateObjectReturn,
  _MapWritableStateReturn,
  _Spread,
  _StoreObject,
} from './mapHelpers'

// TODO: remove in beta
export { createStore } from './deprecated'
