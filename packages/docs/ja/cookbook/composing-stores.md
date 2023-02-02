# Composing Stores {#composing-stores}

ストアを構成するということは、お互いに利用し合うストアを持つことであり、Pinia ではこれをサポートしています。守るべきルールは 1 つです:

**2 つ以上のストアがお互いを使用する** 場合、_ゲッター_ や _アクション_ によって無限ループを作ることはできません。また、セットアップ関数で **互いの** 状態を直接読み取ることもできません:

```js
const useX = defineStore('x', () => {
  const y = useY()

  // ❌ This is not possible because y also tries to read x.name
  y.name

  function doSomething() {
    // ✅ Read y properties in computed or actions
    const yName = y.name
    // ...
  }

  return {
    name: ref('I am X'),
  }
})

const useY = defineStore('y', () => {
  const x = useX()

  // ❌ This is not possible because x also tries to read y.name
  x.name

  function doSomething() {
    // ✅ Read x properties in computed or actions
    const xName = x.name
    // ...
  }

  return {
    name: ref('I am Y'),
  }
})
```

## ネストしたストア {#nested-stores}

あるストアが別のストアを使用する場合、_アクション_ と _ゲッター_ 内で `useStore()` 関数を直接インポートして呼び出すことができることに注意してください。そうすると、Vue コンポーネント内から操作するのと同じように、ストアを操作することができます。[共有ゲッター](#shared-getters) と [共有アクション](#shared-actions) を参照してください。

_ストアの設定_ に関しては、ストア機能の **上部にある** ストアのいずれかを使用すればよいだけです。

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

## 共有ゲッター {#shared-getters}

_ゲッター_ の中で `useOtherStore()` を呼び出すだけです:

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

## 共有アクション {#shared-actions}

_アクション_ も同様です:

```js
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  actions: {
    async orderCart() {
      const user = useUserStore()

      try {
        await apiOrderCart(user.token, this.items)
        // another action
        this.emptyCart()
      } catch (err) {
        displayError(err)
      }
    },
  },
})
```
