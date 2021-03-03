import { defineStore } from './store'

/**
 * {@inheritDoc defineStore}
 * @deprecated Use {@link defineStore}
 */
export const createStore = ((options: any) => {
  console.warn(
    '[🍍]: "createStore" has been deprecated and will be removed on the sable release, use "defineStore" instead.'
  )
  return defineStore(options)
}) as typeof defineStore
