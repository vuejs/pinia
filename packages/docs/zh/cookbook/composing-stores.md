# 组合式 Store %{#composing-stores}%

<!-- <RuleKitLink /> -->

组合式 store 是可以相互使用，Pinia 当然也支持它。但有一个规则需要遵循：

如果**两个或更多的 store 相互使用**，它们不可以通过 _getters_ 或 _actions_ 创建一个无限循环。它们也不可以**同时**在它们的 setup 函数中直接互相读取对方的 state：

```js
const useX = defineStore('x', () => {
  const y = useY()

  // ❌ 这是不可以的，因为 y 也试图读取 x.name
  y.name

  function doSomething() {
    // ✅ 读取 computed 或 action 中的 y 属性
    const yName = y.name
    // ...
  }

  return {
    name: ref('I am X'),
  }
})

const useY = defineStore('y', () => {
  const x = useX()

  // ❌ 这是不可以的，因为 x 也试图读取 y.name
  x.name

  function doSomething() {
    // ✅ 读取 computed 或 action 中的 x 属性
    const xName = x.name
    // ...
  }

  return {
    name: ref('I am Y'),
  }
})
```

## 嵌套 store %{#nested-stores}%

注意，如果一个 store 使用另一个 store，你可以直接导入并在 _actions_ 和 _getters_ 中调用 `useStore()` 函数。然后你就可以像在 Vue 组件中那样使用 store。参考[共享 Getter](#shared-getters) 和[共享 Action](#shared-actions)。

对于 _setup store_，你可以直接使用 store 函数**顶部**的一个 store：

```ts
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { apiPurchase } from './api'

export const useCartStore = defineStore('cart', () => {
  const user = useUserStore()
  const list = ref([])

  const summary = computed(() => {
    return `Hi ${user.name}, you have ${list.value.length} items in your cart. It costs ${price.value}.`
  })

  function purchase() {
    return apiPurchase(user.id, list.value)
  }

  return { list, summary, purchase }
})
```

## 共享 Getter %{#shared-getters}%

你可以直接在一个 _getter_ 中调用 `useUserStore()`：

```js
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  getters: {
    summary(state) {
      const user = useUserStore()

      return `Hi ${user.name}, you have ${state.list.length} items in your cart. It costs ${state.price}.`
    },
  },
})
```

## 共享 Action %{#shared-actions}%

_actions_ 也一样：

```js
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { apiOrderCart } from './api'

export const useCartStore = defineStore('cart', {
  actions: {
    async orderCart() {
      const user = useUserStore()

      try {
        await apiOrderCart(user.token, this.items)
        // 其他 action
        this.emptyCart()
      } catch (err) {
        displayError(err)
      }
    },
  },
})
```

由于 action 可以是异步的，请确保**所有的 `useStore()` 调用都出现在任何 `await` 之前**。否则，_在 SSR 应用中_ 可能会使用错误的 pinia 实例：

```js{7-8,11-13}
import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { apiOrderCart } from './api'

export const useCartStore = defineStore('cart', {
  actions: {
    async orderCart() {
      // ✅ 在 action 顶部、任何 `await` 之前调用
      const user = useUserStore()

      try {
        await apiOrderCart(user.token, this.items)
        // ❌ 在 `await` 语句之后调用
        const otherStore = useOtherStore()
        // 其他 action
        this.emptyCart()
      } catch (err) {
        displayError(err)
      }
    },
  },
})
```
