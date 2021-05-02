# Migrating from 0.0.7

The versions after `0.0.7`: `0.1.0`, and `0.2.0`, came with a few big breaking changes. This guide helps you migrate whether you use Vue 2 or Vue 3. The whole changelog can be found in the repository:

- [For Pinia <= 1 for Vue 2](https://github.com/posva/pinia/blob/v1/CHANGELOG.md)
- [For Pinia >= 2 for Vue 3](https://github.com/posva/pinia/blob/v2/CHANGELOG.md)

If you have questions or issues regarding the migration, feel free to [open a discussion](https://github.com/posva/pinia/discussions/categories/q-a) to ask for help.

## No more `store.state`

You no longer access the store state via a `state` property, you can directly access any state property.

Given a store defined with:

```js
const useStore({
  id: 'main',
  state: () => ({ counter: 0 })
})
```

Do

```diff
 const store = useStore()

-store.state.counter++
+store.counter.++
```

You can still access the whole store state with `$state` when needed:

```diff
-store.state = newState
+store.$state = newState
```

## Rename of store properties

All store properties (`id`, `patch`, `reset`, etc) are now prefixed with `$` to allow properties defined on the store with the same names. Tip: you can refactor your whole codebase with F2 (or right-click + Refactor) on each of the store's properties

```diff
 const store = useStore()
-store.patch({ counter: 0 })
+store.$patch({ counter: 0 })

-store.reset()
+store.$reset()

-store.id
+store.$id
```

## The Pinia instance

It's now necessary to create a pinia instance and install it:

If you are using Vue 2 (Pinia <= 1):

```js
import Vue from 'vue'
import { createPinia, PiniaPlugin } from 'pinia'

const pinia = createPinia()
Vue.use(PiniaPlugin)
new Vue({
  el: '#app',
  pinia,
  // ...
})
```

If you are using Vue 3 (Pinia >= 2):

```js
import { createApp } from 'vue'
import { createPinia, PiniaPlugin } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
createApp(App).use(pinia).mount('#app')
```

The `pinia` instance is what holds the state and should **be unique per application**. Check the SSR section of the docs for more details.

## SSR changes

The SSR plugin `PiniaSsr` is no longer necessary and has been removed.
With the introduction of pinia instances, `getRootState()` is no longer necessary and should be replaced with `pinia.state.value`:

If you are using Vue 2 (Pinia <= 1):

```diff
// entry-server.js
-import { getRootState, PiniaSsr } from 'pinia',
+import { createPinia, PiniaPlugin } from 'pinia',


-// install plugin to automatically use correct context in setup and onServerPrefetch
-Vue.use(PiniaSsr);
+Vue.use(PiniaPlugin)

 export default context => {
+  const pinia = createPinia()
   const app = new Vue({
     // other options
+    pinia
   })

   context.rendered = () => {
     // pass state to context
-    context.piniaState = getRootState(context.req)
+    context.piniaState = pinia.state.value
   };

-   return { app }
+   return { app, pinia }
 }
```

`setActiveReq()` and `getActiveReq()` have been replaced with `setActivePinia()` and `getActivePinia()` respectively. `setActivePinia()` can only be passed a `pinia` instance created with `createPinia()`. **Note that most of the time you won't directly use these functions**.
