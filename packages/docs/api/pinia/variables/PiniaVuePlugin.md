---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / PiniaVuePlugin

# Variable: PiniaVuePlugin

> `const` **PiniaVuePlugin**: `Plugin`

Vue 2 Plugin that must be installed for pinia to work. Note **you don't need
this plugin if you are using Nuxt.js**. Use the `buildModule` instead:
https://pinia.vuejs.org/ssr/nuxt.html.

## Example

```js
import Vue from 'vue'
import { PiniaVuePlugin, createPinia } from 'pinia'

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

new Vue({
  el: '#app',
  // ...
  pinia,
})
```

## Param

`Vue` imported from 'vue'.
