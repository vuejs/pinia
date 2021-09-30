/**
 * @module pinia
 */
export { setActivePinia, getActivePinia } from './rootStore'
export { createPinia } from './createPinia'
export type { Pinia, PiniaStorePlugin, PiniaPluginContext } from './rootStore'

export { defineStore } from './store'
export type { StoreActions, StoreGetters, StoreState } from './store'

export type {
  StateTree,
  Store,
  StoreGeneric,
  // TODO: remove in release
  GenericStore,
  StoreDefinition,
  StoreWithGetters,
  GettersTree,
  ActionsTree,
  _Method,
  StoreWithActions,
  StoreWithState,
  StoreProperties,
  StoreOnActionListener,
  StoreOnActionListenerContext,
  SubscriptionCallback,
  SubscriptionCallbackMutation,
  SubscriptionCallbackMutationDirect,
  SubscriptionCallbackMutationPatchFunction,
  SubscriptionCallbackMutationPatchObject,
  _SubscriptionCallbackMutationBase,
  PiniaCustomProperties,
  PiniaCustomStateProperties,
  DefineStoreOptionsBase,
  DefineStoreOptions,
  DefineSetupStoreOptions,
  DefineStoreOptionsInPlugin,
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

export { storeToRefs } from './storeToRefs'

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

export { acceptHMRUpdate } from './hmr'

export {
  // TODO: remove in release and deprecate PiniaStorePlugin in favor of PiniaPlugin
  PiniaPlugin,
  PiniaVuePlugin,
} from './vue2-plugin'

export * from './globalExtensions'
