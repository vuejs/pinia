---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / \_StoreOnActionListenerContext

# Interface: \_StoreOnActionListenerContext<Store, ActionName, A\> %{#Interface:-\_StoreOnActionListenerContext<Store,-ActionName,-A\>}%

[pinia](../modules/pinia.md)._StoreOnActionListenerContext

Actual type for [StoreOnActionListenerContext](../modules/pinia.md#storeonactionlistenercontext). Exists for refactoring
purposes. For internal use only.
For internal use **only**

## Type parameters %{#Interface:-\_StoreOnActionListenerContext<Store,-ActionName,-A\>-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `Store` | `Store` |
| `ActionName` | extends `string` |
| `A` | `A` |

## Properties %{#Interface:-\_StoreOnActionListenerContext<Store,-ActionName,-A\>-Properties}%

### after %{#Interface:-\_StoreOnActionListenerContext<Store,-ActionName,-A\>-Properties-after}%

• **after**: (`callback`: `A` extends `Record`<`ActionName`, [`_Method`](../modules/pinia.md#_method)\> ? (`resolvedReturn`: [`_Awaited`](../modules/pinia.md#_awaited)<`ReturnType`<`A`[`ActionName`]\>\>) => `void` : () => `void`) => `void`

#### Type declaration %{#Interface:-\_StoreOnActionListenerContext<Store,-ActionName,-A\>-Properties-after-Type-declaration}%

▸ (`callback`): `void`

Sets up a hook once the action is finished. It receives the return value
of the action, if it's a Promise, it will be unwrapped.

##### Parameters %{#Interface:-\_StoreOnActionListenerContext<Store,-ActionName,-A\>-Properties-after-Type-declaration-Parameters}%

| Name | Type |
| :------ | :------ |
| `callback` | `A` extends `Record`<`ActionName`, [`_Method`](../modules/pinia.md#_method)\> ? (`resolvedReturn`: [`_Awaited`](../modules/pinia.md#_awaited)<`ReturnType`<`A`[`ActionName`]\>\>) => `void` : () => `void` |

##### Returns %{#Interface:-\_StoreOnActionListenerContext<Store,-ActionName,-A\>-Properties-after-Type-declaration-Returns}%

`void`

___

### args %{#Interface:-\_StoreOnActionListenerContext<Store,-ActionName,-A\>-Properties-args}%

• **args**: `A` extends `Record`<`ActionName`, [`_Method`](../modules/pinia.md#_method)\> ? `Parameters`<`A`[`ActionName`]\> : `unknown`[]

Parameters passed to the action

___

### name %{#Interface:-\_StoreOnActionListenerContext<Store,-ActionName,-A\>-Properties-name}%

• **name**: `ActionName`

Name of the action

___

### onError %{#Interface:-\_StoreOnActionListenerContext<Store,-ActionName,-A\>-Properties-onError}%

• **onError**: (`callback`: (`error`: `unknown`) => `void`) => `void`

#### Type declaration %{#Interface:-\_StoreOnActionListenerContext<Store,-ActionName,-A\>-Properties-onError-Type-declaration}%

▸ (`callback`): `void`

Sets up a hook if the action fails. Return `false` to catch the error and
stop it from propagating.

##### Parameters %{#Interface:-\_StoreOnActionListenerContext<Store,-ActionName,-A\>-Properties-onError-Type-declaration-Parameters}%

| Name | Type |
| :------ | :------ |
| `callback` | (`error`: `unknown`) => `void` |

##### Returns %{#Interface:-\_StoreOnActionListenerContext<Store,-ActionName,-A\>-Properties-onError-Type-declaration-Returns}%

`void`

___

### store %{#Interface:-\_StoreOnActionListenerContext<Store,-ActionName,-A\>-Properties-store}%

• **store**: `Store`

Store that is invoking the action
