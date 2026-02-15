import { Pinia } from '../rootStore'

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