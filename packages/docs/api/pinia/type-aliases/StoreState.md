---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / StoreState

# Type Alias: StoreState\<SS\>

> **StoreState**\<`SS`\>: `SS` *extends* [`Store`](Store.md)\<`string`, infer S, [`_GettersTree`](GettersTree.md)\<[`StateTree`](StateTree.md)\>, [`_ActionsTree`](ActionsTree.md)\> ? `UnwrapRef`\<`S`\> : [`_ExtractStateFromSetupStore`](ExtractStateFromSetupStore.md)\<`SS`\>

Extract the state of a store type. Works with both a Setup Store or an
Options Store. Note this unwraps refs.

## Type Parameters

• **SS**
