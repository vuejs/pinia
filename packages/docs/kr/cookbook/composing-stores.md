# 통합 Stores

통합 Stores는 서로를 사용하는 상점을 갖는 것에 관한 것이고 따라야 할 한 가지 규칙이 있습니다:

**두 개 이상의 저장소를 서로 사용**하는 경우 _getters_ 또는 *actions*를 통해 무한 루프를 만들 수 없습니다. **둘다** setup function에서 서로의 상태를 직접 읽을 수 없습니다:

```js
const useX = defineStore('x', () => {
  const y = useY()

  // ❌ y도 x.name을 읽으려고 하기 때문에 불가능합니다
  y.name

  function doSomething() {
    // ✅ cumputed 또는 actions에서 y 속성 읽기
    const yName = y.name
    // ...
  }

  return {
    name: ref('I am X'),
  }
})

const useY = defineStore('y', () => {
  const x = useX()

  // ❌ x도 y.name을 읽으려고 하기 때문에 불가능합니다
  x.name

  function doSomething() {
    // ✅ cumputed 또는 actions에서 x 속성 읽기
    const xName = x.name
    // ...
  }

  return {
    name: ref('I am Y'),
  }
})
```

## Nested stores

한 스토어에서 다른 스토어를 사용하는 경우 **별도의 파일에 새 스토어를 생성할 필요가 없으며** 직접 가져올 수 있습니다. 중첩이라고 생각하십시오.

getter 또는 액션의 맨 위에서 `useOtherStore()`를 호출할 수 있습니다:

```js
import { useUserStore } from './user'

export const cartStore = defineStore('cart', {
  getters: {
    // ... 다른 getters
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

## Shared Getters

_getter_ 내부에서 간단히 `useOtherStore()`를 호출할 수 있습니다:

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

## Shared Actions

*액션*에도 동일하게 적용됩니다:

```js
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  actions: {
    async orderCart() {
      const user = useUserStore()

      try {
        await apiOrderCart(user.token, this.items)
        // 다른 액션
        this.emptyCart()
      } catch (err) {
        displayError(err)
      }
    },
  },
})
```
