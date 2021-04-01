# Plugins

Pinia stores can be fully extended thanks to a low level API. Here is a list of things you can do:

- Add new properties to stores
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

## Introduction

A Pinia plugin is a function that optionally returns properties to be added to a store. It takes one optional argument, a _context_:

```js
export function myPiniaPlugin(context) {
  context.pinia // the pinia created with `createPinia()`
  context.app // the current app created with `createApp()`
  context.store // the store the plugin is augmenting
  context.options // the options object defining the store passed to `defineStore()`
  // ...
}
```

This function is then passed to `pinia` with `pinia.use()`:

```js
pinia.use(myPiniaPlugin)
```

It will get executed **every time `useStore()`** is called to be able to extend them.

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

## TypeScript

A Pinia plugin can be typed as follows:

```ts
import { PiniaPluginContext } from 'pinia'

export myPiniaPlugin(context: PiniaPluginContext) {
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

We can type this with by using the 4 generic types

```ts
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomProperties<Id, State, Getters, Actions> {
    $options: {
      id: Id
      state?: () => State
      getters?: G
      actions?: A
    }
  }
}
```
