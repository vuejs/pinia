---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [@pinia/testing](../modules/pinia_testing.md) / TestingOptions

# Interface: TestingOptions %{#Interface:-TestingOptions}%

[@pinia/testing](../modules/pinia_testing.md).TestingOptions

## Properties %{#Interface:-TestingOptions-Properties}%

### createSpy %{#Interface:-TestingOptions-Properties-createSpy}%

• `Optional` **createSpy**: (`fn?`: (...`args`: `any`[]) => `any`) => (...`args`: `any`[]) => `any`

#### Type declaration %{#Interface:-TestingOptions-Properties-createSpy-Type-declaration}%

▸ (`fn?`): (...`args`: `any`[]) => `any`

Function used to create a spy for actions and `$patch()`. Pre-configured
with `jest.fn()` in jest projects or `vi.fn()` in vitest projects.

##### Parameters %{#Interface:-TestingOptions-Properties-createSpy-Type-declaration-Parameters}%

| Name | Type |
| :------ | :------ |
| `fn?` | (...`args`: `any`[]) => `any` |

##### Returns %{#Interface:-TestingOptions-Properties-createSpy-Type-declaration-Returns}%

`fn`

▸ (...`args`): `any`

##### Parameters %{#Interface:-TestingOptions-Properties-createSpy-Type-declaration-Parameters_1}%

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns %{#Interface:-TestingOptions-Properties-createSpy-Type-declaration-Returns_1}%

`any`

___

### fakeApp %{#Interface:-TestingOptions-Properties-fakeApp}%

• `Optional` **fakeApp**: `boolean`

Creates an empty App and calls `app.use(pinia)` with the created testing
pinia. This is allows you to use plugins while unit testing stores as
plugins **will wait for pinia to be installed in order to be executed**.
Defaults to false.

___

### initialState %{#Interface:-TestingOptions-Properties-initialState}%

• `Optional` **initialState**: [`StateTree`](../modules/pinia.md#statetree)

Allows defining a partial initial state of all your stores. This state gets applied after a store is created,
allowing you to only set a few properties that are required in your test.

___

### plugins %{#Interface:-TestingOptions-Properties-plugins}%

• `Optional` **plugins**: [`PiniaPlugin`](pinia.PiniaPlugin.md)[]

Plugins to be installed before the testing plugin. Add any plugins used in
your application that will be used while testing.

___

### stubActions %{#Interface:-TestingOptions-Properties-stubActions}%

• `Optional` **stubActions**: `boolean`

When set to false, actions are only spied, they still get executed. When
set to true, actions will be replaced with spies, resulting in their code
not being executed. Defaults to true. NOTE: when providing `createSpy()`,
it will **only** make the `fn` argument `undefined`. You still have to
handle this in `createSpy()`.

___

### stubPatch %{#Interface:-TestingOptions-Properties-stubPatch}%

• `Optional` **stubPatch**: `boolean`

When set to true, calls to `$patch()` won't change the state. Defaults to
false. NOTE: when providing `createSpy()`, it will **only** make the `fn`
argument `undefined`. You still have to handle this in `createSpy()`.
