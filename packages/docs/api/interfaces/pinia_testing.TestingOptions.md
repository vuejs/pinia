---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
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
with `jest.fn()` in jest projects or `vi.fn()` in vitest projects.

##### Parameters

| Name | Type |
| :------ | :------ |
| `fn?` | (...`args`: `any`[]) => `any` |

##### Returns

`fn`

▸ (...`args`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns

`any`

#### Defined in

[packages/testing/src/testing.ts:63](https://github.com/vuejs/pinia/blob/aa0192a/packages/testing/src/testing.ts#L63)

___

### fakeApp

• `Optional` **fakeApp**: `boolean`

Creates an empty App and calls `app.use(pinia)` with the created testing
pinia. This is allows you to use plugins while unit testing stores as
plugins **will wait for pinia to be installed in order to be executed**.
Defaults to false.

#### Defined in

[packages/testing/src/testing.ts:57](https://github.com/vuejs/pinia/blob/aa0192a/packages/testing/src/testing.ts#L57)

___

### initialState

• `Optional` **initialState**: [`StateTree`](../modules/pinia.md#statetree)

Allows defining a partial initial state of all your stores. This state gets applied after a store is created,
allowing you to only set a few properties that are required in your test.

#### Defined in

[packages/testing/src/testing.ts:27](https://github.com/vuejs/pinia/blob/aa0192a/packages/testing/src/testing.ts#L27)

___

### plugins

• `Optional` **plugins**: [`PiniaPlugin`](pinia.PiniaPlugin.md)[]

Plugins to be installed before the testing plugin. Add any plugins used in
your application that will be used while testing.

#### Defined in

[packages/testing/src/testing.ts:33](https://github.com/vuejs/pinia/blob/aa0192a/packages/testing/src/testing.ts#L33)

___

### stubActions

• `Optional` **stubActions**: `boolean`

When set to false, actions are only spied, they still get executed. When
set to true, actions will be replaced with spies, resulting in their code
not being executed. Defaults to true. NOTE: when providing `createSpy()`,
it will **only** make the `fn` argument `undefined`. You still have to
handle this in `createSpy()`.

#### Defined in

[packages/testing/src/testing.ts:42](https://github.com/vuejs/pinia/blob/aa0192a/packages/testing/src/testing.ts#L42)

___

### stubPatch

• `Optional` **stubPatch**: `boolean`

When set to true, calls to `$patch()` won't change the state. Defaults to
false. NOTE: when providing `createSpy()`, it will **only** make the `fn`
argument `undefined`. You still have to handle this in `createSpy()`.

#### Defined in

[packages/testing/src/testing.ts:49](https://github.com/vuejs/pinia/blob/aa0192a/packages/testing/src/testing.ts#L49)
