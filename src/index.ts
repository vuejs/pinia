export { defineStore } from './store'
export {
  setActiveReq,
  setStateProvider,
  getRootState,
  Pinia,
  PiniaStorePlugin,
  PiniaCustomProperties,
  createPinia,
  setActivePinia,
  getActivePinia,
} from './rootStore'
export {
  StateTree,
  Store,
  StoreWithActions,
  StoreWithGetters,
  StoreWithState,
} from './types'
export { PiniaSsr } from './ssrPlugin'

export { createStore } from './deprecated'
