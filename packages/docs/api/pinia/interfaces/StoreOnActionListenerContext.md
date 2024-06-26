---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / \_StoreOnActionListenerContext

# Interface: \_StoreOnActionListenerContext\<Store, ActionName, A\>

Actual type for [StoreOnActionListenerContext](../type-aliases/StoreOnActionListenerContext.md). Exists for refactoring
purposes. For internal use only.
For internal use **only**

## Type Parameters

• **Store**

• **ActionName** *extends* `string`

• **A**

## Properties

### after()

> **after**: (`callback`) => `void`

Sets up a hook once the action is finished. It receives the return value
of the action, if it's a Promise, it will be unwrapped.

#### Parameters

• **callback**: `A` *extends* `Record`\<`ActionName`, [`_Method`](../type-aliases/Method.md)\> ? (`resolvedReturn`) => `void` : () => `void`

#### Returns

`void`

***

### args

> **args**: `A` *extends* `Record`\<`ActionName`, [`_Method`](../type-aliases/Method.md)\> ? `Parameters`\<`A`\<`A`\>\[`ActionName`\]\> : `unknown`[]

Parameters passed to the action

***

### name

> **name**: `ActionName`

Name of the action

***

### onError()

> **onError**: (`callback`) => `void`

Sets up a hook if the action fails. Return `false` to catch the error and
stop it from propagating.

#### Parameters

• **callback**

#### Returns

`void`

***

### store

> **store**: `Store`

Store that is invoking the action
