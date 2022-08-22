---
title: 상태
---

# State (상태) %{#state}%

상태는 대부분은, 스토어를 중심으로 이루어지며, 일반적으로 앱을 나타내는 상태를 정의하는 것으로 시작합니다.
피니아에서 상태는 초기 상태를 반환하는 함수로 정의됩니다.
이를 통해 피니아는 서버 측과 클라이언트 측 모두에서 작동할 수 있습니다.

```js
import { defineStore } from 'pinia'

export const useStore = defineStore('storeId', {
  // 화살표 함수는 전체 유형 유추을 위해 권장됨. 
  state: () => {
    return {
      // 이 모든 속성은 자동으로 유형이 유추됨.
      count: 0,
      name: 'Eduardo',
      isAdmin: true,
    }
  },
})
```

:::tip
Vue 2를 사용하는 경우,
`state`에서 생성한 데이터는 Vue 인스턴스의 `data`와 동일한 규칙을 따릅니다.
즉, 상태 객체는 일반 객체여야 하며,
새 속성을 추가할 때 `Vue.set()`을 호출해야 합니다.

참조: [Vue#data](https://v2.vuejs.org/v2/api/#data).
:::

## TypeScript

TS와 호환되는 상태를 만들기 위해 많은 작업을 수행할 필요가 없습니다:
[`strict`](https://www.typescriptlang.org/tsconfig#strict) 또는 최소한 [`noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis)가 활성화되어 있는지 확인하고 피니아가 자동으로 상태 유형을 추론합니다!
그러나 몇몇 경우에는 캐스팅으로 보조해야 합니다:

```ts
export const useUserStore = defineStore('user', {
  state: () => {
    return {
      // 처음에 비어 있는 목록의 경우.
      userList: [] as UserInfo[],
      // 아직 로드되지 않은 데이터의 경우.
      user: null as UserInfo | null,
    }
  },
})

interface UserInfo {
  name: string
  age: number
}
```

원하는 경우,
인터페이스로 상태를 정의하고,
`state()`로 반환 값 유형을 정의할 수 있습니다:

```ts
interface State {
  userList: UserInfo[]
  user: UserInfo | null
}

export const useUserStore = defineStore('user', {
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

## `state`에 접근 %{#accessing-the-state}%

기본적으로 `store` 인스턴스로 상태에 접근하여 상태를 직접 읽고 쓸 수 있습니다:

```js
const store = useStore()

store.count++
```

## 상태 재설정 %{#resetting-the-state}%

스토어에서 `$reset()` 메서드를 호출하여 상태를 초기 값으로 재설정할 수 있습니다:

```js
const store = useStore()

store.$reset()
```

### 옵션 API와 함께 사용 %{#usage-with-the-options-api}%

다음 예제는 아래와 같은 스토어가 생성되었다고 가정합니다:

```js
// 예제 파일 경로:
// ./src/stores/counter.js

import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
})
```

컴포지션 API를 사용하지 않고 `computed`, `methods`, ...를 사용하는 경우,
`mapState()` 헬퍼를 사용하여 상태 속성을 읽기 전용 계산된 속성으로 매핑할 수 있습니다:

```js
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  computed: {
    // 컴포넌트 내부에서 `this.count`로 접근할 수 있게 함.
    // `store.count`로 읽는 것과 동일.
    ...mapState(useCounterStore, ['counter']),
    // 위와 같지만 `this.myOwnName`으로 등록.
    ...mapState(useCounterStore, {
      myOwnName: 'count',
      // 스토어에 접근하는 함수를 작성할 수도 있음
      double: store => store.count * 2,
      // `this`에 접근할 수 있지만, 올바르게 입력되지 않음...
      magicValue(store) {
        return store.someGetter + this.count + this.double
      },
    }),
  },
}
```

#### 수정 가능한 상태 %{#modifiable-state}%

이러한 상태 속성을 쓸 수 있도록 하려면(예: form이 있는 경우),
`mapWritableState()`를 사용해야 합니다.
`mapState()`처럼 함수를 전달할 수 없습니다:

```js
import { mapWritableState } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  computed: {
    // 컴포넌트 내부에서 `this.count`로 접근할 수 있게 하고,
    // `this.count++`와 같이 수정도 허용함.
    // `store.count`에서 읽는 것과 동일.
    ...mapWritableState(useCounterStore, ['count']),
    // 위와 같지만 `this.myOwnName`으로 등록.
    ...mapWritableState(useCounterStore, {
      myOwnName: 'count',
    }),
  },
}
```

:::tip
배열 전체를 `cartItems = []`처럼 바꾸지 않는 한,
배열 컬렉션은 `mapWritableState()`가 필요하지 않습니다.
`mapState()`를 사용하면 컬렉션에서 메서드를 호출할 수 있습니다.
:::

## 상태 변경하기 %{#mutating-the-state}%

<!-- TODO: disable this with `strictMode` -->

`store.count++`로 스토어를 직접 변경하는 방법 외에도,
`$patch` 메소드를 호출할 수도 있습니다.
이것을 사용하여 `state` 객체의 일부분을 동시에 변경할 수 있습니다:

```js
store.$patch({
  count: store.count + 1,
  age: 120,
  name: 'DIO',
})
```

그러나 일부 `mutations`은 이러한 문법으로 적용하기가 정말 어렵거나 비용이 많이 듭니다.
컬렉션을 수정(예: 배열에서 요소를 푸시, 제거, 스플라이스)하려면,
새 컬렉션을 만들어야 합니다.
이 때문에 `$patch` 메소드는 패치 객체로 적용하기 어려운 이러한 종류의 `mutations`를 그룹화하는 함수도 허용합니다:

```js
cartStore.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```

<!-- TODO: disable this with `strictMode`, `{ noDirectPatch: true }` -->

여기서 주요 차이점은 `$patch()`를 사용하여 devtools에서 여러 변경 사항을 하나의 항목으로 그룹화할 수 있다는 것입니다.
**`state`와 `$patch()`에 대한 직접적인 변경 사항은 모두 devtools에 나타나며**, 시간 추적이 가능합니다(아직 Vue 3에는 없음).

## `state` 교체하기 %{#replacing-the-state}%

반응성을 깨뜨릴 수 있으므로 스토어의 상태를 **정확히 교체할 수 없습니다**.
그러나 패치할 수 있습니다:

```js
// 이것은 실제로 `$state`를 교체하지 않음.
store.$state = { count: 24 }
// 아래와 같이 내부적으로 `$patch()`를 호출함:
store.$patch({ count: 24 })
```

피니아 인스턴스의 `state`를 변경하여,
전체적으로 앱의 초기 상태를 설정할 수도 있습니다.
[하이드레이션을 위한 SSR](/guide/ssr/#state-hydration) 동안 사용합니다.

```js
pinia.state.value = {}
```

## 상태 구독하기 %{#subscribing-to-the-state}%

Vuex의 [subscribe 메소드](https://vuex.vuejs.org/api/#subscribe)와 마찬가지로,
스토어의 `$subscribe()` 메소드를 통해 상태의 변경 사항을 감시할 수 있습니다.
일반 `watch()`보다 `$subscribe()` 사용시 장점은 구독이 여러 패치(예: 위에서 언급한 것처럼, `$patch`에 함수를 전달하고, 함수 내부에서 여러번의 패치가 실행됨) 이후에 한 번만 트리거된다는 것입니다.

```js
cartStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type // 'direct' | 'patch object' | 'patch function'
  // `cartStore.$id`와 동일.
  mutation.storeId // 'cart'
  // `mutation.type === 'patch object'`에서만 사용 가능.
  mutation.payload // cartStore.$patch()에 전달된 패치 객체

  // 변경될 때마다 전체 상태를 로컬 스토리지에 유지
  localStorage.setItem('cart', JSON.stringify(state))
})
```

기본적으로 상태 구독은 컴포넌트에 추가된(스토어가 컴포넌트의 `setup()` 내부에 있는) 경우에 바인딩됩니다.
따라서 컴포넌트가 마운트 해제되면 자동으로 제거됩니다.
컴포넌트가 마운트 해제된 후에도 이를 유지하려면,
두 번째 인수로 현재 컴포넌트에서 상태 구독을 분리하는 `{ detached: true }`를 전달합니다:

```js
export default {
  setup() {
    const someStore = useSomeStore()

    // 이 구독은 컴포넌트가 마운트 해제된 후에도 유지됨.
    someStore.$subscribe(callback, { detached: true })

    // ...
  },
}
```

:::tip
피니아 인스턴스에서 전체 상태를 감시할 수 있습니다:

```js
watch(
  pinia.state,
  (state) => {
    // 변경될 때마다 전체 상태를 로컬 스토리지에 유지
    localStorage.setItem('piniaState', JSON.stringify(state))
  },
  { deep: true }
)
```

:::