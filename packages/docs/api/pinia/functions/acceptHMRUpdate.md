---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / acceptHMRUpdate

# Function: acceptHMRUpdate()

> **acceptHMRUpdate**\<`Id`, `S`, `G`, `A`\>(`initialUseStore`, `hot`): (`newModule`) => `any`

Creates an _accept_ function to pass to `import.meta.hot` in Vite applications.

## Type Parameters

• **Id** *extends* `string` = `string`

• **S** *extends* [`StateTree`](../type-aliases/StateTree.md) = [`StateTree`](../type-aliases/StateTree.md)

• **G** *extends* [`_GettersTree`](../type-aliases/GettersTree.md)\<`S`\> = [`_GettersTree`](../type-aliases/GettersTree.md)\<`S`\>

• **A** = [`_ActionsTree`](../type-aliases/ActionsTree.md)

## Parameters

• **initialUseStore**: [`StoreDefinition`](../interfaces/StoreDefinition.md)\<`Id`, `S`, `G`, `A`\>

return of the defineStore to hot update

• **hot**: `any`

`import.meta.hot`

## Returns

`Function`

### Parameters

• **newModule**: `any`

### Returns

`any`

## Example

```js
const useUser = defineStore(...)
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot))
}
```
