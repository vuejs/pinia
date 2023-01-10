---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [@pinia/nuxt](../modules/pinia_nuxt.md) / ModuleOptions

# Interface: ModuleOptions

[@pinia/nuxt](../modules/pinia_nuxt.md).ModuleOptions

## Properties

### autoImports

• `Optional` **autoImports**: (`string` \| [`string`, `string`])[]

Array of auto imports to be added to the nuxt.config.js file.

**`Example`**

```js
autoImports: [
 // automatically import `defineStore`
 'defineStore',
 // automatically import `defineStore` as `definePiniaStore`
 ['defineStore', 'definePiniaStore',
]
```

___

### disableVuex

• `Optional` **disableVuex**: `boolean`

Pinia disables Vuex by default, set this option to `false` to avoid it and
use Pinia alongside Vuex (Nuxt 2 only)

**`Default`**

`true`
