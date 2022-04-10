# 从 0.x (v1) 迁移至 v2{#migrating-from-0-x-v1-to-v2}

从 `2.0.0-rc.4` 版本开始，pinia 同时支持 Vue 2 和 Vue 3! 这意味着，所有更新都将应用于 v2，所以 Vue 2 和 Vue 3 的用户都可以从中受益。如果你使用的是 Vue 3，这对你来说没有任何改变，因为你已经在使用 rc，你可以查看[发布日志](https://github.com/vuejs/pinia/blob/v2/packages/pinia/CHANGELOG.md)，了解所有变化的详细解释。否则，**这个指南是为你准备的**!

## 弃用{#deprecations}

让我们来看看你需要应用于你代码的所有变更。首先，为了解所有弃用，确保你已经在运行最新的 0.x 版本：

```shell
npm i 'pinia@^0.x.x'
# 或者使用 yarn
yarn add 'pinia@^0.x.x'
```

如果你正在使用 ESLint，可以考虑使用[这个插件](https://github.com/gund/eslint-plugin-deprecation)，来查找所有废弃的用法。否则，你应该查看它们出现的交叉。这些都是被废弃的 API，被删除了：

- `createStore()`变成`defineStore()`
- 在订阅中，`storeName`变成`storeId`
- `PiniaPlugin`更名为`PiniaVuePlugin`（Vue 2的Pinia插件）
- `$subscribe()`不再接受 _boolean_ 作为第二个参数，而是传递一个带有 `detached: true` 的对象。
- Pinia 插件不再直接接收 store 的 `id`。使用 `store.$id` 代替。

## 破坏性变更{#breaking-changes}

删除这些后，你可以用下面命令升级到 V2 版了：

```shell
npm i 'pinia@^2.x.x'
# 或者使用 yarn
yarn add 'pinia@^2.x.x'
```

然后开始更新你的代码。

### 通用 Store 类型{#generic-store-type}

添加于 [2.0.0-rc.0](https://github.com/vuejs/pinia/blob/v2/packages/pinia/CHANGELOG.md#200-rc0-2021-07-28)

用 `StoreGeneric` 取代 `GenericStore` 类型的全部用法。这是新的通用 store 类型，应该接受任何类型的 store。如果你在写函数时使用 `Store` 类型而不想传递其泛型（例如`Store<Id, State, Getters, Actions>`），你也应该使用 `StoreGeneric`，因为没有泛型的 `Store` 类型会创建一个空的 store 类型：

```diff
-function takeAnyStore(store: Store) {}
+function takeAnyStore(store: StoreGeneric) {}

-function takeAnyStore(store: GenericStore) {}
+function takeAnyStore(store: StoreGeneric) {}
```

## 针对插件的 `DefineStoreOptions`{#definestoreoptions-for-plugins}

如果你在用 TypeScript 写插件并扩展了 `DefineStoreOptions` 类型来添加自定义选项，你应该把它改名为 `DefineStoreOptionsBase`。这个类型将同时适用于 setup 和 options stores。

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

## `PiniaStorePlugin` 已被重命名{#piniastoreplugin-was-renamed}

类型 `PiniaStorePlugin` 被重新命名为 `PiniaPlugin`。

```diff
-import { PiniaStorePlugin } from 'pinia'
+import { PiniaPlugin } from 'pinia'

-const piniaPlugin: PiniaStorePlugin = () => {
+const piniaPlugin: PiniaPlugin = () => {
   // ...
 }
```

**注意这个变化只能在升级到最新的没有弃用的 Pinia 版本后进行**。

## `@vue/composition-api` 版本{#vue-composition-api-version}

由于 pinia 现在依赖于 `effectScope()` ，你必须使用 `@vue/composition-api` 的 `1.1.0` 版本及以上：

```shell
npm i @vue/composition-api@latest
# 或者使用 yarn
yarn add @vue/composition-api@latest
```

## 支持 webpack 4{#webpack-4-support}

如果你使用的是 webpack 4（Vue CLI 使用 webpack 4），你可能会遇到这样的错误：

```
ERROR  Failed to compile with 18 errors

 error  in ./node_modules/pinia/dist/pinia.mjs

Can't import the named export 'computed' from non EcmaScript module (only default export is available)
```

这是由于 dist 文件为支持 Node.js 中的本地 ESM 模块进行的现代化。文件现在使用扩展名 `.mjs` 和 `.cjs` 来让 Node 从中受益。要解决这个问题，你有两种可能的方法：

- 如果你使用Vue CLI 4.x，升级你的依赖。这应该包括下面的修复。
  - 如果你不可能升级，请将此代码添加到你的 `vue.config.js` 中：
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
- 如果你手动处理 webpack，你将必须知道如何让它处理 `.mjs` 文件：
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

Pinia v2 不再劫持 Vue Devtools v5，它需要的是 Vue Devtools v6。在 [Vue Devtools 文档](https://devtools.vuejs.org/guide/installation.html#chrome)上找到该扩展**beta 频道**中的下载链接。

## Nuxt

如果你正在使用 Nuxt，pinia 现在有了专门的 Nuxt 软件包🎉。请用以下方法安装它：

```shell
npm i @pinia/nuxt
# 或者使用 yarn
yarn add @pinia/nuxt
```

还要确保**更新你的 `@nuxtjs/composition-api` 包**。

如果你使用 TypeScript，还要调整你的 `nuxt.config.js` 和 `tsconfig.json`：

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

还推荐阅读[ Nuxt 专用章节](../ssr/nuxt.md)。
