---
title: 스토어 테스트
---

# 스토어 테스트 %{#testing-stores}%

스토어는 설계상 많은 장소에서 사용되며,
테스트를 예상보다 훨씬 어렵게 만들 수 있습니다.
다행히도 반드시 그러지는 않습니다.
스토어를 테스트할 때 세 가지 사항을 고려해야 합니다:

- `pinia` 인스턴스: 스토어는 이것 없이는 작동할 수 없음.
- `actions`: 대부분의 경우 스토어에서 가장 복잡한 논리를 가짐.
  기본적으로 모의(mock)되면 좋지 않을까요?
- 플러그인: 플러그인에 의존하는 경우, 테스트를 위해 플러그인도 설치해야 함.

테스트 대상 또는 방법에 따라 다음 세 가지를 다르게 처리해야 합니다:

- [스토어 테스트](#testing-stores)
  - [스토어 단위 테스트](#unit-testing-a-store)
  - [컴포넌트 단위 테스트](#unit-testing-components)
    - [초기 상태](#initial-state)
    - [액션의 작동 커스터마이징](#customizing-behavior-of-actions)
    - [createSpy 함수 지정](#specifying-the-createspy-function)
    - [게터 모의(mock)하기](#mocking-getters)
    - [피니아 플러그인](#pinia-plugins)
  - [E2E 테스트](#e2e-tests)
  - [컴포넌트 단위 테스트 (Vue 2)](#unit-test-components-vue-2)

## 스토어 단위 테스트 %{#unit-testing-a-store}%

스토어를 단위 테스트하려면 `pinia` 인스턴스를 만드는 것이 가장 중요합니다:

```js
// stores/counter.spec.ts
import { setActivePinia, createPinia } from 'pinia'
import { useCounter } from '../src/stores/counter'

describe('Counter Store', () => {
  beforeEach(() => {
    // 새로운 피니아를 만들고 활성화하여,
    // useStore() 호출에 전달하지 않아도
    // 자동으로 `useStore(pinia)` 처럼 되도록 함.
    setActivePinia(createPinia())
  })

  it('increments', () => {
    const counter = useCounter()
    expect(counter.n).toBe(0)
    counter.increment()
    expect(counter.n).toBe(1)
  })

  it('increments by amount', () => {
    const counter = useCounter()
    counter.increment(10)
    expect(counter.n).toBe(10)
  })
})
```

스토어 플러그인이 있는 경우, 알아야 할 중요한 사항이 있습니다:
**플러그인은 `pinia`가 앱에 설치될 때까지 사용되지 않습니다**.
이것은 빈 앱이나 가짜 앱을 만들어 해결해야 합니다:

```js
import { setActivePinia, createPinia } from 'pinia'
import { createApp } from 'vue'
import { somePlugin } from '../src/stores/plugin'

// 위와 동일한 코드...

// 테스트당 하나의 앱을 만들 필요 없음
const app = createApp({})
beforeEach(() => {
  const pinia = createPinia().use(somePlugin)
  app.use(pinia)
  setActivePinia(pinia)
})
```

## 컴포넌트 단위 테스트 %{#unit-testing-components}%

컴포넌트를 단위 테스트하는 데 도움이 되도록 설계된,
피니아 인스턴스를 반환하는 `createTestingPinia()`를 사용하여 구현할 수 있습니다.

`@pinia/testing`을 설치하여 시작합니다:

```shell
npm i -D @pinia/testing
```

그리고 컴포넌트를 마운트할 때, 테스트에서 테스트용 피니아를 생성해야 합니다:

```js
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
// 테스트에서 상호 작용하려는 모든 상점 import 하기
import { useSomeStore } from '@/stores/myStore'

const wrapper = mount(Counter, {
  global: {
    plugins: [createTestingPinia()],
  },
})

const store = useSomeStore() // 테스트용 피니아를 사용함!

// 상태를 직접 조작할 수 있음.
store.name = '신형만'
// 패치를 통해서도 가능.
store.$patch({ name: '봉미선' })
expect(store.name).toBe('봉미선')

// 액션은 기본적으로 스텁됨(stubbed). 따라서 기본적으로 코드를 실행하지 않음
// 이 동작을 사용자 정의하려면 아래를 참조.
store.someAction()

expect(store.someAction).toHaveBeenCalledTimes(1)
expect(store.someAction).toHaveBeenLastCalledWith()
```

Vue 2를 사용하는 경우, `@vue/test-utils`에 [약간 다른 구성](#unit-test-components-vue-2)이 필요합니다.

### 초기 상태 %{#initial-state}%

`initialState` 객체를 전달하여 테스트용 피니아를 생성할 때,
**모든 스토어**의 초기 상태를 설정(패치)할 수 있습니다.
이 스토어의 상태를 초기화하려고 한다고 가정해 보겠습니다:

```ts
import { defineStore } from 'pinia'

const useCounterStore = defineStore('counter', {
  state: () => ({ n: 0 }),
  // ...
})
```

스토어 이름이 "counter"이므로 `initialState`에 일치하는 객체를 추가해야 합니다:

```ts
// 당신의 테스트 어딘가에.
const wrapper = mount(Counter, {
  global: {
    plugins: [
      createTestingPinia({
        initialState: {
          counter: { n: 20 }, // 0 대신 20에서 카운터 시작.
        },
      }),
    ],
  },
})

const store = useSomeStore() // 테스트용 피니아를 사용함!
store.n // 20
```

### 액션의 작동 커스터마이징 %{#customizing-behavior-of-actions}%

`createTestingPinia`는 달리 명시되지 않는 한 모든 스토어 액션을 스텁 아웃합니다.
이를 통해 컴포넌트와 스토어를 별도로 테스트할 수 있습니다.

이 동작을 되돌리고 테스트 중에 일반적으로 액션을 실행하려면,
`createTestingPinia`를 호출할 때 `stubActions: false`를 지정합니다:

```js
const wrapper = mount(Counter, {
  global: {
    plugins: [createTestingPinia({ stubActions: false })],
  },
})

const store = useSomeStore()

// 이제 이 호출은 스토어에서 정의한 액션을 실행함.
store.someAction()

// ...하지만 여전히 스파이(spy)로 래핑되어 있으므로, 호출을 검사할 수 있음.
expect(store.someAction).toHaveBeenCalledTimes(1)
```

### createSpy 함수 지정 %{#specifying-the-createspy-function}%

Jest 또는 vitest를 `globals: true`와 함께 사용할 때,
`createTestingPinia`는 기존 테스트 프레임워크(`jest.fn` 또는 `vitest.fn`)를 기반으로 하는 스파이 함수를 사용하여 액션을 자동으로 스텁합니다.
다른 프레임워크를 사용하는 경우 [createSpy](/api/modules/pinia_testing/interfaces/TestingOptions.html#createspy) 옵션을 제공해야 합니다:

```js
// 참고: sinon는 테스트 프레임워크에 한 종류임.
import sinon from 'sinon'

createTestingPinia({
  createSpy: sinon.spy, // 액션을 래핑하기 위해 sinon의 스파이를 사용.
})
```

[테스트용 패키지 테스트](https://github.com/vuejs/pinia/blob/v2/packages/testing/src/testing.spec.ts)에서 더 많은 예제를 찾을 수 있습니다.

### 게터 모의(mock)하기 %{#mocking-getters}%

기본적으로 모든 게터는 일반 사용법과 같이 계산되지만,
게터를 원하는 값으로 설정하여 수동으로 값을 강제 적용할 수 있습니다:

```ts
import { defineStore } from 'pinia'
import { createTestingPinia } from '@pinia/testing'

const useCounter = defineStore('counter', {
  state: () => ({ n: 1 }),
  getters: {
    double: (state) => state.n * 2,
  },
})

const pinia = createTestingPinia()
const counter = useCounter(pinia)

counter.double = 3 // 🪄 getter는 테스트에서만 쓸 수 있음(writable).

// 기본 동작으로 재설정하려면 undefined로 설정.
// @ts-expect-error: usually it's a number
counter.double = undefined
counter.double // 2 (=1 x 2)
```

### 피니아 플러그인 %{#pinia-plugins}%

피니아 플러그인이 있는 경우,
`createTestingPinia()` 호출 시 플러그인을 전달하여 제대로 적용되도록 해야 합니다.
일반적으로 피니아에서 **`testingPinia.use(MyPlugin)` 하듯이 추가하지 마십시오**:

```js
import { createTestingPinia } from '@pinia/testing'
import { somePlugin } from '../src/stores/plugin'

// 어떤 테스트 내부에서
const wrapper = mount(Counter, {
  global: {
    plugins: [
      createTestingPinia({
        stubActions: false,
        plugins: [somePlugin],
      }),
    ],
  },
})
```

## E2E 테스트 %{#e2e-tests}%

피니아에 관해서는 e2e 테스트를 위해 아무것도 변경할 필요가 없습니다.
이것이 e2e 테스트의 핵심입니다!
HTTP 요청을 테스트할 수도 있지만, 이는 이 가이드 범위를 벗어납니다 😄.

## 컴포넌트 단위 테스트 (Vue 2) %{#unit-test-components-vue-2}%

[Vue Test Utils 1](https://v1.test-utils.vuejs.org/)을 사용하는 경우, `localVue`에 피니아를 설치합니다:

```js
import { PiniaVuePlugin } from 'pinia'
import { createLocalVue, mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

const localVue = createLocalVue()
localVue.use(PiniaVuePlugin)

const wrapper = mount(Counter, {
  localVue,
  pinia: createTestingPinia(),
})

const store = useSomeStore() // 테스트용 피니아를 사용함!
```
