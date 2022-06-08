# 简介 {#introduction}

<VueSchoolLink
  href="https://vueschool.io/lessons/introduction-to-pinia"
  title="Get started with Pinia"
/>

Pinia [最初](https://github.com/vuejs/pinia/commit/06aeef54e2cad66696063c62829dac74e15fd19e)是在 2019 年 11 月左右作为一个使用 [Composition API](https://github.com/vuejs/composition-api) 的实验进行设计的。从那时起，同时支持 Vue2 和 Vue3 以及不强制要求使用 composition API 的初始原则保留至今。除了**安装**和**SSR**之外，支持 Vue3 和 Vue2 的 API 都是相同的。虽然这些文档主要是面向 Vue3，但在必要时会标注出 Vue2 的内容，因此 Vue2 和 Vue3 的用户都可以阅读本文档。

## 为什么要使用 Pinia？{#why-should-i-use-pinia}

Pinia 是专属 Vue 的 store 库，它允许你跨组件/页面共享状态。如果你熟悉 Composition API 的话，你可能会认为你可以通过一行简单的 `export const state = reactive({})`来共享一个全局状态。对于单页应用程序来说确实是这样的，但如果在服务器端渲染，这可能会使您的应用程序暴露出一些安全漏洞。 不过若是使用 Pinia，即使在小型单页应用程序中，你也可以获得很多好处：

- Devtools 支持
  - 追踪 actions、mutations 的时间线
  - Store 可出现于使用它们的组件中
  - Time travel 以及更容易的调试
- 热更新
  - 不必重载页面即可修改 Store
  - 开发时可保持现有状态
- 插件：可通过插件扩展 Pinia 功能
- 为JS 用户提供适当的 TypeScript 支持或**自动补全**功能。
- 支持服务端渲染

## 基本示例{#basic-example}

下面就是以 API 使用 pinia 的基本用法（为继续阅读本简介请确保你已阅读过了[开始](./getting-started.md)章节）。你可以先创建一个 Store：

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

然后你就可以在一个组件中使用该 store 了:

```js
import { useCounterStore } from '@/stores/counter'

export default {
  setup() {
    const counter = useCounterStore()

    counter.count++
    // 使用自动补全 ✨
    counter.$patch({ count: counter.count + 1 })
    // 或者使用 action 代替
    counter.increment()
  },
}
```

为实现更多高级用法，你甚至可以使用一个函数（与组件 `setup()` 类似）来定义一个 Store：

```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }

  return { count, increment }
})
```

如果你还不熟悉 setup() 和 Composition API，别担心，Pinia 也提供了一组类似 Vuex 的[map helpers](https://vuex.vuejs.org/guide/state.html#the-mapstate-helper)。你可以同样的方式定义 Store，然后通过 `mapStores()`、`mapState()` 或 `mapActions()`使用：

```js
const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    }
  }
})

const useUserStore = defineStore('user', {
  // ...
})

export default {
  computed: {
    // other computed properties
    // ...
    // gives access to this.counterStore and this.userStore
    ...mapStores(useCounterStore, useUserStore)
    // gives read access to this.count and this.double
    ...mapState(useCounterStore, ['count', 'double']),
  },
  methods: {
    // gives access to this.increment()
    ...mapActions(useCounterStore, ['increment']),
  },
}
```

你将会在核心概念部分了解到更多关于 _map helper_ 的信息。

## 为什么命名为 _Pinia_？{#Why-pinia}

Pinia (发音为 `/piːnjʌ/`，类似英文中的 “peenya”) 是最接近有效包名 piña（西班牙语中的 _pineapple_）的词。 菠萝实际上是一组各自独立的花朵，它们结合在一起，由此形成一个多重的水果。 与 Store 类似，每一个都是独立诞生的，但最终它们都是相互联系的。 它也是一种原产于南美洲的美味热带水果。

## 更真实的示例{#a-more-realistic-example}

这是一个更完整的你将会使用的 Pinia API 示例，即使在 JavaScript 中也具有类型提示。对于某些人来说，可能足以在不进一步阅读的情况下直接开始阅读本节内容，但我们仍然建议你继续阅读文档的其余部分，甚至跳过此示例，在阅读完所有**核心概念**之后再返回。

```js
import { defineStore } from 'pinia'

export const todos = defineStore('todos', {
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
        // call other getters with autocompletion ✨
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
      // 你可以直接 mutate 该状态
      this.todos.push({ text, id: this.nextId++, isFinished: false })
    },
  },
})
```

## 与 Vuex 对比{#comparison-with-vuex}

Pinia 最初是为了探索 Vuex 的下一次迭代会是什么样子，结合了 Vuex 5 核心团队讨论中的许多想法。最终，我们意识到 Pinia 已经实现了我们在 Vuex 5 中想要的大部分功能，并决定将其作为新的推荐来代替 Vuex。

与 Vuex 相比，Pinia 不仅提供了一个更简单的 API，也提供了Composition-API 风格的 API，最重要的是，与 TypeScript 一起使用时有坚实的类型推断支持。

### RFCs

最初，Pinia 没有经过任何 RFC。我根据自己开发应用程序的经验，同时阅读其他人的代码，为使用 Pinia 的客户工作，以及在 Discord 上回答问题，测试了一些想法。
这些使我能够产出了这样一个可行的解决方案，并适应各种情况和应用规模。我曾经常发表文章，并在保持其核心 API 不变的情况下不断优化本库。

现在 Pinea 已经成为默认的状态管理解决方案，它和 Vue 生态系统中的其他核心库一样，都要经过 RFC 流程，其 API 已经进入稳定状态。

### 与 Vuex 3.x/4.x 对比{#comparison-with-vuex-3-x-4-x}

> Vuex 3.x 是适配 Vue2 的 Vuex，而 Vuex 4.x 是适配 Vue3 的。

Pinia API 与 Vuex ≤4 有很大不同，即：

- _mutation_ 不再存在。它们经常被认为是**极其冗长的**。它们最初带来了 devtools 的集成，但这已不再是一个问题了。
- 无需要创建自定义的复杂包装器来支持 TypeScript，一切都被类型化了，API 的设计方式是尽可能地利用 TS 类型推理。
- 无过多的魔法字符串注入，导入函数。只需要调用它们，享受自动补全的乐趣就好。
- 无需要动态添加 Store，它们默认都是动态的，甚至你都不会注意到这点。注意，你仍然可以在任何时候手动使用一个 Store 来注册它，但因为它是自动的，所以你不需要担心它。
- 不再有嵌套结构的**模块**。你仍然可以通过导入和使用另一个 Store 来隐含地嵌套存储空间，但是 Pinia 在设计上提供了一个扁平的结构，同时仍然能够在 Store 之间进行交叉组合。**你甚至可以有 Store 的循环依赖关系**。
- 没有**命名的模块**。考虑到 Store 的扁平架构，“命名” Store 是与生俱来的，你可以说所有 Store 都是命名的。

关于如何将现有 Vuex ≤4 项目转化为使用 Pinia 的更多详细说明，请参阅[从 Vuex 迁移指南](./cookbook/migration-vuex.md)。
