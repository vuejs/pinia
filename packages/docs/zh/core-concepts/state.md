# State

<VueSchoolLink
  href="https://vueschool.io/lessons/access-state-from-a-pinia-store"
  title="Learn all about state in Pinia"
/>

在大多数情况下，state 都是你的 store 的核心。人们通常会首先定义能代表他们应用程序的 state。在 Pinia 中，state 被定义为一个返回初始状态的函数。这使得 Pinia 可以同时支持服务端和客户端。

```js
import { defineStore } from 'pinia'

const useStore = defineStore('storeId', {
  // 为了完整类型推理，推荐使用箭头函数
  state: () => {
    return {
      // 所有这些属性都将自动推断出它们的类型
      counter: 0,
      name: 'Eduardo',
      isAdmin: true,
    }
  },
})
```

:::tip
如果你使用的是 Vue2，你在 `state` 中创建的数据与 Vue 实例中的  `data` 遵循同样的规则，即 state 对象必须是清晰的，你需要在**向其添加新**属性时调用 `Vue.set()` 。**参考：[Vue#data](https://vuejs.org/v2/api/#data)**。
:::

## 访问 `state`{#accessing-the-state}

默认情况下，你可以通过 `store` 实例访问 state，直接对其进行读写。

```js
const store = useStore()

store.counter++
```

## 重置 state{#resetting-the-state}

你可以通过调用 store 的 `$reset()` 方法将 state 重置为初始值。

```js
const store = useStore()

store.$reset()
```

### 使用选项式 API 的用法{#usage-with-the-options-api}

<VueSchoolLink
  href="https://vueschool.io/lessons/access-pinia-state-in-the-options-api"
  title="Access Pinia State via the Options API"
/>

对于下面的例子，你可以假设相关 Store 已经创建了：

```js
// 示例文件路径：
// ./src/stores/counterStore.js

import { defineStore } from 'pinia',

const useCounterStore = defineStore('counterStore', {
  state: () => ({
    counter: 0
  })
})
```

### 使用 `setup()`{#with-setup}

虽然组合式 API 并不适合所有人，但 `setup()` 钩子可以使 Pinia 在选项式 API 中更容易操作。并且不需要额外的 map helper 函数!

```js
import { useCounterStore } from '../stores/counterStore'

export default {
  setup() {
    const counterStore = useCounterStore()

    return { counterStore }
  },
  computed: {
    tripleCounter() {
      return this.counterStore.counter * 3
    },
  },
}
```

### 不使用 `setup()`{#without-setup}

如果你不使用组合式 API，你可以使用 `computed`，`methods`，...，你也可以使用`mapState()` helper 将 state 属性映射为只读的计算属性：

```js
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  computed: {
    // 可以访问组件中的 this.counter。
    // 与从 store.counter 中读取的数据相同
    ...mapState(useCounterStore, ['counter'])
    // 与上述相同，但将其注册为 this.myOwnName
    ...mapState(useCounterStore, {
      myOwnName: 'counter',
      // 你也可以写一个函数来获得对 store 的访问权
      double: store => store.counter * 2,
      // 它可以访问 "this"，但它无法被正确类型检查。。。
      magicValue(store) {
        return store.someGetter + this.counter + this.double
      },
    }),
  },
}
```

#### 可修改的 state{#modifiable state}

如果你让这些 state 属性可写（例如，如果你有一个表单），你可以使用 `mapWritableState()` 来代替。但注意你不能像 `mapState()` 那样传递一个函数：

```js
import { mapWritableState } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  computed: {
    // 可以访问组件中的this.counter，并允许设置它。
    // this.counter++
    // 与从 store.counter 中读取的数据相同
    ...mapWritableState(useCounterStore, ['counter'])
    // 与上述相同，但将其注册为 this.myOwnName
    ...mapWritableState(useCounterStore, {
      myOwnName: 'counter',
    }),
  },
}
```

:::tip
对于像数组这样的集合，除非你用 `cartItems = []` 替换整个数组，你不需要 `mapWritableState()`，`mapState()` 就允许你调用集合上的方法。
:::

## 变更 state{#mutating-the-state}

<!-- TODO: disable this with `strictMode` -->

除了用 `store.counter++` 直接改变存储，你还可以调用 `$patch` 方法。它允许你用一个局部的 `state` 对象在同一时间应用多个变化：

```js
store.$patch({
  counter: store.counter + 1,
  name: 'Abalam',
})
```

然而，用这种语法的话，有些变更真的很难实现或很耗时：任何集合的修改（例如，从数组中推送、移除、拼接一个元素）都需要你创建一个新的集合。因此，`$patch` 方法也接受一个函数来分组这种难以用补丁对象实现的变更。

```js
cartStore.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```

<!-- TODO: disable this with `strictMode`, `{ noDirectPatch: true }` -->

这里的主要区别是，`$patch()` 允许你将多个改动归入 devtools 中的一个条目。注意两点，**直接修改 `state`然后 `$patch()` 就会出现在 devtools 中**，并且可以进行 time travelled（在 Vue3 中还没有）。

## 替换 `state`{#replacing-the-state}

你可以通过将一个 store 的 `$state` 属性设置为一个新的对象来替换它的整个 state：

```js
store.$state = { counter: 666, name: 'Paimon' }
```

你也可以通过改变 `pinia` 实例的 `state` 来替换应用程序的整个 state。这在常用于[SSR for hydration](./ssr/#state-hydration)。

```js
pinia.state.value = {}
```

## 订阅 state{#subscribing-to-the-state}

类似于 Vuex 的 [subscribe 方法](https://vuex.vuejs.org/api/#subscribe)，你可以通过 store 的 `$subscribe()` 方法观测 state 及其变化。比起普通的 `watch()`，使用 `$subscribe()` 的好处是 _subscriptions_ 在 _patches_ 后只触发一次（例如，当使用上面的函数版本时）。

```js
cartStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type // 'direct' | 'patch object' | 'patch function'
  // 和 cartStore.$id 一样
  mutation.storeId // 'cart'
  // 只有 mutation.type === 'patch object'的情况下才可用
  mutation.payload // 传递给 cartStore.$patch() 的补丁对象。

  // 每当状态发生变化时，将整个 state 持久化到本地存储。
  localStorage.setItem('cart', JSON.stringify(state))
})
```

默认情况下，_state subscriptions_ 会被绑定到它们被添加的组件上（如果 store 在组件的 `setup()` 里面）。这意味着，当该组件被卸载时，它们将被自动删除。如果你想在组件卸载后保留它们，请将 `{ detached: true }` 作为第二个参数，以将 _state subscription_ 从当前组件中剥离：

```js
export default {
  setup() {
    const someStore = useSomeStore()

    // 在组件被卸载后，该订阅将被保留。
    someStore.$subscribe(callback, { detached: true })

    // ...
  },
}
```

:::tip
你可以在`pinia`实例上侦听整个 state。

```js
watch(
  pinia.state,
  (state) => {
    // 每当状态发生变化时，将整个 state 持久化到本地存储。
    localStorage.setItem('piniaState', JSON.stringify(state))
  },
  { deep: true }
)
```

:::
