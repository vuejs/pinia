# Migrating from 0.x (v1) to v2

Starting at version `2.0.0-rc.4`, pinia supports both Vue 2 and Vue 3! This means, all new updates will be applied to this version 2 so both Vue 2 and Vue 3 users can benefit from it. If you are using Vue 3, this doesn't change anything for you as you were already using the rc and you can check [the CHANGELOG](https://github.com/posva/pinia/blob/v2/packages/pinia/CHANGELOG.md) for detailed explanation of everything that changed. Otherwise, **this guide is for you**!

## Deprecations

Let's take a look at all the changes you need to apply to your code. First, make sure you are already running the latest 0.x version to see any deprecations:

```shell
npm i 'pinia@^0.x.x'
# or with yarn
yarn add 'pinia@^0.x.x'
```

If you are using ESLint, consider using [this plugin](https://github.com/gund/eslint-plugin-deprecation) to find all deprecated usages. Otherwise, you should be able to see them as they appear crossed. These are the APIs that were deprecated that were removed:

- `createStore()` becomes `defineStore()`
- In subscriptions, `storeName` becomes `storeId`
- `PiniaPlugin` was renamed `PiniaVuePlugin` (Pinia plugin for Vue 2)
- `$subscribe()` no longer accepts a _boolean_ as second parameter, pass an object with `detached: true` instead.
- Pinia plugins no longer directly receive the `id` of the store. Use `store.$id` instead.

## Breaking changes

After removing these, you can upgrade to v2 with:

```shell
npm i 'pinia@^2.x.x'
# or with yarn
yarn add 'pinia@^2.x.x'
```

And start updating your code.

### Generic Store type

Added in [2.0.0-rc.0](https://github.com/posva/pinia/blob/v2/packages/pinia/CHANGELOG.md#200-rc0-2021-07-28)

Replace any usage of the type `GenericStore` with `StoreGeneric`. This is the new generic store type that should accept any kind of store. If you were writing functions using the type `Store` without passing its generics (e.g. `Store<Id, State, Getters, Actions>`), you should also use `StoreGeneric` as the `Store` type without generics creates an empty store type.

```diff
-function takeAnyStore(store: Store) {}
+function takeAnyStore(store: StoreGeneric) {}

-function takeAnyStore(store: GenericStore) {}
+function takeAnyStore(store: StoreGeneric) {}
```

## `DefineStoreOptions` for plugins

If you were writing plugins, using TypeScript, and extending the type `DefineStoreOptions` to add custom options, you should rename it to `DefineStoreOptionsBase`. This type will apply to both setup and options stores.

```diff
 declare module 'pinia' {
-  export interface DefineStoreOptions<S, Store> {
+  export interface DefineStoreOptionsBase<S, Store> {
     debounce?: {
       [k in keyof StoreActions<Store>]?: number
     }
   }
 }
```

## `PiniaStorePlugin` was renamed

The type `PiniaStorePlugin` was renamed to `PiniaPlugin`.

```diff
-import { PiniaStorePlugin } from 'pinia'
+import { PiniaPlugin } from 'pinia'

-const piniaPlugin: PiniaStorePlugin = () => {
+const piniaPlugin: PiniaPlugin = () => {
   // ...
 }
```

**Note this change can only be done after upgrading to the latest version of Pinia without deprecations**.

## `@vue/composition-api` version

Since pinia now relies on `effectScope()`, you must use at least the version `1.1.0` of `@vue/composition-api`:

```shell
npm i @vue/composition-api@latest
# or with yarn
yarn add @vue/composition-api@latest
```

## webpack 4 support

If you are using webpack 4 (Vue CLI uses webpack 4), you might encounter an error like this:

```
ERROR  Failed to compile with 18 errors

 error  in ./node_modules/pinia/dist/pinia.mjs

Can't import the named export 'computed' from non EcmaScript module (only default export is available)
```

This is due to the modernization of dist files to support native ESM modules in Node.js. Files are now using the extension `.mjs` and `.cjs` to let Node benefit from this. To fix this issue you have two possibilities:

- If you are using Vue CLI 4.x, upgrade your dependencies. This should include the fix below.
  - If upgrading is not possible for you, add this to your `vue.config.js`:
    ```js
    // vue.config.js
    module.exports = {
      configureWebpack: {
        module: {
          rules: [
            {
              test: /\.mjs$/,
              include: /node_modules/,
              type: 'javascript/auto',
            },
          ],
        },
      },
    }
    ```
- If you are manually handling webpack, you will have to let it know how to handle `.mjs` files:
  ```js
  // webpack.config.js
  module.exports = {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto',
        },
      ],
    },
  }
  ```

## Devtools

Pinia v2 no longer hijacks Vue Devtools v5, it requires Vue Devtools v6. Find the download link on the [Vue Devtools documentation](https://devtools.vuejs.org/guide/installation.html#chrome) for the **beta channel** of the extension.

## Nuxt

If you are using Nuxt, pinia has now it's dedicated Nuxt package 🎉. Install it with:

```shell
npm i @pinia/nuxt
# or with yarn
yarn add @pinia/nuxt
```

Also make sure to **update your `@nuxtjs/composition-api` package**.

Then adapt your `nuxt.config.js` and your `tsconfig.json` if you are using TypeScript:

```diff
 // nuxt.config.js
 module.exports {
   buildModules: [
     '@nuxtjs/composition-api/module',
-    'pinia/nuxt',
+    '@pinia/nuxt',
   ],
 }
```

```diff
 // tsconfig.json
 {
   "types": [
     // ...
-    "pinia/nuxt/types"
+    "@pinia/nuxt"
   ]
 }
```

It is also recommended to give [the dedicated Nuxt section](../ssr/nuxt.md) a read.
