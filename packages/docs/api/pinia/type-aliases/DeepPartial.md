---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / \_DeepPartial

# Type Alias: \_DeepPartial\<T\>

> **\_DeepPartial**\<`T`\>: `{ [K in keyof T]?: _DeepPartial<T[K]> }`

Recursive `Partial<T>`. Used by [['$patch']](Store.md).

For internal use **only**

## Type Parameters

• **T**
