---
title: 액션
---

# Actions (액션) %{#actions}%

액션은 컴포넌트의 [메서드](https://vuejs.kr/guide/essentials/reactivity-fundamentals.html#declaring-methods)와 동일합니다.
이들은 `defineStore()`에서 `actions` 속성으로 정의할 수 있으며,
**처리해야 할 작업의 로직을 정의하는 데 완벽합니다**:

```js
export const useStore = defineStore('main', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++
    },
    randomizeCounter() {
      this.count = Math.round(100 * Math.random())
    },
  },
})
```

[게터](getters.md)와 마찬가지로 액션은 **전체 입력(및 자동 완성 ✨) 지원**과 함께 `this`를 통해 전체 스토어 인스턴스에 접근할 수 있습니다.
**게터와 달리 `actions`은 비동기식일 수 있으며**, 액션 내에서 API 호출이나 다른 액션을 `await`할 수 있습니다!
여기에 [Mande](https://github.com/posva/mande)를 사용한 예제가 있습니다.
`Promise`를 얻기 위해 어떤 라이브러리를 사용하는지는 중요하지 않습니다.
네이티브 `fetch` 함수(브라우저만 해당)를 사용할 수도 있습니다:

```js
import { mande } from 'mande'

const api = mande('/api/users')

export const useUsers = defineStore('users', {
  state: () => ({
    userData: null,
    // ...
  }),

  actions: {
    async registerUser(login, password) {
      try {
        this.userData = await api.post({ login, password })
        showTooltip(`다시 오신 것을 환영합니다, ${this.userData.name}!`)
      } catch (error) {
        showTooltip(error)
        // 폼(form) 컴포넌트가 오류를 표시하도록 함.
        return error
      }
    },
  },
})
```

또한 원하는 인자를 자유롭게 설정하고, 무엇이든 반환할 수 있습니다.
액션을 호출하면 모든 것이 자동으로 추론됩니다!

액션은 메서드처럼 호출됩니다:

```js
export default defineComponent({
  setup() {
    const main = useMainStore()
    // 스토어의 액션을 메서드처럼 호출
    main.randomizeCounter()

    return {}
  },
})
```

## 다른 스토어 액션에 접근 %{#accessing-other-stores-actions}%

액션 내부에서 직접 다른 스토어를 사용할 수 있습니다:

```js
import { useAuthStore } from './auth-store'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    preferences: null,
    // ...
  }),
  actions: {
    async fetchUserPreferences() {
      const auth = useAuthStore()
      if (auth.isAuthenticated) {
        this.preferences = await fetchPreferences()
      } else {
        throw new Error('인증이 필요합니다!')
      }
    },
  },
})
```

## `setup()`에서 사용 %{#usage-with-setup}%

스토어의 모든 액션을 메서드처럼 직접 호출할 수 있습니다:

```js
export default {
  setup() {
    const store = useStore()

    store.randomizeCounter()
  },
}
```

## 옵션 API에서 사용 %{#usage-with-the-options-api}%

다음 예제는 아래와 같이 저장소가 생성되었다고 가정합니다:

```js
// 예제 파일 경로:
// ./src/stores/counter.js

import { defineStore } from 'pinia'

const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++
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
  methods: {
    incrementAndPrint() {
      this.counterStore.increment()
      console.log('숫자세기:', this.counterStore.count)
    },
  },
}
```

### `setup()` 없이 %{#without-setup}%

컴포지션 API를 전혀 사용하지 않으려면,
`mapActions()` 헬퍼를 사용하여 컴포넌트의 메서드에 액션 속성을 매핑할 수 있습니다:

```js
import { mapActions } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  methods: {
    // 컴포넌트 내부에서 `this.increment()`로 접근할 수 있게 함.
    // `store.increment()`처럼 호출하는 것과 동일.
    ...mapActions(useCounterStore, ['increment']),
    // 위와 같지만 `this.myOwnName()`으로 등록.
    ...mapActions(useCounterStore, { myOwnName: 'doubleCount' }),
  },
}
```

## 액션 구독하기 %{#subscribing-to-actions}%

`store.$onAction()`에 콜백을 전달해 액션과 그 결과를 감시할 수 있으며, 액션보다 먼저 실행됩니다.
`after`는 프라미스(promise)를 처리하고, 액션이 해결(resolve)된 후, 함수를 실행할 수 있도록 합니다.
비슷한 방식으로 `onError`를 사용하면, 작업이 실패(throw)되거나 거부(reject)되는 경우, 함수를 실행할 수 있습니다.
이는 [Vue 문서에서 언급하는 팁](https://vuejs.kr/guide/best-practices/production-deployment.html#tracking-runtime-errors)과 유사하게 런타임에 오류를 추적하는 데 유용합니다.

다음은 액션을 실행하기 전과 해결/거부 이후를 콘솔에 기록하는 예제입니다.

```js
const unsubscribe = someStore.$onAction(
  ({
    name, // 액션의 이름.
    store, // 스토어 인스턴스, `someStore`와 같음.
    args, // 액션으로 전달된 인자로 이루어진 배열.
    after, // 액션에서 반환 또는 해결 이후의 훅.
    onError, // 액션에서 실패 또는 거부될 경우의 훅.
  }) => {
    // 이 특정 액션 호출에 대한 공유 변수.
    // 역자설명: 이 액션의 훅에서 참조하게 되는 클로저 변수 개념.
    const startTime = Date.now()
    
    // 이곳은 `store`의 액션이 실행되기 전에 트리거됨.
    console.log(`"${name}"가 [${args.join(', ')}] 인자를 전달받아 시작됩니다.`)

    // 액션이 성공하고 완전히 실행된 후에 트리거됨.
    // 프라미스 반환을 대기.
    after((result) => {
      console.log(
        `"${name}"가 ${
          Date.now() - startTime
        }ms 후 종료됬습니다.\n결과: ${result}.`
      )
    })

    // 액션이 실패하거나 프라미스가 거부되면 트리거 됨.
    onError((error) => {
      console.warn(
        `"${name}"가 ${
          Date.now() - startTime
        }ms 후 실패했습니다.\n애러: ${error}.`
      )
    })
  }
)

// 리스너를 수동으로 제거.
unsubscribe()
```

기본적으로 **액션 구독**은 컴포넌트에 추가된(스토어가 컴포넌트의 `setup()` 내부에 있는) 경우에 바인딩됩니다.
따라서 컴포넌트가 마운트 해제되면 자동으로 제거됩니다.
컴포넌트가 마운트 해제된 후에도 이를 유지하려면,
두 번째 인수로 현재 컴포넌트에서 액션 구독을 분리하는 `true`를 전달합니다:

```js
export default {
  setup() {
    const someStore = useSomeStore()

    // 이 구독은 컴포넌트가 마운트 해제된 후에도 유지됨.
    someStore.$onAction(callback, true)

    // ...
  },
}
```