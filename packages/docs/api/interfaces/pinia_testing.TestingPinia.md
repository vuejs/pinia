---
sidebar: "auto"
editLink: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [@pinia/testing](../modules/pinia_testing.md) / TestingPinia

# Interface: TestingPinia

[@pinia/testing](../modules/pinia_testing.md).TestingPinia

Pinia instance specifically designed for testing. Extends a regular
`Pinia` instance with test specific properties.

## Hierarchy %{#Hierarchy}%

- [`Pinia`](pinia.Pinia.md)

  ↳ **`TestingPinia`**

## Properties %{#Properties}%

### app %{#Properties-app}%

• **app**: `App`<`any`\>

App used by Pinia

___

### install %{#Properties-install}%

• **install**: (`app`: `App`<`any`\>) => `void`

#### Type declaration %{#Properties-install-Type-declaration}%

▸ (`app`): `void`

##### Parameters %{#Properties-install-Type-declaration-Parameters}%

| Name | Type |
| :------ | :------ |
| `app` | `App`<`any`\> |

##### Returns %{#Properties-install-Type-declaration-Returns}%

`void`

#### Inherited from %{#Properties-install-Inherited-from}%

[Pinia](pinia.Pinia.md).[install](pinia.Pinia.md#install)

___

### state %{#Properties-state}%

• **state**: `Ref`<`Record`<`string`, [`StateTree`](../modules/pinia.md#statetree)\>\>

root state

#### Inherited from %{#Properties-state-Inherited-from}%

[Pinia](pinia.Pinia.md).[state](pinia.Pinia.md#state)

## Methods %{#Methods}%

### use %{#Methods-use}%

▸ **use**(`plugin`): [`Pinia`](pinia.Pinia.md)

Adds a store plugin to extend every store

#### Parameters %{#Methods-use-Parameters}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `plugin` | [`PiniaPlugin`](pinia.PiniaPlugin.md) | store plugin to add |

#### Returns %{#Methods-use-Returns}%

[`Pinia`](pinia.Pinia.md)

#### Inherited from %{#Methods-use-Inherited-from}%

[Pinia](pinia.Pinia.md).[use](pinia.Pinia.md#use)
