# ストアのテスト {#testing-stores}

ストアは、設計上、多くの場所で使用されることになり、テストを必要以上に難しくしてしまうことがあります。幸いなことに、そのようなことはありません。ストアをテストする際には、3 つのことに気をつける必要があります:

- `pinia` インスタンス: これがないとストアは成り立たない
- `actions`: ほとんどの場合、ストアの最も複雑なロジックを含んでいます。もし、デフォルトでモック化されていたらいいと思いませんか？
- プラグイン: プラグインに依存している場合、テスト用にプラグインをインストールする必要があります

何をどのようにテストしているかに応じて、これら 3 つを異なる方法で処理する必要があります:

- [ストアのテスト {#testing-stores}](#ストアのテスト-testing-stores)
  - [ストアのユニットテスト {#unit-testing-a-store}](#ストアのユニットテスト-unit-testing-a-store)
  - [コンポーネントのユニットテスト {#unit-testing-components}](#コンポーネントのユニットテスト-unit-testing-components)
    - [初期状態 {#initial-state}](#初期状態-initial-state)
    - [アクションの動作のカスタマイズ {#customizing-behavior-of-actions}](#アクションの動作のカスタマイズ-customizing-behavior-of-actions)
    - [createSpy 関数の指定 {#specifying-the-create-spy-function}](#createspy-関数の指定-specifying-the-create-spy-function)
    - [ゲッターのモック化 {#mocking-getters}](#ゲッターのモック化-mocking-getters)
    - [Pinia プラグイン {#pinia-plugins}](#pinia-プラグイン-pinia-plugins)
  - [E2E テスト {#e2-e-tests}](#e2e-テスト-e2-e-tests)
  - [コンポーネントのユニットテスト（Vue 2） {#unit-test-components-vue-2}](#コンポーネントのユニットテストvue-2-unit-test-components-vue-2)

## ストアのユニットテスト {#unit-testing-a-store}

ストアをユニットテストするために、最も重要な部分は、`pinia` のインスタンスを作成することです:

```js
// stores/counter.spec.ts
import { setActivePinia, createPinia } from 'pinia'
import { useCounter } from '../src/stores/counter'

describe('Counter Store', () => {
  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
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

ストアプラグインがある場合、1 つ重要なことがあります: **プラグインは、`pinia` がアプリにインストールされるまで使用されません**。これは、空のアプリまたは偽のアプリを作成することで解決できます:

```js
import { setActivePinia, createPinia } from 'pinia'
import { createApp } from 'vue'
import { somePlugin } from '../src/stores/plugin'

// same code as above...

// you don't need to create one app per test
const app = createApp({})
beforeEach(() => {
  const pinia = createPinia().use(somePlugin)
  app.use(pinia)
  setActivePinia(pinia)
})
```

## コンポーネントのユニットテスト {#unit-testing-components}

これは `createTestingPinia()` で実現でき、コンポーネントのユニットテストを支援するために設計された pinia インスタンスを返します。

まず、`@pinia/testing` をインストールします:

```shell
npm i -D @pinia/testing
```

また、コンポーネントをマウントする際には、必ずテスト用の pinia をテストに作成してください:

```js
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
// import any store you want to interact with in tests
import { useSomeStore } from '@/stores/myStore'

const wrapper = mount(Counter, {
  global: {
    plugins: [createTestingPinia()],
  },
})

const store = useSomeStore() // uses the testing pinia!

// state can be directly manipulated
store.name = 'my new name'
// can also be done through patch
store.$patch({ name: 'new name' })
expect(store.name).toBe('new name')

// actions are stubbed by default, meaning they don't execute their code by default.
// See below to customize this behavior.
store.someAction()

expect(store.someAction).toHaveBeenCalledTimes(1)
expect(store.someAction).toHaveBeenLastCalledWith()
```

Vue 2 を使用している場合、`@vue/test-utils` は [少し異なる設定](#unit-test-components-vue-2) を必要としますので、注意してください。

### 初期状態 {#initial-state}

テスト用 pinia の作成時に `initialState` オブジェクトを渡すことで、**すべてのストア** の初期状態を設定することができます。このオブジェクトは、テスト用 pinia がストアを作成するときに _パッチ_ を適用するために使用されます。例えば、このストアの状態を初期化したいとします:

```ts
import { defineStore } from 'pinia'

const useCounterStore = defineStore('counter', {
  state: () => ({ n: 0 }),
  // ...
})
```

ストア名が _"counter"_ なので、`initialState` に一致するオブジェクトを追加する必要があります:

```ts
// somewhere in your test
const wrapper = mount(Counter, {
  global: {
    plugins: [
      createTestingPinia({
        initialState: {
          counter: { n: 20 }, // start the counter at 20 instead of 0
        },
      }),
    ],
  },
})

const store = useSomeStore() // uses the testing pinia!
store.n // 20
```

### アクションの動作のカスタマイズ {#customizing-behavior-of-actions}

`createTestingPinia` は、特に指示がない限りすべてのストアアクションをスタブ化します。これにより、コンポーネントとストアを別々にテストすることができます。

この動作を元に戻して、テスト中に通常通りアクションを実行したい場合は、`createTestingPinia` の呼び出し時に `stubActions: false` を指定してください:

```js
const wrapper = mount(Counter, {
  global: {
    plugins: [createTestingPinia({ stubActions: false })],
  },
})

const store = useSomeStore()

// Now this call WILL execute the implementation defined by the store
store.someAction()

// ...but it's still wrapped with a spy, so you can inspect calls
expect(store.someAction).toHaveBeenCalledTimes(1)
```

### createSpy 関数の指定 {#specifying-the-create-spy-function}

Jest または vitest を `globals: true` で使用する場合、`createTestingPinia` は、既存のテストフレームワークに基づくスパイ関数（`jest.fn` または `vitest.fn`）を使用して、自動的にアクションをスタブ化します。別のフレームワークを使用している場合は、[createSpy](/ja/api/interfaces/pinia_testing.TestingOptions.html#createspy) オプションを指定する必要があります:

```js
import sinon from 'sinon'

createTestingPinia({
  createSpy: sinon.spy, // use sinon's spy to wrap actions
})
```

[テストパッケージのテスト](https://github.com/vuejs/pinia/blob/v2/packages/testing/src/testing.spec.ts) に、より多くの例を見ることができます。

### ゲッターのモック化 {#mocking-getters}

デフォルトでは、どのゲッターも通常の使用方法と同じように計算されますが、ゲッターに好きな値を設定することで、手動で強制的に値を設定することができます:

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

counter.double = 3 // 🪄 getters are writable only in tests

// set to undefined to reset the default behavior
// @ts-expect-error: usually it's a number
counter.double = undefined
counter.double // 2 (=1 x 2)
```

### Pinia プラグイン {#pinia-plugins}

pinia プラグインがある場合、`createTestingPinia()` を呼び出すときにプラグインを渡して、正しく適用されるようにする必要があります。通常の pinia のように **`testingPinia.use(MyPlugin)` で追加しないでください**:

```js
import { createTestingPinia } from '@pinia/testing'
import { somePlugin } from '../src/stores/plugin'

// inside some test
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

## E2E テスト {#e2-e-tests}

pinia に関しては、e2e テストのために何かを変更する必要はなく、それが e2e テストの要点です！HTTP リクエストをテストすることもできますが、それはこのガイドの範囲をはるかに超えています😄。

## コンポーネントのユニットテスト（Vue 2） {#unit-test-components-vue-2}

[Vue Test Utils 1](https://v1.test-utils.vuejs.org/) を使用する場合、Pinia は `localVue` にインストールしてください:

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

const store = useSomeStore() // uses the testing pinia!
```
