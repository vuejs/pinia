# 스토어 테스트하기 %{#testing-stores}%

스토어는 설계상 여러 곳에서 사용되며, 테스트를 어렵게 만들 수 있습니다. 다행히 이런 경우는 아닐 수도 있습니다. 스토어를 테스트할 때 세 가지를 고려해야 합니다:

- `pinia` 인스턴스: 스토어는 이 없이는 동작하지 않습니다.
- `actions`: 대부분의 경우, 스토어의 가장 복잡한 로직이 포함됩니다. 기본적으로 이를 모킹할 수 있으면 좋을 것입니다.
- 플러그인: 플러그인을 사용하는 경우, 테스트를 위해 플러그인을 설치해야 합니다.

테스트하는 내용과 방식에 따라 이 세 가지를 다르게 고려해야 합니다:

- [스토어 테스트](#testing-stores)
  - [스토어의 단위 테스트](#unit-testing-a-store)
  - [컴포넌트의 단위 테스트](#unit-testing-components)
    - [초기 상태](#initial-state)
    - [액션 동작 수정](#customizing-behavior-of-actions)
    - [createSpy 함수 지정](#specifying-the-createspy-function)
    - [게터 모킹](#mocking-getters)
    - [Pinia 플러그인](#pinia-plugins)
  - [E2E 테스트](#e2e-tests)
  - [컴포넌트 단위 테스트 (Vue 2)](#unit-test-components-vue-2)

## 스토어의 단위 테스트 %{#unit-testing-a-store}%

스토어의 단위 테스트를 위해서는 가장 중요한 부분은 `pinia` 인스턴스를 생성하는 것입니다:

```js
// stores/counter.spec.ts
import { setActivePinia, createPinia } from 'pinia'
import { useCounterStore } from '../src/stores/counter'

describe('Counter Store', () => {
  beforeEach(() => {
    // 새로운 pinia 인스턴스를 생성하고 활성화하여,
    // useStore()를 호출할 때 인스턴스를 전달하지 않아도 자동으로 선택되도록 만듭니다:
    // `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('increments', () => {
    const counter = useCounterStore()
    expect(counter.n).toBe(0)
    counter.increment()
    expect(counter.n).toBe(1)
  })

  it('increments by amount', () => {
    const counter = useCounterStore()
    counter.increment(10)
    expect(counter.n).toBe(10)
  })
})
```

스토어 플러그인이 있는 경우 알아둬야 할 중요한 사항이 있습니다: **테스트에서 `pinia`가 설치되기 전까지 플러그인은 사용되지 않습니다**. 이는 빈 앱이나 가짜 앱을 생성하여 해결할 수 있습니다:

```js
import { setActivePinia, createPinia } from 'pinia'
import { createApp } from 'vue'
import { somePlugin } from '../src/stores/plugin'

// 위와 같은 코드...

// 테스트당 하나의 앱을 생성할 필요는 없습니다.
const app = createApp({})
beforeEach(() => {
  const pinia = createPinia().use(somePlugin)
  app.use(pinia)
  setActivePinia(pinia)
})
```

## 컴포넌트의 단위 테스트 %{#unit-testing-components}%

`createTestingPinia()`를 사용하여 컴포넌트의 단위 테스트를 수행할 수 있습니다. 이 함수는 컴포넌트의 단위 테스트에 도움을 주기 위해 설계된 pinia 인스턴스를 반환합니다.

먼저 `@pinia/testing`을 설치해야 합니다:

```shell
npm i -D @pinia/testing
```

그리고 컴포넌트를 마운트할 때 테스트 pinia를 생성하는 테스트에서 테스팅 pinia를 만들어야 합니다:

```js
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
// 테스트에서 상호작용할 스토어를 가져옵니다.
import { useSomeStore } from '@/stores/myStore'

const wrapper = mount(Counter, {
  global: {
    plugins: [createTestingPinia()],
  },
})

const store = useSomeStore() // 테스트 pinia 사용!

// 상태를 직접 변경할 수 있습니다.
store.name = 'my new name'
// 패치를 통해서도 가능합니다.
store.$patch({ name: 'new name' })
expect(store.name).toBe('new name')

// 액션은 기본적으로 모킹되어 있으며, 기본적으로 코드를 실행하지 않습니다.
// 이 동작을 사용자 정의하려면 아래를 참조하세요.
store.someAction()

expect(store.someAction).toHaveBeenCalledTimes(1)
expect(store.someAction).toHaveBeenLastCalledWith()
```

주의할 점은 Vue 2를 사용하는 경우, `@vue/test-utils`에서 [약간 다른 구성](#unit-test-components-vue-2)을 해야 한다는 것입니다.

### 초기 상태 %{#initial-state}%

테스트 pinia를 생성할 때 **모든 스토어**의 초기 상태를 설정할 수 있습니다. 이를 위해 `initialState` 객체를 전달하면 테스트 pinia가 스토어가 생성될 때 상태를 _패치_하는 데 사용합니다. 다음과 같은 스토어의 상태를 초기화하려는 경우를 가정해 보겠습니다:

```ts
import { defineStore } from 'pinia'

const useCounterStore = defineStore('counter', {
  state: () => ({ n: 0 }),
  // ...
})
```

스토어의 이름이 _"counter"_이므로 `initialState`에 해당하는 객체를 추가해야 합니다:

```ts
// 테스트의 어딘가에서
const wrapper = mount(Counter, {
  global: {
    plugins: [
      createTestingPinia({
        initialState: {
          counter: { n: 20 }, // 카운터를 0 대신 20에서 시작합니다.
        },
      }),
    ],
  },
})

const store = useSomeStore() // 테스트 pinia 사용!
store.n // 20
```

### 액션 동작 수정 %{#customizing-behavior-of-actions}%

`createTestingPinia`는 명시하지 않은 한 모든 스토어 액션을 스텁 처리합니다. 이렇게 하면 컴포넌트와 스토어를 별도로 테스트할 수 있습니다.

테스트 중에 액션을 정상적으로 실행하고 싶다면 `createTestingPinia`를 호출할 때 `stubActions: false`를 지정하십시오:

```js
const wrapper = mount(Counter, {
  global: {
    plugins: [createTestingPinia({ stubActions: false })],
  },
})

const store = useSomeStore()

// 이제 이 호출은 스토어에 의해 정의된 구현이 실행됩니다.
store.someAction()

// ...그러나 스파이로 래핑되므로 호출을 검사할 수 있습니다.
expect(store.someAction).toHaveBeenCalledTimes(1)
```

### createSpy 함수 지정 %{#specifying-the-createspy-function}%

Jest를 사용하거나 `globals: true`와 함께 `vitest`를 사용하는 경우, `createTestingPinia`는 테스트 프레임워크 (`jest.fn` 또는 `vitest.fn`)를 기반으로 액션을 자동으로 모킹하는 스파이 함수를 사용합니다. 다른 프레임워크를 사용하는 경우 [createSpy](/api/interfaces/pinia_testing.TestingOptions.html#createspy) 옵션을 제공해야 합니다:

```js
import sinon from 'sinon'

createTestingPinia({
  createSpy: sinon.spy, // 액션을 감싸기 위해 sinon의 spy를 사용합니다
})
```

[테스팅 패키지의 테스트](https://github.com/vuejs/pinia/blob/v2/packages/testing/src/testing.spec.ts)에서 더 많은 예제를 찾을 수 있습니다.

### 게터 모킹 %{#mocking-getters}%

기본적으로 게터는 일반적인 사용과 마찬가지로 계산됩니다. 그러나 게터를 원하는 값으로 강제로 설정할 수 있습니다:

```ts
import { defineStore } from 'pinia'
import { createTestingPinia } from '@pinia/testing'

const useCounterStore = defineStore('counter', {
  state: () => ({ n: 1 }),
  getters: {
    double: (state) => state.n * 2,
  },
})

const pinia = createTestingPinia()
const counter = useCounterStore(pinia)

counter.double = 3 // 🪄 테스트에서만 게터를 쓸 수 있습니다.

// 기본 동작을 재설정하려면 undefined로 설정하세요.
// @ts-expect-error: 보통은 숫자입니다.
counter.double = undefined
counter.double // 2 (=1 x 2)
```

### Pinia 플러그인 %{#pinia-plugins}%

Pinia 플러그인이 있는 경우 `createTestingPinia()` 호출 시 해당 플러그인을 제대로 적용하도록 전달해야 합니다. **`testingPinia.use(MyPlugin)`과 같이 일반 pinia에 추가하지 마세요**:

```js
import { createTestingPinia } from '@pinia/testing'
import { somePlugin } from '../src/stores/plugin'

// 어떤 테스트 안에서
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

Pinia의 경우, E2E 테스트를 위해 아무런 변경도 필요하지 않습니다. 그게 바로 E2E 테스트의 목적입니다! 아마도 HTTP 요청을 테스트할 수 있을 것입니다. 하지만 그건 이 안내서의 범위를 벗어납니다 😄.

## 컴포넌트 단위 테스트 (Vue 2) %{#unit-test-components-vue-2}%

[Vue Test Utils 1](https://v1.test-utils.vuejs.org/)를 사용하는 경우, `localVue`에 Pinia를 설치하세요:

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

const store = useSomeStore() // 테스트 pinia 사용!
```
