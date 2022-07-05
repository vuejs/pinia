# 플러그인

low level API 덕분에 Pinia 저장소를 완전히 확장할 수 있습니다. 다음은 수행할 수 있는 작업 목록입니다:

- 새로운 속성을 저장소에 추가
- 저장소를 정의할때 새로운 옵션들 추가
- 저장소에 새로운 메소드 추가
- 기존 메서드 래핑
- 액션 변경 또는 취소
- [로컬 스토리지](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)와 같은 side effects 구현
- **특정** 저장소에만 적용

플러그인은 `pinia.use()`를 사용하여 pinia 인스턴스에 추가됩니다. 가장 간단한 예는 객체를 반환하여 모든 저장소에 정적 속성을 추가하는 것입니다:

```js
import { createPinia } from 'pinia'

// 이 플러그인이 설치된 후 생성되는 모든 저장소에 `secret`이라는 속성을 추가합니다
// 이것은 다른 파일에 있을 수 있습니다
function SecretPiniaPlugin() {
  return { secret: 'the cake is a lie' }
}

const pinia = createPinia()
// 플러그인을 pinia에서 사용
pinia.use(SecretPiniaPlugin)

// 다른 파일
const store = useStore()
store.secret // 'the cake is a lie'
```

이것은 라우터, 모달 또는 알림 관리자와 같은 전역 개체를 추가하는 데 유용합니다.

## 소개

Pinia 플러그인은 상점에 추가할 속성을 선택적으로 반환하는 기능입니다. 하나의 선택적 인수인 *context*가 필요합니다:

```js
export function myPiniaPlugin(context) {
  context.pinia // `createPinia()`로 생성된 pinia
  context.app // `createApp()`으로 생성된 현재 앱(Vue 3만 해당)
  context.store // 플러그인이 확장되는 저장소
  context.options // `defineStore()`에 전달된 저장소를 정의하는 옵션 객체
  // ...
}
```

이 함수는 `pinia.use()`를 사용하여 `pinia`에 전달됩니다:

```js
pinia.use(myPiniaPlugin)
```

플러그인은 **`pinia`가 앱에 전달된 후 생성된** 스토어에만 적용됩니다. 그렇지 않으면 적용되지 않습니다.

## 저장소 확장

단순히 플러그인에서 객체를 반환하기만 하면 모든 저장소에 속성을 추가 할 수 있습니다:

```js
pinia.use(() => ({ hello: 'world' }))
```

`store`에서 직접 속성을 설정할 수도 있지만 **가능하면 반환 버전을 사용하여 devtools에서 자동으로 추적할 수 있도록 합니다**:

```js
pinia.use(({ store }) => {
  store.hello = 'world'
})
```

플러그인에서 *반환*된 모든 속성은 devtools에서 자동으로 추적합니다. 따라서 devtools에서 `hello`를 표시하려면, devtools에서 디버그하려는 경우에 **dev 모드에서만** `store._customProperties`에 추가해야 합니다.

```js
// 위의 예제에서
pinia.use(({ store }) => {
  store.hello = 'world'
  // 번들러가 이것을 처리하는지 확인하십시오. webpack 및 vite는 기본적으로 수행해야 합니다
  if (process.env.NODE_ENV === 'development') {
    // 저장소에서 설정한 키를 추가하십시오
    store._customProperties.add('hello')
  }
})
```

