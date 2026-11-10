# Nuxt %{#nuxt}%

<MasteringPiniaLink
  href="https://masteringpinia.com/lessons/ssr-friendly-state"
  title="Learn about SSR best practices"
/>

搭配 [Nuxt](https://nuxt.com/) 的 Pinia 更易用，因为 Nuxt 处理了很多与*服务端渲染*有关的事情。例如，**你不需要关心序列化或 XSS 攻击**。Pinia 支持 Nuxt 3 和 4。

<!-- <RuleKitLink /> -->

## 安装 %{#installation}%

```bash
npx nuxi@latest module add pinia
```

这会将 `@pinia/nuxt` 和 `pinia` 都添加到你的项目中。**如果你发现 `pinia` 没有被安装，请使用你的包管理器手动安装它**：`npm i pinia @vue/devtools-api`。从 v4 开始，`@vue/devtools-api` 是 `pinia` 必需的 peer 依赖。

:::tip
如果你正在使用 npm，你可能会遇到 _ERESOLVE unable to resolve dependency tree_ 错误。如果那样的话，将以下内容添加到 `package.json` 中：

```js
"overrides": {
  "vue": "latest"
}
```

:::

我们提供了一个 _module_ 来为你处理一切，你只需要在 `nuxt.config.js` 文件的 `modules` 中添加它：

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

## 在页面中等待 action %{#awaiting-for-actions-in-pages}%

与 `onServerPrefetch()` 一样，你可以在 `callOnce()` 组合式函数中调用 store 的 action。
这样 Nuxt 只会运行该 action 一次，并避免重新获取已经存在的数据。

```vue{3-4}
<script setup>
const store = useStore()
// 我们也可以提取数据，但它已经存在于 store 中了
await callOnce('user', () => store.fetchUser())
</script>
```

根据你的需求，你可以选择只在客户端运行一次 action，或者在每次导航时都运行它（这更接近 `useFetch()`/`useAsyncData()` 获取数据的行为）

```vue{3}
<script setup>
const store = useStore()
await callOnce('user', () => store.fetchUser(), { mode: 'navigation' })
</script>
```

::: tip

如果你想在 `setup()` 或*可感知注入 (injection aware)* 的上下文（例如导航守卫、其他 store、Nuxt 中间件等）之外使用一个 store，记得把 `pinia` 实例传给 `useStore()`，原因见[这里](../core-concepts/outside-component-usage.md#ssr-apps)。获取 `pinia` 实例的方式可能有所不同。

```ts
import { useStore } from '~/stores/myStore'

// 这一行通常位于一个能够获取 pinia 实例的函数中
const store = useStore(pinia)
```

幸运的是，大多数时候你**不需要这么麻烦**。

:::

## 自动引入 %{#auto-imports}%

默认情况下，`@pinia/nuxt` 会暴露几个自动引入的方法：

- `usePinia()`，它类似于 `getActivePinia()`，但在 Nuxt 中效果更好。
- `defineStore()` 用于定义 store
- `storeToRefs()` 用于从 store 中提取单个 ref
- `acceptHMRUpdate()` 用于[热更新](../cookbook/hot-module-replacement.md)

它还会自动引入你的 `stores` 文件夹（Nuxt 4 中为 `app/stores`）中定义的**所有 store**。但它不会查找嵌套的 store。你可以通过设置 `storesDirs` 选项来自定义这一行为：

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  // ... 其他配置
  modules: ['@pinia/nuxt'],
  pinia: {
    storesDirs: ['./stores/**', './custom-folder/stores/**'],
  },
})
```

注意，这些文件夹是相对于项目根目录的。如果你修改了 `srcDir` 选项，你需要相应地调整这些路径。

## 测试 %{#testing}%

Pinia 如何融入你的测试取决于测试的类型（见 [Nuxt 的测试文档](https://nuxt.com/docs/getting-started/testing#organizing-your-tests)）：

- **单元测试**在没有 Nuxt 应用的情况下运行，例如测试 store 本身或使用 store 的组合式函数。在每个测试中使用一个新的 pinia 或者 `createTestingPinia()`，见 [store 测试](../cookbook/testing.md)。
- **Nuxt 测试**在一个 Nuxt 应用中运行，该应用只创建一次，并被一个文件中的所有测试共享（如果使用 Vitest 的 `isolate: false`，则被所有文件共享）。应用的 pinia 实例也是共享的，所有 store 的 state 也随之共享，因此在一个测试中修改的 state 会泄漏到下一个测试中。见[在 Nuxt 测试中重置 store](#resetting-stores-in-nuxt-tests)。
- **端到端测试**不需要任何 Pinia 特有的处理。

### 在 Nuxt 测试中重置 store %{#resetting-stores-in-nuxt-tests}%

优先编写不依赖之前测试遗留 state 的测试：在每个测试开始时设置它所需要的 state（例如使用 `store.$patch()`）。

如果你确实需要在每个测试中使用全新的 store，你可以在每个测试之前销毁所有 store 并删除它们的 state：

```ts
// vitest.setup.ts
import { beforeEach } from 'vitest'
import { getStores } from 'pinia'
import { usePinia } from '#imports'

beforeEach(() => {
  const pinia = usePinia()
  for (const store of getStores(pinia)) {
    store.$dispose()
    delete pinia.state.value[store.$id]
  }
})
```

注意，这只会重置 store：保留了已销毁 store 引用的代码不会获取到新的 store，并且 Nuxt 应用的其他全局 state 也不会受影响。
