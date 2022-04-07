# 定义一个 Store{#defining-a-store}

<VueSchoolLink
  href="https://vueschool.io/lessons/define-your-first-pinia-store"
  title="Learn how to define and use stores in Pinia"
/>

在深入研究核心概念之前，我们需要知道 Store 是用 `defineStore()` 定义的，它需要一个**独一无二的**名称，作为第一个参数传递：

```js
import { defineStore } from 'pinia'

// useStore 可以是任意名称，比如useUser，useCart。
// 第一个参数是你的应用程序中 Store 的唯一 ID。
export const useStore = defineStore('main', {
  // 其他配置...
})
```

这个 _name_ ，也被称为 _id_ ，是非常必要的，被 Pinia 用来连接 Store 和 devtools。将返回的函数命名为 _use..._ 是一个跨组合物的惯例，以使其用法符合习惯。

## 使用 Stroe {#using-the-store}

虽然我们定义了一个 Store，但在 `setup()` 中调用 `useStore()` 之前，Store 不会被创建：

```js
import { useStore } from '@/stores/counter'

export default {
  setup() {
    const store = useStore()

    return {
      // 为了能在模板中使用它，你可以返回整个 Store 实例。
      store,
    }
  },
}
```

你可以定义任意多的 Store，**但你应该在不同的文件中定义每个 Store，**以发挥使用 pinia 的最大益处（比如自动允许你构建工具进行代码分割和 TypeScript 推断）。

如果你还不会使用 `setup` 组件，[你仍然可以通过 _map helpers_ 来使用 Pinia](../cookbook/options-api.md)。

一旦 store 被实例化，你可以直接访问在 store `state`、`getters` 和 `actions` 中定义的任何属性。我们将在接下来的页面中看到这些细节，但自动补全将对你有所帮助。

注意 `store` 是一个用 `reactive` 包装的对象，这意味着不需要在 getters 后面写 `.value`，就像 `setup` 中的 `props` 一样，**我们也不能解构它**。

```js
export default defineComponent({
  setup() {
    const store = useStore()
    // ❌ 这将无法生效，因为它破坏了响应式
    // 这与从 `props` 中解构是一样的。
    const { name, doubleCount } = store

    name // "eduardo"
    doubleCount // 2

    return {
      // 始终是 "eduardo"
      name,
      // 始终是 2
      doubleCount,
      // 这个将是响应式的
      doubleValue: computed(() => store.doubleCount),
      }
  },
})
```

为了从 stroe 中提取属性，同时保持其反应性，你需要使用 `storeToRefs()`。它将为每一个响应式属性创建引用。当你只使用 stroe 的状态而不调用任何 action 时，它非常有用。请注意，你可以直接从 store 中解构 action，因为它们也被绑定到 stroe 上：

```js
import { storeToRefs } from 'pinia'

export default defineComponent({
  setup() {
    const store = useStore()
    // `name` and `doubleCount` 都是响应式 refs
    // 这也将为由插件添加的属性创建 refs
    // 同时会跳过任何 action 或非响应式（非 ref/响应式）属性
    const { name, doubleCount } = storeToRefs(store)
    // 名为 increment 的 action 可以直接提取
    const { increment } = store

    return {
      name,
      doubleCount
      increment,
    }
  },
})
```
