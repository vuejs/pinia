---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / Pinia

# Interface: Pinia

[pinia](../modules/pinia.md).Pinia

Every application must own its own pinia to be able to create stores

## Hierarchy

- **`Pinia`**

  ↳ [`TestingPinia`](pinia_testing.TestingPinia.md)

## Properties

### state

• **state**: `Ref`<`Record`<`string`, [`StateTree`](../modules/pinia.md#statetree)\>\>

root state

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

#### Defined in

[pinia/src/rootStore.ts:58](https://github.com/vuejs/pinia/blob/6ce186f/packages/pinia/src/rootStore.ts#L58)
