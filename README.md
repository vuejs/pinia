<p align="center">
  <a href="https://pinia.esm.dev" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://pinia.esm.dev/logo.svg" alt="Pinia logo">
  </a>
</p>
<br/>
<p align="center">
  <a href="https://npmjs.com/package/pinia"><img src="https://badgen.net/npm/v/pinia/next" alt="npm package"></a>
  <a href="https://app.circleci.com/pipelines/github/posva/pinia?branch=v2"><img src="https://badgen.net/circleci/github/posva/pinia/v2" alt="build status"></a>
  <a href="https://codecov.io/github/posva/pinia"><img src="https://badgen.net/codecov/c/github/posva/pinia/v2" alt="code coverage"></a>
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

Pinia works both for Vue 2.x and Vue 3.x and you are currently on the branch that supports Vue 3.x. **If you are looking for the version compatible with Vue 3.x, check the [`v2` branch](https://github.com/posva/pinia/tree/v2)**.

Pinia is is the most similar English pronunciation of the word _pineapple_ in Spanish: _piña_. A pineapple is in reality a group of individual flowers that join together to create a multiple fruit. Similar to stores, each one is born individually, but they are all connected at the end. It's also a delicious tropical fruit indigenous to South America.

## 👉 [Demo on CodeSandbox](https://j4qzw.csb.app/)

Pinia works both for Vue 2.x and Vue 3.x and you are currently on the branch that supports Vue 3.x. [Go here for the Vue 2.x compatible version](https://github.com/posva/pinia/tree/v1).

## Help me keep working on this project 💚

- [Become a Sponsor on GitHub](https://github.com/sponsors/posva)
- [One-time donation via PayPal](https://paypal.me/posva)

<!-- <h3 align="center">Special Sponsors</h3> -->
<!--special start-->

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

**A**: Dynamic modules are not type safe, so instead [we allow creating different stores](#composing-stores) that can be imported anywhere

## Roadmap / Ideas

- [x] Should the state be merged at the same level as actions and getters?
- [ ] ~~Allow grouping stores together into a similar structure and allow defining new getters (`pinia`)~~
      You can directly call `useOtherStore()` inside of a getter or action.
- [ ] Getter with params that act like computed properties (@ktsn)

## Installation

```bash
yarn add pinia@next
# or with npm
npm install pinia@next
```

## Usage

### Install the plugin

Create a pinia (the root store) and pass it to app:

```js
import { createPinia } from 'pinia'

app.use(createPinia())
```

This will also add devtools support. Some features like time traveling and editing are still not supported because vue-devtools doesn't expose the necessary APIs yet.

### Creating a Store

You can create as many stores as you want, and they should each exist in different files:

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
      return this.counter * 2
    },
    // use getters in other getters
    doubleCountPlusOne() {
      return this.doubleCount * 2
    },
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

Note: the SSR implementation on Pinia might change, but if you intend having SSR on your application, you should avoid using `useStore` functions at the root level of a file to make sure the correct store is retrieved for your currently running application instance. Here is an example:

**Avoid doing this**:

```ts
import { createRouter } from 'vue-router'
const router = createRouter({
  // ...
})

// ❌ Depending on where you do this it will fail
const main = useMainStore()

router.beforeEach((to, from, next) => {
  if (main.isLoggedIn) next()
  else next('/login')
})
```

Instead, call `useMainStore()` at the top of `setup`, like `inject` and `provide` in Vue:

```ts
export default defineComponent({
  setup() {
    // ✅ This will work
    const main = useMainStore()

    return {}
  },
})

// In a different file...
const pinia = createPinia()
app.use(pinia)

router.beforeEach((to) => {
  // ✅ This will work (requires pinia param when outside of setup on both
  // Client and Server. See the SSR section below for more information)
  const main = useMainStore(pinia)

  if (to.meta.requiresAuth && !main.isLoggedIn) return '/login'
})
```

⚠️: Note that if you are developing an SSR application, [you will need to do a bit more](#ssr).

You can access any property defined in `state` and `getters` directly on the store, similar to `data` and `computed` properties in a Vue component.

```ts
export default defineComponent({
  setup() {
    const main = useMainStore()
    const text = main.name // "eduardo"
    const doubleCount = main.doubleCount // 2

    return {
      text, // will always be "eduardo"
      textDynamic: computed(() => main.name), // reactive value
    }
  },
})
```

The `main` store in an object wrapped with `reactive`, meaning there is no need to write `.value` after getters but, like `props` in `setup`, we cannot destructure it:

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

### Replacing the `state`

Simply set your store `$stet` property to a new object:

```ts
main.$state = { counter: 666, name: 'Paimon' }
```

### SSR

Creating stores with Pinia should work out of the box for SSR as long as you call your `useStore()` functions at the top of `setup` functions, `getters` and `actions`:

```ts
export default defineComponent({
  setup() {
    // this works because pinia knows what application is running
    const main = useMainStore()
    return { main }
  },
})
```

If you need to use the store somewhere else, you need to pass the `pinia` instance [that was passed to the app](#install-the-plugin) to the `useStore()` function call:

```ts
const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

router.beforeEach((to) => {
  // ✅ This will work make sure the correct store is used for the current running app
  const main = useMainStore(pinia)

  if (to.meta.requiresAuth && !main.isLoggedIn) return '/login'
})
```

To hydrate the initial state, you need to make sure the rootState is included somewhere in the HTML for Pinia to pick it up later on:

```js
import { createPinia } from 'pinia'
// retrieve the rootState server side
const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)

// after rendering the page, the root state is build and can be read
// serialize, escape (VERY important if the content of the state can be changed
// by the user, which is almost always the case), and place it somewhere on
// the page, for example, as a global variable. Note you need to use your own
// `escapeHTML()` function or use an existing package
escapeHTML(JSON.stringify(pinia.state.value))
```

On client side, you must hydrate pinia's state before calling any `useStore()` function. For example, if we serialize the state into a `<script>` tag to make it accessible globally on client side through `window.__pinia`, we can write this:

```js
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// must be set by the user
if (isClient) {
  pinia.state.value = JSON.parse(window.__pinia)
}
```

### Composing Stores

Composing stores may look hard at first glance but there is only one rule to follow really:

If **multiple stores use each other** or you need to use **multiple stores** at the same time, you must create a **separate file** where you import all of them.

If one store uses an other store, there is no need to create a new file, you can directly import it. Think of it as nesting.

You can call `useOtherStore()` at the top of any getter an action:

```ts
import { useUserStore } from './user'

export const cartStore = defineStore({
  id: 'cart',
  getters: {
    // ... other getters
    summary() {
      const user = useUserStore()

      return `Hi ${user.name}, you have ${this.list.length} items in your cart. It costs ${this.price}.`
    },
  },

  actions: {
    purchase() {
      const user = useUserStore()

      return apiPurchase(user.id, this.list)
    },
  },
})
```

#### Shared Getters

If you need to compute a value based on the `state` and/or `getters` of multiple stores, you may be able to import all the stores but one into the remaining store, but depending on how your stores are used across your application, **this would hurt your code splitting** because importing the store that imports all others stores, would result in **one single big chunk** with all of your stores.
To prevent this, **we follow the rule above** and we create a new file with a new store:

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

#### Shared Actions

When an actions needs to use multiple stores, we do the same, we create a new file with a new store:

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

## Plugins

TODO: `pinia.use()` + `interface PiniaCustomProperties` for TS

## Subscribing to changes

TODO: `store.$subscribe()`

## Related

## License

[MIT](http://opensource.org/licenses/MIT)
