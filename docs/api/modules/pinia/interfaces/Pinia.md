# Interface: Pinia

Every application must own its own pinia to be able to create stores

## Hierarchy

- **`Pinia`**

  ↳ [`TestingPinia`](../../pinia_testing/interfaces/TestingPinia.md)

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

• **state**: `Ref`<`Record`<`string`, [`StateTree`](../type_aliases.md#statetree)\>\>

root state

## Methods

### use

▸ **use**(`plugin`): [`Pinia`](Pinia.md)

Adds a store plugin to extend every store

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `plugin` | [`PiniaPlugin`](PiniaPlugin.md) | store plugin to add |

#### Returns

[`Pinia`](Pinia.md)
