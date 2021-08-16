# State

The state is, most of the time, the central part of your store. People often start by defining the state that represents their app. In Pinia the state is defined as a function that returns the initial state. This allows Pinia to work in both Server and Client Side.

```js
import { defineStore } from 'pinia'

const useStore = defineStore('storeId', {
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

:::tip
If you are using Vue 2, the data you create in `state` follows the same rules as the `data` in a Vue instance, ie the state object must be plain and you need to call `Vue.set()` when **adding new** properties to it. **See also: [Vue#data](https://vuejs.org/v2/api/#data)**.
:::

## Accessing the `state`

By default, you can directly read and write to the state by accessing it through the `store` instance:

```js
const store = useStore()

store.counter++
```

## Resetting the state

You can _reset_ the state to its initial value by calling the `$reset()` method on the store:

```js
const store = useStore()

store.$reset()
```

### Usage with the options API

If you are not using the composition API, and you are using `computed`, `methods`, ..., you can use the `mapState()` helper to map state properties as readonly computed properties:

```js
import { mapState } from 'pinia'

export default {
  computed: {
    // gives access to this.counter inside the component
    // same as reading from store.counter
    ...mapState(useStore, ['counter'])
    // same as above but registers it as this.myOwnName
    ...mapState(useStore, {
      myOwnName: 'counter',
      // you can also write a function that gets access to the store
      double: store => store.counter * 2,
      // it can have access to `this` but it won't be typed correctly...
      magicValue(store) {
        return store.someGetter + this.counter + this.double
      },
    }),
  },
}
```

#### Modifiable state

If you want to be able to write to these state properties (e.g. if you have a form), you can use `mapWritableState()` instead. Note you cannot pass a function like with `mapState()`:

```js
import { mapWritableState } from 'pinia'

export default {
  computed: {
    // gives access to this.counter inside the component and allows setting it
    // this.counter++
    // same as reading from store.counter
    ...mapWritableState(useStore, ['counter'])
    // same as above but registers it as this.myOwnName
    ...mapWritableState(useStore, {
      myOwnName: 'counter',
    }),
  },
}
```

:::tip
You don't need `mapWritableState()` for collections like arrays unless you are replacing the whole array with `cartItems = []`, `mapState()` still allows you to call methods on your collections.
:::

## Mutating the state

<!-- TODO: disable this with `strictMode` -->

Apart from directly changing a the store with `store.counter++`, you can also call the `$patch` method. It allows you to apply multiple changes at the same time with a partial `state` object:

```js
store.$patch({
  counter: store.counter + 1,
  name: 'Abalam',
})
```

However, some mutations are really hard or costly to apply with this syntax: any collection modification (e.g. pushing, removing, splicing an element from an array) requires you to create a new collection. Because of this, the `$patch` method also accepts a function to group this kind of mutations that are difficult to apply with a patch object:

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

You can also replace the whole state of your application by changing the `state` of the `pinia` instance. This is used during [SSR for hydration](../ssr/#state-hydration).

```js
pinia.state.value = {}
```

## Subscribing to the state

You can watch the state and its changes through the `$subscribe()` method of a store, similar to Vuex's [subscribe method](https://vuex.vuejs.org/api/#subscribe). The advantage of using `$subscribe()` over a regular `watch()` is that _subscriptions_ will trigger only once after _patches_ (e.g. when using the function version from above).

```js
cartStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type // 'direct' | 'patch object' | 'patch function'
  // same as cartStore.$id
  mutation.storeId // 'cart'
  // only available with mutation.type === 'patch object'
  mutation.payload // patch object passed to cartStore.$patch()

  // persist the whole state to the local storage whenever it changes
  localStorage.setItem('cart', JSON.stringify(state))
})
```

By default, _state subscriptions_ are bound to the component where they are added (if the store is inside a component's `setup()`). Meaning, they will be automatically removed when the component is unmounted. If you want to keep them after the component is unmounted, pass `true` as the second argument to _detach_ the _state subscription_ from the current component:

```js
export default {
  setup() {
    const someStore = useSomeStore()

    // this subscription will be kept after the component is unmounted
    someStore.$subscribe(callback, true)

    // ...
  },
}
```

:::tip
You can watch the whole state on the `pinia` instance:

```js
watch(
  pinia.state,
  (state) => {
    // persist the whole state to the local storage whenever it changes
    localStorage.setItem('piniaState', JSON.stringify(state))
  },
  { deep: true }
)
```

:::
