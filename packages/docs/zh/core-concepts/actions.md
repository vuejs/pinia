# Actions

<VueSchoolLink
  href="https://vueschool.io/lessons/synchronous-and-asynchronous-actions-in-pinia"
  title="Learn all about actions in Pinia"
/>

Action 相当于组件中的 [method](https://v3.vuejs.org/guide/data-methods.html#methods)。它们可以通过 `defineStore()` 中的 `actions` 属性来定义，**它们也是定义业务逻辑的完美选择。**

```js
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  actions: {
    increment() {
      this.counter++
    },
    randomizeCounter() {
      this.counter = Math.round(100 * Math.random())
    },
  },
})
```

与 [getter](./getters.md) 一样，action 也可通过 `this` 访问整个 store 实例，并支持**完整的类型（以及自动补全✨）**。**不同的是，`action` 可以是异步的**，你可以在它们里面 `await` 任何 API 调用，甚至是其他 action！下面是一个使用 [Mande](https://github.com/posva/mande) 的例子。注意你使用什么库并不重要，只要你得到一个`Promise`，你甚至可以使用原生 `fetch` 函数（仅限浏览器）。

```js
import { mande } from 'mande'

const api = mande('/api/users')

export const useUsers = defineStore('users', {
  state: () => ({
    userData: null,
    // ...
  }),

  actions: {
    async registerUser(login, password) {
      try {
        this.userData = await api.post({ login, password })
        showTooltip(`Welcome back ${this.userData.name}!`)
      } catch (error) {
        showTooltip(error)
        // 让表单组件显示错误
        return error
      }
    },
  },
})
```

你也可以完全自由地设置你想要的任何参数以及返回任何结果。当调用 action 时，一切都可以被自动推断出来。

Action 可以像 methods 一样被调用：

```js
export default defineComponent({
  setup() {
    const main = useMainStore()
    // 作为 store 的一个方法调用该 action
    main.randomizeCounter()

    return {}
  },
})
```

## 访问其他 store 的 action {#accessing-other-stores-actions}

要使用另一个 store，你可以直接在 _action_ 中使用它：

```js
import { useAuthStore } from './auth-store'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    preferences: null,
    // ...
  }),
  actions: {
    async fetchUserPreferences() {
      const auth = useAuthStore()
      if (auth.isAuthenticated) {
        this.preferences = await fetchPreferences()
      } else {
        throw new Error('User must be authenticated')
      }
    },
  },
})
```

## 使用 `setup()` 时的用法{#usage-with-setup}

你可以将任何 action 作为 store 的一个方法直接调用：

```js
export default {
  setup() {
    const store = useStore()

    store.randomizeCounter()
  },
}
```

## 使用选项式 API 的用法{#usage-with-the-options-api}

<VueSchoolLink
  href="https://vueschool.io/lessons/access-pinia-actions-in-the-options-api"
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
  actions: {
    increment() {
      this.counter++
    }
  }
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
  methods: {
    incrementAndPrint() {
      this.counterStore.increment()
      console.log('New Count:', this.counterStore.count)
    },
  },
}
```

### 不使用 `setup()`{#without-setup}

如果你不喜欢使用组合式 API，你可以使用 `mapActions()` helper 将 action 属性映射为你组件中的方法。

```js
import { mapActions } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  methods: {
    // 访问组件内的 this.increment()
    // 与从 store.increment() 调用相同
    ...mapActions(useCounterStore, ['increment'])
    // 与上述相同，但将其注册为this.myOwnName()
    ...mapActions(useCounterStore, { myOwnName: 'doubleCounter' }),
  },
}
```

## 订阅 action {#subscribing-to-actions}

可以通过 `store.$onAction()` 来监测 action 和它们的结果。传递给它的回调会在 action 本身之前执行。`after` 处理 promise，允许你在action 解决后执行一个函数。同样地，`onError` 允许你在 action 抛出或拒绝时执行一个函数。这些追踪运行时错误非常有用，类似于[Vue docs 中的这个提示](https://v3.vuejs.org/guide/tooling/deployment.html#tracking-runtime-errors)。

这里有一个例子，在运行 action 之前和 action 解决/拒绝之后都有记录。

```js
const unsubscribe = someStore.$onAction(
  ({
    name, // action 名称
    store, // store 实例，类似 `someStore`
    args, // 传递给 action 的参数数组
    after, // 在 action 返回或解决后的钩子
    onError, // action 抛出或拒绝的钩子
  }) => {
    // 为这个特定的 action 调用提供一个共享变量
    const startTime = Date.now()
    // 这将在执行 "store "的 action 之前触发。
    console.log(`Start "${name}" with params [${args.join(', ')}].`)

    // 这将在 action 成功并完全运行后触发。
    // 它等待着任何返回的 promise
    after((result) => {
      console.log(
        `Finished "${name}" after ${
          Date.now() - startTime
        }ms.\nResult: ${result}.`
      )
    })

    // 如果动作抛出或返回一个拒绝的 promise，这将触发
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })
  }
)

// 手动删除监听器
unsubscribe()
```

默认情况下，_action subscriptions_ 会被绑定到它们被添加的组件上（如果 store 在组件的 `setup()` 内）。这意味着，当该组件被卸载时，它们将被自动删除。如果你想在组件卸载后保留它们，请将 `true` 作为第二个参数传递给 _action subscription_，以便从当前组件中剥离。

```js
export default {
  setup() {
    const someStore = useSomeStore()

    // 在组件被卸载后，这个订阅将被保留。
    someStore.$onAction(callback, true)

    // ...
  },
}
```