모든 저장소는 다음을 포함하는 Ref(`ref()`, `computed()`, ...)를 자동으로 언래핑하는 [`reactive`](https://v3.vuejs.org/api/basic-reactivity.html#reactive)로 래핑되어있습니다:

```js
const sharedRef = ref('shared')
pinia.use(({ store }) => {
  // 각 저장소에는 개별 `hello` 속성이 있습니다.
  store.hello = ref('secret')
  // 자동으로 언래핑됩니다
  store.hello // 'secret'

  // 모든 저장소가 'shared' 속성 값을 공유하고 있습니다
  store.shared = sharedRef
  store.shared // 'shared'
})
```

이것이 모든 computed 속성에 `.value` 없이 엑서스 할 수 있는 이유이고 그리고 반응형인 이유입니다.

### 새로운 상태 추가

저장소에 새로운 상태 속성을 추가하거나 직렬화 중에 사용할 속성을 추가하려면 **두 위치에 추가해야 합니다**:

- `store'에서 `store.myState`로 액세스할 수 있습니다.
- `store.$state`에서 devtools에서 사용할 수 있고 **SSR 동안 직렬화됩니다**.

게다가 다른 액세스에서 값을 공유하려면 `ref()`(또는 다른 반응형 API)를 사용해야 합니다:

```js
import { toRef, ref } from 'vue'

pinia.use(({ store }) => {
  // SSR을 올바르게 처리하려면 기존 값을 재정의하지 않는지
  // 확인해야 합니다
  if (!Object.prototype.hasOwnProperty(store.$state, 'hasError')) {
    // hasError는 플러그인 내에서 정의되므로 각 상점에는
    // 개별 상태 속성이 있습니다
    const hasError = ref(false)
    // 변수를 `$state`에 설정하면 SSR 동안 직렬화할 수 있습니다
    store.$state.hasError = hasError
  }
  // state에서 store로 ref를 전송해야 합니다.
  // 이렇게 하면store.hasError와 store.$state.hasError가
  // 모두 작동하고 동일한 변수를 공유할 수 있습니다
  // 참조 https://vuejs.org/api/reactivity-utilities.html#toref
  store.hasError = toRef(store.$state, 'hasError')

  // 이 경우 devtools의 'state' 섹션에 표시될 것이기 때문에
  // `hasError`를 반환하지 않는 것이 좋습니다.
  // 반환하면 devtools는 이를 두 번 표시합니다
})
```

플러그인 내에서 발생하는 상태 변경 또는 추가(`store.$patch()` 호출 포함)는 저장소가 활성화되기 전에 발생하므로 **구독을 트리거하지 않습니다**.

:::warning
**Vue 2**를 사용하는 경우 Pinia는 Vue와 [동일한 반응성 주의 사항](https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats)이 적용됩니다. `secret`이나 `hasError`같은 새로운 상태 속성을 만들때 `@vue/composition-api`의 `set`을 사용해야합니다:

```js
import { set, toRef } from '@vue/composition-api'
pinia.use(({ store }) => {
  if (!Object.prototype.hasOwnProperty(store.$state, 'hello')) {
    const secretRef = ref('secret')
    // 데이터가 SSR 동안 사용되어야 하는 경우
    // `$state` 속성에 설정하여 직렬화 하고
    // 직렬화 중에 선택되도록 해야 합니다
    set(store.$state, 'secret', secretRef)
  }
  // 두 가지 방법으로 액세스할 수 있도록 스토어에서도
  // 직접 설정하십시오: `store.$state.secret` / `store.secret`
  set(store, 'secret', toRef(store.$state, 'secret'))
  store.secret // 'secret'
})
```

:::

## 새로운 외부 속성 추가

외부 속성을 추가할 때, 다른 라이브러리에서 가져온 클래스 인스턴스일때, 또는 단순히 반응하지 않는 것들일때 객체를 pinia에 전달하기 전에 `markRaw()`로 객체를 래핑해야 합니다. 다음은 모든 상점에 라우터를 추가하는 예제입니다:

```js
import { markRaw } from 'vue'
// router가 어디에 있는지에 따라 이것을 조정하세요
import { router } from './router'

pinia.use(({ store }) => {
  store.router = markRaw(router)
})
```

## 플러그인 안에서 `$subscribe` 호출

플러그인 내부에서도 [store.$subscribe](./state.md#subscribing-to-the-state) 및 [store.$onAction](./actions.md#subscribing-to-actions)을 사용할 수 있습니다:

```ts
pinia.use(({ store }) => {
  store.$subscribe(() => {
    // 저장소 변경에 반응
  })
  store.$onAction(() => {
    // 저장소 액션에 반응
  })
})
```

## 새로운 옵션 추가

나중에 플러그인에서 소비하기 위해 스토어를 정의할 때 새로운 옵션을 생성하는 것이 가능합니다. 예를 들어 모든 작업을 디바운스할 수 있는 `debounce` 옵션을 만들 수 있습니다:

```js
defineStore('search', {
  actions: {
    searchContacts() {
      // ...
    },
  },

  // 이것은 나중에 플러그인에서 읽을 것입니다
  debounce: {
    // searchContacts 작업을 300ms로 디바운스
    searchContacts: 300,
  },
})
```

플러그인은 작업을 래핑하고 원래 작업을 대체하기 위해 해당 옵션을 읽을 수 있습니다:

```js
// 모든 디바운스 라이브러리 사용 허용
import debounce from 'lodash/debounce'

pinia.use(({ options, store }) => {
  if (options.debounce) {
    // 우리는 새로운 행동으로 작업을 재정의하고 있습니다
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

설정 구문을 사용할 때 사용자 지정 옵션이 세 번째 인수로 전달됩니다:

```js
defineStore(
  'search',
  () => {
    // ...
  },
  {
    // 이것은 나중에 플러그인에서 읽을 것입니다
    debounce: {
      // searchContacts 작업을 300ms로 디바운스
      searchContacts: 300,
    },
  }
)
```

## TypeScript

위에 표시된 모든 것은 타입 지정이 지원되어 있으므로 `any` 또는 `@ts-ignore`를 사용할 필요가 없습니다.

### 플러그인에 타입 지정

Pinia 플러그인은 다음과 같이 타입을 지정할 수 있습니다:

```ts
import { PiniaPluginContext } from 'pinia'

export function myPiniaPlugin(context: PiniaPluginContext) {
  // ...
}
```

### 새로운 저장소 속성에 타입 지정

저장소에 새 속성을 추가할 때 `PiniaCustomProperties` 인터페이스도 확장해야 합니다.

```ts
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    // setter를 사용하면 문자열과 refs를 모두 허용할 수 있습니다
    set hello(value: string | Ref<string>)
    get hello(): string

    // 더 간단한 값도 정의할 수 있습니다
    simpleNumber: number
  }
}
```

그런 다음 안전하게 쓰고 읽을 수 있습니다:

```ts
pinia.use(({ store }) => {
  store.hello = 'Hola'
  store.hello = ref('Hola')

  store.simpleNumber = Math.random()
  // @ts-expect-error: 우리는 이것을 올바른 타입으로 지정하지 않았습니다
  store.simpleNumber = ref(Math.random())
})
```

`PiniaCustomProperties`는 저장소의 속성을 참조할 수 있는 일반 유형입니다. 초기 옵션을 `$options`로 복사하는 다음 예제를 상상해 보세요(옵션 저장소에서만 작동함):

```ts
pinia.use(({ options }) => ({ $options: options }))
```

우리는 `PiniaCustomProperties`의 4개의 일반적인 타입을 사용하여 정확한 타입을 지정할 수 있습니다:

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
일반적인 타입들에서 타입을 확장할 때는 **소스 코드에서와 똑같이** 이름을 지정해야 합니다. `Id`는 `id` 또는 `I`로 이름을 지정할 수 없으며, `S`는 `State`로 이름을 지정할 수 없습니다. 모든 문자가 의미하는 것은 다음과 같습니다:

- S: State
- G: Getters
- A: Actions
- SS: Setup Store / Store

:::

### 새로운 상태에 타입 지정

새 상태 속성(`store`와 `store.$state` 둘 다)을 추가할 때 타입을 `PiniaCustomStateProperties`에 추가 해야합니다. `PiniaCustomProperties`와 달리 `State` generic만 수신합니다:

```ts
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomStateProperties<S> {
    hello: string
  }
}
```

### 새로운 생성 옵션에 타입 지정

`defineStore()`에 대한 새 옵션을 만들 때 `DefineStoreOptionsBase`를 확장해야 합니다. `PiniaCustomProperties`와 달리 상태 및 저장소 타입의 두 가지 generic만 노출하므로 정의할 수 있는 항목을 제한할 수 있습니다. 예를 들어 액션 이름을 사용할 수 있습니다:

```ts
import 'pinia'

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    // 모든 액션에 대한 숫자로 된 ms 정의 허용
    debounce?: Partial<Record<keyof StoreActions<Store>, number>>
  }
}
```

:::tip
Store 타입에서 *getters*를 추출하는 `StoreGetters` 타입도 있습니다. 또한 `DefineStoreOptions` 및 `DefineSetupStoreOptions` 유형을 각각 확장함으로써 _setup store_ 또는 _option store_ 옵션을 확장할 수도 있습니다.
:::

## Nuxt.js

[Nuxt와 함께 pinia를 사용할 때](../ssr/nuxt.md) 먼저 [Nuxt 플러그인](https://nuxtjs.org/docs/2.x/directory-structure/plugins)을 만들어야 합니다. 이렇게 하면 `pinia` 인스턴스에 액세스할 수 있습니다.

```ts
// plugins/myPiniaPlugin.js
import { PiniaPluginContext } from 'pinia'
import { Plugin } from '@nuxt/types'

function MyPiniaPlugin({ store }: PiniaPluginContext) {
  store.$subscribe((mutation) => {
    // 저장소의 변경에 반응
    console.log(`[🍍 ${mutation.storeId}]: ${mutation.type}.`)
  })

  // TS를 사용하는 경우 입력해야 합니다
  return { creationTime: new Date() }
}

const myPlugin: Plugin = ({ $pinia }) => {
  $pinia.use(MyPiniaPlugin)
}

export default myPlugin
```

위의 예제는 TypeScript를 사용하고 있으므로, `.js` 파일을 사용하는 경우 타입 주석 `PiniaPluginContext` 및 `Plugin`과 해당 import를 제거해야 합니다.
