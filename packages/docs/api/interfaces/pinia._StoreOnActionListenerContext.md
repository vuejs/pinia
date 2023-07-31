---
editLink: false
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / \_StoreOnActionListenerContext

# Interface: \_StoreOnActionListenerContext<Store, ActionName, A\>

[pinia](../modules/pinia.md)._StoreOnActionListenerContext

Actual type for [StoreOnActionListenerContext](../modules/pinia.md#storeonactionlistenercontext). Exists for refactoring
purposes. For internal use only.
For internal use **only**

## Type parameters %{#Type-parameters}%

| Name | Type |
| :------ | :------ |
| `Store` | `Store` |
| `ActionName` | extends `string` |
| `A` | `A` |

## Properties %{#Properties}%

### after %{#Properties-after}%

• **after**: (`callback`: `A` extends `Record`<`ActionName`, [`_Method`](../modules/pinia.md#_method)\> ? (`resolvedReturn`: [`_Awaited`](../modules/pinia.md#_awaited)<`ReturnType`<`A`[`ActionName`]\>\>) => `void` : () => `void`) => `void`

#### Type declaration %{#Properties-after-Type-declaration}%

▸ (`callback`): `void`

Sets up a hook once the action is finished. It receives the return value
of the action, if it's a Promise, it will be unwrapped.

##### Parameters %{#Properties-after-Type-declaration-Parameters}%

| Name | Type |
| :------ | :------ |
| `callback` | `A` extends `Record`<`ActionName`, [`_Method`](../modules/pinia.md#_method)\> ? (`resolvedReturn`: [`_Awaited`](../modules/pinia.md#_awaited)<`ReturnType`<`A`[`ActionName`]\>\>) => `void` : () => `void` |

##### Returns %{#Properties-after-Type-declaration-Returns}%

`void`

___

### args %{#Properties-args}%

• **args**: `A` extends `Record`<`ActionName`, [`_Method`](../modules/pinia.md#_method)\> ? `Parameters`<`A`[`ActionName`]\> : `unknown`[]

Parameters passed to the action

___

### name %{#Properties-name}%

• **name**: `ActionName`

Name of the action

___

### onError %{#Properties-onError}%

• **onError**: (`callback`: (`error`: `unknown`) => `void`) => `void`

#### Type declaration %{#Properties-onError-Type-declaration}%

▸ (`callback`): `void`

Sets up a hook if the action fails. Return `false` to catch the error and
stop it from propagating.

##### Parameters %{#Properties-onError-Type-declaration-Parameters}%

| Name | Type |
| :------ | :------ |
| `callback` | (`error`: `unknown`) => `void` |

##### Returns %{#Properties-onError-Type-declaration-Returns}%

`void`

___

### store %{#Properties-store}%

• **store**: `Store`

Store that is invoking the action
