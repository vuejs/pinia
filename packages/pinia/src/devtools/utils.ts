import { isReadonly, isRef, toRaw } from 'vue'
import { Pinia } from '../rootStore'
import { StoreGeneric } from '../types'

/**
 * Shows a toast or console.log
 *
 * @param message - message to log
 * @param type - different color of the tooltip
 */
export function toastMessage(
  message: string,
  type?: 'normal' | 'error' | 'warn' | undefined
) {
  const piniaMessage = '🍍 ' + message

  if (type === 'error') {
    console.error(piniaMessage)
  } else if (type === 'warn') {
    console.warn(piniaMessage)
  } else {
    console.debug(piniaMessage)
  }
}

export function isPinia(o: any): o is Pinia {
  return '_a' in o && 'install' in o
}

/**
 * Detects if a store getter is a writable computed (has a setter) so it can be
 * edited from devtools.
 */
export function isWritableComputed(store: StoreGeneric, key: string): boolean {
  const rawProp = toRaw(store)[key]
  return isRef(rawProp) && !isReadonly(rawProp)
}
