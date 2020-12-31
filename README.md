# Pinia [![Build Status](https://badgen.net/circleci/github/posva/pinia/v2)](https://circleci.com/gh/posva/pinia) [![npm package](https://badgen.net/npm/v/pinia/next)](https://www.npmjs.com/package/pinia) [![coverage](https://badgen.net/codecov/c/github/posva/pinia/next)](https://codecov.io/github/posva/pinia) [![thanks](https://badgen.net/badge/thanks/♥/pink)](https://github.com/posva/thanks)

> Pronounced like the fruit in Spanish, _Piña_
>
> _Piña_ is also an invalid package name... that's why it has to be _pinia_ which sounds very similar

🍍 Automatically Typed, Modular and lightweight (but **Experimental**) Store for Vue 3.x based on the composition api with devtools support

## 👉 [Demo on CodeSandbox](https://j4qzw.csb.app/)

⚠️⚠️⚠️ This project is experimental, it's an exploration of what a _Store_ could be like using [the composition api](https://vue-composition-api-rfc.netlify.com). It works both for Vue 2.x and Vue 3.x and you are currently on the branch that supports Vue 3.x. [Go here for the Vue 2.x compatible version](https://github.com/posva/pinia/tree/v1).

What I want is to inspire others to think about ways to improve Vuex and come up with something that works very well with the composition api. Ideally it could also be used without it.

These are the core principles that I try to achieve with this experiment:

- Autocompletion: even if you write your code in JavaScript!
- Flat modular structure 🍍 No nesting, only stores, compose them as needed
- Light layer on top of Vue 💨 keep it very lightweight
- Only `state`, `getters` and `actions`
- No more verbose mutations, 👐 `patch` is _**the** mutation_
- Actions are like _methods_ ⚗️ Group your business logic there
- Import what you need, let webpack code split 📦 No need for dynamically registered modules
- SSR support ⚙️
- DevTools support 💻 Which is crucial to make this enjoyable

**Help me keep working on Open Source in a sustainable way 🚀**. Help me with as little as \$1 a month, [sponsor me on Github](https://github.com/sponsors/posva).

<h3 align="center">Silver Sponsors</h3>

<p align="center">
  <a href="https://www.vuemastery.com" title="Vue Mastery" target="_blank">
    <img src="https://www.vuemastery.com/images/lgo-vuemastery.svg" alt="Vue Mastery logo" height="48px">
  </a>
</p>

<h3 align="center">Bronze Sponsors</h3>

<p align="center">
  <a href="https://vuetifyjs.com" target="_blank" title="Vuetify">
    <img src="https://vuejs.org/images/vuetify.png" height="32px">
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

```sh
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
**NOTE**: this API is still experimental and is currently only used for devtools and SSR but that might change in the future.

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

Simply set it to a new object;

```ts
main.state = { counter: 666, name: 'Paimon' }
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
import { createPinia, getRootState } from 'pinia'
// retrieve the rootState server side
const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)

// after rendering the page, the root state is build and can be read
getRootState() // serialize, escape, and place it somewhere on the page, for example, as a global variable
```

On client side, you must tell pinia how to read that variable:

```js
import { setStateProvider } from 'pinia'

// if the previous step appended a script to the page that sets a global variable named `__pinia` with the rootState
setStateProvider(() => window.__pinia)
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

## Related

## License

[MIT](http://opensource.org/licenses/MIT)
