# 简介 %{#introduction}%

<VueSchoolLink
  href="https://vueschool.io/lessons/introduction-to-pinia"
  title="Get started with Pinia"
/>

Pinia [起始](https://github.com/vuejs/pinia/commit/06aeef54e2cad66696063c62829dac74e15fd19e)于 2019 年 11 月左右的一次实验，其目的是设计一个拥有[组合式 API](https://github.com/vuejs/composition-api) 的 Vue 状态管理库。从那时起，我们就倾向于同时支持 Vue 2 和 Vue 3，并且不强制要求开发者使用组合式 API，我们的初心至今没有改变。除了**安装**和 **SSR** 两章之外，其余章节中提到的 API 均支持 Vue 2 和 Vue 3。虽然本文档主要是面向 Vue 3 的用户，但在必要时会标注出 Vue 2 的内容，因此 Vue 2 和 Vue 3 的用户都可以阅读本文档。

## 为什么你应该使用 Pinia？%{#why-should-i-use-pinia}%

Pinia 是 Vue 的专属状态管理库，它允许你跨组件或页面共享状态。如果你熟悉组合式 API 的话，你可能会认为可以通过一行简单的 `export const state = reactive({})` 来共享一个全局状态。对于单页应用来说确实可以，但如果应用在服务器端渲染，这可能会使你的应用暴露出一些安全漏洞。 而如果使用 Pinia，即使在小型单页应用中，你也可以获得如下功能：

- Devtools 支持
  - 追踪 actions、mutations 的时间线
  - 在组件中展示它们所用到的 Store
  - 让调试更容易的 Time travel
- 热更新
  - 不必重载页面即可修改 Store
  - 开发时可保持当前的 State
- 插件：可通过插件扩展 Pinia 功能
- 为 JS 开发者提供适当的 TypeScript 支持以及**自动补全**功能。
- 支持服务端渲染

## 基础示例 %{#basic-example}%

下面就是 pinia API 的基本用法 (为继续阅读本简介请确保你已阅读过了[开始](./getting-started.md)章节)。你可以先创建一个 Store：

```js
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => {
    return { count: 0 }
  },
  // 也可以这样定义
  // state: () => ({ count: 0 })
  actions: {
    increment() {
      this.count++
    },
  },
})
```

然后你就可以在一个组件中使用该 store 了：

```vue
<script setup>
import { useCounterStore } from '@/stores/counter'
const counter = useCounterStore()
counter.count++
// 自动补全！ ✨
counter.$patch({ count: counter.count + 1 })
// 或使用 action 代替
counter.increment()
</script>
<template>
  <!-- 直接从 store 中访问 state -->
  <div>Current Count: {{ counter.count }}</div>
</template>
```

为实现更多高级用法，你甚至可以使用一个函数 (与组件 `setup()` 类似) 来定义一个 Store：

```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }

  return { count, increment }
})
```

如果你还不熟悉 setup() 函数和组合式 API，别担心，Pinia 也提供了一组类似 Vuex 的 [映射 state 的辅助函数](https://vuex.vuejs.org/zh/guide/state.html#mapstate-辅助函数)。你可以用和之前一样的方式来定义 Store，然后通过 `mapStores()`、`mapState()` 或 `mapActions()` 访问：

```js {22,24,28}
const useCounterStore = defineStore('counter', {
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

const useUserStore = defineStore('user', {
  // ...
})

export default defineComponent({
  computed: {
    // 其他计算属性
    // ...
    // 允许访问 this.counterStore 和 this.userStore
    ...mapStores(useCounterStore, useUserStore)
    // 允许读取 this.count 和 this.double
    ...mapState(useCounterStore, ['count', 'double']),
  },
  methods: {
    // 允许读取 this.increment()
    ...mapActions(useCounterStore, ['increment']),
  },
})
```

你将会在核心概念部分了解到更多关于每个**映射辅助函数**的信息。

## 为什么取名 *Pinia*？%{#why-pinia}%

Pinia (发音为 `/piːnjʌ/`，类似英文中的 “peenya”) 是最接近有效包名 piña (西班牙语中的 *pineapple*，即“菠萝”) 的词。 菠萝花实际上是一组各自独立的花朵，它们结合在一起，由此形成一个多重的水果。 与 Store 类似，每一个都是独立诞生的，但最终它们都是相互联系的。 它(菠萝)也是一种原产于南美洲的美味热带水果。

## 更真实的示例 %{#a-more-realistic-example}%

这是一个更完整的 Pinia API 示例，在 JavaScript 中也使用了类型提示。对于某些开发者来说，可能足以在不进一步阅读的情况下直接开始阅读本节内容，但我们仍然建议你先继续阅读文档的其余部分，甚至跳过此示例，在阅读完所有**核心概念**之后再回来。

```js
import { defineStore } from 'pinia'

export const useTodos = defineStore('todos', {
  state: () => ({
    /** @type {{ text: string, id: number, isFinished: boolean }[]} */
    todos: [],
    /** @type {'all' | 'finished' | 'unfinished'} */
    filter: 'all',
    // 类型将自动推断为 number
    nextId: 0,
  }),
  getters: {
    finishedTodos(state) {
      // 自动补全！ ✨
      return state.todos.filter((todo) => todo.isFinished)
    },
    unfinishedTodos(state) {
      return state.todos.filter((todo) => !todo.isFinished)
    },
    /**
     * @returns {{ text: string, id: number, isFinished: boolean }[]}
     */
    filteredTodos(state) {
      if (this.filter === 'finished') {
        // 调用其他带有自动补全的 getters ✨
        return this.finishedTodos
      } else if (this.filter === 'unfinished') {
        return this.unfinishedTodos
      }
      return this.todos
    },
  },
  actions: {
    // 接受任何数量的参数，返回一个 Promise 或不返回
    addTodo(text) {
      // 你可以直接变更该状态
      this.todos.push({ text, id: this.nextId++, isFinished: false })
    },
  },
})
```

## 对比 Vuex %{#comparison-with-vuex}%

Pinia 起源于一次探索 Vuex 下一个迭代的实验，因此结合了 Vuex 5 核心团队讨论中的许多想法。最后，我们意识到 Pinia 已经实现了我们在 Vuex 5 中想要的大部分功能，所以决定将其作为新的推荐方案来代替 Vuex。

与 Vuex 相比，Pinia 不仅提供了一个更简单的 API，也提供了符合组合式 API 风格的 API，最重要的是，搭配 TypeScript 一起使用时有非常可靠的类型推断支持。

### RFC %{#rfcs}%

最初，Pinia 没有经过任何 RFC 的流程。我基于自己开发应用的经验，同时通过阅读其他人的代码，为使用 Pinia 的用户工作，以及在 Discord 上回答问题等方式验证了一些想法。
这些经历使我产出了这样一个可用的解决方案，并适应了各种场景和应用规模。我会一直在保持其核心 API 不变的情况下发布新版本，同时不断优化本库。

现在 Pinia 已经成为推荐的状态管理解决方案，它和 Vue 生态系统中的其他核心库一样，都要经过 RFC 流程，它的 API 也已经进入稳定状态。

### 对比 Vuex 3.x/4.x %{#comparison-with-vuex-3-x-4-x}%

> Vuex 3.x 只适配 Vue 2，而 Vuex 4.x 是适配 Vue 3 的。

Pinia API 与 Vuex(<=4) 也有很多不同，即：

- *mutation* 已被弃用。它们经常被认为是**极其冗余的**。它们初衷是带来 devtools 的集成方案，但这已不再是一个问题了。
- 无需要创建自定义的复杂包装器来支持 TypeScript，一切都可标注类型，API 的设计方式是尽可能地利用 TS 类型推理。
- 无过多的魔法字符串注入，只需要导入函数并调用它们，然后享受自动补全的乐趣就好。
- 无需要动态添加 Store，它们默认都是动态的，甚至你可能都不会注意到这点。注意，你仍然可以在任何时候手动使用一个 Store 来注册它，但因为它是自动的，所以你不需要担心它。
- 不再有嵌套结构的**模块**。你仍然可以通过导入和使用另一个 Store 来隐含地嵌套 stores 空间。虽然 Pinia 从设计上提供的是一个扁平的结构，但仍然能够在 Store 之间进行交叉组合。**你甚至可以让 Stores 有循环依赖关系**。
- 不再有**可命名的模块**。考虑到 Store 的扁平架构，Store 的命名取决于它们的定义方式，你甚至可以说所有 Store 都应该命名。

关于如何将现有 Vuex(<=4) 的项目转化为使用 Pinia 的更多详细说明，请参阅 [Vuex 迁移指南](./cookbook/migration-vuex.md)。
