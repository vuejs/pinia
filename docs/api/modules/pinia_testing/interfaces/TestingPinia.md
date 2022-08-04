# Interface: TestingPinia

Pinia instance specifically designed for testing. Extends a regular
`Pinia` instance with test specific properties.

## Hierarchy

- [`Pinia`](../../pinia/interfaces/Pinia.md)

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

[Pinia](../../pinia/interfaces/Pinia.md).[install](../../pinia/interfaces/Pinia.md#install)

___

### state

• **state**: `Ref`<`Record`<`string`, [`StateTree`](../../pinia/index.md#statetree)\>\>

root state

#### Inherited from

[Pinia](../../pinia/interfaces/Pinia.md).[state](../../pinia/interfaces/Pinia.md#state)

## Methods

### use

▸ **use**(`plugin`): [`Pinia`](../../pinia/interfaces/Pinia.md)

Adds a store plugin to extend every store

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `plugin` | [`PiniaPlugin`](../../pinia/interfaces/PiniaPlugin.md) | store plugin to add |

#### Returns

[`Pinia`](../../pinia/interfaces/Pinia.md)

#### Inherited from

[Pinia](../../pinia/interfaces/Pinia.md).[use](../../pinia/interfaces/Pinia.md#use)
