# Getters

Getters are exactly the equivalent of [computed values](https://v3.vuejs.org/guide/reactivity-computed-watchers.html#computed-values) for the state of a Store. They can be defined with the `getters` property in `defineStore()`:

```js
export const useStore = defineStore({
  id: 'main',
  state: () => ({
    counter: 0,
  }),
  getters: {
    doubleCount() {
      return this.counter * 2
    },
  },
})
```

Like [actions](./actions.md), getters get access to the _whole store instance_ through `this` with **full typing (and autocompletion ✨) support**.

Then you can access the getter directly on the store instance:

```vue
<template>
  <p>Double count is {{ store.doubleCount }}</p>
</template>

<script>
export default {
  setup() {
    const store = useStore()

    return { store }
  },
}
</script>
```

## Accessing other getters

As with computed properties, you can combine multiple getters. Access any other getter via `this`:

```js
export const useStore = defineStore({
  id: 'main',
  state: () => ({
    counter: 0,
  }),
  getters: {
    doubleCount() {
      return this.counter * 2
    },
    doubleCountPlusOne() {
      // autocompletion ✨
      return this.doubleCount * 2
    },
  },
})
```

## Accessing other stores

To access a different store, you can directly _use_ the other store inside of a `getter`

```js
import { useOtherStore } from './other-store'

export const useStore = defineStore({
  id: 'main',
  state: () => ({
    // ...
  }),
  getters: {
    otherGetter() {
      const otherStore = useOtherStore()
      return this.localData + otherStore.data
    },
  },
})
```
