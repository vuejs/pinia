# Nuxt.js

将 Pinia 与 [Nuxt.js](https://nuxtjs.org/) 搭配更易用，因为 Nuxt 处理了很多与**服务器端渲染**有关的事情。例如，**你不需要关心序列化或 XSS 攻击**。

## 安装{#installation}

确保在安装 `pinia` 的同时安装[`@nuxtjs/composition-api`](https://composition-api.nuxtjs.org/):

```bash
yarn add pinia @pinia/nuxt @nuxtjs/composition-api
# 或者使用 npm
npm install pinia @pinia/nuxt @nuxtjs/composition-api
```

我们提供了一个 _module_ 来为你处理一切，你只需要在 `nuxt.config.js` 文件的 `buildModules` 中添加它。

```js
// nuxt.config.js
export default {
  // ... 其他配置
  buildModules: [
    // 只支持 Nuxt 2：
    // https://composition-api.nuxtjs.org/getting-started/setup#quick-start
    '@nuxtjs/composition-api/module',
    '@pinia/nuxt',
  ],
}
```

配置完成了，像往常一样使用 store 吧!

## 在 `setup()` 外部使用 store{#using-the-store-outside-of-setup}

如果你想在 `setup()` 外部使用一个 store，记得把 `pinia` 对象传给 `useStore()`。我们会把它添加到[上下文](https://nuxtjs.org/docs/2.x/internals-glossary/context)中，所以你可以在 `asyncData()` 和 `fetch()` 中访问它。

```js
import { useStore } from '~/stores/myStore'

export default {
  asyncData({ $pinia }) {
    const store = useStore($pinia)
  },
}
```

## 在 store 中使用 Nuxt 上下文{#using-the-nuxt-context-in-stores}

你也可以通过使用注入属性 `$nuxt` 在任何 store 中使用[上下文](https://nuxtjs.org/docs/2.x/internals-glossary/context)：

```js
import { useUserStore } from '~/stores/userStore'

defineStore('cart', {
  actions: {
    purchase() {
      const user = useUserStore()
      if (!user.isAuthenticated()) {
        this.$nuxt.redirect('/login')
      }
    },
  },
})
```

## Pinia 搭配 Vuex 使用 {#using-pinia-alongside-vuex}

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

## TypeScript

如果你使用 TypeScript 或者有 `jsconfig.json`，你也应该为 `context.pinia` 添加类型：

```json
{
  "types": [
    // ...
    "@pinia/nuxt"
  ]
}
```

这也将确保你可以使用自动补全😉。
