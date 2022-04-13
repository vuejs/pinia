---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [@pinia/testing](../modules/pinia_testing.md) / TestingPinia

# Interface: TestingPinia

[@pinia/testing](../modules/pinia_testing.md).TestingPinia

Pinia instance specifically designed for testing. Extends a regular
[Pinia](pinia.Pinia.md) instance with test specific properties.

## Hierarchy

- [`Pinia`](pinia.Pinia.md)

  ↳ **`TestingPinia`**

## Properties

### app

• **app**: `App`<`any`\>

App used by Pinia

#### Defined in

[testing/src/testing.ts:72](https://github.com/vuejs/pinia/blob/6ce186f/packages/testing/src/testing.ts#L72)

___

### state

• **state**: `Ref`<`Record`<`string`, [`StateTree`](../modules/pinia.md#statetree)\>\>

root state

#### Inherited from

[Pinia](pinia.Pinia.md).[state](pinia.Pinia.md#state)

#### Defined in

[pinia/src/rootStore.ts:51](https://github.com/vuejs/pinia/blob/6ce186f/packages/pinia/src/rootStore.ts#L51)

## Methods

### install

▸ **install**(`app`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `app` | `App`<`any`\> |

#### Returns

`void`

#### Inherited from

[Pinia](pinia.Pinia.md).[install](pinia.Pinia.md#install)

#### Defined in

[pinia/src/rootStore.ts:46](https://github.com/vuejs/pinia/blob/6ce186f/packages/pinia/src/rootStore.ts#L46)

___

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

#### Defined in

[pinia/src/rootStore.ts:58](https://github.com/vuejs/pinia/blob/6ce186f/packages/pinia/src/rootStore.ts#L58)
