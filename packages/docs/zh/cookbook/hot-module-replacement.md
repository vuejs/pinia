# HMR (Hot Module Replacement) {#hmr-hot-module-replacement}

Pinia 支持热更新，所以你可以编辑你的 store，并直接在你的应用中与它们互动，而不需要重新加载页面，允许你保持当前的 state、并添加甚至删除 state、action 和 getter。

目前，只有 [Vite](https://vitejs.dev/) 被官方支持，不过任何实现 `import.meta.hot` 规范的构建工具都应该能正常工作。（例如，[webpack](https://webpack.js.org/api/module-variables/#importmetawebpackhot) 似乎使用的是 `import.meta.webpackHot` 而不是 `import.meta.hot` ）
你需要在任何 store 声明旁边添加这段代码。比方说，你有三个 store：`auth.js`、 `cart.js` 和 `chat.js`, 你必须在每个 **store 声明**后都添加(和调整)这段代码。

```js
// auth.js
import { defineStore, acceptHMRUpdate } from 'pinia'

const useAuth = defineStore('auth', {
  // 配置...
})

// 确保传递正确的 store 声明，本例中为 `useAuth`
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot))
}
```
