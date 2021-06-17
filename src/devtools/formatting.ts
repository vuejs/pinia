import {
  ComponentCustomState,
  CustomInspectorNode,
  CustomInspectorState,
} from '@vue/devtools-api'
import { Store, MutationType } from '../types'
import { DebuggerEvent } from 'vue'
import { Pinia } from '../rootStore'
import { isPinia } from './utils'

export function formatDisplay(display: string) {
  return {
    _custom: {
      display,
    },
  }
}

export const PINIA_ROOT_LABEL = '🍍 Pinia (root)'
export const PINIA_ROOT_ID = '_root'

export function formatStoreForInspectorTree(
  store: Store | Pinia
): CustomInspectorNode {
  return '$id' in store
    ? {
        id: store.$id,
        label: store.$id,
      }
    : {
        id: PINIA_ROOT_ID,
        label: PINIA_ROOT_LABEL,
      }
}

export function formatStoreForInspectorState(
  store: Store | Pinia
): CustomInspectorState {
  if (isPinia(store)) {
    const state: CustomInspectorState = {
      state: Object.keys(store.state.value).map((storeId) => ({
        editable: true,
        key: storeId,
        value: store.state.value[storeId],
      })),
    }
    // TODO: use this version when possible
    // Object.keys(store.state.value).forEach((storeId) => {
    //   const currentState = store.state.value[storeId]
    //   state[storeId] = Object.keys(currentState).map((key) => ({
    //     // is not possible to made editable because no way to get the storeId in
    //     // edit inspector state callback
    //     editable: false,
    //     key,
    //     value: currentState[key],
    //   }))
    // })

    return state
  }

  const state: CustomInspectorState | ComponentCustomState = {
    state: Object.keys(store.$state).map((key) => ({
      editable: true,
      key,
      // @ts-expect-error
      value: store.$state[key],
    })),
  }

  // avoid adding empty getters
  if (store._getters && store._getters.length) {
    state.getters = store._getters.map((getterName) => ({
      editable: false,
      key: getterName,
      // @ts-expect-error
      value: store[getterName],
    }))
  }

  if (store._customProperties.size) {
    state.customProperties = Array.from(store._customProperties).map((key) => ({
      editable: true,
      key,
      // @ts-expect-error
      value: store[key],
    }))
  }

  return state
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
