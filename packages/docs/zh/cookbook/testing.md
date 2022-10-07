# 测试 store {#testing-stores}

根据设计，store 将在许多地方使用，所以可能使测试比正常情况要难得多。幸运的是，这不一定是事实。在测试 store 时，我们需要注意三件事：

- `pinia` 实例：没有它，store 不能工作
- `actions`：大多数时候，它们包含了 store 最复杂的逻辑。如果它们默认就是被 mocked，那不是很好吗？
- 插件：如果你依赖插件，你也必须为测试安装它们

根据测试的内容和方式，我们需要以不同的方式来处理这三个问题：

- [store 测试](#testing-stores)
  - [对 store 单元测试](#unit-testing-a-store)
  - [对组件单元测试](#unit-testing-components)
    - [初始 state](#initial-state)
    - [自定义 action 的行为](#customizing-behavior-of-actions)
    - [指定 createSpy 函数](#specifying-the-creespy-function)
  - [端到端测试](#e2e-tests)
  - [对组件单元测试（Vue 2）](#unit-test-components-vue-2)

## 对 store 进行单元测试{#unit-testing-a-store}

要对一个 store 进行单元测试，最重要的部分是创建一个 `pinia` 实例。

```js
// counterStore.spec.ts
import { setActivePinia, createPinia } from 'pinia'
import { useCounter } from '../src/stores/counter'

describe('Counter Store', () => {
  beforeEach(() => {
    // 创建一个新 Pinia，并使其处于激活状态，这样它就会被任何 useStore() 调用自动接收
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

如果你有任何 store 的插件，有一件重要的事情需要了解：**直到 `pinia` 被安装在一个应用程序中，插件才会被使用**。这个问题可以通过创建一个空的应用程序或一个假的应用程序来解决：

```js
import { setActivePinia, createPinia } from 'pinia'
import { createApp } from 'vue'
import { somePlugin } from '../src/stores/plugin'

// 和前面一样的代码...

// 测试前你不需要创建应用程序
const app = createApp({})
beforeEach(() => {
  const pinia = createPinia().use(somePlugin)
  app.use(pinia)
  setActivePinia(pinia)
})
```

## 对组件单元测试{#unit-testing-components}

这可以通过 `createTestingPinia()` 实现，它会返回一个旨在帮助对组件单元测试的 pinia 实例。

从安装 `@pinia/testing` 开始。

```sh
npm i -D @pinia/testing
```

并确保在安装组件时，在你的测试中创建一个测试的 pinia：

```js
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

const wrapper = mount(Counter, {
  global: {
    plugins: [createTestingPinia()],
  },
})

const store = useSomeStore() // 使用测试的 pinia！

// state 可以直接被操作
store.name = 'my new name'
// 也可以通过 patch 来完成
store.$patch({ name: 'new name' })
expect(store.name).toBe('new name')

// action 默认是存根的，意味着它们默认不执行其代码。
// 请看下面的内容来定制这一行为。
store.someAction()

expect(store.someAction).toHaveBeenCalledTimes(1)
expect(store.someAction).toHaveBeenLastCalledWith()
```

请注意，如果你使用的是 Vue 2，`@vue/test-utils` 需要一个[稍有不同的配置](#unit-test-components-vue-2)。

### 初始 State{#initial-state}

在创建测试 Pinia 时，你可以通过传递一个 `initialState` 对象来设置**所有 store 的初始状态**。这个对象将被测试 Pinia 用于在 store 被创建时 _patch_ store。比方说，你想初始化这个 store 的状态：

```ts
import { defineStore } from 'pinia'

const useCounterStore = defineStore('counter', {
  state: () => ({ n: 0 }),
  // ...
})
```

由于 store 的名字叫 _"counter"_，所以你需要传递相应的对象给 `initialState`：

```ts
// 在你的测试中的某处
const wrapper = mount(Counter, {
  global: {
    plugins: [createTestingPinia(

  initialState: {
    counter: { n: 20 }, //从 20 开始计数，而不是 0
  },
    )],
  },
})

const store = useSomeStore() // 使用测试 pinia!
store.n // 20
```

### 自定义 action 的行为{#customizing-behavior-of-actions}

除非另有指示，`createTestingPinia` 会存根出所有的store action。这允许你独立测试你的组件和 store。

如果你想恢复这种行为，并在测试中正常执行你的动作，请在调用 `createTestingPinia` 时指定 `stubActions: false`：

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

### 指定 createSpy 函数 {#specifying-the-createSpy-function}

当使用 Jest，或 vitest 且设置 `globals: true` 时，`createTestingPinia` 自动使用基于现有测试框架（`jest.fn` 或 `vitest.fn`）的 spy 函数存根 action。如果你使用了不同的框架，你需要提供一个 [createSpy](/zh/api/interfaces/pinia_testing.TestingOptions.html#createspy) 选项：

```js
import sinon from 'sinon'

createTestingPinia({
  createSpy: sinon.spy, // 使用 sinon's spy 包装 actions
})
```

你可以在[测试包的测试](https://github.com/vuejs/pinia/blob/v2/packages/testing/src/testing.spec.ts)中找到更多的例子。

## 端到端测试{#e2e-tests}

说到 pinia，你不需要为端到端测试改变任何东西，这就是端到端测试的全部意义所在 你也许想测试 HTTP 请求，但这已经超出了本指南的范围😄。

## 对组件单元测试（Vue 2）{#unit-test-components-vue-2}

当使用 [Vue Test Utils 1](https://v1.test-utils.vuejs.org/) 时，请将 Pinia 安装在 `localVue` 上：

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

const store = useSomeStore() // 使用测试 pinia！
```
