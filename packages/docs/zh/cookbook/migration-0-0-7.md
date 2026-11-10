# 从 0.0.7 迁移 %{#migrating-from-0-0-7}%

`0.0.7` 之后的版本：`0.1.0` 和 `0.2.0`，带来了一些较大的非兼容性更新。无论你使用的是 Vue 2 还是 Vue 3，本指南都可以帮助你完成迁移。完整的更新日志可以在仓库中找到：

- [适用于 Vue 2 的 Pinia <= 1](https://github.com/vuejs/pinia/blob/v1/CHANGELOG.md)
- [适用于 Vue 3 的 Pinia >= 2](https://github.com/vuejs/pinia/blob/v3/packages/pinia/CHANGELOG.md)

如果你在迁移中遇到问题或有疑问，欢迎[发起讨论](https://github.com/vuejs/pinia/discussions/categories/q-a)来寻求帮助。

## 不再有 `store.state` %{#no-more-store-state}%

你不再需要通过 `state` 属性访问 store 的 state，你可以直接访问任何 state 属性。

假设有一个这样定义的 store：

```js
const useStore({
  id: 'main',
  state: () => ({ count: 0 })
})
```

可以这样做：

```diff
 const store = useStore()

-store.state.count++
+store.count.++
```

在需要时，你仍然可以通过 `$state` 访问整个 store 的 state：

```diff
-store.state = newState
+store.$state = newState
```

## store 属性的重命名 %{#rename-of-store-properties}%

所有 store 属性 (`id`、`patch`、`reset` 等) 现在都带有 `$` 前缀，这样就可以在 store 上定义同名的属性。提示：你可以在 store 的每个属性上按 F2 (或右键 + 重构)，来重构你的整个代码库。

```diff
 const store = useStore()
-store.patch({ count: 0 })
+store.$patch({ count: 0 })

-store.reset()
+store.$reset()

-store.id
+store.$id
```

## Pinia 实例 %{#the-pinia-instance}%

现在必须创建一个 pinia 实例并安装它：

如果你使用的是 Vue 2 (Pinia <= 1)：

```js
import Vue from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'

const pinia = createPinia()
Vue.use(PiniaVuePlugin)
new Vue({
  el: '#app',
  pinia,
  // ...
})
```

如果你使用的是 Vue 3 (Pinia >= 2)：

```js
import { createApp } from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
createApp(App).use(pinia).mount('#app')
```

`pinia` 实例是保存 state 的地方，并且**每个应用都应该只有一个**。更多细节请查看文档的 SSR 章节。

## SSR 的变更 %{#ssr-changes}%

SSR 插件 `PiniaSsr` 已不再需要，并已被移除。
随着 pinia 实例的引入，`getRootState()` 也不再需要，应该用 `pinia.state.value` 替代：

如果你使用的是 Vue 2 (Pinia <= 1)：

```diff
// entry-server.js
-import { getRootState, PiniaSsr } from 'pinia',
+import { createPinia, PiniaVuePlugin } from 'pinia',


-// install plugin to automatically use correct context in setup and onServerPrefetch
-Vue.use(PiniaSsr);
+Vue.use(PiniaVuePlugin)

 export default context => {
+  const pinia = createPinia()
   const app = new Vue({
     // other options
+    pinia
   })

   context.rendered = () => {
     // pass state to context
-    context.piniaState = getRootState(context.req)
+    context.piniaState = pinia.state.value
   };

-   return { app }
+   return { app, pinia }
 }
```

`setActiveReq()` 和 `getActiveReq()` 已分别被 `setActivePinia()` 和 `getActivePinia()` 取代。`setActivePinia()` 只能接收一个由 `createPinia()` 创建的 `pinia` 实例。**注意，大多数时候你不会直接使用这些函数**。
