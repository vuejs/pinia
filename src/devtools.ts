import { StateTree, StoreWithState } from './types'

interface DevtoolHook {
  on(
    event: string,
    callback: (targetState: Record<string, StateTree>) => void
  ): void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(event: string, ...payload: any[]): void
}

// add the __VUE_DEVTOOLS_GLOBAL_HOOK__ variable to the global namespace
declare global {
  interface Window {
    __VUE_DEVTOOLS_GLOBAL_HOOK__?: DevtoolHook
  }
  namespace NodeJS {
    interface Global {
      __VUE_DEVTOOLS_GLOBAL_HOOK__?: DevtoolHook
    }
  }
}

const target =
  typeof window !== 'undefined'
    ? window
    : typeof global !== 'undefined'
    ? global
    : { __VUE_DEVTOOLS_GLOBAL_HOOK__: undefined }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const devtoolHook: DevtoolHook | undefined = target.__VUE_DEVTOOLS_GLOBAL_HOOK__

interface RootState {
  _devtoolHook: DevtoolHook
  _vm: { $options: { computed: {} } }
  _mutations: {}
  // we need to store modules names
  _modulesNamespaceMap: Record<string, boolean>
  _modules: {
    // we only need this specific method to let devtools retrieve the module name
    get(name: string): boolean
  }
  state: Record<string, StateTree>

  replaceState: Function
  registerModule: Function
  unregisterModule: Function
}

let rootStore: RootState

export function useStoreDevtools(
  store: StoreWithState<string, StateTree>,
  stateDescriptor: { get: () => StateTree; set: (newValue: StateTree) => void }
): void {
  if (!devtoolHook) return

  if (!rootStore) {
    rootStore = {
      _devtoolHook: devtoolHook,
      _vm: { $options: { computed: {} } },
      _mutations: {},
      // we need to store modules names
      _modulesNamespaceMap: {},
      _modules: {
        // we only need this specific method to let devtools retrieve the module name
        get(name: string) {
          return name in rootStore._modulesNamespaceMap
        },
      },
      state: {},

      replaceState: () => {
        // we handle replacing per store so we do nothing here
      },
      // these are used by the devtools
      registerModule: () => {},
      unregisterModule: () => {},
    }
    devtoolHook.emit('vuex:init', rootStore)
  }

  // tell the devtools we added a module
  rootStore.registerModule(store.$id, store)

  Object.defineProperty(rootStore.state, store.$id, {
    enumerable: true,
    ...stateDescriptor,
  })

  // Vue.set(rootStore.state, store.name, store.state)
  // the trailing slash is removed by the devtools
  rootStore._modulesNamespaceMap[store.$id + '/'] = true

  devtoolHook.on('vuex:travel-to-state', (targetState) => {
    stateDescriptor.set(targetState[store.$id])
  })

  store.$subscribe((mutation, state) => {
    rootStore.state[store.$id] = state
    devtoolHook.emit(
      'vuex:mutation',
      {
        type: `[${mutation.storeName}] ${mutation.type}`,
        payload: mutation.payload,
      },
      // this doesn't seem to be used by the devtools but it's in vuex codebase
      rootStore.state
    )
  })
}
