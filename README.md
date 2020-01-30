# Pinia [![Build Status](https://badgen.net/circleci/github/posva/pinia/master)](https://circleci.com/gh/posva/pinia) [![npm package](https://badgen.net/npm/v/pinia)](https://www.npmjs.com/package/pinia) [![coverage](https://badgen.net/codecov/c/github/posva/pinia/master)](https://codecov.io/github/posva/pinia) [![thanks](https://badgen.net/badge/thanks/♥/pink)](https://github.com/posva/thanks)

> Pronounced like the fruit in Spanish, _Piña_
>
> _Piña_ is also an invalid package name... that's why it has to be _pinia_ which sounds very similar

🍍Automatically Typed, Modular and lightweight (but **Experimental**) Store for Vue based on the composition api with devtools support

## 👉 [Demo](https://vcuiu.csb.app/)

⚠️⚠️⚠️ This project is experimental, it's an exploration of what a _Store_ could be like using [the composition api](https://vue-composition-api-rfc.netlify.com). It works for Vue 2 by using the [official library](https://github.com/vuejs/composition-api).

What I want is to inspire others to think about ways to improve Vuex and come up with something that works very well with the composition api. Ideally it could also be used without it. **@vue/composition-api is necessary**.

There are the core principles that I try to achieve with this experiment:

- Flat modular structure 🍍 No nesting, only stores, compose them as needed
- Light layer on top of Vue 💨 keep it very lightweight
- Only `state`, `getters` 👐 `patch` is the new _mutation_
- Actions are like _methods_ ⚗️ Group your business there
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

- [ ] List Getters on DevTools
- [x] Nuxt Module
- [ ] Should the state be merged at the same level as actions and getters?
- [ ] Flag to remove devtools support (for very light production apps)
- [ ] Allow grouping stores together into a similar structure and allow defining new getters (`pinia`)
- [ ] Getter with params that act like computed properties (@ktsn)
- [ ] Passing all getters to a getter (need Typing support)

## Installation

```sh
yarn add pinia @vue/composition-api
# or with npm
npm install pinia @vue/composition-api
```

Note: **The Vue Composition API plugin must be installed for Pinia to work**

## Usage

### Creating a Store

You can create as many stores as you want, and they should each exist in different files:

```ts
import { createStore } from 'pinia'

export const useMainStore = createStore({
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
    doubleCount: (state, getters) => state.counter * 2,
    // use getters in other getters
    doubleCountPlusOne: (state, { doubleCount }) => doubleCount.value * 2,
  },
  // optional actions
  actions: {
    reset() {
      // `this` is the store instance
      this.state.counter = 0
    },
  },
})
```

`createStore` returns a function that has to be called to get access to the store:

```ts
import { useMainStore } from '@/stores/main'

export default defineComponent({
  setup() {
    const main = useMainStore()

    return {
      // gives access to the whole store
      main,
      // gives access to the state
      state: main.state,
      // gives access to specific getter,
    }
  },
})
```

**There is one important rule for this to work**: the `useMainStore` (or any other _useStore_ function) must be called inside of deferred functions. This is to allow the **Vue Composition API plugin to be installed**. **Never, ever call `useStore`** like this:

```ts
import { useMainStore } from '@/stores/main'
// ❌ Depending on where you do this it will fail
// so just don't do it
const main = useMainStore()

export default defineComponent({
  setup() {
    return {}
  },
})
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
  if (main.state.isLoggedIn) next()
  else next('/login')
})
```

It must be called **after the Composition API plugin is installed**. That's why calling `useStore` inside functions is usually safe, because they are called after the plugin being installed:

```ts
export default defineComponent({
  setup() {
    // ✅ This will work
    const main = useMainStore()

    return {}
  },
})

// In a different file...

router.beforeEach((to, from, next) => {
  // ✅ This will work
  const main = useMainStore()

  if (main.state.isLoggedIn) next()
  else next('/login')
})
```

