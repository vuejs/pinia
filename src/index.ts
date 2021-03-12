export {
  setActivePinia,
  createPinia,
  Pinia,
  PiniaStorePlugin,
} from './rootStore'
export { defineStore } from './store'
export { PiniaPlugin } from './plugin'
export {
  StateTree,
  Store,
  StoreWithGetters,
  StoreWithActions,
  StoreWithState,
  PiniaCustomProperties,
} from './types'

export { mapStores } from './mapHelpers'
// TODO: remove in beta
export { createStore } from './deprecated'
