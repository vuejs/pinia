---
editLink: false
---

[**API Documentation**](../../../index.md) • **Docs**

***

[API Documentation](../../../index.md) / [@pinia/testing](../index.md) / TestingOptions

# Interface: TestingOptions

## Properties

### createSpy()?

> `optional` **createSpy**: (`fn`?) => (...`args`) => `any`

Function used to create a spy for actions and `$patch()`. Pre-configured
with `jest.fn` in Jest projects or `vi.fn` in Vitest projects if
`globals: true` is set.

#### Parameters

• **fn?**

#### Returns

`Function`

##### Parameters

• ...**args**: `any`[]

##### Returns

`any`

***

### fakeApp?

> `optional` **fakeApp**: `boolean`

Creates an empty App and calls `app.use(pinia)` with the created testing
pinia. This allows you to use plugins while unit testing stores as
plugins **will wait for pinia to be installed in order to be executed**.
Defaults to false.

***

### initialState?

> `optional` **initialState**: [`StateTree`](../../../pinia/type-aliases/StateTree.md)

Allows defining a partial initial state of all your stores. This state gets applied after a store is created,
allowing you to only set a few properties that are required in your test.

***

### plugins?

> `optional` **plugins**: [`PiniaPlugin`](../../../pinia/interfaces/PiniaPlugin.md)[]

Plugins to be installed before the testing plugin. Add any plugins used in
your application that will be used while testing.

***

### stubActions?

> `optional` **stubActions**: `boolean`

When set to false, actions are only spied, but they will still get executed. When
set to true, actions will be replaced with spies, resulting in their code
not being executed. Defaults to true. NOTE: when providing `createSpy()`,
it will **only** make the `fn` argument `undefined`. You still have to
handle this in `createSpy()`.

***

### stubPatch?

> `optional` **stubPatch**: `boolean`

When set to true, calls to `$patch()` won't change the state. Defaults to
false. NOTE: when providing `createSpy()`, it will **only** make the `fn`
argument `undefined`. You still have to handle this in `createSpy()`.

***

### stubReset?

> `optional` **stubReset**: `boolean`

When set to true, calls to `$reset()` won't change the state. Defaults to
false.
