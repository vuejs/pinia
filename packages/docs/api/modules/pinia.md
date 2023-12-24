---
editLink: false
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
- [SetupStoreDefinition](../interfaces/pinia.SetupStoreDefinition.md)
- [StoreDefinition](../interfaces/pinia.StoreDefinition.md)
- [StoreProperties](../interfaces/pinia.StoreProperties.md)
- [SubscriptionCallbackMutationDirect](../interfaces/pinia.SubscriptionCallbackMutationDirect.md)
- [SubscriptionCallbackMutationPatchFunction](../interfaces/pinia.SubscriptionCallbackMutationPatchFunction.md)
- [SubscriptionCallbackMutationPatchObject](../interfaces/pinia.SubscriptionCallbackMutationPatchObject.md)
- [\_StoreOnActionListenerContext](../interfaces/pinia._StoreOnActionListenerContext.md)
- [\_StoreWithState](../interfaces/pinia._StoreWithState.md)
- [\_SubscriptionCallbackMutationBase](../interfaces/pinia._SubscriptionCallbackMutationBase.md)

## Type Aliases

### PiniaStorePlugin

Ƭ **PiniaStorePlugin**: [`PiniaPlugin`](../interfaces/pinia.PiniaPlugin.md)

Plugin to extend every store.

**`Deprecated`**

use PiniaPlugin instead

___

### StateTree

Ƭ **StateTree**: `Record`\<`string` \| `number` \| `symbol`, `any`\>

Generic state of a Store

___

### Store

