## Installation

Install `pinia` with your favorite package manager:

```bash
yarn add pinia@next
# or with npm
npm install pinia@next
```

:::tip
Install Pinia v2 for Vue 3 `pinia@next` and Pinia v1 `pinia@latest` for Vue 2.
:::

Create a pinia (the root store) and pass it to app:

```js
import { createPinia } from 'pinia'

app.use(createPinia())
```

If you are using Vue 2, do:

```js
import { createPinia, PiniaPlugin } from 'pinia'

Vue.use(PiniaPlugin)
const pinia = createPinia()

new Vue({
  el: '#app',
  // other options...
  pinia,
})
```

This will also add devtools support. In Vue 3, some features like time traveling and editing are still not supported because vue-devtools doesn't expose the necessary APIs yet. In Vue 2, Pinia uses the existing interface for Vuex (and can therefore not be used alongside it).

## What is a Store?

A Store (like Pinia) is an entity holding state and business logic that isn't bound to your Component tree. In other words, **it hosts global state**. It's a bit like a component that is always there and that everybody can read off and write to. It has **three concepts**, the [state](./state.md), [getters](./getters.md) and [actions](./actions.md).

## When should I use a Store

A store should contain data that can be accessed throughout your application. This includes data that is used in many places, e.g. User information that is displayed in the navbar, as well as data that needs to be preserved through pages, e.g. a very complicated multi-step form.

On the other hand, you should avoid including in the store local data that could be hosted in a component instead, e.g. the visibility of an element local to a page.

Not all applications need access to a global state, but if yours need one, Pinia will make your life easier.
