---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / pinia

# Module: pinia

## Enumerations

- [MutationType](../enums/pinia.MutationType.md)

## Interfaces

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

## Type aliases

### PiniaStorePlugin

Ƭ **PiniaStorePlugin**: [`PiniaPlugin`](../interfaces/pinia.PiniaPlugin.md)

Plugin to extend every store.

**`deprecated`** use PiniaPlugin instead

#### Defined in

[packages/pinia/src/rootStore.ts:149](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/rootStore.ts#L149)

___

### StateTree

Ƭ **StateTree**: `Record`<`string` \| `number` \| `symbol`, `any`\>

Generic state of a Store

#### Defined in

[packages/pinia/src/types.ts:13](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L13)

___

### Store

Ƭ **Store**<`Id`, `S`, `G`, `A`\>: [`_StoreWithState`](../interfaces/pinia._StoreWithState.md)<`Id`, `S`, `G`, `A`\> & `UnwrapRef`<`S`\> & [`_StoreWithGetters`](pinia.md#_storewithgetters)<`G`\> & [`_ActionsTree`](pinia.md#_actionstree) extends `A` ? {} : `A` & [`PiniaCustomProperties`](../interfaces/pinia.PiniaCustomProperties.md)<`Id`, `S`, `G`, `A`\> & `PiniaCustomStateProperties`<`S`\>

Store type to build a store.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) = {} |
| `G` | {} |
| `A` | {} |

#### Defined in

[packages/pinia/src/types.ts:470](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L470)

___

### StoreActions

Ƭ **StoreActions**<`SS`\>: `SS` extends [`Store`](pinia.md#store)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, infer A\> ? `A` : [`_ExtractActionsFromSetupStore`](pinia.md#_extractactionsfromsetupstore)<`SS`\>

Extract the actions of a store type. Works with both a Setup Store or an
Options Store.

#### Type parameters

| Name |
| :------ |
| `SS` |

#### Defined in

[packages/pinia/src/store.ts:729](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/store.ts#L729)

___

### StoreGeneric

Ƭ **StoreGeneric**: [`Store`](pinia.md#store)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree)\>

Generic and type-unsafe version of Store. Doesn't fail on access with
strings, making it much easier to write generic functions that do not care
about the kind of store that is passed.

#### Defined in

[packages/pinia/src/types.ts:489](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L489)

___

### StoreGetters

Ƭ **StoreGetters**<`SS`\>: `SS` extends [`Store`](pinia.md#store)<`string`, [`StateTree`](pinia.md#statetree), infer G, [`_ActionsTree`](pinia.md#_actionstree)\> ? [`_StoreWithGetters`](pinia.md#_storewithgetters)<`G`\> : [`_ExtractGettersFromSetupStore`](pinia.md#_extractgettersfromsetupstore)<`SS`\>

Extract the getters of a store type. Works with both a Setup Store or an
Options Store.

#### Type parameters

| Name |
| :------ |
| `SS` |

#### Defined in

[packages/pinia/src/store.ts:742](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/store.ts#L742)

___

### StoreOnActionListener

Ƭ **StoreOnActionListener**<`Id`, `S`, `G`, `A`\>: (`context`: [`StoreOnActionListenerContext`](pinia.md#storeonactionlistenercontext)<`Id`, `S`, `G`, {} extends `A` ? [`_ActionsTree`](pinia.md#_actionstree) : `A`\>) => `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | `G` |
| `A` | `A` |

#### Type declaration

▸ (`context`): `void`

Argument of `store.$onAction()`

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`StoreOnActionListenerContext`](pinia.md#storeonactionlistenercontext)<`Id`, `S`, `G`, {} extends `A` ? [`_ActionsTree`](pinia.md#_actionstree) : `A`\> |

##### Returns

`void`

#### Defined in

[packages/pinia/src/types.ts:243](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L243)

___

### StoreOnActionListenerContext

Ƭ **StoreOnActionListenerContext**<`Id`, `S`, `G`, `A`\>: [`_ActionsTree`](pinia.md#_actionstree) extends `A` ? [`_StoreOnActionListenerContext`](../interfaces/pinia._StoreOnActionListenerContext.md)<[`StoreGeneric`](pinia.md#storegeneric), `string`, [`_ActionsTree`](pinia.md#_actionstree)\> : { [Name in keyof A]: Name extends string ? \_StoreOnActionListenerContext<Store<Id, S, G, A\>, Name, A\> : never }[keyof `A`]

Context object passed to callbacks of `store.$onAction(context => {})`
TODO: should have only the Id, the Store and Actions to generate the proper object

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | `G` |
| `A` | `A` |

#### Defined in

[packages/pinia/src/types.ts:227](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L227)

___

### StoreState

Ƭ **StoreState**<`SS`\>: `SS` extends [`Store`](pinia.md#store)<`string`, infer S, [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree)\> ? `UnwrapRef`<`S`\> : [`_ExtractStateFromSetupStore`](pinia.md#_extractstatefromsetupstore)<`SS`\>

Extract the state of a store type. Works with both a Setup Store or an
Options Store. Note this unwraps refs.

#### Type parameters

| Name |
| :------ |
| `SS` |

#### Defined in

[packages/pinia/src/store.ts:755](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/store.ts#L755)

___

### SubscriptionCallback

Ƭ **SubscriptionCallback**<`S`\>: (`mutation`: [`SubscriptionCallbackMutation`](pinia.md#subscriptioncallbackmutation)<`S`\>, `state`: `UnwrapRef`<`S`\>) => `void`

#### Type parameters

| Name |
| :------ |
| `S` |

#### Type declaration

▸ (`mutation`, `state`): `void`

Callback of a subscription

##### Parameters

| Name | Type |
| :------ | :------ |
| `mutation` | [`SubscriptionCallbackMutation`](pinia.md#subscriptioncallbackmutation)<`S`\> |
| `state` | `UnwrapRef`<`S`\> |

##### Returns

`void`

#### Defined in

[packages/pinia/src/types.ts:148](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L148)

___

### SubscriptionCallbackMutation

Ƭ **SubscriptionCallbackMutation**<`S`\>: [`SubscriptionCallbackMutationDirect`](../interfaces/pinia.SubscriptionCallbackMutationDirect.md) \| [`SubscriptionCallbackMutationPatchObject`](../interfaces/pinia.SubscriptionCallbackMutationPatchObject.md)<`S`\> \| [`SubscriptionCallbackMutationPatchFunction`](../interfaces/pinia.SubscriptionCallbackMutationPatchFunction.md)

Context object passed to a subscription callback.

#### Type parameters

| Name |
| :------ |
| `S` |

#### Defined in

[packages/pinia/src/types.ts:140](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L140)

___

### \_ActionsTree

Ƭ **\_ActionsTree**: `Record`<`string`, [`_Method`](pinia.md#_method)\>

Type of an object of Actions. For internal usage only.
For internal use **only**

#### Defined in

[packages/pinia/src/types.ts:555](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L555)

___

### \_Awaited

Ƭ **\_Awaited**<`T`\>: `T` extends ``null`` \| `undefined` ? `T` : `T` extends `object` & { `then`: (`onfulfilled`: `F`) => `any`  } ? `F` extends (`value`: infer V, ...`args`: `any`) => `any` ? [`_Awaited`](pinia.md#_awaited)<`V`\> : `never` : `T`

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[packages/pinia/src/types.ts:164](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L164)

___

### \_DeepPartial

Ƭ **\_DeepPartial**<`T`\>: { [K in keyof T]?: \_DeepPartial<T[K]\> }

Recursive `Partial<T>`. Used by {@link Store.$patch}.

For internal use **only**

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[packages/pinia/src/types.ts:35](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L35)

___

### \_ExtractActionsFromSetupStore

Ƭ **\_ExtractActionsFromSetupStore**<`SS`\>: `SS` extends `undefined` \| `void` ? {} : [`_ExtractActionsFromSetupStore_Keys`](pinia.md#_extractactionsfromsetupstore_keys)<`SS`\> extends keyof `SS` ? `Pick`<`SS`, [`_ExtractActionsFromSetupStore_Keys`](pinia.md#_extractactionsfromsetupstore_keys)<`SS`\>\> : `never`

For internal use **only**

#### Type parameters

| Name |
| :------ |
| `SS` |

#### Defined in

[packages/pinia/src/types.ts:599](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L599)

___

### \_ExtractActionsFromSetupStore\_Keys

Ƭ **\_ExtractActionsFromSetupStore\_Keys**<`SS`\>: keyof { [K in keyof SS as SS[K] extends \_Method ? K : never]: any }

Type that enables refactoring through IDE.
For internal use **only**

#### Type parameters

| Name |
| :------ |
| `SS` |

#### Defined in

[packages/pinia/src/types.ts:569](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L569)

___

### \_ExtractGettersFromSetupStore

Ƭ **\_ExtractGettersFromSetupStore**<`SS`\>: `SS` extends `undefined` \| `void` ? {} : [`_ExtractGettersFromSetupStore_Keys`](pinia.md#_extractgettersfromsetupstore_keys)<`SS`\> extends keyof `SS` ? [`_UnwrapAll`](pinia.md#_unwrapall)<`Pick`<`SS`, [`_ExtractGettersFromSetupStore_Keys`](pinia.md#_extractgettersfromsetupstore_keys)<`SS`\>\>\> : `never`

For internal use **only**

#### Type parameters

| Name |
| :------ |
| `SS` |

#### Defined in

[packages/pinia/src/types.ts:608](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L608)

___

### \_ExtractGettersFromSetupStore\_Keys

Ƭ **\_ExtractGettersFromSetupStore\_Keys**<`SS`\>: keyof { [K in keyof SS as SS[K] extends ComputedRef ? K : never]: any }

Type that enables refactoring through IDE.
For internal use **only**

#### Type parameters

| Name |
| :------ |
| `SS` |

#### Defined in

[packages/pinia/src/types.ts:577](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L577)

___

### \_ExtractStateFromSetupStore

Ƭ **\_ExtractStateFromSetupStore**<`SS`\>: `SS` extends `undefined` \| `void` ? {} : [`_ExtractStateFromSetupStore_Keys`](pinia.md#_extractstatefromsetupstore_keys)<`SS`\> extends keyof `SS` ? [`_UnwrapAll`](pinia.md#_unwrapall)<`Pick`<`SS`, [`_ExtractStateFromSetupStore_Keys`](pinia.md#_extractstatefromsetupstore_keys)<`SS`\>\>\> : `never`

For internal use **only**

#### Type parameters

| Name |
| :------ |
| `SS` |

#### Defined in

[packages/pinia/src/types.ts:590](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L590)

___

### \_ExtractStateFromSetupStore\_Keys

Ƭ **\_ExtractStateFromSetupStore\_Keys**<`SS`\>: keyof { [K in keyof SS as SS[K] extends \_Method \| ComputedRef ? never : K]: any }

Type that enables refactoring through IDE.
For internal use **only**

#### Type parameters

| Name |
| :------ |
| `SS` |

#### Defined in

[packages/pinia/src/types.ts:561](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L561)

___

### \_GettersTree

Ƭ **\_GettersTree**<`S`\>: `Record`<`string`, (`state`: `UnwrapRef`<`S`\> & `UnwrapRef`<`PiniaCustomStateProperties`<`S`\>\>) => `any` \| () => `any`\>

Type of an object of Getters that infers the argument. For internal usage only.
For internal use **only**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`StateTree`](pinia.md#statetree) |

#### Defined in

[packages/pinia/src/types.ts:545](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L545)

___

### \_MapActionsObjectReturn

Ƭ **\_MapActionsObjectReturn**<`A`, `T`\>: { [key in keyof T]: A[T[key]] }

For internal use **only**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | `A` |
| `T` | extends `Record`<`string`, keyof `A`\> |

#### Defined in

[packages/pinia/src/mapHelpers.ts:297](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/mapHelpers.ts#L297)

___

### \_MapActionsReturn

Ƭ **\_MapActionsReturn**<`A`\>: { [key in keyof A]: A[key] }

For internal use **only**

#### Type parameters

| Name |
| :------ |
| `A` |

#### Defined in

[packages/pinia/src/mapHelpers.ts:290](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/mapHelpers.ts#L290)

___

### \_MapStateObjectReturn

Ƭ **\_MapStateObjectReturn**<`Id`, `S`, `G`, `A`, `T`\>: { [key in keyof T]: Function }

For internal use **only**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `T` | extends `Record`<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](pinia.md#store)<`Id`, `S`, `G`, `A`\>) => `any`\> = {} |

#### Defined in

[packages/pinia/src/mapHelpers.ts:141](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/mapHelpers.ts#L141)

___

### \_MapStateReturn

Ƭ **\_MapStateReturn**<`S`, `G`, `Keys`\>: { [key in Keys]: Function }

For internal use **only**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `Keys` | extends keyof `S` \| keyof `G` = keyof `S` \| keyof `G` |

#### Defined in

[packages/pinia/src/mapHelpers.ts:125](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/mapHelpers.ts#L125)

___

### \_MapWritableStateObjectReturn

Ƭ **\_MapWritableStateObjectReturn**<`S`, `T`\>: { [key in keyof T]: Object }

For internal use **only**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `T` | extends `Record`<`string`, keyof `S`\> |

#### Defined in

[packages/pinia/src/mapHelpers.ts:422](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/mapHelpers.ts#L422)

___

### \_MapWritableStateReturn

Ƭ **\_MapWritableStateReturn**<`S`\>: { [key in keyof S]: Object }

For internal use **only**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`StateTree`](pinia.md#statetree) |

#### Defined in

[packages/pinia/src/mapHelpers.ts:412](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/mapHelpers.ts#L412)

___

### \_Method

Ƭ **\_Method**: (...`args`: `any`[]) => `any`

#### Type declaration

▸ (...`args`): `any`

Generic type for a function that can infer arguments and return type

For internal use **only**

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns

`any`

#### Defined in

[packages/pinia/src/types.ts:439](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L439)

___

### \_Spread

Ƭ **\_Spread**<`A`\>: `A` extends [infer L, ...infer R] ? [`_StoreObject`](pinia.md#_storeobject)<`L`\> & [`_Spread`](pinia.md#_spread)<`R`\> : `unknown`

For internal use **only**.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends readonly `any`[] |

#### Defined in

[packages/pinia/src/mapHelpers.ts:53](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/mapHelpers.ts#L53)

___

### \_StoreObject

Ƭ **\_StoreObject**<`S`\>: `S` extends [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<infer Ids, infer State, infer Getters, infer Actions\> ? { [Id in \`${Ids}${MapStoresCustomization extends Record<"suffix", string\> ? MapStoresCustomization["suffix"] : "Store"}\`]: Function } : {}

For internal use **only**.

#### Type parameters

| Name |
| :------ |
| `S` |

#### Defined in

[packages/pinia/src/mapHelpers.ts:25](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/mapHelpers.ts#L25)

___

### \_StoreWithActions

Ƭ **\_StoreWithActions**<`A`\>: { [k in keyof A]: A[k] extends Function ? Function : never }

Store augmented for actions. For internal usage only.
For internal use **only**

#### Type parameters

| Name |
| :------ |
| `A` |

#### Defined in

[packages/pinia/src/types.ts:451](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L451)

___

### \_StoreWithGetters

Ƭ **\_StoreWithGetters**<`G`\>: { readonly [k in keyof G]: G[k] extends Function ? R : UnwrapRef<G[k]\> }

Store augmented with getters. For internal usage only.
For internal use **only**

#### Type parameters

| Name |
| :------ |
| `G` |

#### Defined in

[packages/pinia/src/types.ts:461](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L461)

___

### \_UnwrapAll

Ƭ **\_UnwrapAll**<`SS`\>: { [K in keyof SS]: UnwrapRef<SS[K]\> }

Type that enables refactoring through IDE.
For internal use **only**

#### Type parameters

| Name |
| :------ |
| `SS` |

#### Defined in

[packages/pinia/src/types.ts:585](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/types.ts#L585)

## Variables

### PiniaVuePlugin

• `Const` **PiniaVuePlugin**: `Plugin`

Vue 2 Plugin that must be installed for pinia to work. Note **you don't need
this plugin if you are using Nuxt.js**. Use the `buildModule` instead:
https://pinia.vuejs.org/ssr/nuxt.html.

**`example`**
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

**`param`** `Vue` imported from 'vue'.

#### Defined in

[packages/pinia/src/vue2-plugin.ts:28](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/vue2-plugin.ts#L28)

## Functions

### acceptHMRUpdate

▸ **acceptHMRUpdate**(`initialUseStore`, `hot`): (`newModule`: `any`) => `any`

Creates an _accept_ function to pass to `import.meta.hot` in Vite applications.

**`example`**
```js
const useUser = defineStore(...)
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot))
}
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialUseStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree)\> | return of the defineStore to hot update |
| `hot` | `any` | `import.meta.hot` |

#### Returns

`fn`

▸ (`newModule`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `newModule` | `any` |

##### Returns

`any`

#### Defined in

[packages/pinia/src/hmr.ts:73](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/hmr.ts#L73)

___

### createPinia

▸ **createPinia**(): [`Pinia`](../interfaces/pinia.Pinia.md)

Creates a Pinia instance to be used by the application

#### Returns

[`Pinia`](../interfaces/pinia.Pinia.md)

#### Defined in

[packages/pinia/src/createPinia.ts:10](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/createPinia.ts#L10)

___

### defineStore

▸ **defineStore**<`Id`, `S`, `G`, `A`\>(`id`, `options`): [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

Creates a `useStore` function that retrieves the store instance

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) = {} |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> = {} |
| `A` | {} |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `Id` | id of the store (must be unique) |
| `options` | `Omit`<[`DefineStoreOptions`](../interfaces/pinia.DefineStoreOptions.md)<`Id`, `S`, `G`, `A`\>, ``"id"``\> | options to define the store |

#### Returns

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

#### Defined in

[packages/pinia/src/store.ts:778](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/store.ts#L778)

▸ **defineStore**<`Id`, `S`, `G`, `A`\>(`options`): [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

Creates a `useStore` function that retrieves the store instance

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) = {} |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> = {} |
| `A` | {} |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`DefineStoreOptions`](../interfaces/pinia.DefineStoreOptions.md)<`Id`, `S`, `G`, `A`\> | options to define the store |

#### Returns

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

#### Defined in

[packages/pinia/src/store.ts:794](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/store.ts#L794)

▸ **defineStore**<`Id`, `SS`\>(`id`, `storeSetup`, `options?`): [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, [`_ExtractStateFromSetupStore`](pinia.md#_extractstatefromsetupstore)<`SS`\>, [`_ExtractGettersFromSetupStore`](pinia.md#_extractgettersfromsetupstore)<`SS`\>, [`_ExtractActionsFromSetupStore`](pinia.md#_extractactionsfromsetupstore)<`SS`\>\>

Creates a `useStore` function that retrieves the store instance

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `SS` | `SS` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `Id` | id of the store (must be unique) |
| `storeSetup` | () => `SS` | function that defines the store |
| `options?` | [`DefineSetupStoreOptions`](../interfaces/pinia.DefineSetupStoreOptions.md)<`Id`, [`_ExtractStateFromSetupStore`](pinia.md#_extractstatefromsetupstore)<`SS`\>, [`_ExtractGettersFromSetupStore`](pinia.md#_extractgettersfromsetupstore)<`SS`\>, [`_ExtractActionsFromSetupStore`](pinia.md#_extractactionsfromsetupstore)<`SS`\>\> | extra options |

#### Returns

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, [`_ExtractStateFromSetupStore`](pinia.md#_extractstatefromsetupstore)<`SS`\>, [`_ExtractGettersFromSetupStore`](pinia.md#_extractgettersfromsetupstore)<`SS`\>, [`_ExtractActionsFromSetupStore`](pinia.md#_extractactionsfromsetupstore)<`SS`\>\>

#### Defined in

[packages/pinia/src/store.ts:809](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/store.ts#L809)

___

### getActivePinia

▸ **getActivePinia**(): `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

Get the currently active pinia if there is any.

#### Returns

`undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

#### Defined in

[packages/pinia/src/rootStore.ts:39](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/rootStore.ts#L39)

___

### mapActions

▸ **mapActions**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapActionsObjectReturn`](pinia.md#_mapactionsobjectreturn)<`A`, `KeyMapper`\>

Allows directly using actions from your store without using the composition
API (`setup()`) by generating an object to be spread in the `methods` field
of a component. The values of the object are the actions while the keys are
the names of the resulting methods.

**`example`**
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

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `KeyMapper` | extends `Record`<`string`, keyof `A`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keyMapper` | `KeyMapper` | object to define new names for the actions |

#### Returns

[`_MapActionsObjectReturn`](pinia.md#_mapactionsobjectreturn)<`A`, `KeyMapper`\>

#### Defined in

[packages/pinia/src/mapHelpers.ts:326](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/mapHelpers.ts#L326)

▸ **mapActions**<`Id`, `S`, `G`, `A`\>(`useStore`, `keys`): [`_MapActionsReturn`](pinia.md#_mapactionsreturn)<`A`\>

Allows directly using actions from your store without using the composition
API (`setup()`) by generating an object to be spread in the `methods` field
of a component.

**`example`**
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

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keys` | keyof `A`[] | array of action names to map |

#### Returns

[`_MapActionsReturn`](pinia.md#_mapactionsreturn)<`A`\>

#### Defined in

[packages/pinia/src/mapHelpers.ts:359](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/mapHelpers.ts#L359)

___

### mapGetters

▸ **mapGetters**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapStateObjectReturn`](pinia.md#_mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

Alias for `mapState()`. You should use `mapState()` instead.

**`deprecated`** use `mapState()` instead.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `KeyMapper` | extends `Record`<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](pinia.md#store)<`Id`, `S`, `G`, `A`\>) => `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> |
| `keyMapper` | `KeyMapper` |

#### Returns

[`_MapStateObjectReturn`](pinia.md#_mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

#### Defined in

[packages/pinia/src/mapHelpers.ts:285](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/mapHelpers.ts#L285)

▸ **mapGetters**<`Id`, `S`, `G`, `A`, `Keys`\>(`useStore`, `keys`): [`_MapStateReturn`](pinia.md#_mapstatereturn)<`S`, `G`, `Keys`\>

Alias for `mapState()`. You should use `mapState()` instead.

**`deprecated`** use `mapState()` instead.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `Keys` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> |
| `keys` | readonly `Keys`[] |

#### Returns

[`_MapStateReturn`](pinia.md#_mapstatereturn)<`S`, `G`, `Keys`\>

#### Defined in

[packages/pinia/src/mapHelpers.ts:285](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/mapHelpers.ts#L285)

___

### mapState

▸ **mapState**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapStateObjectReturn`](pinia.md#_mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

Allows using state and getters from one store without using the composition
API (`setup()`) by generating an object to be spread in the `computed` field
of a component. The values of the object are the state properties/getters
while the keys are the names of the resulting computed properties.
Optionally, you can also pass a custom function that will receive the store
as its first argument. Note that while it has access to the component
instance via `this`, it won't be typed.

**`example`**
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

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `KeyMapper` | extends `Record`<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](pinia.md#store)<`Id`, `S`, `G`, `A`\>) => `any`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keyMapper` | `KeyMapper` | object of state properties or getters |

#### Returns

[`_MapStateObjectReturn`](pinia.md#_mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

#### Defined in

[packages/pinia/src/mapHelpers.ts:194](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/mapHelpers.ts#L194)

▸ **mapState**<`Id`, `S`, `G`, `A`, `Keys`\>(`useStore`, `keys`): [`_MapStateReturn`](pinia.md#_mapstatereturn)<`S`, `G`, `Keys`\>

Allows using state and getters from one store without using the composition
API (`setup()`) by generating an object to be spread in the `computed` field
of a component.

**`example`**
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

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `Keys` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keys` | readonly `Keys`[] | array of state properties or getters |

#### Returns

[`_MapStateReturn`](pinia.md#_mapstatereturn)<`S`, `G`, `Keys`\>

#### Defined in

[packages/pinia/src/mapHelpers.ts:231](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/mapHelpers.ts#L231)

___

### mapStores

▸ **mapStores**<`Stores`\>(...`stores`): [`_Spread`](pinia.md#_spread)<`Stores`\>

Allows using stores without the composition API (`setup()`) by generating an
object to be spread in the `computed` field of a component. It accepts a list
of store definitions.

**`example`**
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

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Stores` | extends `any`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...stores` | [...Stores[]] | list of stores to map to an object |

#### Returns

[`_Spread`](pinia.md#_spread)<`Stores`\>

#### Defined in

[packages/pinia/src/mapHelpers.ts:96](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/mapHelpers.ts#L96)

___

### mapWritableState

▸ **mapWritableState**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapWritableStateObjectReturn`](pinia.md#_mapwritablestateobjectreturn)<`S`, `KeyMapper`\>

Same as `mapState()` but creates computed setters as well so the state can be
modified. Differently from `mapState()`, only `state` properties can be
added.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `KeyMapper` | extends `Record`<`string`, keyof `S`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keyMapper` | `KeyMapper` | object of state properties |

#### Returns

[`_MapWritableStateObjectReturn`](pinia.md#_mapwritablestateobjectreturn)<`S`, `KeyMapper`\>

#### Defined in

[packages/pinia/src/mapHelpers.ts:440](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/mapHelpers.ts#L440)

▸ **mapWritableState**<`Id`, `S`, `G`, `A`\>(`useStore`, `keys`): [`_MapWritableStateReturn`](pinia.md#_mapwritablestatereturn)<`S`\>

Allows using state and getters from one store without using the composition
API (`setup()`) by generating an object to be spread in the `computed` field
of a component.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keys` | keyof `S`[] | array of state properties |

#### Returns

[`_MapWritableStateReturn`](pinia.md#_mapwritablestatereturn)<`S`\>

#### Defined in

[packages/pinia/src/mapHelpers.ts:458](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/mapHelpers.ts#L458)

___

### setActivePinia

▸ **setActivePinia**(`pinia`): `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

Sets or unsets the active pinia. Used in SSR and internally when calling
actions and getters

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pinia` | `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md) | Pinia instance |

#### Returns

`undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

#### Defined in

[packages/pinia/src/rootStore.ts:33](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/rootStore.ts#L33)

___

### setMapStoreSuffix

▸ **setMapStoreSuffix**(`suffix`): `void`

Changes the suffix added by `mapStores()`. Can be set to an empty string.
Defaults to `"Store"`. Make sure to extend the MapStoresCustomization
interface if you need are using TypeScript.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `suffix` | `string` | new suffix |

#### Returns

`void`

#### Defined in

[packages/pinia/src/mapHelpers.ts:66](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/mapHelpers.ts#L66)

___

### skipHydrate

▸ **skipHydrate**<`T`\>(`obj`): `T`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `T` |

#### Returns

`T`

#### Defined in

[packages/pinia/src/store.ts:87](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/store.ts#L87)

___

### storeToRefs

▸ **storeToRefs**<`SS`\>(`store`): `ToRefs`<[`StoreState`](pinia.md#storestate)<`SS`\> & [`StoreGetters`](pinia.md#storegetters)<`SS`\> & [`PiniaCustomStateProperties`](../interfaces/pinia.PiniaCustomStateProperties.md)<[`StoreState`](pinia.md#storestate)<`SS`\>\>\>

Creates an object of references with all the state, getters, and plugin-added
state properties of the store. Similar to `toRefs()` but specifically
designed for Pinia stores so methods and non reactive properties are
completely ignored.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `SS` | extends [`_StoreWithState`](../interfaces/pinia._StoreWithState.md)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree), `SS`\> & {} & [`_StoreWithGetters`](pinia.md#_storewithgetters)<[`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>\> & [`PiniaCustomProperties`](../interfaces/pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree), `SS`\> & `PiniaCustomStateProperties`<[`StateTree`](pinia.md#statetree), `SS`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `store` | `SS` | store to extract the refs from |

#### Returns

`ToRefs`<[`StoreState`](pinia.md#storestate)<`SS`\> & [`StoreGetters`](pinia.md#storegetters)<`SS`\> & [`PiniaCustomStateProperties`](../interfaces/pinia.PiniaCustomStateProperties.md)<[`StoreState`](pinia.md#storestate)<`SS`\>\>\>

#### Defined in

[packages/pinia/src/storeToRefs.ts:21](https://github.com/vuejs/pinia/blob/2b998ee/packages/pinia/src/storeToRefs.ts#L21)
