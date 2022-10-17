# 定义一个 Store {#defining-a-store}

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

这个 _name_ ，也被用作 _id_ ，是必须传入的， Pinia 将用它来连接 store 和 devtools。为了养成习惯性的用法，将返回的函数命名为 _use..._ 是一个符合组合式函数的惯例。

`defineStore()` 的第二个参数可接受两类值：Setup 函数或 Option 对象。

## Option Stores {#option-stores}

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

## Setup Stores {#setup-stores}

也存在另一种定义 store 的可用语法。与 Vue 组合式 API 的 [setup 函数](https://vuejs.org/api/composition-api-setup.html) 相似，我们可以传入一个函数，该函数定义了一些响应式属性和方法，并且返回一个带有我们想暴露出去的属性和方法的对象。

```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }

  return { count, increment }
})
```

在 _Setup Stores_ 中：

- `ref()`s 就是 `state` 属性
- `computed()`s 就是 `getters`
- `function()`s 就是 `actions`

Setup stores 比 [Options Stores](#option-stores) 带来了更多的灵活性，因为你可以在一个 store 内创建 watchers，并自由地使用任何[组合式函数](https://vuejs.org/guide/reusability/composables.html#composables)。然而，请记住，使用组合式函数会让 [SSR](../cookbook/composables.md) 变得更加复杂。

## 你应该选用哪种语法？ {#what-syntax-should-i-pick}

和 [Vue 的组合式 API 与选项式 API](https://vuejs.org/guide/introduction.html#which-to-choose) 一样，选择你觉得最舒服的那一个就好。如果你还不确实，可以先试试 [Option Stores](#option-stores)。
## 使用 Store {#using-the-store}

虽然我们前面定义了一个 store，但在 `setup()` 调用 `useStore()` 之前，store 实例是不会被创建的：

```js
import { useCounterStore } from '@/stores/counter'

export default {
  setup() {
    const store = useCounterStore()

    return {
      // 为了能在模板中使用它，你可以返回整个 Store 实例。
      store,
    }
  },
}
```

你可以定义任意多的 store，但为了让使用 pinia 的益处最大化（比如允许构建工具自动进行代码分割以及 TypeScript 推断），**你应该在不同的文件中去定义 store**。

如果你还不会使用 `setup` 组件，[你仍然可以通过 _map helpers_ 来使用 Pinia](../cookbook/options-api.md)。

一旦 store 被实例化，你可以直接访问在 store 的 `state`、`getters` 和 `actions` 中定义的任何属性。我们将在后续章节继续了解这些细节，目前 autocompletion 将帮助你使用相关属性。

请注意，`store` 是一个用 `reactive` 包装的对象，这意味着不需要在 getters 后面写 `.value`，就像 `setup` 中的 `props` 一样，**如果你写了，我们也不能解构它**：

```js
export default defineComponent({
  setup() {
    const store = useCounterStore()
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

为了从 store 中提取属性时保持其响应性，你需要使用 `storeToRefs()`。它将为每一个响应式属性创建引用。当你只使用 store 的状态而不调用任何 action 时，它会非常有用。请注意，你可以直接从 store 中解构 action，因为它们也被绑定到 store 上：

```js
import { storeToRefs } from 'pinia'

export default defineComponent({
  setup() {
    const store = useCounterStore()
    // `name` and `doubleCount` 都是响应式 refs
    // 这也将为由插件添加的属性创建 refs
    // 同时会跳过任何 action 或非响应式（非 ref/响应式）属性
    const { name, doubleCount } = storeToRefs(store)
    // 名为 increment 的 action 可以直接提取
    const { increment } = store

    return {
      name,
      doubleCount,
      increment,
    }
  },
})
```
