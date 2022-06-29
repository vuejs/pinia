# 액션

<VueSchoolLink
  href="https://vueschool.io/lessons/synchronous-and-asynchronous-actions-in-pinia"
  title="Learn all about actions in Pinia"
/>

작업은 구성 요소의 [메서드](https://v3.vuejs.org/guide/data-methods.html#methods)와 동일합니다. 이들은 `defineStore()`의 `actions` 속성으로 정의할 수 있으며 **비즈니스 로직을 정의하는 데 완벽합니다**:

```js
export const useStore = defineStore('main', {
  state: () => ({
    counter: 0,
  }),
  actions: {
    increment() {
      this.counter++
    },
    randomizeCounter() {
      this.counter = Math.round(100 * Math.random())
    },
  },
})
```

[getters](./getters.md)와 마찬가지로 작업은 **전체 입력(및 자동 완성 ✨) 지원**과 함께 `this`를 통해 _전체 저장소 인스턴스_에 액세스할 수 있습니다. **getters와 달리 `actions`는 비동기식일 수 있습니다.** 액션 내에서 API 호출이나 다른 작업을 `await` 할 수 있습니다! 여기 [Mande](https://github.com/posva/mande)를 사용한 예시가 있습니다. 참고로 사용하는 라이브러리는 `Promise`를 얻는 한 중요하지 않습니다. 기본 `fetch` 기능을 사용할 수도 있습니다(브라우저만 해당):

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
        showTooltip(`Welcome back ${this.userData.name}!`)
      } catch (error) {
        showTooltip(error)
        // let the form component display the error
        return error
      }
    },
  },
})
```

또한 원하는 인수를 자유롭게 설정하고 무엇이든 반환할 수 있습니다. 작업을 호출하면 모든 것이 자동으로 추론됩니다!

작업은 메서드처럼 호출됩니다:

```js
export default defineComponent({
  setup() {
    const main = useMainStore()
    // call the action as a method of the store
    main.randomizeCounter()

    return {}
  },
})
```

## 다른 저장소의 액션에 엑서스

다른 저장소를 사용하려면 _action_ 내부에서 직접 *사용*할 수 있습니다.

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
        throw new Error('User must be authenticated')
      }
    },
  },
})
```

## `setup()`과 함께 사용

저장소의 메소드로 모든 작업을 직접 호출할 수 있습니다:

```js
export default {
  setup() {
    const store = useStore()

    store.randomizeCounter()
  },
}
```

## Options API와 함께 사용

<VueSchoolLink
  href="https://vueschool.io/lessons/access-pinia-actions-in-the-options-api"
  title="Access Pinia Getters via the Options API"
/>

다음으로 나올 예제에서는 다음과 같은 저장소가 생성되었다고 가정하겠습니다:

```js
// Example File Path:
// ./src/stores/counterStore.js

import { defineStore } from 'pinia',

const useCounterStore = defineStore('counterStore', {
  state: () => ({
    counter: 0
  }),
  actions: {
    increment() {
      this.counter++
    }
  }
})
```

### `setup()`와 함께

Composition API가 모두를 위한 것은 아니지만 `setup()` 후크를 사용하면 Options API에서 Pinia를 더 쉽게 사용할 수 있습니다. 추가적인 map helper 함수들도 필요하지 않습니다!

```js
import { useCounterStore } from '../stores/counterStore'

export default {
  setup() {
    const counterStore = useCounterStore()

    return { counterStore }
  },
  methods: {
    incrementAndPrint() {
      this.counterStore.increment()
      console.log('New Count:', this.counterStore.count)
    },
  },
}
```

### `setup()` 없이

Composition API를 전혀 사용하지 않으려면 `mapActions()` 도우미를 사용하여 컴포넌트의 메서드로 액션 속성을 매핑할 수 있습니다:

```js
import { mapActions } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  methods: {
    // gives access to this.increment() inside the component
    // same as calling from store.increment()
    ...mapActions(useCounterStore, ['increment'])
    // same as above but registers it as this.myOwnName()
    ...mapActions(useCounterStore, { myOwnName: 'doubleCounter' }),
  },
}
```

## 액션 구독

`store.$onAction()`으로 액션과 그 결과를 관찰할 수 있습니다. 전달된 콜백은 액션 자체보다 먼저 실행됩니다. `after`는 Promise을 처리하고 액션이 resolve된 후 함수를 실행할 수 있도록 합니다. 비슷한 방식으로 `onError`를 사용하면 액션이 throw 되거나 reject 되는 경우 함수를 실행할 수 있습니다. 이는 [Vue 문서의 이 팁](https://v3.vuejs.org/guide/tooling/deployment.html#tracking-runtime-errors)과 유사하게 런타임에 오류를 추적하는 데 유용합니다.

여기 액션을 실행하기 전과 resolve/reject 한 후 로그를 띄우는 예제입니다.

```js
const unsubscribe = someStore.$onAction(
  ({
    name, // name of the action
    store, // store instance, same as `someStore`
    args, // array of parameters passed to the action
    after, // hook after the action returns or resolves
    onError, // hook if the action throws or rejects
  }) => {
    // a shared variable for this specific action call
    const startTime = Date.now()
    // this will trigger before an action on `store` is executed
    console.log(`Start "${name}" with params [${args.join(', ')}].`)

    // this will trigger if the action succeeds and after it has fully run.
    // it waits for any returned promised
    after((result) => {
      console.log(
        `Finished "${name}" after ${
          Date.now() - startTime
        }ms.\nResult: ${result}.`
      )
    })

    // this will trigger if the action throws or returns a promise that rejects
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })
  }
)

// manually remove the listener
unsubscribe()
```

기본적으로 *action subscriptions*는 추가된 컴포넌트에 바인딩됩니다(스토어가 구성 요소의 `setup()` 내부에 있는 경우). 즉, 컴포넌트가 unmounted되면 자동으로 제거됩니다. 컴포넌트가 unmounted된 이후에도 유지하려면 현재 컴포넌트의 *action subscription*의 *detach*에 두 번째 인수로 `true`를 전달하세요.

```js
export default {
  setup() {
    const someStore = useSomeStore()

    // this subscription will be kept after the component is unmounted
    someStore.$onAction(callback, true)

    // ...
  },
}
```
