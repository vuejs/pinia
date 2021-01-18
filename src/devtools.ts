import {
  CustomInspectorNode,
  CustomInspectorState,
  setupDevtoolsPlugin,
} from '@vue/devtools-api'
import { App } from 'vue'
import { getRegisteredStores, registerStore } from './rootStore'
import { GenericStore } from './types'

function formatDisplay(display: string) {
  return {
    _custom: {
      display,
    },
  }
}

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

export function addDevtools(app: App, store: GenericStore) {
  registerStore(store)
  setupDevtoolsPlugin(
    {
      id: 'pinia',
      label: 'Pinia 🍍',
      app,
    },
    (api) => {
      api.on.inspectComponent((payload, ctx) => {
        if (payload.instanceData) {
          payload.instanceData.state.push({
            type: '🍍 ' + store.$id,
            key: 'state',
            editable: false,
            value: store.$state,
          })
        }
      })

      // watch(router.currentRoute, () => {
      //   // @ts-ignore
      //   api.notifyComponentUpdate()
      // })

      const mutationsLayerId = 'pinia:mutations'
      const piniaInspectorId = 'pinia'

      if (!isAlreadyInstalled) {
        api.addTimelineLayer({
          id: mutationsLayerId,
          label: `Pinia 🍍`,
          color: 0xe5df88,
        })

        api.addInspector({
          id: piniaInspectorId,
          label: 'Pinia 🍍',
          icon: 'storage',
          treeFilterPlaceholder: 'Search stores',
        })

        isAlreadyInstalled = true
      } else {
        // @ts-ignore
        api.notifyComponentUpdate()
        api.sendInspectorTree(piniaInspectorId)
        api.sendInspectorState(piniaInspectorId)
      }

      store.$subscribe((mutation, state) => {
        // rootStore.state[store.id] = state
        const data: Record<string, any> = {
          store: formatDisplay(mutation.storeName),
          type: formatDisplay(mutation.type),
        }

        if (mutation.payload) {
          data.payload = mutation.payload
        }

        // @ts-ignore
        api.notifyComponentUpdate()
        api.sendInspectorState(piniaInspectorId)

        api.addTimelineEvent({
          layerId: mutationsLayerId,
          event: {
            time: Date.now(),
            data,
            // TODO: remove when fixed
            meta: {},
          },
        })
      })

      api.on.getInspectorTree((payload) => {
        if (payload.app === app && payload.inspectorId === piniaInspectorId) {
          const stores = Array.from(getRegisteredStores())

          payload.rootNodes = (payload.filter
            ? stores.filter((store) =>
                store.$id.toLowerCase().includes(payload.filter.toLowerCase())
              )
            : stores
          ).map(formatStoreForInspectorTree)
        }
      })

      api.on.getInspectorState((payload) => {
        if (payload.app === app && payload.inspectorId === piniaInspectorId) {
          const stores = Array.from(getRegisteredStores())
          const store = stores.find((store) => store.$id === payload.nodeId)

          if (store) {
            payload.state = {
              options: formatStoreForInspectorState(store),
            }
          } else {
            toastMessage(`store "${payload.nodeId}" not found`, 'error')
          }
        }
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

  return fields
}
