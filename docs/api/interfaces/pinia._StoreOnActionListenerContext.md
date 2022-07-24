---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / \_StoreOnActionListenerContext

# Interface: \_StoreOnActionListenerContext<Store, ActionName, A\>

[pinia](../modules/pinia.md)._StoreOnActionListenerContext

Actual type for [StoreOnActionListenerContext](../modules/pinia.md#storeonactionlistenercontext). Exists for refactoring
purposes. For internal use only.
For internal use **only**

## Type parameters

| Name | Type |
| :------ | :------ |
| `Store` | `Store` |
| `ActionName` | extends `string` |
| `A` | `A` |

## Properties

### args

• **args**: `A` extends `Record`<`ActionName`, [`_Method`](../modules/pinia.md#_method)\> ? `Parameters`<`A`[`ActionName`]\> : `unknown`[]

Parameters passed to the action

#### Defined in

[packages/pinia/src/types.ts:195](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L195)

___

### name

• **name**: `ActionName`

Name of the action

#### Defined in

[packages/pinia/src/types.ts:185](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L185)

___

### store

• **store**: `Store`

Store that is invoking the action

#### Defined in

[packages/pinia/src/types.ts:190](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L190)

## Methods

### after

▸ **after**(`callback`): `void`

Sets up a hook once the action is finished. It receives the return value
of the action, if it's a Promise, it will be unwrapped. Can return a
value (other than `undefined`) to **override** the returned value.

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | `A` extends `Record`<`ActionName`, [`_Method`](../modules/pinia.md#_method)\> ? (`resolvedReturn`: [`_Awaited`](../modules/pinia.md#_awaited)<`ReturnType`<`A`[`ActionName`]\>\>) => `void` \| `ReturnType`<`A`[`ActionName`]\> \| [`_Awaited`](../modules/pinia.md#_awaited)<`ReturnType`<`A`[`ActionName`]\>\> : () => `void` |

#### Returns

`void`

#### Defined in

[packages/pinia/src/types.ts:204](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L204)

___

### onError

▸ **onError**(`callback`): `void`

Sets up a hook if the action fails. Return `false` to catch the error and
stop it fro propagating.

#### Parameters

| Name | Type |
| :------ | :------ |
| `callback` | (`error`: `unknown`) => `unknown` |

#### Returns

`void`

#### Defined in

[packages/pinia/src/types.ts:220](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L220)
