<p align="center">
  <a href="https://pinia.vuejs.org" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://pinia.vuejs.org/logo.svg" alt="Pinia logo">
  </a>
</p>
<br/>
<p align="center">
  <a href="https://npmjs.com/package/pinia"><img src="https://badgen.net/npm/v/pinia" alt="npm package"></a>
  <a href="https://github.com/vuejs/pinia/actions/workflows/test.yml?query=branch%3Av2"><img src="https://github.com/vuejs/pinia/workflows/test/badge.svg?branch=v2" alt="build status"></a>
  <a href="https://codecov.io/github/vuejs/pinia"><img src="https://badgen.net/codecov/c/github/vuejs/pinia/v2" alt="code coverage"></a>
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

Pinia works both for Vue 2.x and Vue 3.x. It requires Vue 2 with the latest `@vue/composition-api` or Vue `^3.2.0-0`.

Pinia is the most similar English pronunciation of the word _pineapple_ in Spanish: _piña_. A pineapple is in reality a group of individual flowers that join together to create a multiple fruit. Similar to stores, each one is born individually, but they are all connected at the end. It's also a delicious tropical fruit indigenous to South America.

## 👉 [Demo with Vue 3 on StackBlitz](https://stackblitz.com/github/piniajs/example-vue-3-vite)

## 👉 [Demo with Nuxt 3 on StackBlitz](https://stackblitz.com/github/piniajs/example-nuxt-3)

## Help me keep working on this project 💚

- [Become a Sponsor on GitHub](https://github.com/sponsors/posva)
- [One-time donation via PayPal](https://paypal.me/posva)

<!--sponsors start-->

<h4 align="center">Gold Sponsors</h4>
<p align="center">
    <a href="https://vuejobs.com/?utm_source=vuerouter&utm_campaign=sponsor" target="_blank" rel="noopener noreferrer">
    <picture>
      <source srcset="https://posva-sponsors.pages.dev/logos/vuejobs.svg" media="(prefers-color-scheme: dark)" height="72px" alt="VueJobs" />
      <img src="https://posva-sponsors.pages.dev/logos/vuejobs.svg" height="72px" alt="VueJobs" />
    </picture>
  </a>
</p>

<h4 align="center">Silver Sponsors</h4>
<p align="center">
    <a href="https://www.vuemastery.com/" target="_blank" rel="noopener noreferrer">
    <picture>
      <source srcset="https://posva-sponsors.pages.dev/logos/vuemastery-dark.png" media="(prefers-color-scheme: dark)" height="42px" alt="VueMastery" />
      <img src="https://posva-sponsors.pages.dev/logos/vuemastery-light.svg" height="42px" alt="VueMastery" />
    </picture>
  </a>
    <a href="https://www.prefect.io/" target="_blank" rel="noopener noreferrer">
    <picture>
      <source srcset="https://posva-sponsors.pages.dev/logos/prefectlogo-dark.svg" media="(prefers-color-scheme: dark)" height="42px" alt="Prefect" />
      <img src="https://posva-sponsors.pages.dev/logos/prefectlogo-light.svg" height="42px" alt="Prefect" />
    </picture>
  </a>
</p>

<h4 align="center">Bronze Sponsors</h4>
<p align="center">
    <a href="https://stormier.ninja" target="_blank" rel="noopener noreferrer">
    <picture>
      <source srcset="https://avatars.githubusercontent.com/u/2486424?u=7b0c73ae5d090ce53bf59473094e9606fe082c59&v=4" media="(prefers-color-scheme: dark)" height="26px" alt="Stanislas OrmiÃ¨res" />
      <img src="https://avatars.githubusercontent.com/u/2486424?u=7b0c73ae5d090ce53bf59473094e9606fe082c59&v=4" height="26px" alt="Stanislas OrmiÃ¨res" />
    </picture>
  </a>
    <a href="www.vuejs.de" target="_blank" rel="noopener noreferrer">
    <picture>
      <source srcset="https://avatars.githubusercontent.com/u/4183726?u=6b50a8ea16de29d2982f43c5640b1db9299ebcd1&v=4" media="(prefers-color-scheme: dark)" height="26px" alt="Antony Konstantinidis" />
      <img src="https://avatars.githubusercontent.com/u/4183726?u=6b50a8ea16de29d2982f43c5640b1db9299ebcd1&v=4" height="26px" alt="Antony Konstantinidis" />
    </picture>
  </a>
    <a href="https://storyblok.com" target="_blank" rel="noopener noreferrer">
    <picture>
      <source srcset="https://posva-sponsors.pages.dev/logos/storyblok.png" media="(prefers-color-scheme: dark)" height="26px" alt="Storyblok" />
      <img src="https://posva-sponsors.pages.dev/logos/storyblok.png" height="26px" alt="Storyblok" />
    </picture>
  </a>
    <a href="https://nuxtjs.org" target="_blank" rel="noopener noreferrer">
    <picture>
      <source srcset="https://posva-sponsors.pages.dev/logos/nuxt-dark.svg" media="(prefers-color-scheme: dark)" height="26px" alt="NuxtJS" />
      <img src="https://posva-sponsors.pages.dev/logos/nuxt-light.svg" height="26px" alt="NuxtJS" />
    </picture>
  </a>
</p>

<!--sponsors end-->

---

## FAQ

A few notes about the project and possible questions:

**Q**: _Is Pinia the successor of Vuex?_

**A**: [Yes](https://vuejs.org/guide/scaling-up/state-management.html#pinia)

**Q**: _What about dynamic modules?_

**A**: Dynamic modules are not type safe, so instead [we allow creating different stores](https://pinia.vuejs.org/cookbook/composing-stores.html) that can be imported anywhere

## Roadmap / Ideas

- [x] Should the state be merged at the same level as actions and getters?
- [ ] ~~Allow grouping stores together into a similar structure and allow defining new getters (`pinia`)~~
      You can directly call `useOtherStore()` inside of a getter or action.
- [ ] ~~Getter with params that act like computed properties (@ktsn)~~ Can be implement through a custom composable and passed directly to state.

## Installation

```bash
yarn add pinia
# or with npm
npm install pinia
```

If you are using Vue 2, make sure to install latest `@vue/composition-api`:

```bash
npm install pinia @vue/composition-api
```

## Usage

### Install the plugin

Create a pinia (the root store) and pass it to app:

```js
import { createPinia } from 'pinia'

app.use(createPinia())
```

### Create a Store

You can create as many stores as you want, and they should each exist in different files:

```ts
import { defineStore } from 'pinia'

// main is the name of the store. It is unique across your application
// and will appear in devtools
export const useMainStore = defineStore('main', {
  // a function that returns a fresh state
  state: () => ({
    counter: 0,
    name: 'Eduardo',
  }),
  // optional getters
  getters: {
    // getters receive the state as first parameter
    doubleCounter: (state) => state.counter * 2,
    // use getters in other getters
    doubleCounterPlusOne(): number {
      return this.doubleCounter + 1
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
import { storeToRefs } from 'pinia'

export default defineComponent({
  setup() {
    const main = useMainStore()

    // extract specific store properties
    const { counter, doubleCounter } = storeToRefs(main)

    return {
      // gives access to the whole store in the template
      main,
      // gives access only to specific state or getter
      counter,
      doubleCounter,
    }
  },
})
```

## Documentation

To learn more about Pinia, check [its documentation](https://pinia.vuejs.org).

## License

[MIT](http://opensource.org/licenses/MIT)
