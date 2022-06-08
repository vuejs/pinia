# Composing Stores

Composing stores 是相互使用的 store，有一个规则需要遵循：

如果**两个或更多的 store 相互使用**，它们不能通过 _getters_ 或 _actions_ 创建一个无限循环。它们不能**都**在它们的 setup 函数中直接读取对方的 state：

```js
const useX = defineStore('x', () => {
  const y = useY()

  // ❌ 这是不可能的，因为 y 也试图读取 x.name
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

  // ❌ 这是不可能的，因为 x 也试图读取 y.name
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

## 嵌套 store{#nested-stores}

请注意，如果一个 store 使用另一个 store，**没有必要在一个单独的文件中创建一个新的 store**，你可以直接导入它。把它看作是嵌套。

你可以在任何 getter 或 action 的顶部调用 `useOtherStore()`：

```js
import { useUserStore } from './user'

export const cartStore = defineStore('cart', {
  getters: {
    // ... 其他 getters
    summary(state) {
      const user = useUserStore()

      return `Hi ${user.name}, you have ${state.list.length} items in your cart. It costs ${state.price}.`
    },
  },

  actions: {
    purchase() {
      const user = useUserStore()

      return apiPurchase(user.id, this.list)
    },
  },
})
```

## 共享 getter{#shared-getters}

你可以直接在一个 _getter_ 里面调用 `useOtherStore()`：

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

## 共享 Action {#shared-actions}

The same applies to _actions_:

```js
import { defineStore } from 'pinia'
import { useUserStore } from './user'

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
