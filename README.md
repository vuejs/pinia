# Pinia [![Build Status](https://badgen.net/circleci/github/posva/pinia/next)](https://circleci.com/gh/posva/pinia) [![npm package](https://badgen.net/npm/v/pinia/next)](https://www.npmjs.com/package/pinia) [![coverage](https://badgen.net/codecov/c/github/posva/pinia/next)](https://codecov.io/github/posva/pinia) [![thanks](https://badgen.net/badge/thanks/♥/pink)](https://github.com/posva/thanks)

> Pronounced like the fruit in Spanish, _Piña_
>
> _Piña_ is also an invalid package name... that's why it has to be _pinia_ which sounds very similar

🍍Automatically Typed, Modular and lightweight (but **Experimental**) Store for Vue 3.x based on the composition api with devtools support

## 👉 [Demo](https://github.com/posva/vue-next-pinia)

⚠️⚠️⚠️ This project is experimental, it's an exploration of what a _Store_ could be like using [the composition api](https://vue-composition-api-rfc.netlify.com). It works both for Vue 2.x and Vue 3.x and you are currently on the branch that supports Vue 3.x. [Go here for the Vue 2.x compatible version](https://github.com/posva/pinia/tree/master).

What I want is to inspire others to think about ways to improve Vuex and come up with something that works very well with the composition api. Ideally it could also be used without it.

There are the core principles that I try to achieve with this experiment:

- Flat modular structure 🍍 No nesting, only stores, compose them as needed
- Light layer on top of Vue 💨 keep it very lightweight
- Only `state`, `getters`
- No more verbose mutations, 👐 `patch` is _the mutation_
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

- [ ] Should the state be merged at the same level as actions and getters?
- [ ] Allow grouping stores together into a similar structure and allow defining new getters (`pinia`)
- [ ] Getter with params that act like computed properties (@ktsn)
- [ ] Passing all getters to a getter (need Typing support)

## Installation

```sh
yarn add pinia@next
# or with npm
npm install pinia@next
```

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
      // gives access only to specific state
      state: computed(() => main.counter),
      // gives access to specific getter; like `computed` properties
      doubleCount: computed(() => main.doubleCount),
    }
  },
})
```

Note: the SSR implementation is yet to be decided on Pinia, but if you intend having SSR on your application, you should avoid using `useStore` functions at the root level of a file to make sure the correct store is retrieved for your request.

Or:

```ts
import { createRouter } from 'vue-router'
const router = createRouter({
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

or call the method `patch` that allows you apply multiple changes at the same time with a partial `state` object:

```ts
main.patch({
  counter: -1,
  name: 'Abalam',
})
```

The main difference here is that `patch` allows you to group multiple changes into one single entry in the devtools (which are not yet available for Vue 3.x).

### Replacing the `state`

Simply set it to a new object;

```ts
main.state = { counter: 666, name: 'Paimon' }
```

### SSR

To be decided once SSR is implemented on Vue 3

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

## Related

## License

[MIT](http://opensource.org/licenses/MIT)
