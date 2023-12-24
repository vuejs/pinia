---
editLink: false
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / StoreProperties

# Interface: StoreProperties\<Id\>

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

___

### \_customProperties

• **\_customProperties**: `Set`\<`string`\>

Used by devtools plugin to retrieve properties added with plugins. Removed
in production. Can be used by the user to add property keys of the store
that should be displayed in devtools.
