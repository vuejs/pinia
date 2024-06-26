---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / StoreOnActionListenerContext

# Type Alias: StoreOnActionListenerContext\<Id, S, G, A\>

> **StoreOnActionListenerContext**\<`Id`, `S`, `G`, `A`\>: [`_ActionsTree`](ActionsTree.md) *extends* `A` ? [`_StoreOnActionListenerContext`](../interfaces/StoreOnActionListenerContext.md)\<[`StoreGeneric`](StoreGeneric.md), `string`, [`_ActionsTree`](ActionsTree.md)\> : `{ [Name in keyof A]: Name extends string ? _StoreOnActionListenerContext<Store<Id, S, G, A>, Name, A> : never }`\[keyof `A`\]

Context object passed to callbacks of `store.$onAction(context => {})`
TODO: should have only the Id, the Store and Actions to generate the proper object

## Type Parameters

• **Id** *extends* `string`

• **S** *extends* [`StateTree`](StateTree.md)

• **G**

• **A**
