# 定义一个 Store{#defining-a-store}

<VueSchoolLink
  href="https://vueschool.io/lessons/define-your-first-pinia-store"
  title="Learn how to define and use stores in Pinia"
/>

在深入研究核心概念之前，我们得知道 Store 是用 `defineStore()` 定义的，它的第一个参数要求是一个**独一无二的**名字：

```js
import { defineStore } from 'pinia'

// 你可以对 `defineStore()` 的返回值进行任意命名，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。（比如 `useUserStore`，`useCartStore`，`useProductStore`）
// 第一个参数是你的应用程序中 Store 的唯一 ID。
export const useStore = defineStore('main', {
  // 其他配置...
})
```

这个 _name_ ，也被用作 _id_ ，是必须传入的， Pinia 将用它来连接 store 和 devtools。为了养成习惯性的用法，将返回的函数命名为 _use..._ 是一个常见的惯例。

`defineStore()` 的第二个参数可接受两类值：一个设置函数或一个配置对象。

## 选项式 Stores

与 Vue 的选项式 API 类似，我们也可以传入一个带有 `state`、`actions` 与 `getters` 属性的配置对象

```js {2-10}
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
```

你可以认为 `state` 是 store 的数据（`data`），`getters` 是 store 的计算属性（`computed`），而 `actions` 则是方法（`methods`）

为方便上手使用，选项式 Store 应尽可能直观简单。

## Setup Stores

There is also another possible syntax to define stores. Similar to the Vue Composition API's [setup function](https://vuejs.org/api/composition-api-setup.html), we can pass in a function that defines reactive properties and methods and returns an object with the properties and methods we want to expose.

```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }

  return { count, increment }
})
```

In _Setup Stores_:

- `ref()`s become `state` properties
- `computed()`s become `getters`
- `function()`s become `actions`

Setup stores bring a lot more flexibility than [Options Stores](#option-stores) as you can create watchers within a store and freely use any [composable](https://vuejs.org/guide/reusability/composables.html#composables). However, keep in mind that using composables will get more complex [SSR](../cookbook/composables.md).

## What syntax should I pick?

As with [Vue's Composition API and Option API](https://vuejs.org/guide/introduction.html#which-to-choose), pick the one that you feel the most comfortable with. If you're not sure, try the [Option Stores](#option-stores) first.
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
