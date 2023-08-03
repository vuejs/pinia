---
editLink: false
---

[API Documentation](../index.md) / [@pinia/testing](../modules/pinia_testing.md) / TestingOptions

# Interface: TestingOptions

[@pinia/testing](../modules/pinia_testing.md).TestingOptions

## Properties

### createSpy

• `Optional` **createSpy**: (`fn?`: (...`args`: `any`[]) => `any`) => (...`args`: `any`[]) => `any`

#### Type declaration

▸ (`fn?`): (...`args`: `any`[]) => `any`

Function used to create a spy for actions and `$patch()`. Pre-configured
with `jest.fn` in Jest projects or `vi.fn` in Vitest projects if
`globals: true` is set.

##### Parameters

| Name | Type |
| :------ | :------ |
| `fn?` | (...`args`: `any`[]) => `any` |

##### Returns

`fn`

▸ (`...args`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns

`any`

___

### fakeApp

• `Optional` **fakeApp**: `boolean`

Creates an empty App and calls `app.use(pinia)` with the created testing
pinia. This allows you to use plugins while unit testing stores as
plugins **will wait for pinia to be installed in order to be executed**.
Defaults to false.

___

### initialState

• `Optional` **initialState**: [`StateTree`](../modules/pinia.md#statetree)

Allows defining a partial initial state of all your stores. This state gets applied after a store is created,
allowing you to only set a few properties that are required in your test.

___

### plugins

• `Optional` **plugins**: [`PiniaPlugin`](pinia.PiniaPlugin.md)[]

Plugins to be installed before the testing plugin. Add any plugins used in
your application that will be used while testing.

___

### stubActions

• `Optional` **stubActions**: `boolean`

When set to false, actions are only spied, but they will still get executed. When
set to true, actions will be replaced with spies, resulting in their code
not being executed. Defaults to true. NOTE: when providing `createSpy()`,
it will **only** make the `fn` argument `undefined`. You still have to
handle this in `createSpy()`.

___

### stubPatch

• `Optional` **stubPatch**: `boolean`

When set to true, calls to `$patch()` won't change the state. Defaults to
false. NOTE: when providing `createSpy()`, it will **only** make the `fn`
argument `undefined`. You still have to handle this in `createSpy()`.

___

### stubReset

• `Optional` **stubReset**: `boolean`

When set to true, calls to `$reset()` won't change the state. Defaults to
false.
