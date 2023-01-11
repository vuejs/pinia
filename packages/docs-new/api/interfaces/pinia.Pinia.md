---
sidebar: "auto"
editLink: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / Pinia

# Interface: Pinia

[pinia](../modules/pinia.md).Pinia

Every application must own its own pinia to be able to create stores

## Hierarchy %{#Hierarchy}%

- **`Pinia`**

  ↳ [`TestingPinia`](pinia_testing.TestingPinia.md)

## Properties %{#Properties}%

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

___

### state %{#Properties-state}%

• **state**: `Ref`<`Record`<`string`, [`StateTree`](../modules/pinia.md#statetree)\>\>

root state

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
