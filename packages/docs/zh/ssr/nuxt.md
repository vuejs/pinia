# Nuxt %{#nuxt}%

<MasteringPiniaLink
  href="https://masteringpinia.com/lessons/ssr-friendly-state"
  title="Learn about SSR best practices"
/>

搭配 [Nuxt](https://nuxt.com/) 的 Pinia 更易用，因为 Nuxt 处理了很多与**服务器端渲染**有关的事情。例如，**你不需要关心序列化或 XSS 攻击**。Pinia 既支持 Nuxt Bridge 和 Nuxt 3，也支持纯 Nuxt 2，[见下文](#nuxt-2-without-bridge)。

<RuleKitLink />

## 安装 %{#installation}%

```bash
yarn add pinia @pinia/nuxt @vue/devtools-api
# 或者使用 npm
npm install pinia @pinia/nuxt @vue/devtools-api
```

:::tip
如果你正在使用 npm，你可能会遇到 _ERESOLVE unable to resolve dependency tree_ 错误。如果那样的话，将以下内容添加到 `package.json` 中：

```js
"overrides": {
  "vue": "latest"
}
```

:::

我们提供了一个 _module_ 来为你处理一切，你只需要在 `nuxt.config.js` 文件的 `modules` 中添加它。

```js
// nuxt.config.js
export default defineNuxtConfig({
  // ... 其他配置
  modules: [
    // ...
    '@pinia/nuxt',
  ],
})
```

这样配置就完成了，正常使用 store 就好啦!

## 在 `setup()` 外部使用 store %{#using-the-store-outside-of-setup}%

如果你想在 `setup()` 外部使用一个 store，记得把 `pinia` 对象传给 `useStore()`。我们会把它添加到[上下文](https://nuxtjs.org/docs/2.x/internals-glossary/context)中，然后你就可以在 `asyncData()` 和 `fetch()` 中访问它了：

```js
import { useStore } from '~/stores/myStore'

export default {
  asyncData({ $pinia }) {
    const store = useStore($pinia)
  },
}
```

与 `onServerPrefetch()` 一样，如果你想在 `asyncData()` 中调用一个存储动作，你不需要做任何特别的事情。

```vue
<script setup>
const store = useStore()
const { data } = await useAsyncData('user', () => store.fetchUser())
</script>
```

## 自动引入 %{#auto-imports}%

默认情况下，`@pinia/nuxt` 会暴露一个自动引入的方法：`usePinia()`，它类似于 `getActivePinia()`，但在 Nuxt 中效果更好。你可以添加自动引入来减轻你的开发工作：

```js
// nuxt.config.js
export default defineNuxtConfig({
  // ... 其他配置
  modules: [
    // ...
    [
      '@pinia/nuxt',
      {
        autoImports: [
          // 自动引入 `defineStore()`
          'defineStore',
          // 自动引入 `defineStore()` 并重命名为 `definePiniaStore()`
          ['defineStore', 'definePiniaStore'],
        ],
      },
    ],
  ],
})
```

## 纯 Nuxt 2 %{#nuxt-2-without-bridge}%

`@pinia/nuxt` v0.2.1 之前的版本中，Pinia 都支持 Nuxt 2。请确保在安装 `pinia` 的同时也安装 [`@nuxtjs/composition-api`](https://composition-api.nuxtjs.org/)：

```bash
yarn add pinia @pinia/nuxt@0.2.1 @nuxtjs/composition-api
# 使用 npm
npm install pinia @pinia/nuxt@0.2.1 @nuxtjs/composition-api
```

我们提供了一个 _module_ 来为你处理一切工作，你只需要在 `nuxt.config.js` 文件的 `buildModules` 中添加它。

```js
// nuxt.config.js
export default {
  // ... 其他配置
  buildModules: [
    // 仅支持 Nuxt 2:
    // https://composition-api.nuxtjs.org/getting-started/setup#quick-start
    '@nuxtjs/composition-api/module',
    '@pinia/nuxt',
  ],
}
```

### TypeScript %{#typescript}%

如果你使用的是 Nuxt 2 (`@pinia/nuxt` < 0.3.0) 搭配 TypeScript，并且有 `jsconfig.json`，你应该为 `context.pinia` 引入类型：

```json
{
  "types": [
    // ...
    "@pinia/nuxt"
  ]
}
```

这也将确保你可以使用自动补全😉。

## Pinia 搭配 Vuex 使用 %{#using-pinia-alongside-vuex}%

建议**避免同时使用 Pinia 和 Vuex**，但如果你确实需要同时使用，你需要告诉 Pinia 不要禁用它：

```js
// nuxt.config.js
export default {
  buildModules: [
    '@nuxtjs/composition-api/module',
    ['@pinia/nuxt', { disableVuex: false }],
  ],
  // ... 其他配置
}
```
