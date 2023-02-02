# State %{#state}%

<VueSchoolLink
  href="https://vueschool.io/lessons/access-state-from-a-pinia-store"
  title="Learn all about state in Pinia"
/>

在大多数情况下，state 都是你的 store 的核心。人们通常会先定义能代表他们 APP 的 state。在 Pinia 中，state 被定义为一个返回初始状态的函数。这使得 Pinia 可以同时支持服务端和客户端。

```js
import { defineStore } from 'pinia'

const useStore = defineStore('storeId', {
  // 为了完整类型推理，推荐使用箭头函数
  state: () => {
    return {
      // 所有这些属性都将自动推断出它们的类型
      count: 0,
      name: 'Eduardo',
      isAdmin: true,
      items: [],
      hasChanged: true,
    }
  },
})
```

:::tip
如果你使用的是 Vue 2，你在 `state` 中创建的数据与 Vue 实例中的  `data` 遵循同样的规则，即 state 对象必须是清晰的，当你想向其**添加新属性**时，你需要调用 `Vue.set()` 。**参考：[Vue#data](https://v2.cn.vuejs.org/v2/api/#data)**。
:::

## TypeScript %{#typescript}%

你并不需要做太多努力就能使你的 state 兼容 TS。 Pinia 会自动推断出你的 state 的类型，但在一些情况下，你得用一些方法来帮它一把。

```ts
const useStore = defineStore('storeId', {
  state: () => {
    return {
      // 用于初始化空列表
      userList: [] as UserInfo[],
      // 用于尚未加载的数据
      user: null as UserInfo | null,
    }
  },
})

interface UserInfo {
  name: string
  age: number
}
```

如果你愿意，你可以用一个接口定义 state，并添加 `state()` 的返回值的类型。

```ts
interface State {
  userList: UserInfo[]
  user: UserInfo | null
}

const useStore = defineStore('storeId', {
  state: (): State => {
    return {
      userList: [],
      user: null,
    }
  },
})

interface UserInfo {
  name: string
  age: number
}
```

## 访问 `state` %{#accessing-the-state}%

默认情况下，你可以通过 `store` 实例访问 state，直接对其进行读写。

```js
const store = useStore()

store.count++
```

## 重置 state %{#resetting-the-state}%

你可以通过调用 store 的 `$reset()` 方法将 state 重置为初始值。

```js
const store = useStore()

store.$reset()
```

### 使用选项式 API 的用法 %{#usage-with-the-options-api}%

<VueSchoolLink
  href="https://vueschool.io/lessons/access-pinia-state-in-the-options-api"
  title="Access Pinia State via the Options API"
/>

在下面的例子中，你可以假设相关 store 已经创建了：

```js
// 示例文件路径：
// ./src/stores/counter.js

import { defineStore } from 'pinia'

const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
})
```

如果你不能使用组合式 API，但你可以使用 `computed`，`methods`，...，那你可以使用 `mapState()` 辅助函数将 state 属性映射为只读的计算属性：

```js
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  computed: {
    // 可以访问组件中的 this.count
    // 与从 store.count 中读取的数据相同
    ...mapState(useCounterStore, ['count'])
    // 与上述相同，但将其注册为 this.myOwnName
    ...mapState(useCounterStore, {
      myOwnName: 'count',
      // 你也可以写一个函数来获得对 store 的访问权
      double: store => store.count * 2,
      // 它可以访问 `this`，但它没有标注类型...
      magicValue(store) {
        return store.someGetter + this.count + this.double
      },
    }),
  },
}
```

#### 可修改的 state %{#modifiable-state}%

如果你想修改这些 state 属性(例如，如果你有一个表单)，你可以使用 `mapWritableState()` 作为代替。但注意你不能像 `mapState()` 那样传递一个函数：

```js
import { mapWritableState } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  computed: {
    // 可以访问组件中的 this.count，并允许设置它。
    // this.count++
    // 与从 store.count 中读取的数据相同
    ...mapWritableState(useCounterStore, ['count'])
    // 与上述相同，但将其注册为 this.myOwnName
    ...mapWritableState(useCounterStore, {
      myOwnName: 'count',
    }),
  },
}
```

:::tip
对于像数组这样的集合，你并不一定需要使用 `mapWritableState()`，`mapState()` 也允许你调用集合上的方法，除非你想用 `cartItems = []` 替换整个数组。
:::

## 变更 state %{#mutating-the-state}%

<!-- TODO: disable this with `strictMode` -->

除了用 `store.count++` 直接改变 store，你还可以调用 `$patch` 方法。它允许你用一个 `state` 的补丁对象在同一时间更改多个属性：

```js
store.$patch({
  count: store.count + 1,
  age: 120,
  name: 'DIO',
})
```

不过，用这种语法的话，有些变更真的很难实现或者很耗时：任何集合的修改（例如，向数组中添加、移除一个元素或是做 `splice` 操作）都需要你创建一个新的集合。因此，`$patch` 方法也接受一个函数来组合这种难以用补丁对象实现的变更。

```js
store.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```

<!-- TODO: disable this with `strictMode`, `{ noDirectPatch: true }` -->

两种变更 store 方法的主要区别是，`$patch()` 允许你将多个变更归入 devtools 的同一个条目中。同时请注意，**直接修改 `state`，`$patch()` 也会出现在 devtools 中**，而且可以进行 time travel(在 Vue 3 中还没有)。

## 替换 `state` %{#replacing-the-state}%

你**不能完全替换掉** store 的 state，因为那样会破坏其响应性。但是，你可以 *patch* 它。

```js
// 这实际上并没有替换`$state`
store.$state = { count: 24 }
// 在它内部调用 `$patch()`：
store.$patch({ count: 24 })
```

你也可以通过变更 `pinia` 实例的 `state` 来设置整个应用的初始 state。这常用于 [SSR 中的激活过程](../ssr/#state-hydration)。

```js
pinia.state.value = {}
```

## 订阅 state %{#subscribing-to-the-state}%

类似于 Vuex 的 [subscribe 方法](https://vuex.vuejs.org/zh/api/index.html#subscribe)，你可以通过 store 的 `$subscribe()` 方法侦听 state 及其变化。比起普通的 `watch()`，使用 `$subscribe()` 的好处是 *subscriptions* 在 *patch* 后只触发一次(例如，当使用上面的函数版本时)。

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

默认情况下，*state subscription* 会被绑定到添加它们的组件上(如果 store 在组件的 `setup()` 里面)。这意味着，当该组件被卸载时，它们将被自动删除。如果你想在组件卸载后依旧保留它们，请将 `{ detached: true }` 作为第二个参数，以将 *state subscription* 从当前组件中*分离*：

```vue
<script setup>
const someStore = useSomeStore()
// this subscription will be kept even after the component is unmounted
someStore.$subscribe(callback, { detached: true })
</script>
```

:::tip
你可以在 `pinia` 实例上使用 `watch()` 函数侦听整个 state。

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
