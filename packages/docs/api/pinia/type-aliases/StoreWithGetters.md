---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / \_StoreWithGetters

# Type Alias: \_StoreWithGetters\<G\>

> **\_StoreWithGetters**\<`G`\>: `{ readonly [k in keyof G]: G[k] extends Function ? R : UnwrapRef<G[k]> }`

Store augmented with getters. For internal usage only.
For internal use **only**

## Type Parameters

• **G**
