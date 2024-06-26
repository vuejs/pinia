---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / defineStore

# Function: defineStore()

## defineStore(id, options)

> **defineStore**\<`Id`, `S`, `G`, `A`\>(`id`, `options`): [`StoreDefinition`](../interfaces/StoreDefinition.md)\<`Id`, `S`, `G`, `A`\>

Creates a `useStore` function that retrieves the store instance

### Type Parameters

• **Id** *extends* `string`

• **S** *extends* [`StateTree`](../type-aliases/StateTree.md) = `object`

• **G** *extends* [`_GettersTree`](../type-aliases/GettersTree.md)\<`S`\> = `object`

• **A** = `object`

### Parameters

• **id**: `Id`

id of the store (must be unique)

• **options**: `Omit`\<[`DefineStoreOptions`](../interfaces/DefineStoreOptions.md)\<`Id`, `S`, `G`, `A`\>, `"id"`\>

options to define the store

### Returns

[`StoreDefinition`](../interfaces/StoreDefinition.md)\<`Id`, `S`, `G`, `A`\>

## defineStore(options)

> **defineStore**\<`Id`, `S`, `G`, `A`\>(`options`): [`StoreDefinition`](../interfaces/StoreDefinition.md)\<`Id`, `S`, `G`, `A`\>

Creates a `useStore` function that retrieves the store instance

### Type Parameters

• **Id** *extends* `string`

• **S** *extends* [`StateTree`](../type-aliases/StateTree.md) = `object`

• **G** *extends* [`_GettersTree`](../type-aliases/GettersTree.md)\<`S`\> = `object`

• **A** = `object`

### Parameters

• **options**: [`DefineStoreOptions`](../interfaces/DefineStoreOptions.md)\<`Id`, `S`, `G`, `A`\>

options to define the store

### Returns

[`StoreDefinition`](../interfaces/StoreDefinition.md)\<`Id`, `S`, `G`, `A`\>

## defineStore(id, storeSetup, options)

> **defineStore**\<`Id`, `SS`\>(`id`, `storeSetup`, `options`?): [`StoreDefinition`](../interfaces/StoreDefinition.md)\<`Id`, [`_ExtractStateFromSetupStore`](../type-aliases/ExtractStateFromSetupStore.md)\<`SS`\>, [`_ExtractGettersFromSetupStore`](../type-aliases/ExtractGettersFromSetupStore.md)\<`SS`\>, [`_ExtractActionsFromSetupStore`](../type-aliases/ExtractActionsFromSetupStore.md)\<`SS`\>\>

Creates a `useStore` function that retrieves the store instance

### Type Parameters

• **Id** *extends* `string`

• **SS**

### Parameters

• **id**: `Id`

id of the store (must be unique)

• **storeSetup**

function that defines the store

• **options?**: [`DefineSetupStoreOptions`](../interfaces/DefineSetupStoreOptions.md)\<`Id`, [`_ExtractStateFromSetupStore`](../type-aliases/ExtractStateFromSetupStore.md)\<`SS`\>, [`_ExtractGettersFromSetupStore`](../type-aliases/ExtractGettersFromSetupStore.md)\<`SS`\>, [`_ExtractActionsFromSetupStore`](../type-aliases/ExtractActionsFromSetupStore.md)\<`SS`\>\>

extra options

### Returns

[`StoreDefinition`](../interfaces/StoreDefinition.md)\<`Id`, [`_ExtractStateFromSetupStore`](../type-aliases/ExtractStateFromSetupStore.md)\<`SS`\>, [`_ExtractGettersFromSetupStore`](../type-aliases/ExtractGettersFromSetupStore.md)\<`SS`\>, [`_ExtractActionsFromSetupStore`](../type-aliases/ExtractActionsFromSetupStore.md)\<`SS`\>\>
