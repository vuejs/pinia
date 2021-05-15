# Plugins

Pinia stores can be fully extended thanks to a low level API. Here is a list of things you can do:

- Add new properties to stores
- Add new options when defining stores
- Add new methods to stores
- Wrap existing methods
- Change or even cancel actions
- Implement side effects like local storage
- Apply **only** to specific stores

Plugins are added to pinia with `pinia.use()`. The simplest example is adding a property to all stores by returning an object:

```js
// add a property named `secret` to every store that is created after this plugin is installed
pinia.use(() => ({ secret: 'the cake is a lie' }))

// in another file
const store = useStore()
store.secret // 'the cake is a lie'
```

This is useful to add global objects like the router, modals, or toasts.

## Introduction

A Pinia plugin is a function that optionally returns properties to be added to a store. It takes one optional argument, a _context_:

```js
export function myPiniaPlugin(context) {
  context.pinia // the pinia created with `createPinia()`
  context.app // the current app created with `createApp()` (Vue 3 only)
  context.store // the store the plugin is augmenting
  context.options // the options object defining the store passed to `defineStore()`
  // ...
}
```

This function is then passed to `pinia` with `pinia.use()`:

```js
pinia.use(myPiniaPlugin)
```

It will get executed **every time `useStore()`** is called to be able to extend them. This is a limitation of the current implementation until [the effectScope RFC](https://github.com/vuejs/rfcs/pull/212) is merged.

## Augmenting a Store

You can add properties to every store by simply returning an object of them in a plugin:

```js
pinia.use(() => ({ hello: 'world' }))
```

You can also set the property directly on the `store`:

```js
pinia.use(({ store }) => {
  store.hello = 'world'
})
```

Note that every store is wrapped with [`reactive`](https://v3.vuejs.org/api/basic-reactivity.html#reactive), automatically unwrapping any Ref (`ref()`, `computed()`, ...) it contains:

```js
const sharedRef = ref('shared')
pinia.use(({ store }) => {
  // each store has its individual `hello` property
  store.hello = ref('secret')
  // it gets automatically unwrapped
  store.hello // 'secret'

  // all stores are sharing the value `shared` property
  store.shared = sharedRef
  store.shared // 'shared'
})
```

This is why you can access all computed properties without `.value` and why they are reactive.

### Adding new state

If you want to add new state properties to a store or properties that are meant to be used during hydration, **you will have to add it in two places**:

- On the `store` so you can access it with `store.myState`
- On `store.$state` so it can be used in devtools and, **be serialized during SSR**.

Note that this allows you to share a `ref` or `computed` property:

```js
const globalSecret = ref('secret')
pinia.use(({ store }) => {
  // `secret` is shared among all stores
  store.$state.secret = globalSecret
  store.secret = globalSecret
  // it gets automatically unwrapped
  store.secret // 'secret'

  // we need to check if the state has been added yet because of
  // the limitation mentioned during the introduction
  if (!Object.hasOwnProperty(store.$state, 'hasError')) {
    // Each store has its own `hasError`
    const hasError = ref(false)
    store.$state.hasError = hasError
    store.hasError = hasError
  }
})
```

:::warning
If you are using **Vue 2**, Pinia is subject to the [same reactivity caveats](https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats) as Vue. You will need to use `set` from `@vue/composition-api`:

```js
import { set } from '@vue/composition-api'
pinia.use(({ store }) => {
  if (!Object.hasOwnProperty(store.$state, 'hello')) {
    const secretRef = ref('secret')
    // If the data is meant to be used during SSR, you should
    // set it on the `$state` property so it is serialized and
    // picked up during hydration
    set(store.$state, 'hello', secretRef)
    // set it directly on the store too so you can access it
    // both ways: `store.$state.hello` / `store.hello`
    set(store, 'hello', secretRef)
    store.hello // 'secret'
  }
})
```

:::

## Adding new external properties

When adding external properties, class instances that come from other libraries, or simply things that are not reactive, you should wrap the object with `markRaw()` before passing it to pinia. Here is an example adding the router to every store:

```js
import { markRaw } from 'vue'
// adapt this based on where your router isj
import { router } from './router'

pinia.use(({ store }) => {
  store.router = markRaw(router)
})
```

## Calling `$subscribe` inside plugins

Because of the limitation mentioned above about plugins being invoked **every time `useStore()` is called**, it's important to avoid _subscribing_ multiple times by keeping track of the registered subscriptions:

```ts
let isRegistered
pinia.use({ store }) => {
  if (!isRegistered) {
  store.$subscribe(() => {
    // react to store changes
  })
  isRegistered = true
  }
})
```

The same is true for `store.$onAction()`.

## Adding new options

It is possible to create new options when defining stores to later on consume the options on plugins. For example, you could create a `debounce` option that allows you to debounce any action:

```js
defineStore({
  id: 'search',
  // ...
  actions: {
    searchContacts() {
      // ...
    },
  },

  // this will be read by a plugin later on
  debounce: {
    // debounce the action searchContacts by 300ms
    searchContacts: 300,
  },
})
```

The plugin can then read that option to wrap actions and replace the original ones:

```js
// use any debounce library
import debounce from 'lodash/debunce'

pinia.use(({ options, store }) => {
  if (options.debounce) {
    return Object.keys(options.debounce).reduce((debouncedActions, action) => {
      debouncedActions[action] = debounce(
        store[action],
        options.debounce[action]
      )
      return debouncedActions
    }, {})
  }
})
```

## TypeScript

### Typing plugins

A Pinia plugin can be typed as follows:

```ts
import { PiniaPluginContext } from 'pinia'

export function myPiniaPlugin(context: PiniaPluginContext) {
  // ...
}
```

### Typing new store properties

When adding new properties to stores, you should also extend the `PiniaCustomProperties` interface.

```ts
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    hello: string
  }
}
```

It can then be written and read safely:

```ts
pinia.use(({ store }) => {
  store.hello = 'Hola'
  // @ts-expect-error: this will still add a string because refs get unwrapped
  store.hello = ref('Hola')
})
```

`PiniaCustomProperties` is a generic type that allows you to reference properties of a store. Imagine the following example where we copy over the initial options as `$options`:

```ts
pinia.use(({ options }) => ({ $options: options }))
```

We can properly type this by using the 4 generic types of `PiniaCustomProperties`:

```ts
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomProperties<Id, State, Getters, Actions> {
    $options: {
      id: Id
      state?: () => State
      getters?: Getters
      actions?: Actions
    }
  }
}
```

When creating new options for `defineStore()`, you should extend the `DefineStoreOptions`. Like `PiniaCustomProperties`, it also exposes all the generics that define a store, allowing you to limit what can be defined. For example, you can une the names of the actions:

```ts
import 'pinia'

declare module 'pinia' {
  export interface DefineStoreOptions<Id, State, Getters, Actions> {
    debounce?: {
      // allow defining a number of ms for any of the actions
      [k in keyof A]?: number
    }
  }
}
```
