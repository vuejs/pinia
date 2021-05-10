import {
  CustomInspectorNode,
  CustomInspectorState,
  setupDevtoolsPlugin,
  TimelineEvent,
} from '@vue/devtools-api'
import { App, computed, DebuggerEvent, reactive, toRefs } from 'vue'
import { PiniaPluginContext, setActivePinia } from './rootStore'
import {
  GenericStore,
  GettersTree,
  MutationType,
  StateTree,
  StoreWithActions,
  _Method,
} from './types'

function formatDisplay(display: string) {
  return {
    _custom: {
      display,
    },
  }
}

/**
 * Registered stores used for devtools.
 */
const registeredStores = /*#__PURE__*/ new Set<GenericStore>()

function toastMessage(
  message: string,
  type?: 'normal' | 'error' | 'warning' | undefined
) {
  const piniaMessage = '🍍 ' + message

  if (typeof __VUE_DEVTOOLS_TOAST__ === 'function') {
    __VUE_DEVTOOLS_TOAST__(piniaMessage, type)
  } else if (type === 'error') {
    console.error(piniaMessage)
  } else if (type === 'warning') {
    console.warn(piniaMessage)
  } else {
    console.log(piniaMessage)
  }
}

let isAlreadyInstalled: boolean | undefined
const componentStateTypes: string[] = []

const MUTATIONS_LAYER_ID = 'pinia:mutations'
const INSPECTOR_ID = 'pinia'

export function addDevtools(app: App, store: GenericStore) {
  registeredStores.add(store)
  componentStateTypes.push('🍍 ' + store.$id)
  setupDevtoolsPlugin(
    {
      id: 'dev.esm.pinia',
      label: 'Pinia 🍍',
      logo: 'https://pinia.esm.dev/logo.svg',
      packageName: 'pinia',
      homepage: 'https://pinia.esm.dev',
      componentStateTypes,
      app,
    },
    (api) => {
      // watch(router.currentRoute, () => {
      //   // @ts-ignore
      //   api.notifyComponentUpdate()
      // })

      // TODO: only load stores used by the component?
      api.on.inspectComponent((payload, ctx) => {
        if (payload.instanceData) {
          payload.instanceData.state.push({
            type: '🍍 ' + store.$id,
            key: 'state',
            editable: false,
            value: store.$state,
          })

          if (store._getters?.length) {
            payload.instanceData.state.push({
              type: '🍍 ' + store.$id,
              key: 'getters',
              editable: false,
              value: store._getters.reduce((getters, key) => {
                getters[key] = store[key]
                return getters
              }, {} as GettersTree<StateTree>),
            })
          }
        }
      })

      if (!isAlreadyInstalled) {
        api.addTimelineLayer({
          id: MUTATIONS_LAYER_ID,
          label: `Pinia 🍍`,
          color: 0xe5df88,
        })

        api.addInspector({
          id: INSPECTOR_ID,
          label: 'Pinia 🍍',
          icon: 'storage',
          treeFilterPlaceholder: 'Search stores',
        })

        api.on.getInspectorTree((payload) => {
          if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
            const stores = Array.from(registeredStores)

            payload.rootNodes = (payload.filter
              ? stores.filter((store) =>
                  store.$id.toLowerCase().includes(payload.filter.toLowerCase())
                )
              : stores
            ).map(formatStoreForInspectorTree)
          }
        })

        api.on.getInspectorState((payload) => {
          if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
            const store = Array.from(registeredStores).find(
              (store) => store.$id === payload.nodeId
            )

            if (!store) {
              return toastMessage(
                `store "${payload.nodeId}" not found`,
                'error'
              )
            }

            if (store) {
              payload.state = {
                options: formatStoreForInspectorState(store),
              }
            }
          }
        })

        api.on.editInspectorState((payload) => {
          if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
            const store = Array.from(registeredStores).find(
              (store) => store.$id === payload.nodeId
            )

            if (!store) {
              return toastMessage(
                `store "${payload.nodeId}" not found`,
                'error'
              )
            }

            const { path } = payload
            if (path[0] !== 'state') {
              return toastMessage(
                `Invalid path for store "${payload.nodeId}":\n${path}\nOnly state can be modified.`
              )
            }

            // rewrite the first entry to be able to directly set the state as
            // well as any other path
            path[0] = '$state'
            payload.set(store, path, payload.state.value)
          }
        })

        isAlreadyInstalled = true
      } else {
        api.sendInspectorTree(INSPECTOR_ID)
        api.sendInspectorState(INSPECTOR_ID)
      }

      // TODO: implement
      store.$before?.('action', ({ name, handler, args, context }) => {
        context._actionId = actionId++
      })

      store.$after?.('patch', ({ context }) => {
        // TODO: use context._actionId as the group
      })

      store.$after?.('action', ({ context, result }) => {
        // TODO: use context._actionId as the group
        // result.then.catch
      })

      store.$subscribe(({ events, type }, state) => {
        // rootStore.state[store.id] = state
        console.log('subscribe devtools', events)
        console.log('subscribe with active', activeAction)

        api.notifyComponentUpdate()
        api.sendInspectorState(INSPECTOR_ID)

        const eventData: TimelineEvent = {
          time: Date.now(),
          title: formatMutationType(type),
          data: formatEventData(events),
        }

        if (type === MutationType.patchFunction) {
          eventData.subtitle = '⤵️'
        } else if (type === MutationType.patchObject) {
          eventData.subtitle = '🧩'
        } else if (events && !Array.isArray(events)) {
          eventData.subtitle = events.type
        }

        if (events) {
          eventData.data['rawEvent(s)'] = {
            _custom: {
              display: 'DebuggerEvent',
              type: 'object',
              tooltip: 'raw DebuggerEvent[]',
              value: events,
            },
          }
        }

        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: eventData,
        })
      })

      // trigger an update so it can display new registered stores
      // @ts-ignore
      api.notifyComponentUpdate()
      toastMessage(`"${store.$id}" store installed`)
    }
  )
}

