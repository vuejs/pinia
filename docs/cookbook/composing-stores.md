---
title: 스토어 구성하기
---

# 스토어 구성하기 %{#composing-stores}%

스토어를 구성한다는 것은 서로를 사용하는 스토어을 갖는 것이며, 이는 피니아에서 지원됩니다.
단, 따라야 할 한 가지 규칙이 있습니다:

**두 개 이상의 스토어가 서로를 사용**하는 경우, 게터 또는 액션을 통해 무한 루프를 생성할 수 없습니다.
**둘 다** 셋업 함수에서 서로의 상태를 직접 읽을 수 없습니다:

```js
const useX = defineStore('x', () => {
  const y = useY()

  // ❌ y도 x.name을 읽으려고 하기 때문에 불가능함.
  y.name

  function doSomething() {
    // ✅ 계산된 속성(computed) 또는 액션에서 y 속성 읽기
    const yName = y.name
    // ...
  }

  return {
    name: ref('나는 X 입니다.'),
  }
})

const useY = defineStore('y', () => {
  const x = useX()

  // ❌ x도 y.name을 읽으려고 하기 때문에 불가능함.
  x.name

  function doSomething() {
    // ✅ 계산된 속성(computed) 또는 액션에서 x 속성 읽기
    const xName = x.name
    // ...
  }

  return {
    name: ref('나는 Y 입니다.'),
  }
})
```

## 중첩된 스토어 %{#nested-stores}%

한 스토어가 다른 스토어를 사용하는 경우,
액션 및 게터 내에서 `useStore()` 함수를 직접 가져오고 호출할 수 있습니다.
그런 다음 Vue 컴포넌트 내에서처럼 스토어와 상호 작용할 수 있습니다.
[공유 게터](#shared-getters)와 [공유 액션](#shared-actions)을 참고하십시오.

스토어 셋업은 단순히 스토어 함수 상단에 있는 스토어를 사용하면 됩니다:

```ts
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', () => {
  const user = useUserStore()
  const list = ref([])

  const summary = computed(() => {
    return `안녕하세요 ${user.name} 님! 장바구니에 ${list.value.length} 만큼의 리스트가 있고, 가격은 ${price.value} 입니다.`
  })

  function purchase() {
    return apiPurchase(user.id, this.list)
  }

  return { summary, purchase }
})
```

## 공유 게터 %{#shared-getters}%

게터 내부에서 간단히 `useOtherStore()`를 호출할 수 있습니다:

```js
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  getters: {
    summary(state) {
      const user = useUserStore()

      return `안녕하세요 ${user.name} 님! 장바구니에 ${state.list.length} 만큼의 리스트가 있고, 가격은 ${state.price} 입니다.`
    },
  },
})
```

## 공유 액션 %{#shared-actions}%

액션에도 동일하게 적용됩니다:

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