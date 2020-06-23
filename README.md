# Pinia [![Build Status](https://badgen.net/circleci/github/posva/pinia/master)](https://circleci.com/gh/posva/pinia) [![npm package](https://badgen.net/npm/v/pinia)](https://www.npmjs.com/package/pinia) [![coverage](https://badgen.net/codecov/c/github/posva/pinia/master)](https://codecov.io/github/posva/pinia) [![thanks](https://badgen.net/badge/thanks/♥/pink)](https://github.com/posva/thanks)

> Pronounced like the fruit in Spanish, _Piña_
>
> _Piña_ is also an invalid package name... that's why it has to be _pinia_ which sounds very similar

🍍Automatically Typed, Modular and lightweight (but **Experimental**) Store for Vue based on the composition api with devtools support

## 👉 [Demo](https://vcuiu.csb.app/)

⚠️⚠️⚠️ This project is experimental, it's an exploration of what a _Store_ could be like using [the composition api](https://vue-composition-api-rfc.netlify.com). It works for Vue 2 by using the [official library](https://github.com/vuejs/composition-api).

**If you are looking for the version compatible with Vue 3.x, check the [`next` branch](https://github.com/posva/pinia/tree/next)**

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

<p align="center">
  <a href="https://vuetifyjs.com" target="_blank" title="Vuetify">
    <img src="https://vuejs.org/images/vuetify.png" alt="Vuetify logo" height="48px">
  </a>
</p>

<h3 align="center">Bronze Sponsors</h3>

<p align="center">
  <a href="https://www.storyblok.com" target="_blank" title="Storyblok">
    <img src="https://a.storyblok.com/f/51376/3856x824/fea44d52a9/colored-full.png" alt="Storyblok logo" height="32px">
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
- [x] Should the state be merged at the same level as actions and getters?
- [ ] Flag to remove devtools support (for very light production apps)
- [ ] Allow grouping stores together into a similar structure and allow defining new getters (`pinia`)
- ~~Getter with params that act like computed properties (@ktsn)~~
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

`createStore` returns a function that has to be called to get access to the store:

```ts
import { useMainStore } from '@/stores/main'

export default defineComponent({
  setup() {
    const main = useMainStore()

    return {
      // gives access to the whole store
      main,
      // gives access only to the state
      state: computed(() => main.state),
      // gives access to specific getter; like `computed` properties
      doubleCount: computed(() => main.doubleCount),
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
  // ✅ This will work (requires an extra param for SSR, see below)
  const main = useMainStore()

  if (main.state.isLoggedIn) next()
  else next('/login')
})
```

⚠️: Note that if you are developing an SSR application, [you will need to do a bit more](#ssr).

You can access any property defined in `state` and `getters` directly on the store, similar to `data` and `computed` properties in a Vue component.

```ts
export default defineComponent({
  setup() {
    const main = useMainStore()
    const text = main.name
    const doubleCount = main.doubleCount
    return {}
  },
})
```

The `main` store in an object wrapped with `reactive`, meaning there is no need to write `.value` after getters but, like `props` in `setup`, we cannot destructure it:

```ts
export default defineComponent({
  setup() {
    // ❌ This won't work, it breaks reactivity
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

By default, it will also disable Vuex so you can directly use the `store` folder for pinia. If you want to keep using Vuex, you need to provide an option in `nuxt.config.js`:

```js
export default {
  disableVuex: false,
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

Note: **This is necessary in middlewares and other asynchronous methods**.

It may look like things are working even if you don't pass `req` to `useStore` **but multiple concurrent requests to the server could end up sharing state between different users**.

#### Raw Vue SSR

In a Raw Vue SSR application you have to modify a few files to enable hydration and to tell requests apart.

```js
// entry-server.js
import { getRootState, PiniaSsr } from 'pinia'

// install plugin to automatically use correct context in setup and onServerPrefetch
Vue.use(PiniaSsr)

export default context => {
  /* ... */
  context.rendered = () => {
    // pass state to context
    context.piniaState = getRootState(context.req)
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
import { setStateProvider } from 'pinia'

// inject ssr-state
setStateProvider(() => window.__PINIA_STATE__)
```

### Accessing other Stores

You can `useOtherStore` inside a store `actions` and `getters`:

Actions are simply function that contain business logic. As with components, they **must call `useStore`** to retrieve the store:

```ts
createStore({
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

      return `Hi ${user.name}, you have ${cart.list.length} items in your cart. It costs ${cart.price}.`
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
        await apiOrderCart(user.token, cart.items)
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
      combinedGetter () {
        return `Hi ${this.user.name}, you have ${this.cart.list.length} items in your cart. It costs ${this.cart.price}.`,
      }
    },
    actions: {
      async orderCart() {
        try {
          await apiOrderCart(this.user.token, this.cart.items)
          this.cart.emptyCart()
        } catch (err) {
          displayError(err)
        }
      },
    },
  }
)
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

export const useMainStore = createStore({
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
