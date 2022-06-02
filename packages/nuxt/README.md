# `@pinia/nuxt`

> Nuxt 2 & 3 module

## Installation

```shell
npm i @pinia/nuxt
```

## Usage

Add to `modules` (Nuxt 3) or `buildModules` (Nuxt 2) in `nuxt.config.js`:

```js
// Nuxt 2
export default {
  buildModules: [['@pinia/nuxt', { disableVuex: true }]],
}
// Nuxt 3
export default defineNuxtConfig({
    modules: ['@pinia/nuxt'],
})
```

Note you also need `@nuxtjs/composition-api` if you are using Nuxt 2 without Bridge. [Refer to docs for more](https://pinia.vuejs.org/ssr/nuxt.html).

## License

[MIT](http://opensource.org/licenses/MIT)
