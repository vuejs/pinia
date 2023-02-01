## 安装 %{#installation}%

用你喜欢的包管理器安装 `pinia`：

```bash
yarn add pinia
# 或者使用 npm
npm install pinia
```

:::tip
如果你的应用使用的是 Vue 2，你还需要安装组合式 API 包：`@vue/composition-api`。如果你使用的是 Nuxt，你应该参考[这篇指南](/ssr/nuxt.md)。
:::

如果你正在使用 Vue CLI，你可以试试这个[**非官方插件**](https://github.com/wobsoriano/vue-cli-plugin-pinia)。

创建一个 pinia 实例(根 store)并将其传递给应用：

```js {2,5-6,8}
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

如果你使用的是 Vue 2，你还需要安装一个插件，并在应用的根部注入创建的 `pinia`：

```js {1,3-4,12}
import { createPinia, PiniaVuePlugin } from 'pinia'

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

new Vue({
  el: '#app',
  // 其他配置...
  // ...
  // 请注意，同一个`pinia'实例
  // 可以在同一个页面的多个 Vue 应用中使用。 
  pinia,
})
```

这样才能提供 devtools 的支持。在 Vue 3 中，一些功能仍然不被支持，如 time traveling 和编辑，这是因为 vue-devtools 还没有相关的 API，但 devtools 也有很多针对 Vue 3 的专属功能，而且就开发者的体验来说，Vue 3 整体上要好得多。在 Vue 2 中，Pinia 使用的是 Vuex 的现有接口(因此不能与 Vuex 一起使用)。

## Store 是什么？%{#what-is-a-store}%

Store (如 Pinia) 是一个保存状态和业务逻辑的实体，它并不与你的组件树绑定。换句话说，**它承载着全局状态**。它有点像一个永远存在的组件，每个组件都可以读取和写入它。它有**三个概念**，[state](./core-concepts/state.md)、[getter](./core-concepts/getters.md) 和 [action](./core-concepts/actions.md)，我们可以假设这些概念相当于组件中的 `data`、 `computed` 和 `methods`。

## 应该在什么时候使用 Store? %{#when-should-i-use-a-store}%

一个 Store 应该包含可以在整个应用中访问的数据。这包括在许多地方使用的数据，例如显示在导航栏中的用户信息，以及需要通过页面保存的数据，例如一个非常复杂的多步骤表单。

另一方面，你应该避免在 Store 中引入那些原本可以在组件中保存的本地数据，例如，一个元素在页面中的可见性。

并非所有的应用都需要访问全局状态，但如果你的应用确实需要一个全局状态，那 Pinia 将使你的开发过程更轻松。
