# Actions

Actions are the equivalent of [methods](https://v3.vuejs.org/guide/data-methods.html#methods) in components. They can be defined with the `actions` property in `defineStore()` and **they are perfect to define business logic**:

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

Like [getters](./getters.md), actions get access to the _whole store instance_ through `this` with **full typing (and autocompletion ✨) support**. **Unlike them, `actions` can be asynchronous**, you can `await` inside of them any API call or even other actions! Here is an examlpe using [Mande](https://github.com/posva/mande). Note the library you use doesn't matter as long as you get a `Promise`, you could even use the native `fetch` function (browser only):

```js
import { mande } from 'mande'

const api = mande('/api/users')

export const useUsers = defineStore({
  id: 'users',
  state: () => ({
    data: userData,
    // ...
  }),

  actions: {
    async registerUser(login, password) {
      try {
        this.userData = await api.post({ login, password })
        showTooltip(`Welcome back ${this.userData.name}!`)
      } catch (error) {
        showTooltip(error)
        // let the form component display the error
        return error
      }
    },
  },
})
```

You are also completely free to set whatever arguments you want and return anything. When calling actions, everything will be automatically inferred!

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

To use another store, you can directly _use it_ inside of the _action_:

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

## Watching actions

> [Give feedback about `$onAction()`](https://github.com/posva/pinia/issues/240)

It is possible to observe actions and their outcome with `store.$onAction()`. This

Here is an example that logs before running actions and after they resolve/reject.

```js
const unsubscribe = someStore.$onAction(
  ({
    name, // name of the action
    store, // store instance, same as `someStore`
    args, // array of parameters passed to the action
    after, // hook after the action returns or resolves
    onError, // hook if the action throws or rejects
  }) => {
    // a shared variable for this specific action call
    const startTime = Date.now()
    // this will trigger before an action on `store` is executed
    console.log(`Start "${name}" with params [${args.join(', ')}].`)

    // this will trigger if the action succeeds and after it has fully run.
    // it waits for any returned promised
    after((result) => {
      console.log(
        `Finished "${name}" after ${
          Date.now() - startTime
        }ms.\nResult: ${result}.`
      )
    })

    // this will trigger if the action throws or returns a promise that rejects
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })
  }
)

// manually remove the listener
unsubscribe()
```

By default, action listeners are bound to the component where they are added (if the store is inside a component's `setup()`). Meaning, they will be automatically removed when the component is unmounted.
