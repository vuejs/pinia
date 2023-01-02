# 组合式 Store {#composing-stores}

组合式 store 是可以相互使用，Pinia 当然也支持它。但有一个规则需要遵循：

如果**两个或更多的 store 相互使用**，它们不可以通过 *getters* 或 *actions* 创建一个无限循环。它们也不可以**同时**在它们的 setup 函数中直接互相读取对方的 state：

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

## 嵌套 store {#nested-stores}

注意，如果一个 store 使用另一个 store，你可以直接导入并在 *actions* 和 *getters* 中调用 `useStore()` 函数。然后你就可以像在 Vue 组件中那样使用 store。参考[共享 Getter](#shared-getters) 和[共享 Action](#shared-actions)。

对于 *setup store* ，你直接使用 store 函数**顶部**的一个 store：

```ts
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', () => {
  const user = useUserStore()

  const summary = computed(() => {
    return `Hi ${user.name}, you have ${state.list.length} items in your cart. It costs ${state.price}.`
  })

  function purchase() {
    return apiPurchase(user.id, this.list)
  }

  return { summary, purchase }
})
```

## 共享 Getter {#shared-getters}

你可以直接在一个 *getter* 中调用 `useOtherStore()`：

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

## 共享 Actions {#shared-actions}

*actions* 也一样：

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
