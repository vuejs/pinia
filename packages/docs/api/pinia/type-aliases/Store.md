---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / Store

# Type Alias: Store\<Id, S, G, A\>

> **Store**\<`Id`, `S`, `G`, `A`\>: [`_StoreWithState`](../interfaces/StoreWithState.md)\<`Id`, `S`, `G`, `A`\> & `UnwrapRef`\<`S`\> & [`_StoreWithGetters`](StoreWithGetters.md)\<`G`\> & [`_ActionsTree`](ActionsTree.md) *extends* `A` ? `object` : `A` & [`PiniaCustomProperties`](../interfaces/PiniaCustomProperties.md)\<`Id`, `S`, `G`, `A`\> & [`PiniaCustomStateProperties`](../interfaces/PiniaCustomStateProperties.md)\<`S`\>

Store type to build a store.

## Type Parameters

• **Id** *extends* `string` = `string`

• **S** *extends* [`StateTree`](StateTree.md) = `object`

• **G** = `object`

• **A** = `object`
