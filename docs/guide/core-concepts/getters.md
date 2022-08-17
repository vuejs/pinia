---
title: 게터
---

# Getters (게터) %{#getters}%

게터는 스토어의 상태에 대한 [계산된 값](https://vuejs.kr/guide/essentials/computed.html)과 정확히 동일합니다.
`defineStore()` 내에서 `getters` 속성으로 정의할 수 있습니다.
화살표 함수의 사용을 **권장하기 위해**, 첫 번째 인자로 `state`를 받습니다:

```js
export const useStore = defineStore('main', {
  state: () => ({
    count: 0,
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
})
```

대부분의 경우, 게터는 오직 상태에만 의존하지만, 다른 게터를 사용해야 할 수도 있습니다.
이 때문에 일반 함수를 정의할 때,
`this`를 통해 전체 스토어 인스턴스에 접근할 수 있지만,
**반환 유형을 정의해야 합니다(TypeScript에서)**.
이것은 TypeScript의 알려진 제한 사항 때문이며,
**화살표 함수로 정의된 게터나 `this`를 사용하지 않는 게터에 영향을 미치지 않습니다**:

```ts
export const useStore = defineStore('main', {
  state: () => ({
    count: 0,
  }),
  getters: {
    // 자동으로 반환 유형을 숫자로 유추함.
    doubleCount(state) {
      return state.count * 2
    },
    // 반환 유형은 **반드시** 명시적으로 설정되어야 함.
    doublePlusOne(): number {
      // 전체 스토어에 대한 자동 완성 및 타이핑 ✨
      return this.doubleCount + 1
    },
  },
})
```

그런 다음 스토어 인스턴스에서 직접 게터에 접근할 수 있습니다:

```vue
<template>
  <p>Double count is {{ store.doubleCount }}</p>
</template>

<script>
export default {
  setup() {
    const store = useStore()

    return { store }
  },
}
</script>
```

## 다른 getter에 접근 %{#accessing-other-getters}%

계산된 속성처럼 여러 게터를 결합할 수 있습니다.
`this`를 통해 다른 게터에 접근합니다.
TypeScript를 사용하지 않는 경우에도 [JSDoc](https://jsdoc.app/tags-returns.html)를 사용하여 유형에 대해 IDE에 힌트를 줄 수 있습니다:

```js
export const useStore = defineStore('main', {
  state: () => ({
    count: 0,
  }),
  getters: {
    // `this`를 사용하지 않기 때문에 유형이 자동으로 유추됨.
    doubleCount: (state) => state.count * 2,
    // 여기에 유형을 직접 추가해야 함(JS에서 JSDoc 사용).
    // 이것을 사용하여 게터를 문서화할 수도 있음.
    /**
     * count에 2를 곱한 값에 1을 더해 반환.
     *
     * @returns {number}
     */
    doubleCountPlusOne() {
      // 자동완성 ✨
      return this.doubleCount + 1
    },
  },
})
```

## getter에 인자 전달 %{#passing-arguments-to-getters}%

게터는 내부적으로 계산된 속성일 뿐이라 파라미터를 전달할 수 없습니다.
그러나 게터에서 함수를 반환하여 모든 인자를 받을 수 있습니다:

```js
export const useStore = defineStore('main', {
  getters: {
    getUserById: (state) => {
      return (userId) => state.users.find((user) => user.id === userId)
    },
  },
})
```

그리고 컴포넌트에서 사용:

```vue
<script>
export default {
  setup() {
    const store = useStore()

    return { getUserById: store.getUserById }
  },
}
</script>

<template>
  <p>유저 2: {{ getUserById(2) }}</p>
</template>
```

이 작업을 수행할 때 **게터는 더 이상 캐시되지 않고**, 단순히 호출하는 함수입니다.
그러나 게터 자체 내부에 일부 결과를 캐시할 수 있습니다.
이는 흔하지 않지만 성능이 더 우수합니다:

```js
export const useStore = defineStore('main', {
  getters: {
    getActiveUserById(state) {
      const activeUsers = state.users.filter((user) => user.active)
      return (userId) => activeUsers.find((user) => user.id === userId)
    },
  },
})
```

## 다른 스토어 getter에 접근 %{#accessing-other-stores-getters}%

다른 스토어 게터를 사용하려면, 게터 내부에서 직접 사용할 수 있습니다:

```js
import { useOtherStore } from './other-store'

export const useStore = defineStore('main', {
  state: () => ({
    // ...
  }),
  getters: {
    otherGetter(state) {
      const otherStore = useOtherStore()
      return state.localData + otherStore.data
    },
  },
})
```

## `setup()`에서 사용 %{#usage-with-setup}%

스토어의 모든 게터를 상태 속성처럼 직접 접근할 수 있습니다.

```js
export default {
  setup() {
    const store = useStore()

    store.count = 3
    store.doubleCount // 6
  },
}
```

## 옵션 API에서 사용 %{#usage-with-the-options-api}%


다음 예제는 저장소가 생성되었다고 가정합니다:

```js
// 예제 파일 경로:
// ./src/stores/count.js

import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  getters: {
    doubleCount(state) {
      return state.count * 2
    }
  }
})
```

### `setup()`에서 %{#with-setup}%

컴포지션 API가 모든 사람을 위한 것은 아니지만,
`setup()` 훅을 사용하면 옵션 API에서 피니아를 더 쉽게 사용할 수 있습니다.
추가 맵 헬퍼 함수가 필요하지 않습니다!

```js
import { useCounterStore } from '../stores/counter'

export default {
  setup() {
    const counterStore = useCounterStore()

    return { counterStore }
  },
  computed: {
    quadrupleCounter() {
      return this.counterStore.doubleCount * 2
    },
  },
}
```

### `setup()` 없이 %{#without-setup}%

[이전 섹션인 상태](state.md#options-api)에서 사용한 것과 동일한 `mapState()` 함수를 사용하여 게터에 매핑할 수 있습니다:

```js
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  computed: {
    // 컴포넌트 내부에서 `this.doubleCount`로 접근할 수 있게 함.
    // `store.doubleCount`로 읽는 것과 동일.
    ...mapState(useCounterStore, ['doubleCount']),
    // 위와 같지만 `this.myOwnName`으로 등록.
    ...mapState(useCounterStore, {
      myOwnName: 'doubleCount',
      // 스토어에 접근하는 함수를 작성할 수도 있음.
      double: (store) => store.doubleCount,
    }),
  },
}
```