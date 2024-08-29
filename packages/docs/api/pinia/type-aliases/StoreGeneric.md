---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / StoreGeneric

# Type Alias: StoreGeneric

> **StoreGeneric**: [`Store`](Store.md)\<`string`, [`StateTree`](StateTree.md), [`_GettersTree`](GettersTree.md)\<[`StateTree`](StateTree.md)\>, [`_ActionsTree`](ActionsTree.md)\>

Generic and type-unsafe version of Store. Doesn't fail on access with
strings, making it much easier to write generic functions that do not care
about the kind of store that is passed.
