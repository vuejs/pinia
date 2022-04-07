## 安装 {#installation}

用你喜欢的包管理器安装 `pinia`：

```bash
yarn add pinia
# 或者使用 npm
npm install pinia
```

:::tip
如果你的 App 使用的是 Vue2，你还需要安装组合式 API 包：`@vue/composition-api`。如果你使用的是 Nuxt，你应该参考[这篇指南](/ssr/nuxt.md)。
:::

如果你正在使用 Vue CLI，你可以试试这个[**非官方插件**]（https://github.com/wobsoriano/vue-cli-plugin-pinia）。

创建一个 pinia（根 Store）并将其传递给应用程序：

```js
import { createPinia } from 'pinia'

app.use(createPinia())
```

如果你使用的是 Vue2，你还需要安装一个插件，并在应用程序的根部注入创建的 `pinia`：

```js
import { createPinia, PiniaVuePlugin } from 'pinia'

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

new Vue({
  el: '#app',
  // 其他配置...
  // ...
  // 请注意，同一个`pinia'实例
  // 可以在同一个页面的多个 Vue 应用程序中使用。 
  pinia,
})
```

这也将增加 devtools 支持。在 Vue3 中，一些功能如 time traveling 和编辑仍然不被支持，因为 vue-devtools 还没有相关的 API，但是 devtools 有更多的功能，而且开发者的体验整体上要好得多。在 Vue2 中，Pinia 使用 Vuex 的现有接口（因此不能与它一起使用）。

## Store 是什么？{#what-is-a-store}

Store（如 Pinia）是一个保存状态和业务逻辑的实体，它并不与你的组件树绑定。换句话说，**它承载着全局状态**。它有点像一个永远存在的组件，每个组件都可以读取和写入它。它有**三个概念**，[state](./core-concepts/state.md)、[getters](./core-concepts/getters.md) 和 [actions](./core-concepts/actions.md)，我们可以假设这些概念相当于组件中的 `data`、 `computed` 和 `methods`。

## 应该在什么时候使用 Store?{#when-should-i-use-a-store}

一个 Store 应该包含可以在整个应用程序中访问的数据。这包括在许多地方使用的数据，例如显示在导航栏中的用户信息，以及需要通过页面保存的数据，例如一个非常复杂的多步骤表单。

另一方面，你应该避免在 Store 中包括那些可以在组件中托管的本地数据，例如，一个元素在页面中的可见性。

并非所有的应用程序都需要访问全局状态，但如果你的应用程序需要一个全局状态，Pinia 将使你的生活更轻松。
