# 상태

<VueSchoolLink
  href="https://vueschool.io/lessons/access-state-from-a-pinia-store"
  title="Learn all about state in Pinia"
/>

상태는 대부분의 경우 저장소의 중심이 되는 부분입니다. 사람들은 자주 앱을 나타내는 상태를 정의하는 것으로 시작합니다. Pinia에서 상태는 초기 상태를 반환하는 함수로 정의됩니다. 이를 통해 Pinia는 서버 측과 클라이언트 측 모두에서 작동할 수 있습니다.

```js
import { defineStore } from 'pinia'

const useStore = defineStore('storeId', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      counter: 0,
      name: 'Eduardo',
      isAdmin: true,
    }
  },
})
```

:::tip
Vue 2를 사용하는 경우, `state`에서 생성한 데이터는 Vue 인스턴스의 `data`와 동일한 규칙을 따릅니다. 즉, 상태 객체는 일반 객체여야 하며 새 속성을 추가할 때 Vue.set()을 호출해야 합니다. **참조: [Vue#data](https://v2.vuejs.org/v2/api/#data)**
:::

## `state` 액서스

기본적으로 `store` 인스턴스를 통해 상태에 액세스하여 상태를 직접 읽고 쓸 수 있습니다:

```js
const store = useStore()

store.counter++
```

## 상태 재설정

스토어에서 `$reset()` 메서드를 호출하여 상태를 초기 값으로 *재설정*할 수 있습니다.

```js
const store = useStore()

store.$reset()
```

### Options API 와 함께 사용하기

<VueSchoolLink
  href="https://vueschool.io/lessons/access-pinia-state-in-the-options-api"
  title="Access Pinia State via the Options API"
/>

다음 예제에선 다음과 같은 저장소를 만들었다고 가정하겠습니다:

```js
// Example File Path:
// ./src/stores/counterStore.js

import { defineStore } from 'pinia'

const useCounterStore = defineStore('counterStore', {
  state: () => ({
    counter: 0
  })
})
```

Composition API를 사용하지 않고 `computed`, `methods`, ...를 사용하는 경우 `mapState()` 도우미를 사용하여 state 속성들을 읽기 전용 computed 속성으로 매핑할 수 있습니다.

```js
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  computed: {
    // gives access to this.counter inside the component
    // same as reading from store.counter
    ...mapState(useCounterStore, ['counter'])
    // same as above but registers it as this.myOwnName
    ...mapState(useCounterStore, {
      myOwnName: 'counter',
      // you can also write a function that gets access to the store
      double: store => store.counter * 2,
      // it can have access to `this` but it won't be typed correctly...
      magicValue(store) {
        return store.someGetter + this.counter + this.double
      },
    }),
  },
}
```

#### 수정 가능한 상태값

만약 이러한 state 속성에 값을 입력하고 싶다면(예: 입력 폼이 있는 경우), `mapWritableState()`를 대신 사용할 수 있습니다. 참고로 `mapState()`와 같은 함수는 전달할 수 없습니다.

```js
import { mapWritableState } from 'pinia'
import { useCounterStore } from '../stores/counterStore'

export default {
  computed: {
    // gives access to this.counter inside the component and allows setting it
    // this.counter++
    // same as reading from store.counter
    ...mapWritableState(useCounterStore, ['counter'])
    // same as above but registers it as this.myOwnName
    ...mapWritableState(useCounterStore, {
      myOwnName: 'counter',
    }),
  },
}
```

:::tip
다음과 같이 전체 배열을 `cartItems = []`로 바꾸지 않는 상황인 경우에는 `mapWritableState()`가 필요하지 않습니다. `mapState()`를 사용하면 컬렉션에서 메서드를 호출할 수 있습니다.
:::

## 상태값 변경

<!-- TODO: disable this with `strictMode` -->

`store.counter++`로 상점을 직접 변경하는 것 외에도 `$patch` 메소드를 호출할 수도 있습니다. 부분적인 `state` 객체를 사용하여 동시에 여러 변경 사항을 적용할 수 있습니다:

```js
store.$patch({
  counter: store.counter + 1,
  name: 'Abalam',
})
```

그러나 일부 변형은 이 구문으로 적용하기가 정말 어렵거나 비용이 많이 듭니다. 컬렉션을 수정(예: 배열에서 요소 밀기, 제거, 접합)하려면 새 컬렉션을 만들어야 합니다. 이 때문에 `$patch` 메서드는 patch 객체로 적용하기 어려운 이러한 종류의 변이를 그룹화하는 기능도 허용합니다:

```js
cartStore.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```

<!-- TODO: disable this with `strictMode`, `{ noDirectPatch: true }` -->

여기서 주요 차이점은 `$patch()`를 사용하여 여러 변경 사항을 devtools의 단일 항목으로 그룹화할 수 있다는 것입니다. **둘 다 `state`와 `$patch()`에 대한 직접적인 변경 사항은 devtools**에 표시되며 시간 여행 디버깅이 가능합니다(아직 Vue 3에는 없음).

## `state` 바꾸기

`$state` 속성을 새 객체로 설정하여 저장소의 전체 상태를 바꿀 수 있습니다:

```js
store.$state = { counter: 666, name: 'Paimon' }
```

`pinia` 인스턴스의 `state`를 변경하여 애플리케이션의 전체 상태를 바꿀 수도 있습니다. [SSR 직렬화](../ssr/#state-hydration) 시 사용합니다.

```js
pinia.state.value = {}
```

## state 구독하기

Vuex의 [subscribe 메소드](https://vuex.vuejs.org/api/#subscribe)와 마찬가지로 스토어의 `$subscribe()` 메소드를 통해 상태와 변경 사항을 볼 수 있습니다. 일반 `watch()`보다 `$subscribe()`를 사용하는 이점은 *subscriptions*가 *patches* 이후에 한 번만 트리거된다는 것입니다(예: 위의 함수 버전을 사용할 때).

```js
cartStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type // 'direct' | 'patch object' | 'patch function'
  // same as cartStore.$id
  mutation.storeId // 'cart'
  // only available with mutation.type === 'patch object'
  mutation.payload // patch object passed to cartStore.$patch()

  // persist the whole state to the local storage whenever it changes
  localStorage.setItem('cart', JSON.stringify(state))
})
```

기본적으로, *state subscriptions*은 추가된 구성 요소에 바인딩됩니다 (스토어가 구성 요소의 `setup()` 내부에 있는 경우). 즉, 컴포넌트가 unmounted되면 자동으로 제거됩니다. 컴포넌트가 unmounted된 이후에도 유지하려면 현재 컴포넌트의 *state subscription*의 *detach*에 대한 두 번째 인수로 `{ detached: true }`를 전달하세요:

```js
export default {
  setup() {
    const someStore = useSomeStore()

    // this subscription will be kept after the component is unmounted
    someStore.$subscribe(callback, { detached: true })

    // ...
  },
}
```

:::tip
`pinia` 인스턴스의 모든 state 값을 볼 수 있습니다.

```js
watch(
  pinia.state,
  (state) => {
    // persist the whole state to the local storage whenever it changes
    localStorage.setItem('piniaState', JSON.stringify(state))
  },
  { deep: true }
)
```

:::
