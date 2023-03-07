---
title: 플러그인
---

# Plugins (플러그인) %{#plugins}%

피니아 스토어는 저수준 API 덕분에 완전히 확장할 수 있습니다.
다음은 수행할 수 있는 작업 목록입니다:

- 스토어에 새 속성 추가
- 스토어를 정의할 때 새로운 옵션 추가
- 스토어에 새로운 메서드 추가
- 기존 메서드 랩핑
- 인터셉트 작업 및 그 결과
- [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)와 같은 사이드 이팩트 구현
- 특정 **스토어에만** 적용

플러그인은 `pinia.use()`를 사용하여 피니아 인스턴스에 추가합니다.
가장 간단한 예제로는 객체를 반환하여 모든 스토어에 정적 속성을 추가하는 것입니다:

```js
import { createPinia } from 'pinia'

// 이 플러그인이 설치된 후 생성된 모든 저장소에 `secret`이라는 속성을 추가합니다.
// 이것은 다른 파일에 있을 수 있습니다.
function SecretPiniaPlugin() {
  return { secret: '임금님 귀는 당나귀 귀!' }
}

const pinia = createPinia()
// 플러그인을 피니아에 제공
pinia.use(SecretPiniaPlugin)

// 다른 파일에서
const store = useStore()
store.secret // '임금님 귀는 당나귀 귀!'
```

이것은 라우터나 모달 또는 토스트 상태를 관리할 전역 객체를 추가하는 데 유용합니다.

## 소개 %{#introduction}%

피니아 플러그인은 스토어에 추가할 속성을 선택적으로 반환하는 함수입니다.
하나의 선택적 인자인 `context`가 필요합니다:

```js
export function myPiniaPlugin(context) {
  context.pinia // `createPinia()`로 생성된 피니아
  context.app // `createApp()`으로 생성된 현재 앱(Vue 3만 해당)
  context.store // 플러그인이 확장되는 스토어
  context.options // `defineStore()`에 전달된 스토어를 정의하는 옵션 객체
  // ...
}
```

이 함수는 `pinia.use()`를 사용하여 `pinia`에 전달됩니다:

```js
pinia.use(myPiniaPlugin)
```

플러그인은 **플러그인 이후에 만들어진 스토어와 앱**에 `pinia`가 전달된 후에만 적용된다.
그렇지 않으면 적용되지 않습니다.

## 스토어 확장하기 %{#augmenting-a-store}%

플러그인에서 객체를 반환하기만 하면,
모든 스토어에 속성을 추가할 수 있습니다:

```js
pinia.use(() => ({ hello: '멋진 뷰!' }))
```

`store`에서 직접 속성을 설정할 수도 있지만,
**가능한 경우 반환 버전을 사용하여 devtools에서 자동으로 추적할 수 있도록 합니다**:

```js
pinia.use(({ store }) => {
  store.hello = '멋진 뷰!'
})
```

플러그인이 반환하는 모든 속성은 devtools에서 자동으로 추적하므로 devtools에서 `hello`를 볼 수 있습니다.
devtools에서 디버그하려는 경우에만 dev 모드의 `store._customProperties`에 추가해야 합니다:

```js
// 위의 예제에서
pinia.use(({ store }) => {
  store.hello = '멋진 뷰!'
  // 번들러가 이것을 처리하는지 확인 해야함.
  // webpack 및 vite는 기본적으로 처리함.
  if (process.env.NODE_ENV === 'development') {
    // 스토어에서 설정한 키를 추가합니다.
    store._customProperties.add('hello')
  }
})
```

