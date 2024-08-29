---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / \_MapStateObjectReturn

# Type Alias: \_MapStateObjectReturn\<Id, S, G, A, T\>

> **\_MapStateObjectReturn**\<`Id`, `S`, `G`, `A`, `T`\>: `{ [key in keyof T]: Function }`

For internal use **only**

## Type Parameters

• **Id** *extends* `string`

• **S** *extends* [`StateTree`](StateTree.md)

• **G** *extends* [`_GettersTree`](GettersTree.md)\<`S`\> \| `object`

• **A**

• **T** *extends* `Record`\<`string`, keyof `S` \| keyof `G` \| (`store`) => `any`\> = `object`
