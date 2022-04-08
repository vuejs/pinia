# Getters{#getters}

<VueSchoolLink
  href="https://vueschool.io/lessons/getters-in-pinia"
  title="Learn all about getters in Pinia"
/>

Getter 完全等同于 store 的状态[计算值](https://v3.vuejs.org/guide/reactivity-computed-watchers.html#computed-values)。它们可以通过 `defineStore()` 中的 `getters` 属性来定义。它们接收 `state` 作为第一个参数，同时**推荐**使用箭头函数。

```js
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
})
```

大多数时候，getter 只会依赖状态，不过，有时它们可能需要使用其他 getter。正因为如此，在定义普通函数时，我们可以通过 `this` 访问到**整个 store 实例**，**但定义返回类型（在TypeScript中）是很有必要的**。这是 TypeScript 的一个已知限制，**不影响用箭头函数定义的 getter，也不会影响不使用 `this` 的 getter**。

```ts
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    // 自动推断出返回类型是一个 number
    doubleCount(state) {
      return state.counter * 2
    },
    // 返回类型**必须**明确设置
    doublePlusOne(): number {
      // 整个 store 的 自动补全和类型检查 ✨
      return this.doubleCount + 1
    },
  },
})
```

然后你可以直接访问 store 实例上的 getter 了：

```vue
<template>
  <p>Double count is {{ store.doubleCount }}</p>
</template>

<script>
export default {
  setup() {
    const store = useStore()

    return { store }
  },
}
</script>
```

## 访问其他 getter{#accessing-other-getters}

与计算属性一样，你可以结合多个 getter。通过 `this` 访问任何其他 getter。即使你不使用 TypeScript，你也可以用 [JSDoc](https://jsdoc.app/tags-returns.html) 来让你的 IDE 提示类型。

```js
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    // 类型是自动推断出来的，因为我们没有使用 `this`。
    doubleCount: (state) => state.counter * 2,
    // 这里我们需要自己添加类型（在 JS 中使用 JSDoc）。
    // 我们也可以用 this 来记录 getter 的内容
    /**
     * 返回 counter 的值乘以 2 加 1
     *
     * @returns {number}
     */
    doubleCountPlusOne() {
      // 自动补全 ✨
      return this.doubleCount + 1
    },
  },
})
```

## 向 getter 传递参数{#passing-arguments-to-getters}

_getter_ 只是幕后的**计算**属性，所以不可能向它们传递任何参数。不过，你可以从 _getter_ 返回一个函数，该函数可以接受任何参数：

```js
export const useStore = defineStore('main', {
  getters: {
    getUserById: (state) => {
      return (userId) => state.users.find((user) => user.id === userId)
    },
  },
})
```

并在组件中使用：

```vue
<script>
export default {
  setup() {
    const store = useStore()

    return { getUserById: store.getUserById }
  },
}
</script>

<template>
  <p>User 2: {{ getUserById(2) }}</p>
</template>
```

请注意，这样做时，**getter 将不再被缓存**，它们只是被你调用的函数。不过，你可以在 getter 本身中缓存一些结果，虽然这种做法不常见，但应该能证明它的性能更好：

```js
export const useStore = defineStore('main', {
  getters: {
    getActiveUserById(state) {
      const activeUsers = state.users.filter((user) => user.active)
      return (userId) => activeUsers.find((user) => user.id === userId)
    },
  },
})
```

## 访问其他 store 的 getter{#accessing-other-stores-getters}

要使用另一个 store 的 getter，你可以直接在 _getter_ 内使用它：

```js
import { useOtherStore } from './other-store'

export const useStore = defineStore('main', {
  state: () => ({
    // ...
  }),
  getters: {
    otherGetter(state) {
      const otherStore = useOtherStore()
      return state.localData + otherStore.data
    },
  },
})
```

## 使用 `setup()` 时的用法{#usage-with-setup}

作为 store 的一个属性，你可以直接访问任何 getter（与状态属性完全一样）。

```js
export default {
  setup() {
    const store = useStore()

    store.counter = 3
    store.doubleCount // 6
  },
}
```

## 使用选项式 API 的用法{#usage-with-the-options-api}

<VueSchoolLink
  href="https://vueschool.io/lessons/access-pinia-getters-in-the-options-api"
  title="Access Pinia Getters via the Options API"
/>

对于下面的例子，你可以假设相关的 store 已经创建了：

```js
// 示例文件路径：
// ./src/stores/counterStore.js

import { defineStore } from 'pinia',

const useCounterStore = defineStore('counterStore', {
  state: () => ({
    counter: 0
  }),
  getters: {
    doubleCounter() {
      return this.counter * 2
    }
  }
})
```

### 使用 `setup()`{#with-setup}

虽然组合式 API 并不适合所有人，但 `setup()` 钩子可以使 Pinia 在选项式 API 中更容易操作。不需要额外的 map helper 函数!

```js
import { useCounterStore } from '../stores/counterStore'

export default {
  setup() {
    const counterStore = useCounterStore()

    return { counterStore }
  },
  computed: {
    quadrupleCounter() {
      return counterStore.doubleCounter * 2
    },
  },
}
```

### 不使用 `setup()`{#without-setup}

你可以使用与[前一节的 state](./state.md#options-api)中相同的 `mapState()` 函数来映射 getters：

```js
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  computed: {
    // 允许在组件中访问 this.doubleCounter
    // 与从 store.doubleCounter 中读取的相同
    ...mapState(useCounterStore, ['doubleCount'])
    // 与上述相同，但将其注册为 this.myOwnName
    ...mapState(useCounterStore, {
      myOwnName: 'doubleCounter',
      // 你也可以写一个函数来获得对 store 的访问权
      double: store => store.doubleCount,
    }),
  },
}
```
