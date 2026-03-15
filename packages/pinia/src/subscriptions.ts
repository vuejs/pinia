import { getCurrentScope, onScopeDispose } from 'vue'
import { _Method } from './types'

export const noop = () => {}

export function addSubscription<T extends _Method>(
  subscriptions: Set<T>,
  callback: T,
  detached?: boolean,
  onCleanup: () => void = noop
) {
  subscriptions.add(callback)

  const removeSubscription = () => {
    const isDel = subscriptions.delete(callback)
    isDel && onCleanup()
  }

  if (!detached && getCurrentScope()) {
    onScopeDispose(removeSubscription)
  }

  return removeSubscription
}

export function triggerSubscriptions<T extends _Method>(
  subscriptions: Set<T>,
  ...args: Parameters<T>
) {
  subscriptions.forEach((callback) => {
    callback(...args)
  })
}

/**
 * Same as {@link triggerSubscriptions} but catches errors in callbacks to ensure all subscribers
 * are notified even if one throws.
 *
 * @internal
 */
export function triggerSubscriptionsSafe<T extends _Method>(
  subscriptions: Set<T>,
  ...args: Parameters<T>
) {
  subscriptions.forEach((callback) => {
    try {
      callback(...args)
    } catch (e) {
      // Ensure all subscribers are notified even if one throws
      if (__DEV__) {
        console.error('[🍍]: Error in subscription callback', e)
      }
    }
  })
}