모든 스토어는 [`reactive`](https://vuejs.kr/api/reactivity-core.html#reactive)로 래핑되며,
모든 Ref(`ref()`, `computed()`, . ..)는 자동으로 언래핑됩니다:

```js
const sharedRef = ref('shared')
pinia.use(({ store }) => {
  // 각 스토어에는 개별 `hello` 속성이 있음.
  store.hello = ref('secret')
  // 자동으로 언래핑 됨.
  store.hello // 'secret'

  // 모든 스토어는 `shared` 속성의 값을 공유함.
  store.shared = sharedRef
  store.shared // 'shared'
})
```

따라서 `.value` 없이 모든 계산된 속성에 접근할 수 있으며, 이러한 속성이 반응형인 것입니다.

### 새로운 상태 추가하기 %{#adding-new-state}%

스토어에 새로운 상태 속성을 추가하거나 하이드레이션 중에 사용할 속성을 추가하려면 **두 위치에 추가해야 합니다**:

- `store`: 따라서 `store.myState`로 접근할 수 있음.
- `store.$state`: 따라서 devtools에서 사용할 수 있고, **SSR 동안 직렬화될 수 있음**.

게다가 다른 접근 간에 값을 공유하려면 `ref()`(또는 다른 반응형 API)를 사용해야 합니다:

```js
import { toRef, ref } from 'vue'

pinia.use(({ store }) => {
  // SSR을 올바르게 처리하려면 기존 값을 재정의하지 않는지 확인해야 함.
  if (!Object.prototype.hasOwnProperty(store.$state, 'hasError')) {
    // hasError는 플러그인 내에서 정의되므로,
    // 각 스토어에는 개별 상태 속성이 있음.
    const hasError = ref(false)
    // 변수를 `$state`에 설정하면 SSR 동안 직렬화할 수 있음.
    store.$state.hasError = hasError
  }
  // ref를 state에서 stroe로 옮겨야 하며,
  // 이 방법으로 두 곳에서 모두 접근 가능해짐:
  // "store.hasError"와 "store.$state.hasError"가 작동하고 동일한 변수를 공유.
  // 참고: https://vuejs.kr/api/reactivity-utilities.html#toref
  store.hasError = toRef(store.$state, 'hasError')
  
  // 이 경우 devtools의 `state` 섹션에 표시될 것이기 때문에,
  // `hasError`를 반환하지 않는 것이 좋음.
  // 어쨌든 그것을 반환하면 devtools는 그것을 두 번 표시함.
  
})
```

플러그인 내에서 발생하는 상태 변경 또는 추가(`store.$patch()` 호출 포함)는 스토어가 활성화되기 전에 발생하므로 **구독을 트리거하지 않습니다**.

:::warning
**Vue 2**를 사용하는 경우,
피니아는 Vue와 [동일한 반응형 주의 사항](https://v2.vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats)이 적용됩니다.
`secret` 및 `hasError`와 같은 새 상태 속성을 생성할 때,
(Vue 2.7의 경우)`Vue.set()` 또는 (Vue < 2.7의 경우 `@vue/composition-api`에서)`set()`을 사용해야 합니다:

```js
import { set, toRef } from '@vue/composition-api'
pinia.use(({ store }) => {
  if (!Object.prototype.hasOwnProperty(store.$state, 'secret')) {
    const secretRef = ref('secret')
    // 데이터가 SSR 동안 사용되어야 하는 경우,
    // 이것을 `$state` 속성에 설정하여,
    // 하이드레이션 중에 직렬화되고 선택되도록 해야 함.
    set(store.$state, 'secret', secretRef)
  }
  // `store.$state.secret` / `store.secret`처럼
  // 두 방법 모두로 접근할 수 있도록, 스토어에도 직접 설정해야 함.
  set(store, 'secret', toRef(store.$state, 'secret'))
  store.secret // 'secret'
})
```

:::

#### 플러그인에 추가된 리셋 상태 %{#resetting-state-added-in-plugins}%

기본적으로 `$reset()`은 플러그인에 의해 추가된 상태(state)를 리셋하지 않지만 추가한 상태를 리셋하도록 재정의할 수 있습니다:

```js
import { toRef, ref } from 'vue'

pinia.use(({ store }) => {
  // 이것은 위 예제 코드와 동일합니다.
  if (!Object.prototype.hasOwnProperty(store.$state, 'hasError')) {
    const hasError = ref(false)
    store.$state.hasError = hasError
  }
  store.hasError = toRef(store.$state, 'hasError')

  // 컨텍스트(`this`)를 스토어로 설정했는지 확인하십시오.
  const originalReset = store.$reset.bind(store)

  // $reset 함수 재정의
  return {
    $reset() {
      originalReset()
      store.hasError = false
    }
  }
})
```

## 새로운 외부 속성 추가하기 %{#adding-new-external-properties}%

외부 속성, 다른 라이브러리에서 가져온 클래스 인스턴스 또는 단순히 반응하지 않는 것을 추가할 때,
객체를 피니아에 전달하기 전에 `markRaw()`로 래핑해야 합니다.
다음은 모든 스토어에 라우터를 추가하는 예제입니다:

```js
import { markRaw } from 'vue'
import { router } from './router'

pinia.use(({ store }) => {
  store.router = markRaw(router)
})
```

## 플러그인 내에서 `$subscribe` 호출하기 %{#calling-subscribe-inside-plugins}%

플러그인 내에서도 [store.$subscribe](state.md#subscribe-to-the-state) 및 [store.$onAction](actions.md#subscribe-to-actions)을 사용할 수 있습니다:

```ts
pinia.use(({ store }) => {
  store.$subscribe(() => {
    // 스토어 변경 사항에 반응
  })
  store.$onAction(() => {
    // 스토어 액션에 반응
  })
})
```

## 새로운 옵션 추가하기 %{#adding-new-options}%

나중에 플러그인에서 소비하기 위해,
스토어를 정의할 때 새로운 옵션을 생성하는 것이 가능합니다.
예를 들어 모든 작업을 디바운스할 수 있는 `debounce` 옵션을 만들 수 있습니다:

```js
defineStore('search', {
  actions: {
    searchContacts() {
      // ...
    },
  },

  // 이것은 나중에 플러그인에서 읽을 것임.
  debounce: {
    // searchContacts 액션을 300ms로 디바운스함.
    searchContacts: 300,
  },
})
```

그런 다음 플러그인은 해당 옵션을 읽고 액션을 래핑하고 원래 옵션을 교체할 수 있습니다:

```js
// 아무 디바운스 라이브러리 사용
import debounce from 'lodash/debounce'

pinia.use(({ options, store }) => {
  if (options.debounce) {
    // 새로운 것으로 액션을 재정의 함.
    return Object.keys(options.debounce).reduce((debouncedActions, action) => {
      debouncedActions[action] = debounce(
        store[action],
        options.debounce[action]
      )
      return debouncedActions
    }, {})
  }
})
```

셋업 문법을 사용하는 경우, 커스텀 옵션이 세 번째 인자로 전달됩니다:

```js
defineStore(
  'search',
  () => {
    // ...
  },
  {
    // 이것은 나중에 플러그인에서 읽을 것임.
    debounce: {
      // searchContacts 액션을 300ms로 디바운스함.
      searchContacts: 300,
    },
  }
)
```

## TypeScript

위에 표시된 모든 것은 타이핑(유형 감지)이 지원되므로,
`any` 또는 `@ts-ignore`를 사용할 필요가 없습니다.

### Typing plugins %{#typing-plugins}%

피니아 플러그인은 다음과 같이 typed 할 수 있습니다:

```ts
import { PiniaPluginContext } from 'pinia'

export function myPiniaPlugin(context: PiniaPluginContext) {
  // ...
}
```

### Typing new store properties %{#typing-new-store-properties}%

스토어에 새 속성을 추가할 때, `PiniaCustomProperties` 인터페이스도 확장해야 합니다.

```ts
import ...

declare module 'pinia' {
  export interface PiniaCustomProperties {
    // setter를 사용하여 문자열과 참조를 모두 허용할 수 있음.
    set hello(value: string | Ref<string>)
    get hello(): string

    // 더 간단한 값도 정의할 수 있음.
    simpleNumber: number

    // 위의 플러그인에서 추가한 라우터를 입력합니다(#adding-new-external-properties).
    router: Router
  }
}
```

그런 다음 안전하게 쓰고 읽을 수 있습니다:

```ts
pinia.use(({ store }) => {
  store.hello = '안녕하세요'
  store.hello = ref('하이')

  store.simpleNumber = Math.random()
  // @ts-expect-error: 올바른 타입이 아님.
  store.simpleNumber = ref(Math.random())
})
```

`PiniaCustomProperties`는 스토어의 속성을 참조할 수 있는 일반 유형입니다.
다음 예제는 초기 옵션을 `$options`로 복사한다고 가정합니다(옵션 스토어에서만 작동함):

```ts
pinia.use(({ options }) => ({ $options: options }))
```

`PiniaCustomProperties`의 4가지 일반 유형을 사용하여 올바르게 입력할 수 있습니다:

```ts
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomProperties<Id, S, G, A> {
    $options: {
      id: Id
      state?: () => S
      getters?: G
      actions?: A
    }
  }
}
```

:::tip
제네릭에서 유형을 확장할 때는 **소스 코드에서와 똑같이** 이름을 지정해야 합니다.
`Id`는 `id` 또는 `I`로 이름을 지정할 수 없으며,
`S`는 `State`로 이름을 지정할 수 없습니다.
모든 문자가 의미하는 것은 다음과 같습니다.

- S: State
- G: Getters
- A: Actions
- SS: Setup Store / Store

:::

### Typing new state %{#typing-new-state}%

새로운 상태 속성을 추가할 때(`store`와 `store.$state` 모두에),
`PiniaCustomStateProperties`에 유형을 추가해야 합니다.
`PiniaCustomProperties`와 달리 `State` 제네릭만 수신합니다:

```ts
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomStateProperties<S> {
    hello: string
  }
}
```

### Typing new creation options %{#typing-new-creation-options}%

`defineStore()`에 대한 새 옵션을 만들 때, `DefineStoreOptionsBase`를 확장해야 합니다.
`PiniaCustomProperties`와 달리 두 개의 제네릭만 노출합니다:
State 및 Store 유형으로 정의할 수 있는 것을 제한할 수 있습니다.
예를 들어 액션의 이름을 사용할 수 있습니다:

```ts
import 'pinia'

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    // 모든 액션의 ms 값을 정의할 수 있음.
    debounce?: Partial<Record<keyof StoreActions<Store>, number>>
  }
}
```

:::tip
Store 유형에서 게터를 추출하는 `StoreGetters` 유형도 있습니다.
또한 `DefineStoreOptions` 및 `DefineSetupStoreOptions` 유형을 각각 확장하여 [셋업 스토어](/core-concepts/#setup-stores) 또는 [옵션 스토어](/core-concepts/#option-stores)의 옵션을 확장할 수도 있습니다.
:::

## Nuxt.js

[Nuxt와 함께 피니아를 사용](/ssr/nuxt.md)하는 경우,
먼저 [Nuxt 플러그인](https://nuxtjs.org/docs/2.x/directory-structure/plugins)을 만들어야 합니다.
이렇게 하면 `pinia` 인스턴스에 접근할 수 있습니다:

```ts
// plugins/myPiniaPlugin.ts
import { PiniaPluginContext } from 'pinia'

function MyPiniaPlugin({ store }: PiniaPluginContext) {
  store.$subscribe((mutation) => {
    // 스토어 변경에 반응.
    console.log(`[🍍 ${mutation.storeId}]: ${mutation.type}.`)
  })

  // TS를 사용하는 경우 typed 해야 함.
  return { creationTime: new Date() }
}

export default defineNuxtPlugin(({ $pinia }) => {
  $pinia.use(MyPiniaPlugin)
})
```

위의 예는 TypeScript를 사용하고 있으므로,
`.js` 파일을 사용하는 경우,
`PiniaPluginContext`와 `Plugin`를 유형 주석으로 사용하는 부분과 `import` 부분을 제거해야 합니다.

### Nuxt.js 2

Nuxt.js 2를 사용하는 경우 유형이 약간 다릅니다.

```ts
// plugins/myPiniaPlugin.ts
import { PiniaPluginContext } from 'pinia'
import { Plugin } from '@nuxt/types'

function MyPiniaPlugin({ store }: PiniaPluginContext) {
  store.$subscribe((mutation) => {
    // 스토어 변경에 반응.
    console.log(`[🍍 ${mutation.storeId}]: ${mutation.type}.`)
  })

  // TS를 사용하는 경우 typed 해야 함.
  return { creationTime: new Date() }
}

const myPlugin: Plugin = ({ $pinia }) => {
  $pinia.use(MyPiniaPlugin)
}

export default myPlugin
```
