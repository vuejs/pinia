# Actions

Actions are the equivalent of [methods](https://v3.vuejs.org/guide/data-methods.html#methods) in components. They can be defined with the `actions` property in `defineStore()` and they are perfect to define business logic:

```js
export const useStore = defineStore({
  id: 'main',
  state: () => ({
    counter: 0,
  }),
  actions: {
    randomizeCounter() {
      this.counter = Math.round(100 * Math.random())
    },
  },
})
```

Like [getters](./getters.md), actions get access to the _whole store instance_ through `this` with **full typing (and autocompletion ✨) support**.

Actions are invoked like methods:

```ts
export default defineComponent({
  setup() {
    const main = useMainStore()
    // call the action as a method of the store
    main.randomizeCounter()

    return {}
  },
})
```

## Accessing other stores actions

To use another store, you can directly _use it_ inside of the _getter_:

```js
import { useOtherStore } from './other-store'

export const useSettingsStore = defineStore({
  id: 'settings',
  state: () => ({
    // ...
  }),
  actions: {
    async fetchUserPreferences(preferences) {
      const auth = useAuthStore()
      if (auth.isAuthenticated) {
        this.preferences = await fetchPreferences()
      } else {
        throw new Error('User must be authenticated')
      }
    },
  },
})
```
