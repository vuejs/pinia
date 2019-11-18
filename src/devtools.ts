import { DevtoolHook, StateTree, Store } from './types'

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
  // we neeed to store modules names
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

export function devtoolPlugin<S extends StateTree>(store: Store<S>) {
  if (!devtoolHook) return

  if (!rootStore) {
    rootStore = {
      _devtoolHook: devtoolHook,
      _vm: { $options: { computed: {} } },
      _mutations: {},
      // we neeed to store modules names
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

  rootStore.state[store.name] = store.state

  // tell the devtools we added a module
  rootStore.registerModule(store.name, store)

  Object.defineProperty(rootStore.state, store.name, {
    get: () => store.state,
    set: state => store.replaceState(state),
  })

  // Vue.set(rootStore.state, store.name, store.state)
  // the trailing slash is removed by the devtools
  rootStore._modulesNamespaceMap[store.name + '/'] = true

  devtoolHook.on('vuex:travel-to-state', targetState => {
    store.replaceState(targetState[store.name] as S)
  })

  store.subscribe((mutation, state) => {
    rootStore.state[store.name] = state
    devtoolHook.emit(
      'vuex:mutation',
      {
        ...mutation,
        type: `[${mutation.storeName}] ${mutation.type}`,
      },
      rootStore.state
    )
  })
}
