---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / \_MapStateReturn

# Type Alias: \_MapStateReturn\<S, G, Keys\>

> **\_MapStateReturn**\<`S`, `G`, `Keys`\>: `{ [key in Keys]: key extends keyof Store<string, S, G, Object> ? Function : never }`

For internal use **only**

## Type Parameters

• **S** *extends* [`StateTree`](StateTree.md)

• **G** *extends* [`_GettersTree`](GettersTree.md)\<`S`\> \| `object`

• **Keys** *extends* keyof `S` \| keyof `G` = keyof `S` \| keyof `G`
