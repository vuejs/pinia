---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / Pinia

# Interface: Pinia %{#Interface:-Pinia}%

[pinia](../modules/pinia.md).Pinia

Every application must own its own pinia to be able to create stores

## Hierarchy %{#Interface:-Pinia-Hierarchy}%

- **`Pinia`**

  ↳ [`TestingPinia`](pinia_testing.TestingPinia.md)

## Properties %{#Interface:-Pinia-Properties}%

### install %{#Interface:-Pinia-Properties-install}%

• **install**: (`app`: `App`<`any`\>) => `void`

#### Type declaration %{#Interface:-Pinia-Properties-install-Type-declaration}%

▸ (`app`): `void`

##### Parameters %{#Interface:-Pinia-Properties-install-Type-declaration-Parameters}%

| Name | Type |
| :------ | :------ |
| `app` | `App`<`any`\> |

##### Returns %{#Interface:-Pinia-Properties-install-Type-declaration-Returns}%

`void`

___

### state %{#Interface:-Pinia-Properties-state}%

• **state**: `Ref`<`Record`<`string`, [`StateTree`](../modules/pinia.md#statetree)\>\>

root state

## Methods %{#Interface:-Pinia-Methods}%

### use %{#Interface:-Pinia-Methods-use}%

▸ **use**(`plugin`): [`Pinia`](pinia.Pinia.md)

Adds a store plugin to extend every store

#### Parameters %{#Interface:-Pinia-Methods-use-Parameters}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `plugin` | [`PiniaPlugin`](pinia.PiniaPlugin.md) | store plugin to add |

#### Returns %{#Interface:-Pinia-Methods-use-Returns}%

[`Pinia`](pinia.Pinia.md)
