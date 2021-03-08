# State

The state is, most of the time, the central part of your store. People often start by defining the state that represents their app. In Pinia the state is defined as a function that returns the initial state. \_This allows Pinia to work in both Server and Client Side.

```js
import { defineStore } from 'pinia'

const useStore = defineStore({
  id: 'storeName',
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

You can directly read and write to the state by accessing it through the `store` instance:

```js
store.counter++
```

or call the method `$patch` that allows you apply multiple changes at the same time with a partial `state` object:

```ts
store.$patch({
  counter: -1,
  name: 'Abalam',
})
```

The main difference here is that `$patch` allows you to group multiple changes into one single entry in the devtools.

## Replacing the `state`

Simply set your store `$stet` property to a new object:

```ts
store.$state = { counter: 666, name: 'Paimon' }
```
