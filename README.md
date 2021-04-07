<p align="center">
  <a href="https://pinia.esm.dev" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://pinia.esm.dev/logo.svg" alt="Pinia logo">
  </a>
</p>
<br/>
<p align="center">
  <a href="https://npmjs.com/package/pinia"><img src="https://badgen.net/npm/v/pinia" alt="npm package"></a>
  <a href="https://github.com/posva/pinia/actions/workflows/test.yml?query=branch%3Av1"><img src="https://github.com/posva/pinia/workflows/test/badge.svg?branch=v1" alt="build status"></a>
  <a href="https://codecov.io/github/posva/pinia"><img src="https://badgen.net/codecov/c/github/posva/pinia/v1" alt="code coverage"></a>
</p>
<br/>

# Pinia

> Intuitive, type safe and flexible Store for Vue

- 💡 Intuitive
- 🔑 Type Safe
- ⚙️ Devtools support
- 🔌 Extensible
- 🏗 Modular by design
- 📦 Extremely light

## 👉 [Demo](https://vcuiu.csb.app/)

Pinia works both for Vue 2.x and Vue 3.x and you are currently on the branch that supports Vue 2.x. **If you are looking for the version compatible with Vue 3.x, check the [`v2` branch](https://github.com/posva/pinia/tree/v2)**.

Pinia is is the most similar English pronunciation of the word _pineapple_ in Spanish: _piña_. A pineapple is in reality a group of individual flowers that join together to create a multiple fruit. Similar to stores, each one is born individually, but they are all connected at the end. It's also a delicious tropical fruit indigenous to South America.

**Help me keep working on Open Source in a sustainable way 🚀**. Help me with as little as \$1 a month, [sponsor me on Github](https://github.com/sponsors/posva).

<h4 align="center">Gold Sponsors</h4>

<p align="center">
  <a href="https://passionatepeople.io/" target="_blank" rel="noopener noreferrer">
    <img src="https://img2.storyblok.com/0x200/filters::format(webp)/f/86387/x/4cf6a70a8c/logo-white-text.svg" height="72px" alt="Passionate People">
  </a>
</p>

<h4 align="center">Silver Sponsors</h4>

<p align="center">
  <a href="https://www.vuemastery.com" target="_blank" rel="noopener noreferrer">
    <img src="https://www.vuemastery.com/images/vuemastery.svg" height="42px" alt="Vue Mastery">
  </a>

  <a href="https://vuetifyjs.com" target="_blank" rel="noopener noreferrer">
    <img src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-light-text.svg" alt="Vuetify" height="42px">
  </a>

  <a href="https://www.codestream.com/?utm_source=github&utm_campaign=vuerouter&utm_medium=banner" target="_blank" rel="noopener noreferrer">
    <img src="https://alt-images.codestream.com/codestream_logo_vuerouter.png" alt="CodeStream" height="42px">
  </a>
</p>

<h4 align="center">Bronze Sponsors</h4>

<p align="center">
  <a href="https://storyblok.com" target="_blank" rel="noopener noreferrer">
    <img src="https://a.storyblok.com/f/51376/3856x824/fea44d52a9/colored-full.png" alt="Storyblok" height="32px">
  </a>

  <a href="https://nuxtjs.org" target="_blank" rel="noopener noreferrer">
    <img src="https://nuxtjs.org/logos/nuxtjs-typo-white.svg" alt="Storyblok" height="32px">
  </a>
</p>

---

## FAQ

A few notes about the project and possible questions:

**Q**: _Does this replace Vuex, is it its successor?_

**A**: No, or at least that's not the main intention

**Q**: _What about dynamic modules?_

**A**: Dynamic modules are not type safe, so instead [we allow creating different stores](#composing-stores) that can be imported anywhere **making them dynamic by design**!

## Roadmap / Ideas

- [ ] List Getters on DevTools
- [x] Nuxt Module
- [x] Should the state be merged at the same level as actions and getters?
- [ ] Flexible plugin API
- [ ] Flag to remove devtools support (for very light production apps)
- [ ] Strict mode to disable state changes outside of actions

## Usage

### Installation

### Vue

Pinia requires the Vue (or Nuxt) Composition API library.

```bash
yarn add pinia @vue/composition-api
# or with npm
npm install pinia @vue/composition-api
```

```js
import Vue from 'vue'
import VueCompositionAPI from '@vue/composition-api'
import { PiniaPlugin, createPinia } from 'pinia'

Vue.use(VueCompositionAPI)
Vue.use(PiniaPlugin)

const pinia = createPinia()

new Vue({
  el: '#app',
  pinia,
  // ...
})
```

#### Nuxt

```sh
yarn add pinia @nuxtjs/composition-api
# or with npm
npm install pinia @nuxtjs/composition-api
```

Add the pinia module after the composition api to `buildModules` in `nuxt.config.js`:

```js
// nuxt.config.js
export default {
  // ... other options
  buildModules: ['@nuxtjs/composition-api', 'pinia/nuxt'],
}
```

If you are using TypeScript, you should also add the types for `context.pinia`:

```json
{
  "include": [
    // ...
    "pinia/nuxt/types"
  ]
}
```

### Defining a Store

You can define as many stores as you want, and they should each exist in different files:

```ts
import { defineStore } from 'pinia'

export const useMainStore = defineStore({
  // name of the store
  // it is used in devtools and allows restoring state
  id: 'main',
  // a function that returns a fresh state
  state: () => ({
    counter: 0,
    name: 'Eduardo',
  }),
  // optional getters
  getters: {
    doubleCount() {
      return this.counter * 2,
    },
    // use getters in other getters
    doubleCountPlusOne() {
      return this.doubleCount * 2
    }
  },
  // optional actions
  actions: {
    reset() {
      // `this` is the store instance
      this.counter = 0
    },
  },
})
```

`defineStore` returns a function that has to be called to get access to the store:

```ts
import { useMainStore } from '@/stores/main'

export default defineComponent({
  setup() {
    const main = useMainStore()

    return {
      // gives access to the whole store
      main,
      // gives access only to specific state
      state: computed(() => main.counter),
      // gives access to specific getter; like `computed` properties
      doubleCount: computed(() => main.doubleCount),
    }
  },
})
```

These functions should be called inside of `setup()` functions. If they are called outside, make sure the `createPinia()` has been called before:

```ts
import { useMainStore } from '@/stores/main'
// ❌ Depending on where you do this it will fail
// so just don't do it
const main = useMainStore()
const pinia = createPinia()
```

Or:

```ts
import Router from 'vue-router'
const router = new Router({
  // ...
})

// ❌ Depending on where you do this it will fail
const main = useMainStore()

router.beforeEach((to, from, next) => {
  if (main.$state.isLoggedIn) next()
  else next('/login')
})
```

It must be called **after the Composition API plugin is installed**. That's why calling `useStore` inside functions is usually safe, because they are called after the plugin being installed:

```ts
const pinia = createPinia()
const main = useMainStore()

// In a different file...
router.beforeEach((to, from, next) => {
  // ✅ This will work (requires an extra param for SSR, see below)
  const main = useMainStore()

  if (main.$state.isLoggedIn) next()
  else next('/login')
})
```

⚠️: Note that if you are developing an SSR application, [you will need to do a bit more](#ssr).

You can access any property defined in `state` and `getters` directly on the store, similar to `data` and `computed` properties in a Vue component.

```ts
export default defineComponent({
  setup() {
    const main = useMainStore()
    main.name // 'Eduardo'
    main.doubleCount // 2
    return {}
  },
})
```

The `main` store in an object wrapped with `reactive`, meaning there is no need to write `.value` after getters but, like `props` in `setup`, we cannot destructure them:

```ts
export default defineComponent({
  setup() {
    // ❌ This won't work because it breaks reactivity
    // it's the same as destructuring from `props`
    const { name, doubleCount } = useMainStore()
    return { name, doubleCount }
  },
})
```

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

### Mutating the `state`

To mutate the state you can either directly change something:

```ts
main.counter++
```

or call the method `$patch` that allows you apply multiple changes at the same time with a partial `state` object:

```ts
main.$patch({
  counter: -1,
  name: 'Abalam',
})
```

The main difference here is that `$patch` allows you to group multiple changes into one single entry in the devtools.

This is convenient to map a state property directly to a `v-model` without creating a computed with a setter.

### Replacing the `state`

Simply set it to a new object;

```ts
main.$state = { counter: 666, name: 'Paimon' }
```

You can also replace all stores state by setting the state on the `pinia` object returned by `createPinia()`:

```js
pinia.state.value = {
  main: { counter: 666, name: 'Paimon' },
}
```

Note: _This is useful for SSR or plugins that replace the whole state_

### SSR

When writing a Single Page Application, there always only one instance of the store, but on the server, each request will create new store instances. For Pinia to track which one should be used, we rely on the `pinia` object Pinia makes this automatic in a few places:

- actions
- getters
- `setup`

Meaning that you can call `useMainStore()` at the top of these functions and it will retrieve the correct store. **Calling it anywhere else requires you to pass the `pinia` to `useMainStore(pinia)`**. Pinia injects itself as `$pinia` in all components, giving you access to it in `serverPrefetch()`:

```js
function serverPrefetch() {
  const main = useMainStore(this.$pinia)
}
```

#### Nuxt

Make sure you added the module in [installation](#installation).

By default, it will also disable Vuex so you can directly use the `store` folder for pinia. If you want to keep using Vuex, you need to provide an option in `nuxt.config.js`:

```js
export default {
  // ...
  buildModules: [
    // ...
  ],
  disableVuex: false,
}
```

If you are dealing with SSR, in order to make sure the correct store is retrieved by `useStore` functions, pass the active `pinia` to `useStore`. **This is necessary anywhere not in the list above** but only during server side rendering. This is because on the client side there is always only one pinia instance but on the server there is one pinia instance per active application on your running server:

```js
export default {
  async fetch({ pinia }) {
    const store = useStore(pinia)
  },
}
```

Note: **This is necessary in middlewares and other asynchronous methods**.

It may look like things are working even if you don't pass `pinia` to `useStore` **but multiple concurrent requests to the server could end up sharing state between different users**. Fortunately you have access to `pinia` in the Nuxt Context.

#### Raw Vue SSR

In a Raw Vue SSR application you have to modify a few files to enable hydration and to tell requests apart.

```js
// entry-server.js
export default (context) => {
  const pinia = createPinia()
  /* ... */
  context.rendered = () => {
    // pass state to context
    context.piniaState = pinia.state.value
  }
  /* ... */
}
```

```html
<!-- index.html -->
<body>
  <!-- pass state from context to client -->
  {{{ renderState({ contextKey: 'piniaState', windowKey: '__PINIA_STATE__' })
  }}}
</body>
```

```js
// entry-client.js

const pinia = createPinia()
// install and inject pinia...
// ...
// inject ssr-state
pinia.state.value = window.__PINIA_STATE__
```

### Accessing other Stores

You can `useOtherStore()` inside a store `actions` and `getters`:

Since actions are functions that contain business logic, as in components, they **must call `useStore`** to retrieve the store:

```ts
defineStore({
  id: 'cart',
  state: () => ({ items: [] }),
  getters: {
    message() {
      const user = useUserStore()
      return `Hi ${user.name}, you have ${this.items.length} items in the cart`
    },
  },
  actions: {
    async purchase() {
      const user = useUserStore()

      await apiBuy(user.token, this.items)

      this.items = []
    },
  },
})
```

### Composing Stores

If **multiple stores use each other** or you need to use **multiple stores** at the same time, you should create a **separate file** where you import all of them.

If one store uses an other store, there is no need to create a new file, you can directly import it like in [the example above](#accessing-other-stores). Think of it as nesting.

#### Shared Getters

If you need to compute a value based on the `state` and/or `getters` of multiple stores, you may be able to import all the stores but one into the remaining store, but depending on how your stores are used across your application, **this would hurt your code splitting** because importing the store that imports all others stores, would result in **one single big chunk** with all of your stores.
To prevent this, **we create a new file with a new store** that imports the other stores:

```ts
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { useCartStore } from './cart'

export const useSharedStore = defineStore({
  id: 'shared',
  getters: {
    summary() {
      const user = useUserStore()
      const cart = useCartStore()

      return `Hi ${user.name}, you have ${cart.list.length} items in your cart. It costs ${cart.price}.`
    },
  },
})
```

<!-- TODO: redo this example with more stores to make sense and move to advanced -->

#### Shared Actions

The same applies to actions:

```ts
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { useCartStore } from './cart'

export const useSharedStore = defineStore({
  id: 'shared',
  state: () => ({}),
  actions: {
    async orderCart() {
      const user = useUserStore()
      const cart = useCartStore()

      try {
        await apiOrderCart(user.token, cart.items)
        cart.emptyCart()
      } catch (err) {
        displayError(err)
      }
    },
  },
})
```

## TypeScript

Pinia is conceived to make typing automatic, benefiting both, JS and, TS users. There are however different ways of handling types when using TS

### Using an interface to type the `state`

If you want to define your own interface to type the _state_, explicitly type the return type of the `state` function:

```ts
interface MainState {
  counter: number
  name: string
}

export const useMainStore = defineStore({
  id: 'main',
  state: (): MainState => ({
    counter: 0,
    name: 'Paimon',
  }),
})
```

## Related

- Vuex 5

## License

[MIT](http://opensource.org/licenses/MIT)
