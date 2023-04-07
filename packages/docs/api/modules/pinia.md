---
editLink: false
---

[API Documentation](../index.md) / pinia

# Module: pinia

## Enumerations %{#Enumerations}%

- [MutationType](../enums/pinia.MutationType.md)

## Interfaces %{#Interfaces}%

- [DefineSetupStoreOptions](../interfaces/pinia.DefineSetupStoreOptions.md)
- [DefineStoreOptions](../interfaces/pinia.DefineStoreOptions.md)
- [DefineStoreOptionsBase](../interfaces/pinia.DefineStoreOptionsBase.md)
- [DefineStoreOptionsInPlugin](../interfaces/pinia.DefineStoreOptionsInPlugin.md)
- [MapStoresCustomization](../interfaces/pinia.MapStoresCustomization.md)
- [Pinia](../interfaces/pinia.Pinia.md)
- [PiniaCustomProperties](../interfaces/pinia.PiniaCustomProperties.md)
- [PiniaCustomStateProperties](../interfaces/pinia.PiniaCustomStateProperties.md)
- [PiniaPlugin](../interfaces/pinia.PiniaPlugin.md)
- [PiniaPluginContext](../interfaces/pinia.PiniaPluginContext.md)
- [StoreDefinition](../interfaces/pinia.StoreDefinition.md)
- [StoreProperties](../interfaces/pinia.StoreProperties.md)
- [SubscriptionCallbackMutationDirect](../interfaces/pinia.SubscriptionCallbackMutationDirect.md)
- [SubscriptionCallbackMutationPatchFunction](../interfaces/pinia.SubscriptionCallbackMutationPatchFunction.md)
- [SubscriptionCallbackMutationPatchObject](../interfaces/pinia.SubscriptionCallbackMutationPatchObject.md)
- [\_StoreOnActionListenerContext](../interfaces/pinia._StoreOnActionListenerContext.md)
- [\_StoreWithState](../interfaces/pinia._StoreWithState.md)
- [\_SubscriptionCallbackMutationBase](../interfaces/pinia._SubscriptionCallbackMutationBase.md)

## Type Aliases %{#Type-Aliases}%

### PiniaStorePlugin %{#Type-Aliases-PiniaStorePlugin}%

Ƭ **PiniaStorePlugin**: [`PiniaPlugin`](../interfaces/pinia.PiniaPlugin.md)

Plugin to extend every store.

**`Deprecated`**

use PiniaPlugin instead

___

### StateTree %{#Type-Aliases-StateTree}%

Ƭ **StateTree**: `Record`<`string` \| `number` \| `symbol`, `any`\>

Generic state of a Store

___

### Store %{#Type-Aliases-Store}%

