import { defineStore } from './store'
export {
  setActiveReq,
  setStateProvider,
  getRootState,
  createPinia,
} from './rootStore'

function createStore(options: Parameters<typeof defineStore>[0]) {
  console.warn(
    '[🍍]: "createStore" has been deprecated and will be removed on the sable release, use "defineStore" instead.'
  )
  return defineStore(options)
}

export { StateTree, StoreGetter, Store } from './types'
export { createStore, defineStore }
