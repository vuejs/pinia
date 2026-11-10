# 开始 %{#getting-started}%

## 安装 %{#installation}%

<VueMasteryLogoLink for="pinia-cheat-sheet">
</VueMasteryLogoLink>

用你喜欢的包管理器安装 `pinia`。从 v4 起，你还需要安装 `@vue/devtools-api`，它是 devtools 集成所需的对等依赖 (peer dependency)：

::: code-group

```bash [npm]
npm install pinia @vue/devtools-api
```

```bash [yarn]
yarn add pinia @vue/devtools-api
```

```bash [pnpm]
pnpm add pinia @vue/devtools-api
```

```bash [bun]
bun add pinia @vue/devtools-api
```

```bash [deno]
deno add pinia @vue/devtools-api
```

:::

:::tip
如果你的应用使用的 Vue 版本低于 2.7，你还需要安装组合式 API 包：`@vue/composition-api`。如果你使用的是 Nuxt，你应该参考[这篇指南](/zh/ssr/nuxt.md)。
:::

Pinia 面向现代浏览器，并使用了 [`Object.hasOwn()`](https://caniuse.com/mdn-javascript_builtins_object_hasown)。如果你需要支持旧版浏览器，请添加一个 polyfill，例如 [core-js](https://github.com/zloirock/core-js#ecmascript-object)。

如果你正在使用 Vue CLI，你可以试试这个[**非官方插件**](https://github.com/wobsoriano/vue-cli-plugin-pinia)。

创建一个 pinia 实例 (根 store) 并将其作为插件传递给应用：

```js {2,5-6,8}
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

## Store 是什么？%{#what-is-a-store}%

Store (如 Pinia) 是一个保存状态和业务逻辑的实体，它并不与你的组件树绑定。换句话说，**它承载着全局状态**。它有点像一个永远存在的组件，每个组件都可以读取和写入它。它有**三个概念**，[state](./core-concepts/state.md)、[getter](./core-concepts/getters.md) 和 [action](./core-concepts/actions.md)，我们可以假设这些概念相当于组件中的 `data`、 `computed` 和 `methods`。

<!-- <RuleKitLink /> -->

## 应该在什么时候使用 Store? %{#when-should-i-use-a-store}%

一个 Store 应该包含可以在整个应用中访问的数据。这包括在许多地方使用的数据，例如显示在导航栏中的用户信息，以及需要通过页面保存的数据，例如一个非常复杂的多步骤表单。

另一方面，你应该避免在 Store 中引入那些原本可以在组件中保存的本地数据，例如，一个元素在页面中的可见性。

并非所有的应用都需要访问全局状态，但如果你的应用确实需要一个全局状态，那 Pinia 将使你的开发过程更轻松。

## 什么时候**不**应该使用 Store %{#when-should-i-not-use-a-store}%

有的时候我们会过度使用 store。如果觉得应用程序的 store 过多，你可能需要重新考虑使用 store 的目的。例如其中一些逻辑应该只是组合式函数，或者应该只是组件的本地状态。这在 Mastering Pinia 的 [(不要) 滥用 store](https://masteringpinia.com/lessons/not-overusing-stores) 课程中有详细介绍。
