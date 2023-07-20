# 스토어 조합하기 %{#composing-stores}%

스토어 조합은 서로를 사용하는 스토어를 가지는 것을 의미하며, 이는 Pinia에서 지원됩니다. 따라야 할 규칙이 하나 있습니다.

**두 개 이상의 스토어가 서로를 사용하는 경우**, 게터(getter)나 액션(action)을 통해 무한 루프를 생성할 수 없습니다. 스토어 설정(setup) 함수에서 **서로의 상태(state)를 직접 읽어올 수 없습니다**.

```js
const useX = defineStore('x', () => {
  const y = useY()

  // ❌ y도 x.name을 읽으려고 해서 불가능합니다
  y.name

  function doSomething() {
    // ✅ 계산된(computed) 값이나 액션에서 y 속성을 읽을 수 있습니다
    const yName = y.name
    // ...
  }

  return {
    name: ref('나는 X입니다'),
  }
})

const useY = defineStore('y', () => {
  const x = useX()

  // ❌ x도 y.name을 읽으려고 해서 불가능합니다
  x.name

  function doSomething() {
    // ✅ 계산된 값이나 액션에서 x 속성을 읽을 수 있습니다
    const xName = x.name
    // ...
  }

  return {
    name: ref('나는 Y입니다'),
  }
})
```

## 중첩 스토어 %{#nested-stores}%

한 스토어가 다른 스토어를 사용하는 경우, 액션(action)과 게터(getter) 내에서 `useStore()` 함수를 직접 호출하고 사용할 수 있습니다. 그런 다음 Vue 컴포넌트 내에서와 마찬가지로 스토어와 상호작용할 수 있습니다. [공유 게터(Shared Getters)](#shared-getters) 및 [공유 액션(Shared Actions)](#shared-actions)을 참조하세요.

스토어 설정(setup)에서는 스토어 함수의 **가장 위에서** 스토어 중 하나를 간단히 사용할 수 있습니다.

```ts
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', () => {
  const user = useUserStore()
  const list = ref([])

  const summary = computed(() => {
    return `${user.name}님, 장바구니에 ${list.value.length}개의 아이템이 있습니다. 가격은 ${price.value}입니다.`
  })

  function purchase() {
    return apiPurchase(user.id, this.list)
  }

  return { summary, purchase }
})
```

## 공유 게터(Shared Getters) %{#shared-getters}%

게터(getter) 내에서 간단히 `useOtherStore()`를 호출할 수 있습니다.

```js
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  getters: {
    summary(state) {
      const user = useUserStore()

      return `${user.name}님, 장바구니에 ${state.list.length}개의 아이템이 있습니다. 가격은 ${state.price}입니다.`
    },
  },
})
```

## 공유 액션(Shared Actions) %{#shared-actions}%

액션(action)에서도 동일한 방식이 적용됩니다.

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

액션은 비동기적일 수 있으므로 **`await` 이전에 `useStore()` 호출이 모두 나타나도록** 주의하십시오. 그렇지 않으면 SSR 앱에서 올바른 pinia 인스턴스를 사용하지 못할 수 있습니다.

```js{7-8,11-13}
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  actions: {
    async orderCart() {
      // ✅ `await` 이전에 액션 맨 위에서 호출합니다
      const user = useUserStore()

      try {
        await apiOrderCart(user.token, this.items)
        // ❌ `await` 문 이후에 호출됩니다
        const otherStore = useOtherStore()
        // 다른 액션
        this.emptyCart()
      } catch (err) {
        displayError(err)
      }
    },
  },
})
```
