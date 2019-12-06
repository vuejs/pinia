# Pinia [![Build Status](https://badgen.net/circleci/github/posva/pinia/master)](https://circleci.com/gh/posva/pinia) [![npm package](https://badgen.net/npm/v/pinia)](https://www.npmjs.com/package/pinia) [![coverage](https://badgen.net/codecov/c/github/posva/pinia/master)](https://codecov.io/github/posva/pinia) [![thanks](https://badgen.net/badge/thanks/♥/pink)](https://github.com/posva/thanks)

> Pronounced like the fruit, in Spanish _Piña_
>
> _Piña_ is also an invalid package name...

🍍Type Safe Modular and lightweight (but **Experimental**) Store for Vue based on the composition api

Demo (TODO link)

⚠️⚠️⚠️ This project is experimental, it's an exploration of what a _Store_ could be like using [the composition api](https://vue-composition-api-rfc.netlify.com). It works for Vue 2 by using the [official library](https://github.com/vuejs/composition-api).

What I want is to inspire others to think about ways to improve Vuex and come up with something that works very well with the composition api but that can also be used **without it**.

There are the core principles that I try to achieve with this experiment:

- Flat modular structure 🍍 No nesting, only stores, compose them as needed
- Light layer on top of Vue 💨 keep it under 1kg gzip
- Only `state` and `getters` 👐 `patch` is the new _mutation_
- Actions are just functions ⚗️ Group your business there
- Import what you need, let webpack code split 📦 No need for dynamically registered modules
- SSR support ⚙️
- DevTools support 💻 Which is crucial to make this enjoyable

## FAQ

A few notes about the project and possible questions:

**Q**: _Does this replace Vuex, is it its successor?_

**A**: No, or at least that's not the main intention

**Q**: _What about dynamic modules?_

**A**: Dynamic modules are not type safe, so instead [we allow creating different stores](#composing-stores) that can be imported anywhere

## Roadmap / Ideas

- [ ] List Getters on DevTools
- [ ] Nuxt Module
- [ ] Automatic fresh store on Server Side?
- [ ] Flag to remove devtools support (for very light production apps)
- [ ] Allow grouping stores together into a similar structure and allow defining new getters

## Installation

```sh
yarn add pinia
# or with npm
npm install pinia
```

## Usage

### Creating a Store

You can create as many stores as you want, and they should each exist in isolated files:

```ts
import { createStore } from 'pinia'

export const useMainStore = createStore(
  // name of the store
  // it is used in devtools and allows restoring state
  'main',
  // a function that returns a fresh state
  () => ({
    counter: 0,
    name: 'Eduardo',
  }),
  // optional getters
  {
    doubleCount: state => state.counter * 2,
  }
)
```

`createStore` returns a function that has to be called to get access to the store:

```ts
import { useMainStore } from '@/stores/main'

export default createComponent({
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

**There is one important rule for this to work**: the `useMainStore` (or any other _useStore_ function) must be called inside of deffered functions. This is to allow the Vue Composition API plugin to be installed. **Never, ever call `useStore`** like this:

```ts
import { useMainStore } from '@/stores/main'
// ❌ Depending on where you do this it will fail
// so just don't do it
const main = useMainStore()

export default createComponent({
  setup() {
    return {}
  },
})
```

Once you have access to the store, you can access the `state` through `store.state` and any getter directly on the `store` itself as a _computed_ property (from `@vue/composition-api`) (meaning you need to use `.value` to read the actual value on the JavaScript but not in the template):

```ts
export default createComponent({
  setup() {
    const main = useMainStore()
    const text = main.state.name
    const doubleCount = main.doubleCount.value // notice the `.value` at the end
    return {}
  },
})
```

`state` is the result of a `ref` while every getter is the result of a `computed`. Both from `@vue/composition-api`.

### Mutating the `state`

To mutate the state you can either directly change something:

```ts
main.state.counter++
```

or call the method `patch` that allows you apply multiple changes at the same time with a partial `state` object:

```ts
main.patch({
  counter; -1,
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

The main part about SSR is **not sharing `state`** between requests. So we can pass `true` to `useStore` **once** when getting a new request on the server. If we follow [the SSR guide](https://ssr.vuejs.org/guide/data.html), our `createApp` should look like this:

```ts
export function createApp() {
  // Here there could also be a router
  const store = useStore(true)

  // we can change the state now!
  store.state.counter++

  // create the app instance
  const app = new Vue({
    render: h => h(App),
  })

  // expose the app and the store.
  return { app, store }
}
```

### Actions

Actions are simply function that contain business logic. As with components, they **must call `useStore`** to retrieve the store:

```ts
export async function login(user, password) {
  const store = useUserStore()
  const userData = await apiLogin(user, password)

  store.patch({
    name: user,
    ...userData,
  })
}
```

### Composing Stores

Composing stores may look hard at first glance but there is only one rule to follow really:

If **multiple stores use each other** or you need to use **multiple stores** at the same time, you must create a **separate file** where you import all of them.

If one store uses an other store, there is no need to create a new file, you can directly import it. Think of it as nesting.

#### Shared Getters

If you need to compute a value based on the `state` and/or `getters` of multiple stores, you may be able to import all the stores but one into the remaining store, but depending on how your stores are used across your application, **this would hurt your code splitting** as you importing the store that imports all others stores, would result in **one single big chunk** with all of your stores.
To prevent this, **we follow the rule above** and we create a new file:

```ts
import { computed } from '@vue/composition-api'
import { useUserStore } from './user'
import { useCartStore } from './cart'

export const summary = computed(() => {
  const user = useUserStore()
  const cart = useCartStore()

  return `Hi ${user.state.name}, you have ${cart.state.list.length} items in your cart. It costs ${cart.price}.`
})
```

#### Shared Actions

When an actions needs to use multiple stores, we do the same, we create a new file:

```ts
import { useUserStore } from './user'
import { useCartStore, emptyCart } from './cart'

export async function orderCart() {
  const user = useUserStore()
  const cart = useCartStore()

  try {
    await apiOrderCart(user.state.token, cart.state.items)
    emptyCart()
  } catch (err) {
    displayError(err)
  }
}
```

#### Creating _Pinias_

_Not implemented_. Replaces the examles above

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
    combinedGetter: state =>
      `Hi ${user.state.name}, you have ${cart.state.list.length} items in your cart. It costs ${cart.price}.`,
  }
)

export async function orderCart() {
  const store = useCartUserStore()

  try {
    await apiOrderCart(store.state.user.token, store.state.cart.items)
    emptyCart()
  } catch (err) {
    displayError(err)
  }
}
```

## Related

## License

[MIT](http://opensource.org/licenses/MIT)
