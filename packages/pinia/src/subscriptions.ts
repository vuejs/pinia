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
  // Do not visit subscriptions added while dispatching, including a callback
  // that removes and registers itself again. Keep removals effective, though.
  Array.from(subscriptions).forEach((callback) => {
    if (subscriptions.has(callback)) {
      callback(...args)
    }
  })
}
