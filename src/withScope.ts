import { createApp } from 'vue'
import { IS_CLIENT } from './env'

export function withScope<T>(factory: () => T): T {
  if (__BROWSER__ && IS_CLIENT) {
    let store: T
    createApp({
      setup() {
        store = factory()
        return () => null
      },
    }).mount(document.createElement('div'))
    // TODO: collect apps to be unmounted when the main app is unmounted
    return store!
  } else {
    // no need to wrap with an app on SSR
    return factory()
  }
}
