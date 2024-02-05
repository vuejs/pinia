---
editLink: false
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / \_StoreOnActionListenerContext

# Interface: \_StoreOnActionListenerContext\<Store, ActionName, A\>

[pinia](../modules/pinia.md)._StoreOnActionListenerContext

Actual type for [StoreOnActionListenerContext](../modules/pinia.md#StoreOnActionListenerContext). Exists for refactoring
purposes. For internal use only.
For internal use **only**

## Type parameters

| Name | Type |
| :------ | :------ |
| `Store` | `Store` |
| `ActionName` | extends `string` |
| `A` | `A` |

## Properties

### after

• **after**: (`callback`: `A` extends `Record`\<`ActionName`, [`_Method`](../modules/pinia.md#_Method)\> ? (`resolvedReturn`: [`_Awaited`](../modules/pinia.md#_Awaited)\<`ReturnType`\<`A`[`ActionName`]\>\>) => `void` : () => `void`) => `void`

Sets up a hook once the action is finished. It receives the return value
of the action, if it's a Promise, it will be unwrapped.

#### Type declaration

▸ (`callback`): `void`

Sets up a hook once the action is finished. It receives the return value
of the action, if it's a Promise, it will be unwrapped.

##### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | `A` extends `Record`\<`ActionName`, [`_Method`](../modules/pinia.md#_Method)\> ? (`resolvedReturn`: [`_Awaited`](../modules/pinia.md#_Awaited)\<`ReturnType`\<`A`[`ActionName`]\>\>) => `void` : () => `void` |

##### Returns

`void`

___

### args

• **args**: `A` extends `Record`\<`ActionName`, [`_Method`](../modules/pinia.md#_Method)\> ? `Parameters`\<`A`[`ActionName`]\> : `unknown`[]

Parameters passed to the action

___

### name

• **name**: `ActionName`

Name of the action

___

### onError

• **onError**: (`callback`: (`error`: `unknown`) => `void`) => `void`

Sets up a hook if the action fails. Return `false` to catch the error and
stop it from propagating.

#### Type declaration

▸ (`callback`): `void`

Sets up a hook if the action fails. Return `false` to catch the error and
stop it from propagating.

##### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`error`: `unknown`) => `void` |

##### Returns

`void`

___

### store

• **store**: `Store`

Store that is invoking the action
