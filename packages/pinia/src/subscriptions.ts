import { getCurrentScope, onScopeDispose } from 'vue'
import { _Method } from './types'
/**
 * @fileoverview Subscription management utilities for Pinia stores.
 * Provides functions to add, remove, and trigger subscriptions to store mutations and actions.
 * @module subscriptions
 */


/**
 * A no-operation function that does nothing.
 * Used as a default callback when no cleanup action is needed.
 * @internal
 */
export const noop = () => {}

/**
 * Adds a subscription callback to a set of subscriptions.
 * Automatically removes the subscription when the current effect scope is disposed,
 * unless the `detached` parameter is true.
 *
 * @template T - The type of the callback function
 * @param subscriptions - The set of subscription callbacks to add to
 * @param callback - The callback function to subscribe
 * @param detached - If true, the subscription won't be automatically removed on scope disposal
 * @param onCleanup - Optional cleanup function to run when the subscription is removed
 * @returns A function that removes the subscription when called
 *
 * @example
 * ```ts
 * const subscriptions = new Set<() => void>()
 * const unsubscribe = addSubscription(subscriptions, () => console.log('called'))
 * // Later: unsubscribe()
 * ```
 */
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

/**
 * Triggers all subscription callbacks with the provided arguments.
 * Iterates through the set of subscriptions and calls each callback function
 * with the given parameters.
 *
 * @template T - The type of the callback function
 * @param subscriptions - The set of subscription callbacks to trigger
 * @param args - The arguments to pass to each subscription callback
 *
 * @example
 * ```ts
 * const subscriptions = new Set<(value: number) => void>()
 * subscriptions.add((value) => console.log(value))
 * triggerSubscriptions(subscriptions, 42) // Logs: 42
 * ```
 */
export function triggerSubscriptions<T extends _Method>(
  subscriptions: Set<T>,
  ...args: Parameters<T>
) {
  subscriptions.forEach((callback) => {
    callback(...args)
  })
}
