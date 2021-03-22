# Actions

Actions are the equivalent of [methods](https://v3.vuejs.org/guide/data-methods.html#methods) in components. They can be defined with the `actions` property in `defineStore()` and they are perfect to define business logic:

```js
export const useStore = defineStore({
  id: 'main',
  state: () => ({
    counter: 0,
  }),
  actions: {
    reset() {
      this.counter = 0
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
    main.reset()

    return {}
  },
})
```
