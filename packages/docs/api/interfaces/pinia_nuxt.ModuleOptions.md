---
editLink: false
---

[API Documentation](../index.md) / [@pinia/nuxt](../modules/pinia_nuxt.md) / ModuleOptions

# Interface: ModuleOptions

[@pinia/nuxt](../modules/pinia_nuxt.md).ModuleOptions

## Properties

### disableVuex

• `Optional` **disableVuex**: `boolean`

Pinia disables Vuex by default, set this option to `false` to avoid it and
use Pinia alongside Vuex (Nuxt 2 only)

**`Default`**

`true`

___

### storesDirs

• `Optional` **storesDirs**: `string`[]

Automatically add stores dirs to the auto imports. This is the same as
directly adding the dirs to the `imports.dirs` option. If you want to
also import nested stores, you can use the glob pattern `./stores/**`

**`Default`**

`['./stores']`