Ƭ **Store**<`Id`, `S`, `G`, `A`\>: [`_StoreWithState`](../interfaces/pinia._StoreWithState.md)<`Id`, `S`, `G`, `A`\> & `UnwrapRef`<`S`\> & [`_StoreWithGetters`](pinia.md#_storewithgetters)<`G`\> & [`_ActionsTree`](pinia.md#_actionstree) extends `A` ? {} : `A` & [`PiniaCustomProperties`](../interfaces/pinia.PiniaCustomProperties.md)<`Id`, `S`, `G`, `A`\> & [`PiniaCustomStateProperties`](../interfaces/pinia.PiniaCustomStateProperties.md)<`S`\>

Store type to build a store.

#### Type parameters %{#Type-Aliases-Store-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) = {} |
| `G` | {} |
| `A` | {} |

___

### StoreActions %{#Type-Aliases-StoreActions}%

Ƭ **StoreActions**<`SS`\>: `SS` extends [`Store`](pinia.md#store)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, infer A\> ? `A` : [`_ExtractActionsFromSetupStore`](pinia.md#_extractactionsfromsetupstore)<`SS`\>

Extract the actions of a store type. Works with both a Setup Store or an
Options Store.

#### Type parameters %{#Type-Aliases-StoreActions-Type-parameters}%

| Name |
| :------ |
| `SS` |

___

### StoreGeneric %{#Type-Aliases-StoreGeneric}%

Ƭ **StoreGeneric**: [`Store`](pinia.md#store)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree)\>

Generic and type-unsafe version of Store. Doesn't fail on access with
strings, making it much easier to write generic functions that do not care
about the kind of store that is passed.

___

### StoreGetters %{#Type-Aliases-StoreGetters}%

Ƭ **StoreGetters**<`SS`\>: `SS` extends [`Store`](pinia.md#store)<`string`, [`StateTree`](pinia.md#statetree), infer G, [`_ActionsTree`](pinia.md#_actionstree)\> ? [`_StoreWithGetters`](pinia.md#_storewithgetters)<`G`\> : [`_ExtractGettersFromSetupStore`](pinia.md#_extractgettersfromsetupstore)<`SS`\>

Extract the getters of a store type. Works with both a Setup Store or an
Options Store.

#### Type parameters %{#Type-Aliases-StoreGetters-Type-parameters}%

| Name |
| :------ |
| `SS` |

___

### StoreOnActionListener %{#Type-Aliases-StoreOnActionListener}%

Ƭ **StoreOnActionListener**<`Id`, `S`, `G`, `A`\>: (`context`: [`StoreOnActionListenerContext`](pinia.md#storeonactionlistenercontext)<`Id`, `S`, `G`, {} extends `A` ? [`_ActionsTree`](pinia.md#_actionstree) : `A`\>) => `void`

#### Type parameters %{#Type-Aliases-StoreOnActionListener-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | `G` |
| `A` | `A` |

#### Type declaration %{#Type-Aliases-StoreOnActionListener-Type-declaration}%

▸ (`context`): `void`

Argument of `store.$onAction()`

##### Parameters %{#Type-Aliases-StoreOnActionListener-Type-declaration-Parameters}%

| Name | Type |
| :------ | :------ |
| `context` | [`StoreOnActionListenerContext`](pinia.md#storeonactionlistenercontext)<`Id`, `S`, `G`, {} extends `A` ? [`_ActionsTree`](pinia.md#_actionstree) : `A`\> |

##### Returns %{#Type-Aliases-StoreOnActionListener-Type-declaration-Returns}%

`void`

___

### StoreOnActionListenerContext %{#Type-Aliases-StoreOnActionListenerContext}%

Ƭ **StoreOnActionListenerContext**<`Id`, `S`, `G`, `A`\>: [`_ActionsTree`](pinia.md#_actionstree) extends `A` ? [`_StoreOnActionListenerContext`](../interfaces/pinia._StoreOnActionListenerContext.md)<[`StoreGeneric`](pinia.md#storegeneric), `string`, [`_ActionsTree`](pinia.md#_actionstree)\> : { [Name in keyof A]: Name extends string ? \_StoreOnActionListenerContext<Store<Id, S, G, A\>, Name, A\> : never }[keyof `A`]

Context object passed to callbacks of `store.$onAction(context => {})`
TODO: should have only the Id, the Store and Actions to generate the proper object

#### Type parameters %{#Type-Aliases-StoreOnActionListenerContext-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | `G` |
| `A` | `A` |

___

### StoreState %{#Type-Aliases-StoreState}%

Ƭ **StoreState**<`SS`\>: `SS` extends [`Store`](pinia.md#store)<`string`, infer S, [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree)\> ? `UnwrapRef`<`S`\> : [`_ExtractStateFromSetupStore`](pinia.md#_extractstatefromsetupstore)<`SS`\>

Extract the state of a store type. Works with both a Setup Store or an
Options Store. Note this unwraps refs.

#### Type parameters %{#Type-Aliases-StoreState-Type-parameters}%

| Name |
| :------ |
| `SS` |

___

### SubscriptionCallback %{#Type-Aliases-SubscriptionCallback}%

Ƭ **SubscriptionCallback**<`S`\>: (`mutation`: [`SubscriptionCallbackMutation`](pinia.md#subscriptioncallbackmutation)<`S`\>, `state`: `UnwrapRef`<`S`\>) => `void`

#### Type parameters %{#Type-Aliases-SubscriptionCallback-Type-parameters}%

| Name |
| :------ |
| `S` |

#### Type declaration %{#Type-Aliases-SubscriptionCallback-Type-declaration}%

▸ (`mutation`, `state`): `void`

Callback of a subscription

##### Parameters %{#Type-Aliases-SubscriptionCallback-Type-declaration-Parameters}%

| Name | Type |
| :------ | :------ |
| `mutation` | [`SubscriptionCallbackMutation`](pinia.md#subscriptioncallbackmutation)<`S`\> |
| `state` | `UnwrapRef`<`S`\> |

##### Returns %{#Type-Aliases-SubscriptionCallback-Type-declaration-Returns}%

`void`

___

### SubscriptionCallbackMutation %{#Type-Aliases-SubscriptionCallbackMutation}%

Ƭ **SubscriptionCallbackMutation**<`S`\>: [`SubscriptionCallbackMutationDirect`](../interfaces/pinia.SubscriptionCallbackMutationDirect.md) \| [`SubscriptionCallbackMutationPatchObject`](../interfaces/pinia.SubscriptionCallbackMutationPatchObject.md)<`S`\> \| [`SubscriptionCallbackMutationPatchFunction`](../interfaces/pinia.SubscriptionCallbackMutationPatchFunction.md)

Context object passed to a subscription callback.

#### Type parameters %{#Type-Aliases-SubscriptionCallbackMutation-Type-parameters}%

| Name |
| :------ |
| `S` |

___

### \_ActionsTree %{#Type-Aliases-\_ActionsTree}%

Ƭ **\_ActionsTree**: `Record`<`string`, [`_Method`](pinia.md#_method)\>

Type of an object of Actions. For internal usage only.
For internal use **only**

___

### \_Awaited %{#Type-Aliases-\_Awaited}%

Ƭ **\_Awaited**<`T`\>: `T` extends ``null`` \| `undefined` ? `T` : `T` extends `object` & { `then`: (`onfulfilled`: `F`) => `any`  } ? `F` extends (`value`: infer V, ...`args`: `any`) => `any` ? [`_Awaited`](pinia.md#_awaited)<`V`\> : `never` : `T`

#### Type parameters %{#Type-Aliases-\_Awaited-Type-parameters}%

| Name |
| :------ |
| `T` |

___

### \_DeepPartial %{#Type-Aliases-\_DeepPartial}%

Ƭ **\_DeepPartial**<`T`\>: { [K in keyof T]?: \_DeepPartial<T[K]\> }

Recursive `Partial<T>`. Used by [['$patch']](pinia.md#store).

For internal use **only**

#### Type parameters %{#Type-Aliases-\_DeepPartial-Type-parameters}%

| Name |
| :------ |
| `T` |

___

### \_ExtractActionsFromSetupStore %{#Type-Aliases-\_ExtractActionsFromSetupStore}%

Ƭ **\_ExtractActionsFromSetupStore**<`SS`\>: `SS` extends `undefined` \| `void` ? {} : [`_ExtractActionsFromSetupStore_Keys`](pinia.md#_extractactionsfromsetupstore_keys)<`SS`\> extends keyof `SS` ? `Pick`<`SS`, [`_ExtractActionsFromSetupStore_Keys`](pinia.md#_extractactionsfromsetupstore_keys)<`SS`\>\> : `never`

For internal use **only**

#### Type parameters %{#Type-Aliases-\_ExtractActionsFromSetupStore-Type-parameters}%

| Name |
| :------ |
| `SS` |

___

### \_ExtractActionsFromSetupStore\_Keys %{#Type-Aliases-\_ExtractActionsFromSetupStore\_Keys}%

Ƭ **\_ExtractActionsFromSetupStore\_Keys**<`SS`\>: keyof { [K in keyof SS as SS[K] extends \_Method ? K : never]: any }

Type that enables refactoring through IDE.
For internal use **only**

#### Type parameters %{#Type-Aliases-\_ExtractActionsFromSetupStore\_Keys-Type-parameters}%

| Name |
| :------ |
| `SS` |

___

### \_ExtractGettersFromSetupStore %{#Type-Aliases-\_ExtractGettersFromSetupStore}%

Ƭ **\_ExtractGettersFromSetupStore**<`SS`\>: `SS` extends `undefined` \| `void` ? {} : [`_ExtractGettersFromSetupStore_Keys`](pinia.md#_extractgettersfromsetupstore_keys)<`SS`\> extends keyof `SS` ? `Pick`<`SS`, [`_ExtractGettersFromSetupStore_Keys`](pinia.md#_extractgettersfromsetupstore_keys)<`SS`\>\> : `never`

For internal use **only**

#### Type parameters %{#Type-Aliases-\_ExtractGettersFromSetupStore-Type-parameters}%

| Name |
| :------ |
| `SS` |

___

### \_ExtractGettersFromSetupStore\_Keys %{#Type-Aliases-\_ExtractGettersFromSetupStore\_Keys}%

Ƭ **\_ExtractGettersFromSetupStore\_Keys**<`SS`\>: keyof { [K in keyof SS as SS[K] extends ComputedRef ? K : never]: any }

Type that enables refactoring through IDE.
For internal use **only**

#### Type parameters %{#Type-Aliases-\_ExtractGettersFromSetupStore\_Keys-Type-parameters}%

| Name |
| :------ |
| `SS` |

___

### \_ExtractStateFromSetupStore %{#Type-Aliases-\_ExtractStateFromSetupStore}%

Ƭ **\_ExtractStateFromSetupStore**<`SS`\>: `SS` extends `undefined` \| `void` ? {} : [`_ExtractStateFromSetupStore_Keys`](pinia.md#_extractstatefromsetupstore_keys)<`SS`\> extends keyof `SS` ? [`_UnwrapAll`](pinia.md#_unwrapall)<`Pick`<`SS`, [`_ExtractStateFromSetupStore_Keys`](pinia.md#_extractstatefromsetupstore_keys)<`SS`\>\>\> : `never`

For internal use **only**

#### Type parameters %{#Type-Aliases-\_ExtractStateFromSetupStore-Type-parameters}%

| Name |
| :------ |
| `SS` |

___

### \_ExtractStateFromSetupStore\_Keys %{#Type-Aliases-\_ExtractStateFromSetupStore\_Keys}%

Ƭ **\_ExtractStateFromSetupStore\_Keys**<`SS`\>: keyof { [K in keyof SS as SS[K] extends \_Method \| ComputedRef ? never : K]: any }

Type that enables refactoring through IDE.
For internal use **only**

#### Type parameters %{#Type-Aliases-\_ExtractStateFromSetupStore\_Keys-Type-parameters}%

| Name |
| :------ |
| `SS` |

___

### \_GettersTree %{#Type-Aliases-\_GettersTree}%

Ƭ **\_GettersTree**<`S`\>: `Record`<`string`, (`state`: `UnwrapRef`<`S`\> & `UnwrapRef`<[`PiniaCustomStateProperties`](../interfaces/pinia.PiniaCustomStateProperties.md)<`S`\>\>) => `any` \| () => `any`\>

Type of an object of Getters that infers the argument. For internal usage only.
For internal use **only**

#### Type parameters %{#Type-Aliases-\_GettersTree-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `S` | extends [`StateTree`](pinia.md#statetree) |

___

### \_MapActionsObjectReturn %{#Type-Aliases-\_MapActionsObjectReturn}%

Ƭ **\_MapActionsObjectReturn**<`A`, `T`\>: { [key in keyof T]: A[T[key]] }

For internal use **only**

#### Type parameters %{#Type-Aliases-\_MapActionsObjectReturn-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `A` | `A` |
| `T` | extends `Record`<`string`, keyof `A`\> |

___

### \_MapActionsReturn %{#Type-Aliases-\_MapActionsReturn}%

Ƭ **\_MapActionsReturn**<`A`\>: { [key in keyof A]: A[key] }

For internal use **only**

#### Type parameters %{#Type-Aliases-\_MapActionsReturn-Type-parameters}%

| Name |
| :------ |
| `A` |

___

### \_MapStateObjectReturn %{#Type-Aliases-\_MapStateObjectReturn}%

Ƭ **\_MapStateObjectReturn**<`Id`, `S`, `G`, `A`, `T`\>: { [key in keyof T]: Function }

For internal use **only**

#### Type parameters %{#Type-Aliases-\_MapStateObjectReturn-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `T` | extends `Record`<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](pinia.md#store)<`Id`, `S`, `G`, `A`\>) => `any`\> = {} |

___

### \_MapStateReturn %{#Type-Aliases-\_MapStateReturn}%

Ƭ **\_MapStateReturn**<`S`, `G`, `Keys`\>: { [key in Keys]: Function }

For internal use **only**

#### Type parameters %{#Type-Aliases-\_MapStateReturn-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `Keys` | extends keyof `S` \| keyof `G` = keyof `S` \| keyof `G` |

___

### \_MapWritableStateObjectReturn %{#Type-Aliases-\_MapWritableStateObjectReturn}%

Ƭ **\_MapWritableStateObjectReturn**<`S`, `T`\>: { [key in keyof T]: Object }

For internal use **only**

#### Type parameters %{#Type-Aliases-\_MapWritableStateObjectReturn-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `T` | extends `Record`<`string`, keyof `S`\> |

___

### \_MapWritableStateReturn %{#Type-Aliases-\_MapWritableStateReturn}%

Ƭ **\_MapWritableStateReturn**<`S`\>: { [key in keyof S]: Object }

For internal use **only**

#### Type parameters %{#Type-Aliases-\_MapWritableStateReturn-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `S` | extends [`StateTree`](pinia.md#statetree) |

___

### \_Method %{#Type-Aliases-\_Method}%

Ƭ **\_Method**: (...`args`: `any`[]) => `any`

#### Type declaration %{#Type-Aliases-\_Method-Type-declaration}%

▸ (`...args`): `any`

Generic type for a function that can infer arguments and return type

For internal use **only**

##### Parameters %{#Type-Aliases-\_Method-Type-declaration-Parameters}%

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns %{#Type-Aliases-\_Method-Type-declaration-Returns}%

`any`

___

### \_Spread %{#Type-Aliases-\_Spread}%

Ƭ **\_Spread**<`A`\>: `A` extends [infer L, ...(infer R)] ? [`_StoreObject`](pinia.md#_storeobject)<`L`\> & [`_Spread`](pinia.md#_spread)<`R`\> : `unknown`

For internal use **only**.

#### Type parameters %{#Type-Aliases-\_Spread-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `A` | extends readonly `any`[] |

___

### \_StoreObject %{#Type-Aliases-\_StoreObject}%

Ƭ **\_StoreObject**<`S`\>: `S` extends [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<infer Ids, infer State, infer Getters, infer Actions\> ? { [Id in \`${Ids}${MapStoresCustomization extends Record<"suffix", infer Suffix\> ? Suffix : "Store"}\`]: Function } : {}

For internal use **only**.

#### Type parameters %{#Type-Aliases-\_StoreObject-Type-parameters}%

| Name |
| :------ |
| `S` |

___

### \_StoreWithActions %{#Type-Aliases-\_StoreWithActions}%

Ƭ **\_StoreWithActions**<`A`\>: { [k in keyof A]: A[k] extends Function ? Function : never }

Store augmented for actions. For internal usage only.
For internal use **only**

#### Type parameters %{#Type-Aliases-\_StoreWithActions-Type-parameters}%

| Name |
| :------ |
| `A` |

___

### \_StoreWithGetters %{#Type-Aliases-\_StoreWithGetters}%

Ƭ **\_StoreWithGetters**<`G`\>: { readonly [k in keyof G]: G[k] extends Function ? R : UnwrapRef<G[k]\> }

Store augmented with getters. For internal usage only.
For internal use **only**

#### Type parameters %{#Type-Aliases-\_StoreWithGetters-Type-parameters}%

| Name |
| :------ |
| `G` |

___

### \_UnwrapAll %{#Type-Aliases-\_UnwrapAll}%

Ƭ **\_UnwrapAll**<`SS`\>: { [K in keyof SS]: UnwrapRef<SS[K]\> }

Type that enables refactoring through IDE.
For internal use **only**

#### Type parameters %{#Type-Aliases-\_UnwrapAll-Type-parameters}%

| Name |
| :------ |
| `SS` |

## Variables %{#Variables}%

### PiniaVuePlugin %{#Variables-PiniaVuePlugin}%

• `Const` **PiniaVuePlugin**: `Plugin`

Vue 2 Plugin that must be installed for pinia to work. Note **you don't need
this plugin if you are using Nuxt.js**. Use the `buildModule` instead:
https://pinia.vuejs.org/ssr/nuxt.html.

**`Example`**

```js
import Vue from 'vue'
import { PiniaVuePlugin, createPinia } from 'pinia'

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

new Vue({
  el: '#app',
  // ...
  pinia,
})
```

**`Param`**

`Vue` imported from 'vue'.

## Functions %{#Functions}%

### acceptHMRUpdate %{#Functions-acceptHMRUpdate}%

▸ **acceptHMRUpdate**(`initialUseStore`, `hot`): (`newModule`: `any`) => `any`

Creates an _accept_ function to pass to `import.meta.hot` in Vite applications.

**`Example`**

```js
const useUser = defineStore(...)
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot))
}
```

#### Parameters %{#Functions-acceptHMRUpdate-Parameters}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialUseStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree)\> | return of the defineStore to hot update |
| `hot` | `any` | `import.meta.hot` |

#### Returns %{#Functions-acceptHMRUpdate-Returns}%

`fn`

▸ (`newModule`): `any`

##### Parameters %{#Functions-acceptHMRUpdate-Returns-Parameters}%

| Name | Type |
| :------ | :------ |
| `newModule` | `any` |

##### Returns %{#Functions-acceptHMRUpdate-Returns-Returns}%

`any`

___

### createPinia %{#Functions-createPinia}%

▸ **createPinia**(): [`Pinia`](../interfaces/pinia.Pinia.md)

Creates a Pinia instance to be used by the application

#### Returns %{#Functions-createPinia-Returns}%

[`Pinia`](../interfaces/pinia.Pinia.md)

___

### defineStore %{#Functions-defineStore}%

▸ **defineStore**<`Id`, `S`, `G`, `A`\>(`id`, `options`): [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

Creates a `useStore` function that retrieves the store instance

#### Type parameters %{#Functions-defineStore-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) = {} |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> = {} |
| `A` | {} |

#### Parameters %{#Functions-defineStore-Parameters}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `Id` | id of the store (must be unique) |
| `options` | `Omit`<[`DefineStoreOptions`](../interfaces/pinia.DefineStoreOptions.md)<`Id`, `S`, `G`, `A`\>, ``"id"``\> | options to define the store |

#### Returns %{#Functions-defineStore-Returns}%

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

▸ **defineStore**<`Id`, `S`, `G`, `A`\>(`options`): [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

Creates a `useStore` function that retrieves the store instance

#### Type parameters %{#Functions-defineStore-Type-parameters_1}%

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) = {} |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> = {} |
| `A` | {} |

#### Parameters %{#Functions-defineStore-Parameters_1}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`DefineStoreOptions`](../interfaces/pinia.DefineStoreOptions.md)<`Id`, `S`, `G`, `A`\> | options to define the store |

#### Returns %{#Functions-defineStore-Returns_1}%

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

▸ **defineStore**<`Id`, `SS`\>(`id`, `storeSetup`, `options?`): [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, [`_ExtractStateFromSetupStore`](pinia.md#_extractstatefromsetupstore)<`SS`\>, [`_ExtractGettersFromSetupStore`](pinia.md#_extractgettersfromsetupstore)<`SS`\>, [`_ExtractActionsFromSetupStore`](pinia.md#_extractactionsfromsetupstore)<`SS`\>\>

Creates a `useStore` function that retrieves the store instance

#### Type parameters %{#Functions-defineStore-Type-parameters_2}%

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `SS` | `SS` |

#### Parameters %{#Functions-defineStore-Parameters_2}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `Id` | id of the store (must be unique) |
| `storeSetup` | () => `SS` | function that defines the store |
| `options?` | [`DefineSetupStoreOptions`](../interfaces/pinia.DefineSetupStoreOptions.md)<`Id`, [`_ExtractStateFromSetupStore`](pinia.md#_extractstatefromsetupstore)<`SS`\>, [`_ExtractGettersFromSetupStore`](pinia.md#_extractgettersfromsetupstore)<`SS`\>, [`_ExtractActionsFromSetupStore`](pinia.md#_extractactionsfromsetupstore)<`SS`\>\> | extra options |

#### Returns %{#Functions-defineStore-Returns_2}%

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, [`_ExtractStateFromSetupStore`](pinia.md#_extractstatefromsetupstore)<`SS`\>, [`_ExtractGettersFromSetupStore`](pinia.md#_extractgettersfromsetupstore)<`SS`\>, [`_ExtractActionsFromSetupStore`](pinia.md#_extractactionsfromsetupstore)<`SS`\>\>

___

### getActivePinia %{#Functions-getActivePinia}%

▸ **getActivePinia**(): `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

Get the currently active pinia if there is any.

#### Returns %{#Functions-getActivePinia-Returns}%

`undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

___

### mapActions %{#Functions-mapActions}%

▸ **mapActions**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapActionsObjectReturn`](pinia.md#_mapactionsobjectreturn)<`A`, `KeyMapper`\>

Allows directly using actions from your store without using the composition
API (`setup()`) by generating an object to be spread in the `methods` field
of a component. The values of the object are the actions while the keys are
the names of the resulting methods.

**`Example`**

```js
export default {
  methods: {
    // other methods properties
    // useCounterStore has two actions named `increment` and `setCount`
    ...mapActions(useCounterStore, { moar: 'increment', setIt: 'setCount' })
  },

  created() {
    this.moar()
    this.setIt(2)
  }
}
```

#### Type parameters %{#Functions-mapActions-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `KeyMapper` | extends `Record`<`string`, keyof `A`\> |

#### Parameters %{#Functions-mapActions-Parameters}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keyMapper` | `KeyMapper` | object to define new names for the actions |

#### Returns %{#Functions-mapActions-Returns}%

[`_MapActionsObjectReturn`](pinia.md#_mapactionsobjectreturn)<`A`, `KeyMapper`\>

▸ **mapActions**<`Id`, `S`, `G`, `A`\>(`useStore`, `keys`): [`_MapActionsReturn`](pinia.md#_mapactionsreturn)<`A`\>

Allows directly using actions from your store without using the composition
API (`setup()`) by generating an object to be spread in the `methods` field
of a component.

**`Example`**

```js
export default {
  methods: {
    // other methods properties
    ...mapActions(useCounterStore, ['increment', 'setCount'])
  },

  created() {
    this.increment()
    this.setCount(2) // pass arguments as usual
  }
}
```

#### Type parameters %{#Functions-mapActions-Type-parameters_1}%

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |

#### Parameters %{#Functions-mapActions-Parameters_1}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keys` | keyof `A`[] | array of action names to map |

#### Returns %{#Functions-mapActions-Returns_1}%

[`_MapActionsReturn`](pinia.md#_mapactionsreturn)<`A`\>

___

### mapGetters %{#Functions-mapGetters}%

▸ **mapGetters**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapStateObjectReturn`](pinia.md#_mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

Alias for `mapState()`. You should use `mapState()` instead.

**`Deprecated`**

use `mapState()` instead.

#### Type parameters %{#Functions-mapGetters-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `KeyMapper` | extends `Record`<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](pinia.md#store)<`Id`, `S`, `G`, `A`\>) => `any`\> |

#### Parameters %{#Functions-mapGetters-Parameters}%

| Name | Type |
| :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> |
| `keyMapper` | `KeyMapper` |

#### Returns %{#Functions-mapGetters-Returns}%

[`_MapStateObjectReturn`](pinia.md#_mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

▸ **mapGetters**<`Id`, `S`, `G`, `A`, `Keys`\>(`useStore`, `keys`): [`_MapStateReturn`](pinia.md#_mapstatereturn)<`S`, `G`, `Keys`\>

Alias for `mapState()`. You should use `mapState()` instead.

**`Deprecated`**

use `mapState()` instead.

#### Type parameters %{#Functions-mapGetters-Type-parameters_1}%

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `Keys` | extends `string` \| `number` \| `symbol` |

#### Parameters %{#Functions-mapGetters-Parameters_1}%

| Name | Type |
| :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> |
| `keys` | readonly `Keys`[] |

#### Returns %{#Functions-mapGetters-Returns_1}%

[`_MapStateReturn`](pinia.md#_mapstatereturn)<`S`, `G`, `Keys`\>

___

### mapState %{#Functions-mapState}%

▸ **mapState**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapStateObjectReturn`](pinia.md#_mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

Allows using state and getters from one store without using the composition
API (`setup()`) by generating an object to be spread in the `computed` field
of a component. The values of the object are the state properties/getters
while the keys are the names of the resulting computed properties.
Optionally, you can also pass a custom function that will receive the store
as its first argument. Note that while it has access to the component
instance via `this`, it won't be typed.

**`Example`**

```js
export default {
  computed: {
    // other computed properties
    // useCounterStore has a state property named `count` and a getter `double`
    ...mapState(useCounterStore, {
      n: 'count',
      triple: store => store.n * 3,
      // note we can't use an arrow function if we want to use `this`
      custom(store) {
        return this.someComponentValue + store.n
      },
      doubleN: 'double'
    })
  },

  created() {
    this.n // 2
    this.doubleN // 4
  }
}
```

#### Type parameters %{#Functions-mapState-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `KeyMapper` | extends `Record`<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](pinia.md#store)<`Id`, `S`, `G`, `A`\>) => `any`\> |

#### Parameters %{#Functions-mapState-Parameters}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keyMapper` | `KeyMapper` | object of state properties or getters |

#### Returns %{#Functions-mapState-Returns}%

[`_MapStateObjectReturn`](pinia.md#_mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

▸ **mapState**<`Id`, `S`, `G`, `A`, `Keys`\>(`useStore`, `keys`): [`_MapStateReturn`](pinia.md#_mapstatereturn)<`S`, `G`, `Keys`\>

Allows using state and getters from one store without using the composition
API (`setup()`) by generating an object to be spread in the `computed` field
of a component.

**`Example`**

```js
export default {
  computed: {
    // other computed properties
    ...mapState(useCounterStore, ['count', 'double'])
  },

  created() {
    this.count // 2
    this.double // 4
  }
}
```

#### Type parameters %{#Functions-mapState-Type-parameters_1}%

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `Keys` | extends `string` \| `number` \| `symbol` |

#### Parameters %{#Functions-mapState-Parameters_1}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keys` | readonly `Keys`[] | array of state properties or getters |

#### Returns %{#Functions-mapState-Returns_1}%

[`_MapStateReturn`](pinia.md#_mapstatereturn)<`S`, `G`, `Keys`\>

___

### mapStores %{#Functions-mapStores}%

▸ **mapStores**<`Stores`\>(`...stores`): [`_Spread`](pinia.md#_spread)<`Stores`\>

Allows using stores without the composition API (`setup()`) by generating an
object to be spread in the `computed` field of a component. It accepts a list
of store definitions.

**`Example`**

```js
export default {
  computed: {
    // other computed properties
    ...mapStores(useUserStore, useCartStore)
  },

  created() {
    this.userStore // store with id "user"
    this.cartStore // store with id "cart"
  }
}
```

#### Type parameters %{#Functions-mapStores-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `Stores` | extends `any`[] |

#### Parameters %{#Functions-mapStores-Parameters}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `...stores` | [...Stores[]] | list of stores to map to an object |

#### Returns %{#Functions-mapStores-Returns}%

[`_Spread`](pinia.md#_spread)<`Stores`\>

___

### mapWritableState %{#Functions-mapWritableState}%

▸ **mapWritableState**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapWritableStateObjectReturn`](pinia.md#_mapwritablestateobjectreturn)<`S`, `KeyMapper`\>

Same as `mapState()` but creates computed setters as well so the state can be
modified. Differently from `mapState()`, only `state` properties can be
added.

#### Type parameters %{#Functions-mapWritableState-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `KeyMapper` | extends `Record`<`string`, keyof `S`\> |

#### Parameters %{#Functions-mapWritableState-Parameters}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keyMapper` | `KeyMapper` | object of state properties |

#### Returns %{#Functions-mapWritableState-Returns}%

[`_MapWritableStateObjectReturn`](pinia.md#_mapwritablestateobjectreturn)<`S`, `KeyMapper`\>

▸ **mapWritableState**<`Id`, `S`, `G`, `A`, `Keys`\>(`useStore`, `keys`): { [K in Keys]: Object }

Allows using state and getters from one store without using the composition
API (`setup()`) by generating an object to be spread in the `computed` field
of a component.

#### Type parameters %{#Functions-mapWritableState-Type-parameters_1}%

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `Keys` | extends `string` \| `number` \| `symbol` |

#### Parameters %{#Functions-mapWritableState-Parameters_1}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keys` | readonly `Keys`[] | array of state properties |

#### Returns %{#Functions-mapWritableState-Returns_1}%

{ [K in Keys]: Object }

___

### setActivePinia %{#Functions-setActivePinia}%

▸ **setActivePinia**(`pinia`): `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

Sets or unsets the active pinia. Used in SSR and internally when calling
actions and getters

#### Parameters %{#Functions-setActivePinia-Parameters}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `pinia` | `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md) | Pinia instance |

#### Returns %{#Functions-setActivePinia-Returns}%

`undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

___

### setMapStoreSuffix %{#Functions-setMapStoreSuffix}%

▸ **setMapStoreSuffix**(`suffix`): `void`

Changes the suffix added by `mapStores()`. Can be set to an empty string.
Defaults to `"Store"`. Make sure to extend the MapStoresCustomization
interface if you are using TypeScript.

#### Parameters %{#Functions-setMapStoreSuffix-Parameters}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `suffix` | `string` | new suffix |

#### Returns %{#Functions-setMapStoreSuffix-Returns}%

`void`

___

### skipHydrate %{#Functions-skipHydrate}%

▸ **skipHydrate**<`T`\>(`obj`): `T`

Tells Pinia to skip the hydration process of a given object. This is useful in setup stores (only) when you return a
stateful object in the store but it isn't really state. e.g. returning a router instance in a setup store.

#### Type parameters %{#Functions-skipHydrate-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters %{#Functions-skipHydrate-Parameters}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `obj` | `T` | target object |

#### Returns %{#Functions-skipHydrate-Returns}%

`T`

obj

___

### storeToRefs %{#Functions-storeToRefs}%

▸ **storeToRefs**<`SS`\>(`store`): `StoreToRefs`<`SS`\>

Creates an object of references with all the state, getters, and plugin-added
state properties of the store. Similar to `toRefs()` but specifically
designed for Pinia stores so methods and non reactive properties are
completely ignored.

#### Type parameters %{#Functions-storeToRefs-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `SS` | extends [`_StoreWithState`](../interfaces/pinia._StoreWithState.md)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree), `SS`\> & [`StateTree`](pinia.md#statetree) & [`_StoreWithGetters`](pinia.md#_storewithgetters)<[`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>\> & [`PiniaCustomProperties`](../interfaces/pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree), `SS`\> & [`PiniaCustomStateProperties`](../interfaces/pinia.PiniaCustomStateProperties.md)<[`StateTree`](pinia.md#statetree), `SS`\> |

#### Parameters %{#Functions-storeToRefs-Parameters}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `store` | `SS` | store to extract the refs from |

#### Returns %{#Functions-storeToRefs-Returns}%

`StoreToRefs`<`SS`\>
