---
editLink: false
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / Pinia

# Interface: Pinia

[pinia](../modules/pinia.md).Pinia

Every application must own its own pinia to be able to create stores

## Hierarchy

- **`Pinia`**

  ↳ [`TestingPinia`](pinia_testing.TestingPinia.md)

## Properties

### install

• **install**: (`app`: `App`<`any`\>) => `void`

#### Type declaration

▸ (`app`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `app` | `App`<`any`\> |

##### Returns

`void`

___

### state

• **state**: `Ref`<`Record`<`string`, [`StateTree`](../modules/pinia.md#statetree)\>\>

root state

## Methods

### use

▸ **use**(`plugin`): [`Pinia`](pinia.Pinia.md)

Adds a store plugin to extend every store

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `plugin` | [`PiniaPlugin`](pinia.PiniaPlugin.md) | store plugin to add |

#### Returns

[`Pinia`](pinia.Pinia.md)