⚠️: Note that if you are developing an SSR application, [you will need to do a bit more](#ssr).

Once you have access to the store, you can access the `state` through `store.state` and any getter directly on the `store` itself as a _computed_ property (from `@vue/composition-api`) (meaning you need to use `.value` to read the actual value on the JavaScript but not in the template):

```ts
export default defineComponent({
  setup() {
    const main = useMainStore()
    const text = main.state.name
    const doubleCount = main.doubleCount.value // notice the `.value` at the end
    return {}
  },
})
```

`state` is the result of a `ref` while every getter is the result of a `computed`. Both from `@vue/composition-api`.

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
main.state.counter++
```

or call the method `patch` that allows you apply multiple changes at the same time with a partial `state` object:

```ts
main.patch({
  counter: -1,
  name: 'Abalam',
})
```

The main difference here is that `patch` allows you to group multiple changes into one single entry in the devtools.

### Replacing the `state`

Simply set it to a new object;

```ts
main.state = { counter: 666, name: 'Paimon' }
```

### SSR

When writing a Single Page Application, there always only one instance of the store, but on the server, each request will create new store instances. For Pinia to track which one should be used, we rely on the _Request_ object (usually named `req`). Pinia makes this automatic in a few places:

- actions
- getters
- `setup`
- `serverPrefetch`

Meaning that you can call `useMainStore` at the top of these functions and it will retrieve the correct store. **Calling it anywhere else requires you to pass the current `req` to `useMainStore`**.

#### Nuxt Plugin

SSR is much easier with Nuxt, and so is for Pinia: include the Pinia module in your `buildModules` in your `nuxt.config.js`:

```js
export default {
  // ...
  // rest of the nuxt config
  // ...
  buildModules: ['pinia/nuxt'],
}
```

If you are dealing with SSR, in order to make sure the correct store is retrieved by `useStore` functions, pass the current `req` to `useStore`. **This is necessary anywhere not in the list above**:

```js
export default {
  async fetch({ req }) {
    const store = useStore(req)
  },
}
```

Note: **This is necessary in middlewares and other asyncronous methods**

It may look like things are working even if you don't pass `req` to `useStore` **but multiple concurrent requests to the server could end up sharing state between different users**.

#### Raw Vue SSR

TODO: this part isn't built yet. You need to call `setActiveReq` with the _Request_ object before `useStore` is called

### Accessing other Stores

You can `useOtherStore` inside a store `actions` and `getters`:

Actions are simply function that contain business logic. As with components, they **must call `useStore`** to retrieve the store:

```ts
createStore({
  id: 'cart',
  state: () => ({ items: [] }),
  getters: {
    message: state => {
      const user = useUserStore()
      return `Hi ${user.state.name}, you have ${items.length} items in the cart`
    },
  },
  actions: {
    async purchase() {
      const user = useUserStore()

      await apiBuy(user.state.token, this.state.items)

      this.state.items = []
    },
  },
})
```

### Composing Stores

Composing stores may look hard at first glance but there is only one rule to follow really:

If **multiple stores use each other** or you need to use **multiple stores** at the same time, you must create a **separate file** where you import all of them.

If one store uses an other store, there is no need to create a new file, you can directly import it. Think of it as nesting.

#### Shared Getters

If you need to compute a value based on the `state` and/or `getters` of multiple stores, you may be able to import all the stores but one into the remaining store, but depending on how your stores are used across your application, **this would hurt your code splitting** because importing the store that imports all others stores, would result in **one single big chunk** with all of your stores.
To prevent this, **we follow the rule above** and we create a new file with a new store:

```ts
import { createStore } from 'pinia'
import { useUserStore } from './user'
import { useCartStore } from './cart'

export const useSharedStore = createStore({
  id: 'shared',
  getters: {
    summary() {
      const user = useUserStore()
      const cart = useCartStore()

      return `Hi ${user.state.name}, you have ${cart.state.list.length} items in your cart. It costs ${cart.price}.`
    },
  },
})
```

#### Shared Actions

When an actions needs to use multiple stores, we do the same, we create a new file with a new store:

```ts
import { createStore } from 'pinia'
import { useUserStore } from './user'
import { useCartStore } from './cart'

export const useSharedStore = createStore({
  id: 'shared',
  state: () => ({}),
  actions: {
    async orderCart() {
      const user = useUserStore()
      const cart = useCartStore()

      try {
        await apiOrderCart(user.state.token, cart.state.items)
        cart.emptyCart()
      } catch (err) {
        displayError(err)
      }
    },
  },
})
```

#### Creating _Pinias_

_Not implemented_. Still under discussion, needs more feedback as this doesn't seem necessary because it can be replaced by shared stores as shown above.

Combine multiple _stores_ (gajos) into a new one:

```ts
import { pinia } from 'pinia'
import { useUserStore } from './user'
import { useCartStore, emptyCart } from './cart'

export const useCartUserStore = pinia(
  {
    user: useUserStore,
    cart: useCartStore,
  },
  {
    getters: {
      combinedGetter: ({ user, cart }) =>
        `Hi ${user.state.name}, you have ${cart.state.list.length} items in your cart. It costs ${cart.price}.`,
    },
    actions: {
      async orderCart() {
        try {
          await apiOrderCart(this.user.state.token, this.cart.state.items)
          this.cart.emptyCart()
        } catch (err) {
          displayError(err)
        }
      },
    },
  }
)
```

## Related

## License

[MIT](http://opensource.org/licenses/MIT)
