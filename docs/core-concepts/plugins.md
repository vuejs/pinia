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
pinia.use(({ store }) => {
  store.hello = ref('secret')
  // it gets automatically unwrapped
  store.hello // 'secret'
})
```

This is why you can access all computed properties without `.value`.

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

A Pinia plugin can be typed as follows:

```ts
import { PiniaPluginContext } from 'pinia'

export function myPiniaPlugin(context: PiniaPluginContext) {
  // ...
}
```

When adding new properties to stores, you should also extend the `PiniaCustomProperties` interface.

```ts
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    hello: string
  }
}
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
