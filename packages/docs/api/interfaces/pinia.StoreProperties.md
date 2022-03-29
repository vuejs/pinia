---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / StoreProperties

# Interface: StoreProperties<Id\>

[pinia](../modules/pinia.md).StoreProperties

Properties of a store.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |

## Hierarchy

- **`StoreProperties`**

  ↳ [`_StoreWithState`](pinia._StoreWithState.md)

## Properties

### $id

• **$id**: `Id`

Unique identifier of the store

#### Defined in

[pinia/src/types.ts:265](https://github.com/vuejs/pinia/blob/d96dca2/packages/pinia/src/types.ts#L265)

___

### \_customProperties

• **\_customProperties**: `Set`<`string`\>

Used by devtools plugin to retrieve properties added with plugins. Removed
in production. Can be used by the user to add property keys of the store
that should be displayed in devtools.

#### Defined in

[pinia/src/types.ts:293](https://github.com/vuejs/pinia/blob/d96dca2/packages/pinia/src/types.ts#L293)
