# store 测试 %{#testing-stores}%

<RuleKitLink />

<MasteringPiniaLink
  href="https://play.gumlet.io/embed/65f9a9c10bfab01f414c25dc"
  title="Watch a free video of Mastering Pinia about testing stores"
/>

从设计上来说，许多地方都会使用 store，所以可能比正常情况更难测试。但幸运的是，这不一定是真的。在测试 store 时，我们需要注意三件事：

- `pinia` 实例：没有它，store 不能正常工作
- `actions`：大多数时候，它们包含了 store 最复杂的逻辑。如果它们默认就可以被 mocked，那不是很好吗？
- 插件：如果你依赖插件，你也必须为测试安装它们

根据测试的内容和方式，我们需要以不同的方式来处理这三个问题：

- [store 测试](#testing-stores)
  - [对 store 单元测试](#unit-testing-a-store)
  - [对组件单元测试](#unit-testing-components)
    - [初始 state](#initial-state)
    - [自定义 action 的行为](#customizing-behavior-of-actions)
    - [指定 createSpy 函数](#specifying-the-createspy-function)
    - [Mocking getters](#mocking-getters)
    - [Pinia 插件](#pinia-plugins)
  - [端到端测试](#e2e-tests)
  - [对组件单元测试(Vue 2)](#unit-test-components-vue-2)

## 对 store 进行单元测试 %{#unit-testing-a-store}%

要对一个 store 进行单元测试，最重要的是创建一个 `pinia` 实例：

```js
// stores/counter.spec.ts
import { setActivePinia, createPinia } from 'pinia'
import { useCounter } from '../src/stores/counter'

describe('Counter Store', () => {
  beforeEach(() => {
    // 创建一个新 pinia，并使其处于激活状态，这样它就会被任何 useStore() 调用自动接收
    // 而不需要手动传递：
    // `useStore(pinia)`
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

如果你有使用任何 store 的插件，有一件重要的事情需要了解：**在 `pinia` 被安装在一个应用之后，插件才会被使用**。可以通过创建一个空的或假的应用来解决这个问题：

```js
import { setActivePinia, createPinia } from 'pinia'
import { createApp } from 'vue'
import { somePlugin } from '../src/stores/plugin'

// 和前面一样的代码...

// 测试前你不需要创建应用
const app = createApp({})
beforeEach(() => {
  const pinia = createPinia().use(somePlugin)
  app.use(pinia)
  setActivePinia(pinia)
})
```

## 对组件单元测试 %{#unit-testing-components}%

这可以通过 `createTestingPinia()` 实现，它会返回一个仅用于帮助对组件单元测试的 pinia 实例。

从安装 `@pinia/testing` 开始：

```shell
npm i -D @pinia/testing
```

确保挂载组件时，在你的测试中创建一个用于测试的 pinia 实例：

```js
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
// 引入任何你想要测试的 store
import { useSomeStore } from '@/stores/myStore'

const wrapper = mount(Counter, {
  global: {
    plugins: [createTestingPinia()],
  },
})

const store = useSomeStore() // // 使用 pinia 的测试实例!

// 可直接操作 state
store.name = 'my new name'
// 也可以通过 patch 来完成
store.$patch({ name: 'new name' })
expect(store.name).toBe('new name')

// action 默认是存根的(stubbed)，意味着它们默认不执行其代码。
// 请看下面的内容来定制这一行为。
store.someAction()

expect(store.someAction).toHaveBeenCalledTimes(1)
expect(store.someAction).toHaveBeenLastCalledWith()
```

请注意，如果你使用的是 Vue 2，`@vue/test-utils` 需要一个[轻微不同的配置](#unit-test-components-vue-2)。

### 初始 State %{#initial-state}%

在创建测试 Pinia 时，你可以通过传递一个 `initialState` 对象来设置**所有 store 的初始状态**。这个对象将被 pinia 的测试实例用于创建 store 时 _patch_ store。比方说，你想初始化这个 store 的状态：

```ts
import { defineStore } from 'pinia'

const useCounterStore = defineStore('counter', {
  state: () => ({ n: 0 }),
  // ...
})
```

由于 store 的名字是 _"counter"_，所以你需要传递相应的对象给 `initialState`：

```ts
// 在测试中的某处
const wrapper = mount(Counter, {
  global: {
    plugins: [
      createTestingPinia({
        initialState: {
          counter: { n: 20 }, //从 20 开始计数，而不是 0
        },
      }),
    ],
  },
})

const store = useSomeStore() // 使用 pinia 的测试实例!
store.n // 20
```

### 自定义 action 的行为 %{#customizing-behavior-of-actions}%

除非另有指示，`createTestingPinia` 会存根 (stub) 出所有的 store action。这样可以让你独立测试你的组件和 store。

如果你想恢复这种行为，并在测试中正常执行 action，请在调用 `createTestingPinia` 时指定 `stubActions: false`：

```js
const wrapper = mount(Counter, {
  global: {
    plugins: [createTestingPinia({ stubActions: false })],
  },
})

const store = useSomeStore()

// 现在，这个调用将由 store 定义的实现执行。
store.someAction()

// ...但它仍然被一个 spy 包装着，所以你可以检查调用
expect(store.someAction).toHaveBeenCalledTimes(1)
```

<!-- TODO: translation -->

### Mocking the returned value of an action

Actions are automatically spied but type-wise, they are still the regular actions. In order to get the correct type, we must implement a custom type-wrapper that applies the `Mock` type to each action. **This type depends on the testing framework you are using**. Here is an example with Vitest:

```ts
import type { Mock } from 'vitest'
import type { Store, StoreDefinition } from 'pinia'

function mockedStore<TStoreDef extends () => unknown>(
  useStore: TStoreDef
): TStoreDef extends StoreDefinition<
  infer Id,
  infer State,
  infer Getters,
  infer Actions
>
  ? Store<
      Id,
      State,
      Getters,
      {
        [K in keyof Actions]: Actions[K] extends (
          ...args: infer Args
        ) => infer ReturnT
          ? // 👇 depends on your testing framework
            Mock<Args, ReturnT>
          : Actions[K]
      }
    >
  : ReturnType<TStoreDef> {
  return useStore() as any
}
```

This can be used in tests to get a correctly typed store:

```ts
import { mockedStore } from './mockedStore'
import { useSomeStore } from '@/stores/myStore'

const store = mockedStore(useSomeStore)
// typed!
store.someAction.mockResolvedValue('some value')
```

### 指定 createSpy 函数 %{#specifying-the-createspy-function}%

当使用 Jest，或 vitest 且设置 `globals: true` 时，`createTestingPinia` 会自动使用现有测试框架 (`jest.fn` 或 `vitest.fn`) 的 spy 函数存根 (stub) action。如果你使用的是不同的框架，你需要提供一个 [createSpy](/zh/api/interfaces/pinia_testing.TestingOptions.html#createspy) 选项：

```js
import sinon from 'sinon'

createTestingPinia({
  createSpy: sinon.spy, // 使用 sinon's spy 包装 action
})
```

你可以在[测试包的测试源码](https://github.com/vuejs/pinia/blob/v3/packages/testing/src/testing.spec.ts)中找到更多的例子。

### Mocking getters %{#mocking-getters}%

默认情况下，任何 getter 都会像常规用法一样进行计算，但你可以通过将 getter 设置为任何你想要的值来手动强制计算：

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

counter.double = 3 // 🪄 getter 仅在测试中可被重写

// 设置为 undefined，以重置默认行为
// @ts-expect-error: usually it's a number
counter.double = undefined
counter.double // 2 (=1 x 2)
```

### Pinia 插件 %{#pinia-plugins}%

如果你有使用任何 pinia 插件，确保在调用 `createTestingPinia()` 时传入它们，这样它们就会被正确加载。**不要使用 `testingPinia.use(MyPlugin)`** 来加载它们，而应该像正常的 pinia 那样：

```js
import { createTestingPinia } from '@pinia/testing'
import { somePlugin } from '../src/stores/plugin'

// 某些测试
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

## 端到端测试 %{#e2e-tests}%

对于 pinia，你不需要为端到端测试修改任何代码，这就是端到端测试的含义！也许你想测试 HTTP 请求，但这已经超出了本指南的范围😄。

## 对组件单元测试(Vue 2) %{#unit-test-components-vue-2}%

当你使用的是 [Vue Test Utils 1](https://v1.test-utils.vuejs.org/zh/) 时，请将 Pinia 安装在 `localVue` 上：

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

const store = useSomeStore() // 使用 pinia 的测试实例！
```
