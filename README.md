<p align="center">
  <a href="https://pinia.esm.dev" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://pinia.esm.dev/logo.svg" alt="Pinia logo">
  </a>
</p>
<br/>
<p align="center">
  <a href="https://npmjs.com/package/pinia"><img src="https://badgen.net/npm/v/pinia/next" alt="npm package"></a>
  <a href="https://github.com/posva/pinia/actions/workflows/test.yml?query=branch%3Av2"><img src="https://github.com/posva/pinia/workflows/test/badge.svg?branch=v2" alt="build status"></a>
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

Pinia works both for Vue 2.x and Vue 3.x. It requires Vue 2 with `@vue/composition-api` `^1.1.0-0` or Vue `^3.2.0-0`.

Pinia is is the most similar English pronunciation of the word _pineapple_ in Spanish: _piña_. A pineapple is in reality a group of individual flowers that join together to create a multiple fruit. Similar to stores, each one is born individually, but they are all connected at the end. It's also a delicious tropical fruit indigenous to South America.

## 👉 [Demo on CodeSandbox](https://y4dfi.csb.app)

## Help me keep working on this project 💚

- [Become a Sponsor on GitHub](https://github.com/sponsors/posva)
- [One-time donation via PayPal](https://paypal.me/posva)

<!-- <h3 align="center">Special Sponsors</h3> -->
<!--special start-->

<h4 align="center">Gold Sponsors</h4>

<p align="center">
  <a href="https://passionatepeople.io" target="_blank" rel="noopener noreferrer">
    <img src="https://img2.storyblok.com/672x0/filters::format(webp)/f/86387/x/21aa32ed18/logo-normal.svg" height=72px" alt="Passionate People">
  </a>

  <a href="https://vuetifyjs.com" target="_blank" rel="noopener noreferrer">
    <img src="https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-light-text.svg" alt="Vuetify" height="72px">
  </a>

  <a href="https://vuejobs.com/?utm_source=vuerouter&utm_campaign=sponsor" target="_blank" rel="noopener noreferrer">
    <img src="packages/docs/public/sponsors/vuejobs.svg" height="72px" alt="VueJobs">
  </a>
</p>

<h4 align="center">Silver Sponsors</h4>

<p align="center">
  <a href="https://www.vuemastery.com" target="_blank" rel="noopener noreferrer">
    <img src="https://www.vuemastery.com/images/vuemastery.svg" height="42px" alt="Vue Mastery">
  </a>

  <a href="https://birdeatsbug.com/?utm_source=vuerouter&utm_medium=sponsor&utm_campaign=silver" target="_blank" rel="noopener noreferrer">
    <img src="https://static.birdeatsbug.com/general/bird-logotype-150x27.svg" alt="Bird Eats bug" height="42px">
  </a>
</p>

<h4 align="center">Bronze Sponsors</h4>

<p align="center">
  <a href="https://storyblok.com" target="_blank" rel="noopener noreferrer">
    <img src="https://a.storyblok.com/f/51376/3856x824/fea44d52a9/colored-full.png" alt="Storyblok" height="32px">
  </a>

  <a href="https://nuxtjs.org" target="_blank" rel="noopener noreferrer">
    <img src="https://nuxtjs.org/logos/nuxtjs-typo-white.svg" alt="NuxtJS" height="26px">
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

If you are using Vue 2, make sure to install `@vue/composition-api` version `1.1.0` (or greater):

```bash
npm install pinia@next @vue/composition-api
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
    doubleCount() {
      return this.counter * 2
    },
    // use getters in other getters
    doubleCountPlusOne() {
      return this.doubleCount * 2 + 1
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

## Documentation

To learn more about Pinia, check [its documentation](https://pinia.esm.dev).

## License

[MIT](http://opensource.org/licenses/MIT)
