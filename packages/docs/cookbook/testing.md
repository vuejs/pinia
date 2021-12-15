# Testing stores

Stores will, by design, be used at many places and can make testing much harder than it should be. Fortunately, this doesn't have to be the case. We need to take care of three things when testing stores:

- The `pinia` instance: Stores cannot work without it
- `actions`: most of the time, they contain the most complex logic of our stores. Wouldn't it be nice if they were mocked by default?
- Plugins: If you rely on plugins, you will have to install them for tests too

Depending on what or how you are testing, we need to take care of these three differently:

- [Unit testing stores (outside of components)](#unit-testing-a-store)
- [Unit testing components that use stores](#unit-testing-components)
- [End to End tests](#e2e-tests)

## Unit testing a store

To unit test a store, the most important part is creating a `pinia` instance:

```js
// counterStore.spec.ts
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

If you have any store plugins, there is one important thing to know: **plugins won't be used until `pinia` is installed in an App**. This can be solved by creating an empty App or a fake one:

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

## Unit testing components

This can be achieved with `createTestingPinia()`. I haven't been able to write proper documentation for this yet but its usage can be discovered through autocompletion and the documentation that appears in tooltips.

Start by installing `@pinia/testing`:

```sh
npm i -D @pinia/testing
```

And make sure to create a testing pinia in your tests when mounting a component:

```js
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'

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

// actions are stubbed by default but can be configured by
// passing an option to `createTestingPinia()`
store.someAction()

expect(store.someAction).toHaveBeenCalledTimes(1)
expect(store.someAction).toHaveBeenLastCalledWith()
```

You can find more examples in [the tests of the testing package](https://github.com/vuejs/pinia/blob/v2/packages/testing/src/testing.spec.ts).

## E2E tests

When it comes to pinia, you don't need to change anything for e2e tests, that's the whole point of e2e tests! You could maybe test HTTP requests, but that's way beyond the scope of this guide 😄.