function formatStoreForInspectorTree(store: GenericStore): CustomInspectorNode {
  return {
    id: store.$id,
    label: store.$id,
    tags: [],
  }
}

function formatStoreForInspectorState(
  store: GenericStore
): CustomInspectorState[string] {
  const fields: CustomInspectorState[string] = [
    { editable: false, key: 'id', value: formatDisplay(store.$id) },
    { editable: true, key: 'state', value: store.$state },
  ]

  // avoid adding empty getters
  if (store._getters?.length) {
    fields.push({
      editable: false,
      key: 'getters',
      value: store._getters.reduce((getters, key) => {
        getters[key] = store[key]
        return getters
      }, {} as GettersTree<StateTree>),
    })
  }

  return fields
}

function formatEventData(events: DebuggerEvent[] | DebuggerEvent | undefined) {
  if (!events) return {}
  if (Array.isArray(events)) {
    // TODO: handle add and delete for arrays and objects
    return events.reduce(
      (data, event) => {
        data.keys.push(event.key)
        data.operations.push(event.type)
        data.oldValue[event.key] = event.oldValue
        data.newValue[event.key] = event.newValue
        return data
      },
      {
        oldValue: {} as Record<string, any>,
        keys: [] as string[],
        operations: [] as string[],
        newValue: {} as Record<string, any>,
      }
    )
  } else {
    return {
      operation: formatDisplay(events.type),
      key: formatDisplay(events.key),
      oldValue: events.oldValue,
      newValue: events.newValue,
    }
  }
}

function formatMutationType(type: MutationType): string {
  switch (type) {
    case MutationType.direct:
      return 'mutation'
    case MutationType.patchFunction:
      return '$patch'
    case MutationType.patchObject:
      return '$patch'
    default:
      return 'unknown'
  }
}

let actionId = 0
let activeAction = -1

const actionMap = new WeakMap<Promise<any>, number>()

/**
 * pinia.use(devtoolsPlugin)
 */
export function devtoolsPlugin<
  Id extends string = string,
  S extends StateTree = StateTree,
  G extends GettersTree<S> = GettersTree<S>,
  A = Record<string, _Method>
>({ app, store, options, pinia }: PiniaPluginContext<Id, S, G, A>) {
  const wrappedActions: StoreWithActions<A> = {} as StoreWithActions<A>
  const actions: A = options.actions || ({} as any)

  // custom patch method

  for (const actionName in actions) {
    wrappedActions[actionName] = function () {
      setActivePinia(pinia)
      const keys = Object.keys(options.state?.() || {})
      const _actionId = actionId++
      const patchedStore = reactive({
        ...toRefs(store),
        // $patch() {
        //   // TODO: should call subscribe listeners with a group ID
        //   store.$patch.apply(null, arguments as any)
        // },
        ...keys.reduce((stateProperties, stateName) => {
          // @ts-expect-error
          stateProperties[stateName] = computed({
            get() {
              activeAction = _actionId
              return store[stateName]
            },
            set(value) {
              activeAction = _actionId
              // @ts-expect-error
              return (store[stateName] = value)
            },
          })
          return stateProperties
        }, {}),
        _actionId,
      })
      console.log('beforeAction', _actionId)
      const promise = Promise.resolve(
        // @ts-expect-error: not recognizing it's a _Method for some reason
        actions[actionName].apply(patchedStore, (arguments as unknown) as any[])
      )
        .then(() => {
          // TODO: finish and mark as completed
        })
        .catch((err) => {
          // TODO: finish and mark as failed
        })
        .finally(() => {
          activeAction = -1
        })

      return promise
    } as StoreWithActions<A>[typeof actionName]
  }

  addDevtools(app, store)

  return { ...wrappedActions }
}

/**
 * Another idea: wrap the getter/setter of all state properties to call setActiveAction. This way, we can directly use it in $subscribe to attach it to its action
 */
