---
editLink: false
---

[API Documentation](../index.md) / [@pinia/testing](../modules/pinia_testing.md) / TestingPinia

# Interface: TestingPinia

[@pinia/testing](../modules/pinia_testing.md).TestingPinia

Pinia instance specifically designed for testing. Extends a regular
`Pinia` instance with test specific properties.

## Hierarchy

- [`Pinia`](pinia.Pinia.md)

  ↳ **`TestingPinia`**

## Properties

### app

• **app**: `App`<`any`\>

App used by Pinia

___

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

#### Inherited from

[Pinia](pinia.Pinia.md).[install](pinia.Pinia.md#install)

___

### state

• **state**: `Ref`<`Record`<`string`, [`StateTree`](../modules/pinia.md#statetree)\>\>

root state

#### Inherited from

[Pinia](pinia.Pinia.md).[state](pinia.Pinia.md#state)

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

#### Inherited from

[Pinia](pinia.Pinia.md).[use](pinia.Pinia.md#use)
