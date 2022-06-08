# 在组件外使用一个 store{#using-a-store-outside-of-a-component}

Pinia store 依靠 `pinia` 实例在所有调用中共享同一个 store 实例。大多数时候，只需调用你的 `useStore()` 函数，非常开箱即用。例如，在 `setup()` 中，你不需要做任何其他事情。但在组件之外，情况就有点不同了。
在幕后，`useStore()` 给你的 `app` 注入了 `pinia` 实例。这意味着，如果 `pinia` 实例不能自动注入，你必须手动提供给 `useStore()` 函数。
你可以根据你所写的应用程序的种类，以不同的方式解决这个问题。

## 单页面应用{#single-page-applications}

如果你不做任何 SSR（服务器端渲染），在用 `app.use(pinia)` 安装pinia 插件后，任何对 `useStore()` 的调用都会有效：

```js
import { useUserStore } from '@/stores/user'
import { createApp } from 'vue'
import App from './App.vue'

// ❌  失败，因为它是在创建 pinia 之前被调用的
const userStore = useUserStore()

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// ✅ 成功，因为 pinia 实例现在激活了
const userStore = useUserStore()
```

最简单的方法是将 `useStore()` 的调用放在 pinia 安装后一直运行的函数中，以确保其始终被应用。

让我们来看看这个在 Vue Router 的导航卫士中使用 store 的例子。

```js
import { createRouter } from 'vue-router'
const router = createRouter({
  // ...
})

// ❌ 取决于引入的顺序，这将失败
const store = useStore()

router.beforeEach((to, from, next) => {
  // 我们想用这里的 store
  if (store.isLoggedIn) next()
  else next('/login')
})

router.beforeEach((to) => {
  // ✅ 这样做是可行的，因为路由器在安装完之后就会开始导航。
  // Pinia 也将被安装。
  const store = useStore()

  if (to.meta.requiresAuth && !store.isLoggedIn) return '/login'
})
```

## 服务端渲染应用{#ssr-apps}

当处理服务端渲染时，你将必须把 `pinia` 实例传递给 `useStore()`。这可以防止 pinia 在不同的应用程序实例之间共享全局状态。

在[SSR 指南](/ssr/index.md)中有一整节专门讨论这个问题，这里只是一个简短的解释。