Ƭ **Store**\<`Id`, `S`, `G`, `A`\>: [`_StoreWithState`](../interfaces/pinia._StoreWithState.md)\<`Id`, `S`, `G`, `A`\> & `UnwrapRef`\<`S`\> & [`_StoreWithGetters`](pinia.md#_StoreWithGetters)\<`G`\> & [`_ActionsTree`](pinia.md#_ActionsTree) extends `A` ? {} : `A` & [`PiniaCustomProperties`](../interfaces/pinia.PiniaCustomProperties.md)\<`Id`, `S`, `G`, `A`\> & [`PiniaCustomStateProperties`](../interfaces/pinia.PiniaCustomStateProperties.md)\<`S`\>

Store type to build a store.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](pinia.md#StateTree) = {} |
| `G` | {} |
| `A` | {} |

___

### StoreActions

Ƭ **StoreActions**\<`SS`\>: `SS` extends [`Store`](pinia.md#Store)\<`string`, [`StateTree`](pinia.md#StateTree), [`_GettersTree`](pinia.md#_GettersTree)\<[`StateTree`](pinia.md#StateTree)\>, infer A\> ? `A` : [`_ExtractActionsFromSetupStore`](pinia.md#_ExtractActionsFromSetupStore)\<`SS`\>

Extract the actions of a store type. Works with both a Setup Store or an
Options Store.

#### Type parameters

| Name |
| :------ |
| `SS` |

___

### StoreGeneric

Ƭ **StoreGeneric**: [`Store`](pinia.md#Store)\<`string`, [`StateTree`](pinia.md#StateTree), [`_GettersTree`](pinia.md#_GettersTree)\<[`StateTree`](pinia.md#StateTree)\>, [`_ActionsTree`](pinia.md#_ActionsTree)\>

Generic and type-unsafe version of Store. Doesn't fail on access with
strings, making it much easier to write generic functions that do not care
about the kind of store that is passed.

___

### StoreGetters

Ƭ **StoreGetters**\<`SS`\>: `SS` extends [`Store`](pinia.md#Store)\<`string`, [`StateTree`](pinia.md#StateTree), infer G, [`_ActionsTree`](pinia.md#_ActionsTree)\> ? [`_StoreWithGetters`](pinia.md#_StoreWithGetters)\<`G`\> : [`_ExtractGettersFromSetupStore`](pinia.md#_ExtractGettersFromSetupStore)\<`SS`\>

Extract the getters of a store type. Works with both a Setup Store or an
Options Store.

#### Type parameters

| Name |
| :------ |
| `SS` |

___

### StoreOnActionListener

Ƭ **StoreOnActionListener**\<`Id`, `S`, `G`, `A`\>: (`context`: [`StoreOnActionListenerContext`](pinia.md#StoreOnActionListenerContext)\<`Id`, `S`, `G`, {} extends `A` ? [`_ActionsTree`](pinia.md#_ActionsTree) : `A`\>) => `void`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#StateTree) |
| `G` | `G` |
| `A` | `A` |

#### Type declaration

▸ (`context`): `void`

Argument of `store.$onAction()`

##### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`StoreOnActionListenerContext`](pinia.md#StoreOnActionListenerContext)\<`Id`, `S`, `G`, {} extends `A` ? [`_ActionsTree`](pinia.md#_ActionsTree) : `A`\> |

##### Returns

`void`

___

### StoreOnActionListenerContext

Ƭ **StoreOnActionListenerContext**\<`Id`, `S`, `G`, `A`\>: [`_ActionsTree`](pinia.md#_ActionsTree) extends `A` ? [`_StoreOnActionListenerContext`](../interfaces/pinia._StoreOnActionListenerContext.md)\<[`StoreGeneric`](pinia.md#StoreGeneric), `string`, [`_ActionsTree`](pinia.md#_ActionsTree)\> : \{ [Name in keyof A]: Name extends string ? \_StoreOnActionListenerContext\<Store\<Id, S, G, A\>, Name, A\> : never }[keyof `A`]

Context object passed to callbacks of `store.$onAction(context => {})`
TODO: should have only the Id, the Store and Actions to generate the proper object

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#StateTree) |
| `G` | `G` |
| `A` | `A` |

___

### StoreState

Ƭ **StoreState**\<`SS`\>: `SS` extends [`Store`](pinia.md#Store)\<`string`, infer S, [`_GettersTree`](pinia.md#_GettersTree)\<[`StateTree`](pinia.md#StateTree)\>, [`_ActionsTree`](pinia.md#_ActionsTree)\> ? `UnwrapRef`\<`S`\> : [`_ExtractStateFromSetupStore`](pinia.md#_ExtractStateFromSetupStore)\<`SS`\>

Extract the state of a store type. Works with both a Setup Store or an
Options Store. Note this unwraps refs.

#### Type parameters

| Name |
| :------ |
| `SS` |

___

### SubscriptionCallback

Ƭ **SubscriptionCallback**\<`S`\>: (`mutation`: [`SubscriptionCallbackMutation`](pinia.md#SubscriptionCallbackMutation)\<`S`\>, `state`: `UnwrapRef`\<`S`\>) => `void`

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
| `mutation` | [`SubscriptionCallbackMutation`](pinia.md#SubscriptionCallbackMutation)\<`S`\> |
| `state` | `UnwrapRef`\<`S`\> |

##### Returns

`void`

___

### SubscriptionCallbackMutation

Ƭ **SubscriptionCallbackMutation**\<`S`\>: [`SubscriptionCallbackMutationDirect`](../interfaces/pinia.SubscriptionCallbackMutationDirect.md) \| [`SubscriptionCallbackMutationPatchObject`](../interfaces/pinia.SubscriptionCallbackMutationPatchObject.md)\<`S`\> \| [`SubscriptionCallbackMutationPatchFunction`](../interfaces/pinia.SubscriptionCallbackMutationPatchFunction.md)

Context object passed to a subscription callback.

#### Type parameters

| Name |
| :------ |
| `S` |

___

### \_ActionsTree

Ƭ **\_ActionsTree**: `Record`\<`string`, [`_Method`](pinia.md#_Method)\>

Type of an object of Actions. For internal usage only.
For internal use **only**

___

### \_Awaited

Ƭ **\_Awaited**\<`T`\>: `T` extends ``null`` \| `undefined` ? `T` : `T` extends `object` & \{ `then`: (`onfulfilled`: `F`) => `any`  } ? `F` extends (`value`: infer V, ...`args`: `any`) => `any` ? [`_Awaited`](pinia.md#_Awaited)\<`V`\> : `never` : `T`

#### Type parameters

| Name |
| :------ |
| `T` |

___

### \_DeepPartial

Ƭ **\_DeepPartial**\<`T`\>: \{ [K in keyof T]?: \_DeepPartial\<T[K]\> }

Recursive `Partial<T>`. Used by [['$patch']](pinia.md#Store).

For internal use **only**

#### Type parameters

| Name |
| :------ |
| `T` |

___

### \_ExtractActionsFromSetupStore

Ƭ **\_ExtractActionsFromSetupStore**\<`SS`\>: `SS` extends `undefined` \| `void` ? {} : [`_ExtractActionsFromSetupStore_Keys`](pinia.md#_ExtractActionsFromSetupStore_Keys)\<`SS`\> extends keyof `SS` ? `Pick`\<`SS`, [`_ExtractActionsFromSetupStore_Keys`](pinia.md#_ExtractActionsFromSetupStore_Keys)\<`SS`\>\> : `never`

For internal use **only**

#### Type parameters

| Name |
| :------ |
| `SS` |

___

### \_ExtractActionsFromSetupStore\_Keys

Ƭ **\_ExtractActionsFromSetupStore\_Keys**\<`SS`\>: keyof \{ [K in keyof SS as SS[K] extends \_Method ? K : never]: any }

Type that enables refactoring through IDE.
For internal use **only**

#### Type parameters

| Name |
| :------ |
| `SS` |

___

### \_ExtractGettersFromSetupStore

Ƭ **\_ExtractGettersFromSetupStore**\<`SS`\>: `SS` extends `undefined` \| `void` ? {} : [`_ExtractGettersFromSetupStore_Keys`](pinia.md#_ExtractGettersFromSetupStore_Keys)\<`SS`\> extends keyof `SS` ? `Pick`\<`SS`, [`_ExtractGettersFromSetupStore_Keys`](pinia.md#_ExtractGettersFromSetupStore_Keys)\<`SS`\>\> : `never`

For internal use **only**

#### Type parameters

| Name |
| :------ |
| `SS` |

___

### \_ExtractGettersFromSetupStore\_Keys

Ƭ **\_ExtractGettersFromSetupStore\_Keys**\<`SS`\>: keyof \{ [K in keyof SS as SS[K] extends ComputedRef ? K : never]: any }

Type that enables refactoring through IDE.
For internal use **only**

#### Type parameters

| Name |
| :------ |
| `SS` |

___

### \_ExtractStateFromSetupStore

Ƭ **\_ExtractStateFromSetupStore**\<`SS`\>: `SS` extends `undefined` \| `void` ? {} : [`_ExtractStateFromSetupStore_Keys`](pinia.md#_ExtractStateFromSetupStore_Keys)\<`SS`\> extends keyof `SS` ? [`_UnwrapAll`](pinia.md#_UnwrapAll)\<`Pick`\<`SS`, [`_ExtractStateFromSetupStore_Keys`](pinia.md#_ExtractStateFromSetupStore_Keys)\<`SS`\>\>\> : `never`

For internal use **only**

#### Type parameters

| Name |
| :------ |
| `SS` |

___

### \_ExtractStateFromSetupStore\_Keys

Ƭ **\_ExtractStateFromSetupStore\_Keys**\<`SS`\>: keyof \{ [K in keyof SS as SS[K] extends \_Method \| ComputedRef ? never : K]: any }

Type that enables refactoring through IDE.
For internal use **only**

#### Type parameters

| Name |
| :------ |
| `SS` |

___

### \_GettersTree

Ƭ **\_GettersTree**\<`S`\>: `Record`\<`string`, (`state`: `UnwrapRef`\<`S`\> & `UnwrapRef`\<[`PiniaCustomStateProperties`](../interfaces/pinia.PiniaCustomStateProperties.md)\<`S`\>\>) => `any` \| () => `any`\>

Type of an object of Getters that infers the argument. For internal usage only.
For internal use **only**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`StateTree`](pinia.md#StateTree) |

___

### \_MapActionsObjectReturn

Ƭ **\_MapActionsObjectReturn**\<`A`, `T`\>: \{ [key in keyof T]: A[T[key]] }

For internal use **only**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | `A` |
| `T` | extends `Record`\<`string`, keyof `A`\> |

___

### \_MapActionsReturn

Ƭ **\_MapActionsReturn**\<`A`\>: \{ [key in keyof A]: A[key] }

For internal use **only**

#### Type parameters

| Name |
| :------ |
| `A` |

___

### \_MapStateObjectReturn

Ƭ **\_MapStateObjectReturn**\<`Id`, `S`, `G`, `A`, `T`\>: \{ [key in keyof T]: Function }

For internal use **only**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#StateTree) |
| `G` | extends [`_GettersTree`](pinia.md#_GettersTree)\<`S`\> |
| `A` | `A` |
| `T` | extends `Record`\<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](pinia.md#Store)\<`Id`, `S`, `G`, `A`\>) => `any`\> = {} |

___

### \_MapStateReturn

Ƭ **\_MapStateReturn**\<`S`, `G`, `Keys`\>: \{ [key in Keys]: Function }

For internal use **only**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`StateTree`](pinia.md#StateTree) |
| `G` | extends [`_GettersTree`](pinia.md#_GettersTree)\<`S`\> |
| `Keys` | extends keyof `S` \| keyof `G` = keyof `S` \| keyof `G` |

___

### \_MapWritableStateObjectReturn

Ƭ **\_MapWritableStateObjectReturn**\<`S`, `T`\>: \{ [key in keyof T]: Object }

For internal use **only**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`StateTree`](pinia.md#StateTree) |
| `T` | extends `Record`\<`string`, keyof `S`\> |

___

### \_MapWritableStateReturn

Ƭ **\_MapWritableStateReturn**\<`S`\>: \{ [key in keyof S]: Object }

For internal use **only**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`StateTree`](pinia.md#StateTree) |

___

### \_Method

Ƭ **\_Method**: (...`args`: `any`[]) => `any`

#### Type declaration

▸ (`...args`): `any`

Generic type for a function that can infer arguments and return type

For internal use **only**

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

##### Returns

`any`

___

### \_Spread

Ƭ **\_Spread**\<`A`\>: `A` extends [infer L, ...(infer R)] ? [`_StoreObject`](pinia.md#_StoreObject)\<`L`\> & [`_Spread`](pinia.md#_Spread)\<`R`\> : `unknown`

For internal use **only**.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | extends readonly `any`[] |

___

### \_StoreObject

Ƭ **\_StoreObject**\<`S`\>: `S` extends [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)\<infer Ids, infer State, infer Getters, infer Actions\> ? \{ [Id in \`$\{Ids}$\{MapStoresCustomization extends Record\<"suffix", infer Suffix\> ? Suffix : "Store"}\`]: Function } : {}

For internal use **only**.

#### Type parameters

| Name |
| :------ |
| `S` |

___

### \_StoreWithActions

Ƭ **\_StoreWithActions**\<`A`\>: \{ [k in keyof A]: A[k] extends Function ? Function : never }

Store augmented for actions. For internal usage only.
For internal use **only**

#### Type parameters

| Name |
| :------ |
| `A` |

___

### \_StoreWithGetters

Ƭ **\_StoreWithGetters**\<`G`\>: \{ readonly [k in keyof G]: G[k] extends Function ? R : UnwrapRef\<G[k]\> }

Store augmented with getters. For internal usage only.
For internal use **only**

#### Type parameters

| Name |
| :------ |
| `G` |

___

### \_UnwrapAll

Ƭ **\_UnwrapAll**\<`SS`\>: \{ [K in keyof SS]: UnwrapRef\<SS[K]\> }

Type that enables refactoring through IDE.
For internal use **only**

#### Type parameters

| Name |
| :------ |
| `SS` |

## Variables

### PiniaVuePlugin

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

## Functions

### acceptHMRUpdate

▸ **acceptHMRUpdate**\<`Id`, `S`, `G`, `A`\>(`initialUseStore`, `hot`): (`newModule`: `any`) => `any`

Creates an _accept_ function to pass to `import.meta.hot` in Vite applications.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](pinia.md#StateTree) = [`StateTree`](pinia.md#StateTree) |
| `G` | extends [`_GettersTree`](pinia.md#_GettersTree)\<`S`\> = [`_GettersTree`](pinia.md#_GettersTree)\<`S`\> |
| `A` | [`_ActionsTree`](pinia.md#_ActionsTree) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialUseStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)\<`Id`, `S`, `G`, `A`\> | return of the defineStore to hot update |
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

**`Example`**

```js
const useUser = defineStore(...)
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot))
}
```

___

### createPinia

▸ **createPinia**(): [`Pinia`](../interfaces/pinia.Pinia.md)

Creates a Pinia instance to be used by the application

#### Returns

[`Pinia`](../interfaces/pinia.Pinia.md)

___

### defineStore

▸ **defineStore**\<`Id`, `S`, `G`, `A`\>(`id`, `options`): [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)\<`Id`, `S`, `G`, `A`\>

Creates a `useStore` function that retrieves the store instance

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#StateTree) = {} |
| `G` | extends [`_GettersTree`](pinia.md#_GettersTree)\<`S`\> = {} |
| `A` | {} |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `Id` | id of the store (must be unique) |
| `options` | `Omit`\<[`DefineStoreOptions`](../interfaces/pinia.DefineStoreOptions.md)\<`Id`, `S`, `G`, `A`\>, ``"id"``\> | options to define the store |

#### Returns

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)\<`Id`, `S`, `G`, `A`\>

▸ **defineStore**\<`Id`, `S`, `G`, `A`\>(`options`): [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)\<`Id`, `S`, `G`, `A`\>

Creates a `useStore` function that retrieves the store instance

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#StateTree) = {} |
| `G` | extends [`_GettersTree`](pinia.md#_GettersTree)\<`S`\> = {} |
| `A` | {} |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`DefineStoreOptions`](../interfaces/pinia.DefineStoreOptions.md)\<`Id`, `S`, `G`, `A`\> | options to define the store |

#### Returns

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)\<`Id`, `S`, `G`, `A`\>

▸ **defineStore**\<`Id`, `SS`\>(`id`, `storeSetup`, `options?`): [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)\<`Id`, [`_ExtractStateFromSetupStore`](pinia.md#_ExtractStateFromSetupStore)\<`SS`\>, [`_ExtractGettersFromSetupStore`](pinia.md#_ExtractGettersFromSetupStore)\<`SS`\>, [`_ExtractActionsFromSetupStore`](pinia.md#_ExtractActionsFromSetupStore)\<`SS`\>\>

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
| `options?` | [`DefineSetupStoreOptions`](../interfaces/pinia.DefineSetupStoreOptions.md)\<`Id`, [`_ExtractStateFromSetupStore`](pinia.md#_ExtractStateFromSetupStore)\<`SS`\>, [`_ExtractGettersFromSetupStore`](pinia.md#_ExtractGettersFromSetupStore)\<`SS`\>, [`_ExtractActionsFromSetupStore`](pinia.md#_ExtractActionsFromSetupStore)\<`SS`\>\> | extra options |

#### Returns

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)\<`Id`, [`_ExtractStateFromSetupStore`](pinia.md#_ExtractStateFromSetupStore)\<`SS`\>, [`_ExtractGettersFromSetupStore`](pinia.md#_ExtractGettersFromSetupStore)\<`SS`\>, [`_ExtractActionsFromSetupStore`](pinia.md#_ExtractActionsFromSetupStore)\<`SS`\>\>

___

### disposePinia

▸ **disposePinia**(`pinia`): `void`

Dispose a Pinia instance by stopping its effectScope and removing the state, plugins and stores. This is mostly
useful in tests, with both a testing pinia or a regular pinia and in applications that use multiple pinia instances.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pinia` | [`Pinia`](../interfaces/pinia.Pinia.md) | pinia instance |

#### Returns

`void`

___

### getActivePinia

▸ **getActivePinia**(): `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

Get the currently active pinia if there is any.

#### Returns

`undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

___

### mapActions

▸ **mapActions**\<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapActionsObjectReturn`](pinia.md#_MapActionsObjectReturn)\<`A`, `KeyMapper`\>

Allows directly using actions from your store without using the composition
API (`setup()`) by generating an object to be spread in the `methods` field
of a component. The values of the object are the actions while the keys are
the names of the resulting methods.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#StateTree) |
| `G` | extends [`_GettersTree`](pinia.md#_GettersTree)\<`S`\> |
| `A` | `A` |
| `KeyMapper` | extends `Record`\<`string`, keyof `A`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)\<`Id`, `S`, `G`, `A`\> | store to map from |
| `keyMapper` | `KeyMapper` | object to define new names for the actions |

#### Returns

[`_MapActionsObjectReturn`](pinia.md#_MapActionsObjectReturn)\<`A`, `KeyMapper`\>

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

▸ **mapActions**\<`Id`, `S`, `G`, `A`\>(`useStore`, `keys`): [`_MapActionsReturn`](pinia.md#_MapActionsReturn)\<`A`\>

Allows directly using actions from your store without using the composition
API (`setup()`) by generating an object to be spread in the `methods` field
of a component.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#StateTree) |
| `G` | extends [`_GettersTree`](pinia.md#_GettersTree)\<`S`\> |
| `A` | `A` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)\<`Id`, `S`, `G`, `A`\> | store to map from |
| `keys` | keyof `A`[] | array of action names to map |

#### Returns

[`_MapActionsReturn`](pinia.md#_MapActionsReturn)\<`A`\>

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

___

### mapGetters

▸ **mapGetters**\<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapStateObjectReturn`](pinia.md#_MapStateObjectReturn)\<`Id`, `S`, `G`, `A`, `KeyMapper`\>

Alias for `mapState()`. You should use `mapState()` instead.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#StateTree) |
| `G` | extends [`_GettersTree`](pinia.md#_GettersTree)\<`S`\> |
| `A` | `A` |
| `KeyMapper` | extends `Record`\<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](pinia.md#Store)\<`Id`, `S`, `G`, `A`\>) => `any`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)\<`Id`, `S`, `G`, `A`\> |
| `keyMapper` | `KeyMapper` |

#### Returns

[`_MapStateObjectReturn`](pinia.md#_MapStateObjectReturn)\<`Id`, `S`, `G`, `A`, `KeyMapper`\>

**`Deprecated`**

use `mapState()` instead.

▸ **mapGetters**\<`Id`, `S`, `G`, `A`, `Keys`\>(`useStore`, `keys`): [`_MapStateReturn`](pinia.md#_MapStateReturn)\<`S`, `G`, `Keys`\>

Alias for `mapState()`. You should use `mapState()` instead.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#StateTree) |
| `G` | extends [`_GettersTree`](pinia.md#_GettersTree)\<`S`\> |
| `A` | `A` |
| `Keys` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)\<`Id`, `S`, `G`, `A`\> |
| `keys` | readonly `Keys`[] |

#### Returns

[`_MapStateReturn`](pinia.md#_MapStateReturn)\<`S`, `G`, `Keys`\>

**`Deprecated`**

use `mapState()` instead.

___

### mapState

▸ **mapState**\<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapStateObjectReturn`](pinia.md#_MapStateObjectReturn)\<`Id`, `S`, `G`, `A`, `KeyMapper`\>

Allows using state and getters from one store without using the composition
API (`setup()`) by generating an object to be spread in the `computed` field
of a component. The values of the object are the state properties/getters
while the keys are the names of the resulting computed properties.
Optionally, you can also pass a custom function that will receive the store
as its first argument. Note that while it has access to the component
instance via `this`, it won't be typed.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#StateTree) |
| `G` | extends [`_GettersTree`](pinia.md#_GettersTree)\<`S`\> |
| `A` | `A` |
| `KeyMapper` | extends `Record`\<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](pinia.md#Store)\<`Id`, `S`, `G`, `A`\>) => `any`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)\<`Id`, `S`, `G`, `A`\> | store to map from |
| `keyMapper` | `KeyMapper` | object of state properties or getters |

#### Returns

[`_MapStateObjectReturn`](pinia.md#_MapStateObjectReturn)\<`Id`, `S`, `G`, `A`, `KeyMapper`\>

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

▸ **mapState**\<`Id`, `S`, `G`, `A`, `Keys`\>(`useStore`, `keys`): [`_MapStateReturn`](pinia.md#_MapStateReturn)\<`S`, `G`, `Keys`\>

Allows using state and getters from one store without using the composition
API (`setup()`) by generating an object to be spread in the `computed` field
of a component.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#StateTree) |
| `G` | extends [`_GettersTree`](pinia.md#_GettersTree)\<`S`\> |
| `A` | `A` |
| `Keys` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)\<`Id`, `S`, `G`, `A`\> | store to map from |
| `keys` | readonly `Keys`[] | array of state properties or getters |

#### Returns

[`_MapStateReturn`](pinia.md#_MapStateReturn)\<`S`, `G`, `Keys`\>

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

___

### mapStores

▸ **mapStores**\<`Stores`\>(`...stores`): [`_Spread`](pinia.md#_Spread)\<`Stores`\>

Allows using stores without the composition API (`setup()`) by generating an
object to be spread in the `computed` field of a component. It accepts a list
of store definitions.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Stores` | extends `any`[] |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...stores` | [...Stores[]] | list of stores to map to an object |

#### Returns

[`_Spread`](pinia.md#_Spread)\<`Stores`\>

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

___

### mapWritableState

▸ **mapWritableState**\<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapWritableStateObjectReturn`](pinia.md#_MapWritableStateObjectReturn)\<`S`, `KeyMapper`\>

Same as `mapState()` but creates computed setters as well so the state can be
modified. Differently from `mapState()`, only `state` properties can be
added.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#StateTree) |
| `G` | extends [`_GettersTree`](pinia.md#_GettersTree)\<`S`\> |
| `A` | `A` |
| `KeyMapper` | extends `Record`\<`string`, keyof `S`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)\<`Id`, `S`, `G`, `A`\> | store to map from |
| `keyMapper` | `KeyMapper` | object of state properties |

#### Returns

[`_MapWritableStateObjectReturn`](pinia.md#_MapWritableStateObjectReturn)\<`S`, `KeyMapper`\>

▸ **mapWritableState**\<`Id`, `S`, `G`, `A`, `Keys`\>(`useStore`, `keys`): \{ [K in Keys]: Object }

Allows using state and getters from one store without using the composition
API (`setup()`) by generating an object to be spread in the `computed` field
of a component.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#StateTree) |
| `G` | extends [`_GettersTree`](pinia.md#_GettersTree)\<`S`\> |
| `A` | `A` |
| `Keys` | extends `string` \| `number` \| `symbol` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)\<`Id`, `S`, `G`, `A`\> | store to map from |
| `keys` | readonly `Keys`[] | array of state properties |

#### Returns

\{ [K in Keys]: Object }

___

### setActivePinia

▸ **setActivePinia**(`pinia`): [`Pinia`](../interfaces/pinia.Pinia.md)

Sets or unsets the active pinia. Used in SSR and internally when calling
actions and getters

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pinia` | [`Pinia`](../interfaces/pinia.Pinia.md) | Pinia instance |

#### Returns

[`Pinia`](../interfaces/pinia.Pinia.md)

▸ **setActivePinia**(`pinia`): `undefined`

Sets or unsets the active pinia. Used in SSR and internally when calling
actions and getters

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pinia` | `undefined` | Pinia instance |

#### Returns

`undefined`

▸ **setActivePinia**(`pinia`): `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

Sets or unsets the active pinia. Used in SSR and internally when calling
actions and getters

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pinia` | `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md) | Pinia instance |

#### Returns

`undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

___

### setMapStoreSuffix

▸ **setMapStoreSuffix**(`suffix`): `void`

Changes the suffix added by `mapStores()`. Can be set to an empty string.
Defaults to `"Store"`. Make sure to extend the MapStoresCustomization
interface if you are using TypeScript.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `suffix` | `string` | new suffix |

#### Returns

`void`

___

### skipHydrate

▸ **skipHydrate**\<`T`\>(`obj`): `T`

Tells Pinia to skip the hydration process of a given object. This is useful in setup stores (only) when you return a
stateful object in the store but it isn't really state. e.g. returning a router instance in a setup store.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `obj` | `T` | target object |

#### Returns

`T`

obj

___

### storeToRefs

▸ **storeToRefs**\<`SS`\>(`store`): `StoreToRefs`\<`SS`\>

Creates an object of references with all the state, getters, and plugin-added
state properties of the store. Similar to `toRefs()` but specifically
designed for Pinia stores so methods and non reactive properties are
completely ignored.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `SS` | extends [`StoreGeneric`](pinia.md#StoreGeneric) |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `store` | `SS` | store to extract the refs from |

#### Returns

`StoreToRefs`\<`SS`\>
