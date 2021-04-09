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
      return this.doubleCount + 1
    },
  },
})
```

## Accessing other stores getters

To use another store getters, you can directly _use it_ inside of the _action_:

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

## Usage with `setup()`

You can directly access any getter as a property of the store (exactly like state properties):

```js
export default {
  setup() {
    const store = useStore()

    store.counter = 3
    store.doubleCount // 6
  },
}
```

## Usage with the options API

You can use the same `mapState()` function used in the [previous section of state](./state.md#options-api) to map to getters:

```js
import { mapState } from 'pinia'

export default {
  computed: {
    // gives access to this.doubleCounter inside the component
    // same as reading from store.doubleCounter
    ...mapState(useStore, ['doubleCount'])
    // same as above but registers it as this.myOwnName
    ...mapState(useStore, {
      myOwnName: 'doubleCounter',
      // you can also write a function that gets access to the store
      double: store => store.doubleCount,
    }),
  },
}
```
