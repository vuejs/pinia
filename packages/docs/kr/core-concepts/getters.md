# Getters

<VueSchoolLink
  href="https://vueschool.io/lessons/getters-in-pinia"
  title="Learn all about getters in Pinia"
/>

Getter는 Store 상태에 대한 [computed 값](https://v3.vuejs.org/guide/reactivity-computed-watchers.html#computed-values)과 정확히 동일합니다. `defineStore()`의 `getters` 속성으로 정의할 수 있습니다. 화살표 함수의 사용을 **장려하기 위해** 첫 번째 매개변수로 `state`를 받습니다:

```js
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
})
```

대부분의 경우 getter는 상태에만 의존하지만 다른 getter를 사용해야 할 수도 있습니다. 이 때문에 일반 함수를 정의할 때 `this`를 통해 _전체 저장소 인스턴스_에 액세스할 수 있지만 **반환 유형(TypeScript 에서)의 유형을 정의해야 합니다**. 이것은 TypeScript의 알려진 제한으로 인한 것이며 **화살표 함수로 정의된 getter나 `this`를 사용하지 않는 getter에 영향을 미치지 않습니다**:

```ts
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    // automatically infers the return type as a number
    doubleCount(state) {
      return state.counter * 2
    },
    // the return type **must** be explicitly set
    doublePlusOne(): number {
      // autocompletion and typings for the whole store ✨
      return this.doubleCount + 1
    },
  },
})
```

그런 다음 저장소 인스턴스에서 직접 getter에 액세스할 수 있습니다:

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

## 다른 getters에 엑서스

computed 속성과 마찬가지로 여러 getter를 결합할 수 있습니다. `this`를 통해 다른 getter에 액세스합니다. TypeScript를 사용하지 않더라도 [JSDoc](https://jsdoc.app/tags-returns.html)를 사용하여 type에 대한 IDE에 힌트를 줄 수 있습니다:

```js
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    // type is automatically inferred because we are not using `this`
    doubleCount: (state) => state.counter * 2,
    // here we need to add the type ourselves (using JSDoc in JS). We can also
    // use this to document the getter
    /**
     * Returns the counter value times two plus one.
     *
     * @returns {number}
     */
    doubleCountPlusOne() {
      // autocompletion ✨
      return this.doubleCount + 1
    },
  },
})
```

## getters에 인수 전달

*Getters*는 뒤에서는 _computed_ 속성일 뿐이므로 매개변수를 전달할 수 없습니다. 그러나 *getter*에서 함수를 반환하여 모든 인수를 받아들일 수 있습니다:

```js
export const useStore = defineStore('main', {
  getters: {
    getUserById: (state) => {
      return (userId) => state.users.find((user) => user.id === userId)
    },
  },
})
```

그리고 컴포넌트에서 사용하세요:

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
  <p>User 2: {{ getUserById(2) }}</p>
</template>
```

이 작업을 수행할 때 **getters는 더 이상 캐시되지 않습니다**, 단순히 호술하는 함수입니다. 그러나 getter 자체 내부에 일부 결과를 캐시할 수 있습니다. 이는 드물지만 더 성능이 좋을 것입니다:

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

## 다른 저장소의 getters에 엑서스

다른 저장소의 getters를 사용하려면 _getter_ 내부에서 직접 *사용*할 수 있습니다:

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

## `setup()`과 함께 사용하기

저장소의 속성으로 모든 getter에 직접 액세스할 수 있습니다(상태 속성과 정확히 동일함):

```js
export default {
  setup() {
    const store = useStore()

    store.counter = 3
    store.doubleCount // 6
  },
}
```

## Options API와 함께 사용하기

<VueSchoolLink
  href="https://vueschool.io/lessons/access-pinia-getters-in-the-options-api"
  title="Access Pinia Getters via the Options API"
/>

다음 예제에서는 다음과 같은 저장소가 생성되었다고 가정하겠습니다:

```js
// Example File Path:
// ./src/stores/counterStore.js

import { defineStore } from 'pinia',

const useCounterStore = defineStore('counterStore', {
  state: () => ({
    counter: 0
  }),
  getters: {
    doubleCounter(state) {
      return state.counter * 2
    }
  }
})
```

### `setup()`과 함께

Composition API가 모두를 위한 것은 아니지만 `setup()` 후크를 사용하면 Options API에서 Pinia를 더 쉽게 사용할 수 있습니다. 추가적인 map helper 함수들도 필요하지 않습니다!

```js
import { useCounterStore } from '../stores/counterStore'

export default {
  setup() {
    const counterStore = useCounterStore()

    return { counterStore }
  },
  computed: {
    quadrupleCounter() {
      return this.counterStore.doubleCounter * 2
    },
  },
}
```

### `setup()` 없이

[상태의 이전 섹션](./state.md#options-api)에서 사용한 것과 동일한 `mapState()` 함수를 사용하여 getter에 매핑할 수 있습니다:

```js
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  computed: {
    // gives access to this.doubleCounter inside the component
    // same as reading from store.doubleCounter
    ...mapState(useCounterStore, ['doubleCount'])
    // same as above but registers it as this.myOwnName
    ...mapState(useCounterStore, {
      myOwnName: 'doubleCounter',
      // you can also write a function that gets access to the store
      double: store => store.doubleCount,
    }),
  },
}
```
