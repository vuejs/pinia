# 服务端渲染 (SSR){#server-side-rendering-ssr}

:::tip
如果你使用的是 **Nuxt.js**，你需要阅读的是[**这些说明文档**](./nuxt.md)。
:::

只要你在 `setup` 函数、`getters` 和 `actions` 的顶部调用 `useStore()` 函数，使用 Pinia 创建 store 对于 SSR 来说应该是开箱即用的。

```js
export default defineComponent({
  setup() {
    // 这样做的原因是 Pinia 知道
    // `setup()` 中运行的应用程序是什么
    const main = useMainStore()
    return { main }
  },
})
```

## 在 `setup()` 外部使用 store{#using-the-store-outside-of-setup}

如果你需要在其他地方使用 store，你需要将[被传递给应用程序](#install-the-plugin) 的 `pinia` 实例传递给 `useStore()` 函数调用：

```js
const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

router.beforeEach((to) => {
  // ✅这将会生效，确保正确的 store 被用于
  // 当前正在运行的应用程序
  const main = useMainStore(pinia)

  if (to.meta.requiresAuth && !main.isLoggedIn) return '/login'
})
```

Pinia 会将自己作为 `$pinia` 添加到你的应用程序中，所以你可以在 `serverPrefetch()` 等函数中使用它。

```js
export default {
  serverPrefetch() {
    const store = useStore(this.$pinia)
  },
}
```

## State hydration

为了 hydrate 初始 state，你需要确保 rootState 包含在 HTML 中的某个地方，以便 Pinia 稍后能够接收到它。根据你所使用的 SSR，**你应该为了安全而转义状态**。我们推荐使用 [@nuxt/devalue](https://github.com/nuxt-contrib/devalue)，这是 Nuxt.js 使用的。

```js
import devalue from '@nuxt/devalue'
import { createPinia } from 'pinia'
// 检索服务端的 rootState
const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)

// 渲染页面后，根状态被建立，
// 可以直接在 `pinia.state.value`上读取。

// 序列化，转义（状态的内容是否可以被用户改变，这非常重要，几乎都是这样的）
// 并将其放置在页面的某处
// 例如，作为一个全局变量。
devalue(pinia.state.value)
```

根据你所使用的 SSR，你将设置一个**初始状态**变量，该变量将在 HTML 中被序列化。你还应该保护自己免受 XSS 攻击。例如，使用 [vit-ssr](https://github.com/frandiox/vite-ssr) 你可以使用[ `transformState` 选项](https://github.com/frandiox/vite-ssr#state-serialization)和 `@nuxt/devalue`。

```js
import devalue from '@nuxt/devalue'

export default viteSSR(
  App,
  {
    routes,
    transformState(state) {
      return import.meta.env.SSR ? devalue(state) : state
    },
  },
  ({ initialState }) => {
    // ...
    if (import.meta.env.SSR) {
      // 这将被字符串化并设置为窗口。__INITIAL_STATE__
      initialState.pinia = pinia.state.value
    } else {
      // 在客户端，我们恢复状态
      pinia.state.value = initialState.pinia
    }
  }
)
```

你可以根据你的需要使用 `@nuxt/devalue` 的[其他替代品](https://github.com/nuxt-contrib/devalue#see-also)，例如，如果你能用 `JSON.stringify()`/`JSON.parse()` 来序列化和解析你的状态，**你可以把性能提高很多。**

根据你的环境调整这个策略。确保在客户端调用任何 `useStore()` 函数之前，对 pinia 的 state 进行 hydrate。例如，如果我们将状态序列化为一个 `<script>` 标签，使其在客户端通过 `window.__pinia` 全局访问，我们可以这样写：

```js
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// 必须由用户设置
if (isClient) {
  pinia.state.value = JSON.parse(window.__pinia)
}
```
