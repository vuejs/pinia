import { CustomInspectorNode, CustomInspectorState } from '@vue/devtools-api'
import { Store, GettersTree, MutationType, StateTree } from '../types'
import { DebuggerEvent } from 'vue'

export function formatDisplay(display: string) {
  return {
    _custom: {
      display,
    },
  }
}

export function formatStoreForInspectorTree(store: Store): CustomInspectorNode {
  return {
    id: store.$id,
    label: store.$id,
    tags: [],
  }
}

export function formatStoreForInspectorState(
  store: Store
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

export function formatEventData(
  events: DebuggerEvent[] | DebuggerEvent | undefined
) {
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

export function formatMutationType(type: MutationType): string {
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
