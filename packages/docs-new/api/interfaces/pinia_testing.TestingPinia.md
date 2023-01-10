---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [@pinia/testing](../modules/pinia_testing.md) / TestingPinia

# Interface: TestingPinia %{#Interface:-TestingPinia}%

[@pinia/testing](../modules/pinia_testing.md).TestingPinia

Pinia instance specifically designed for testing. Extends a regular
`Pinia` instance with test specific properties.

## Hierarchy %{#Interface:-TestingPinia-Hierarchy}%

- [`Pinia`](pinia.Pinia.md)

  ↳ **`TestingPinia`**

## Properties %{#Interface:-TestingPinia-Properties}%

### app %{#Interface:-TestingPinia-Properties-app}%

• **app**: `App`<`any`\>

App used by Pinia

___

### install %{#Interface:-TestingPinia-Properties-install}%

• **install**: (`app`: `App`<`any`\>) => `void`

#### Type declaration %{#Interface:-TestingPinia-Properties-install-Type-declaration}%

▸ (`app`): `void`

##### Parameters %{#Interface:-TestingPinia-Properties-install-Type-declaration-Parameters}%

| Name | Type |
| :------ | :------ |
| `app` | `App`<`any`\> |

##### Returns %{#Interface:-TestingPinia-Properties-install-Type-declaration-Returns}%

`void`

#### Inherited from %{#Interface:-TestingPinia-Properties-install-Inherited-from}%

[Pinia](pinia.Pinia.md).[install](pinia.Pinia.md#install)

___

### state %{#Interface:-TestingPinia-Properties-state}%

• **state**: `Ref`<`Record`<`string`, [`StateTree`](../modules/pinia.md#statetree)\>\>

root state

#### Inherited from %{#Interface:-TestingPinia-Properties-state-Inherited-from}%

[Pinia](pinia.Pinia.md).[state](pinia.Pinia.md#state)

## Methods %{#Interface:-TestingPinia-Methods}%

### use %{#Interface:-TestingPinia-Methods-use}%

▸ **use**(`plugin`): [`Pinia`](pinia.Pinia.md)

Adds a store plugin to extend every store

#### Parameters %{#Interface:-TestingPinia-Methods-use-Parameters}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `plugin` | [`PiniaPlugin`](pinia.PiniaPlugin.md) | store plugin to add |

#### Returns %{#Interface:-TestingPinia-Methods-use-Returns}%

[`Pinia`](pinia.Pinia.md)

#### Inherited from %{#Interface:-TestingPinia-Methods-use-Inherited-from}%

[Pinia](pinia.Pinia.md).[use](pinia.Pinia.md#use)
