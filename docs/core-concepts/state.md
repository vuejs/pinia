# State

The state is, most of the time, the central part of your store. People often start by defining the state that represents their app. In Pinia the state is defined as a function that returns the initial state. This allows Pinia to work in both Server and Client Side.

```js
import { defineStore } from 'pinia'

const useStore = defineStore({
  id: 'storeName',
  // can also be defined with an arrow function if you prefer that syntax
  state() {
    return {
      // all these properties will have their type inferred automatically
      counter: 0,
      name: 'Eduardo',
      isAdmin: true,
    }
  },
})
```

## Accessing the `state`

By default, you can directly read and write to the state by accessing it through the `store` instance:

```js
const store = useStore()

store.counter++
```

<!-- TODO: disable this with `strictMode` -->

or call the method `$patch` that allows you apply multiple changes at the same time with a partial `state` object:

```js
store.$patch({
  counter: store.counter + 1,
  name: 'Abalam',
})
```

The `$path` method also accepts a function to group object mutations that are difficult to apply with an object, e.g. array mutations:

```js
cartStore.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```

<!-- TODO: disable this with `strictMode`, `{ noDirectPatch: true }` -->

The main difference here is that `$patch()` allows you to group multiple changes into one single entry in the devtools. Note **both, direct changes to `state` and `$patch()` appear in the devtools** and can be time travelled (not yet in Vue 3).

## Replacing the `state`

You can replace the whole state of a store by setting its `$state` property to a new object:

```js
store.$state = { counter: 666, name: 'Paimon' }
```
