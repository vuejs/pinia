# Actions

Actions are the equivalent of [methods](https://v3.vuejs.org/guide/data-methods.html#methods) in components. They can be defined with the `actions` property in `defineStore()` and they are perfect to define business logic:

```js
export const useStore = defineStore({
  id: 'main',
  state: () => ({
    counter: 0,
  }),
  actions: {
    increment() {
      this.counter++
    },
    randomizeCounter() {
      this.counter = Math.round(100 * Math.random())
    },
  },
})
```

Like [getters](./getters.md), actions get access to the _whole store instance_ through `this` with **full typing (and autocompletion ✨) support**.

Actions are invoked like methods:

```js
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
import { useAuthStore } from './auth-store'

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

## Usage with `setup()`

You can directly call any action as a method of the store:

```js
export default {
  setup() {
    const store = useStore()

    store.randomizeCounter()
  },
}
```

## Usage with the options API

If you are not using the composition API, and you are using `computed`, `methods`, ..., you can use the `mapActions()` helper to map actions properties as methods in your component:

```js
import { mapActions } from 'pinia'

export default {
  methods: {
    // gives access to this.increment() inside the component
    // same as calling from store.increment()
    ...mapActions(useStore, ['increment'])
    // same as above but registers it as this.myOwnName()
    ...mapActions(useStore, { myOwnName: 'doubleCounter' }),
  },
}
```
