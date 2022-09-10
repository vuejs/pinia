# Defining a Store

<VueSchoolLink
  href="https://vueschool.io/lessons/define-your-first-pinia-store"
  title="Learn how to define and use stores in Pinia"
/>

Before diving into core concepts, we need to know that a store is defined using `defineStore()` and that it requires a **unique** name, passed as the first argument:

```js
import { defineStore } from 'pinia'

// You can name the return value of `defineStore()` anything you want, 
// but it's best to use the name of the store and surround it with `use` 
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useStore = defineStore('main', {
  // other options...
})
```

This _name_, also referred as _id_, is necessary and is used by Pinia to connect the store to the devtools. Naming the returned function _use..._ is a convention across composables to make its usage idiomatic.

`defineStore()` accepts two distinct values for its second argument: a Setup function or an Options object.

## Option Stores

Similar to Vue's Options API, we can also pass an Options Object with `state`, `actions`, and `getters` properties.

```js {2-10}
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0, name: 'Eduardo' }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
```

You can think of `state` as the `data` of the store, and `getters` as the `computed` properties of the store, and `actions` as the `methods`.

Options stores should feel intuitive and simple to get started with.

## Setup Stores

There is also another possible syntax to define stores. Similar to the Vue Composition API's [setup function](https://vuejs.org/api/composition-api-setup.html), we can pass in a function that defines reactive properties and methods and returns an object with the properties and methods we want to expose.

```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const name = ref('Eduardo')
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, name, doubleCount, increment }
})
```

In _Setup Stores_:

- `ref()`s become `state` properties
- `computed()`s become `getters`
- `function()`s become `actions`

Setup stores bring a lot more flexibility than [Options Stores](#option-stores) as you can create watchers within a store and freely use any [composable](https://vuejs.org/guide/reusability/composables.html#composables). However, keep in mind that using composables will get more complex [SSR](../cookbook/composables.md).

## What syntax should I pick?

As with [Vue's Composition API and Option API](https://vuejs.org/guide/introduction.html#which-to-choose), pick the one that you feel the most comfortable with. If you're not sure, try the [Option Stores](#option-stores) first.

## Using the store

We are _defining_ a store because the store won't be created until `use...Store()` is called inside of `setup()`:

```js
import { useCounterStore } from '@/stores/counter'

export default {
  setup() {
    const store = useCounterStore()

    return {
      // you can return the whole store instance to use it in the template
      store,
    }
  },
}
```

:::tip
If you are not using `setup` components yet, [you can still use Pinia with _map helpers_](../cookbook/options-api.md).
:::

You can define as many stores as you want and **you should define each store in a different file** to get the most out of pinia (like automatically allow your bundler to code split and TypeScript inference).

Once the store is instantiated, you can access any property defined in `state`, `getters`, and `actions` directly on the store. We will see these in detail in the next pages but autocompletion will help you.

Note that `store` is an object wrapped with `reactive`, meaning there is no need to write `.value` after getters but, like `props` in `setup`, **we cannot destructure it**:

```js
export default defineComponent({
  setup() {
    const store = useCounterStore()
    // ❌ This won't work because it breaks reactivity
    // it's the same as destructuring from `props`
    const { name, doubleCount } = store

    name // "Eduardo"
    doubleCount // 0

    setTimeout(() => {
      store.increment()
    }, 1000)

    return {
      // will always be "Eduardo"
      name,
      // will always be 0
      doubleCount,
      // will also always be 0
      doubleNumber: store.doubleCount,

      // ✅ this one will be reactive
      doubleValue: computed(() => store.doubleCount),
    }
  },
})
```

In order to extract properties from the store while keeping its reactivity, you need to use `storeToRefs()`. It will create refs for every reactive property. This is useful when you are only using state from the store but not calling any action. Note you can destructure actions directly from the store as they are bound to the store itself too:

```js
import { storeToRefs } from 'pinia'

export default defineComponent({
  setup() {
    const store = useCounterStore()
    // `name` and `doubleCount` are reactive refs
    // This will also create refs for properties added by plugins
    // but skip any action or non reactive (non ref/reactive) property
    const { name, doubleCount } = storeToRefs(store)
    // the increment action can be just extracted
    const { increment } = store

    return {
      name,
      doubleCount,
      increment,
    }
  },
})
```
