# Nuxt.js

Using Pinia with [Nuxt.js](https://nuxtjs.org/) is easier since Nuxt takes care of a lot of things when it comes to _server side rendering_.

## Installation

Make sure to install [`@nuxtjs/composition-api`](https://composition-api.nuxtjs.org/) alongside `pinia`:

```bash
yarn add pinia @nuxtjs/composition-api
# or with npm
npm install pinia @nuxtjs/composition-api
```

We supply a _module_ to handle everything for you, you only need to add it to `buildModules` in your `nuxt.config.js` file:

```js
// nuxt.config.js
export default {
  // ... other options
  buildModules: ['@nuxtjs/composition-api', 'pinia/nuxt'],

  // there is currently a unresolved bug that requires you to add
  // `pinia` to `build.transpile` to make it work in production:
  // https://github.com/nuxt-community/composition-api/issues/415
  build: {
    transpile: ['pinia'],
  },
}
```

And that's it, use your store as usual!

## Using the store outside of `setup()`

If you want to use a store outside of `setup()`, remember to pass the `pinia` object to `useStore()`. We added it to [the context](https://nuxtjs.org/docs/2.x/internals-glossary/context) so you have access to it in `asyncData()` and `fetch()`:

```js
export default {
  asyncData({ pinia }) {
    const store = useStore(pinia)
  },
}
```

## Using the Nuxt context in stores

You can also use [the context](https://nuxtjs.org/docs/2.x/internals-glossary/context) in any store by using the injected property `$nuxt`:

```js
defineStore({
  id: 'main',

  actions: {
    login() {
      if (!canLogin()) {
        this.$nuxt.redirect('/login')
      }
    },
  },
})
```

## Using Pinia alongside Vuex

It is recommended to **avoid using both Pinia and Vuex** but if you need to use both, you need to tell pinia to not disable it:

```js
// nuxt.config.js
export default {
  buildModules: [
    '@nuxtjs/composition-api',
    ['pinia/nuxt', { disableVuex: false }],
  ],
  // ... other options
}
```

## Typescript

If you are using TypeScript or have a `jsconfig.json`, you should also add the types for `context.pinia`:

```js
{
  "include": [
    // ...
    "pinia/nuxt/types"
  ]
}
```

This will also ensure you have autocompletion 😉 .
