import { createStore } from './store'
export {
  setActiveReq,
  setStateProvider,
  getRootState,
  createPinia,
} from './rootStore'
export { StateTree, StoreGetter, Store } from './types'
// TODO: deprecate createStore
export { createStore, createStore as defineStore }
