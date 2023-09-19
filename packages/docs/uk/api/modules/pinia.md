---
editLink: false
---

[Документація API](../index.md) / pinia

# Модуль: pinia

## Перелік

- [MutationType](../enums/pinia.MutationType.md)

## Інтерфейси

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

## Тип псевдоніми

### PiniaStorePlugin

Ƭ **PiniaStorePlugin**: [`PiniaPlugin`](../interfaces/pinia.PiniaPlugin.md)

Плагін для розширення кожного сховища.

**`Заборонено`**

використовуйте PiniaPlugin натомість

___

### StateTree

Ƭ **StateTree**: `Record`<`string` \| `number` \| `symbol`, `any`\>

Загальний стан сховища

___

### Store

Ƭ **Store**<`Id`, `S`, `G`, `A`\>: [`_StoreWithState`](../interfaces/pinia._StoreWithState.md)<`Id`, `S`, `G`, `A`\> & `UnwrapRef`<`S`\> & [`_StoreWithGetters`](pinia.md#_storewithgetters)<`G`\> & [`_ActionsTree`](pinia.md#_actionstree) extends `A` ? {} : `A` & [`PiniaCustomProperties`](../interfaces/pinia.PiniaCustomProperties.md)<`Id`, `S`, `G`, `A`\> & [`PiniaCustomStateProperties`](../interfaces/pinia.PiniaCustomStateProperties.md)<`S`\>

Тип сховища для створення сховища.

#### Параметри типу

| Ім'я  | Тип                                            |
|:-----|:-----------------------------------------------|
| `Id` | extends `string` = `string`                    |
| `S`  | extends [`StateTree`](pinia.md#statetree) = {} |
| `G`  | {}                                             |
| `A`  | {}                                             |

___

### StoreActions

Ƭ **StoreActions**<`SS`\>: `SS` extends [`Store`](pinia.md#store)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, infer A\> ? `A` : [`_ExtractActionsFromSetupStore`](pinia.md#_extractactionsfromsetupstore)<`SS`\>

Витягує дії за типом сховища. Працює як зі сховищем композиційного API, так і зі сховищем опційного.

#### Параметри типу

| Ім'я |
| :------ |
| `SS` |

___

### StoreGeneric

Ƭ **StoreGeneric**: [`Store`](pinia.md#store)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree)\>

Загальна та небезпечна версія сховища. Не дає збою при доступі через рядки, 
що значно спрощує написання загальних функцій, які не зважають 
на тип переданого сховища.

___

### StoreGetters

Ƭ **StoreGetters**<`SS`\>: `SS` extends [`Store`](pinia.md#store)<`string`, [`StateTree`](pinia.md#statetree), infer G, [`_ActionsTree`](pinia.md#_actionstree)\> ? [`_StoreWithGetters`](pinia.md#_storewithgetters)<`G`\> : [`_ExtractGettersFromSetupStore`](pinia.md#_extractgettersfromsetupstore)<`SS`\>

Витягує гетери сховища. Працює як зі сховищем композиційного API, так і зі сховищем опційного.

#### Параметри типу

| Ім'я |
| :------ |
| `SS` |

___

### StoreOnActionListener

Ƭ **StoreOnActionListener**<`Id`, `S`, `G`, `A`\>: (`context`: [`StoreOnActionListenerContext`](pinia.md#storeonactionlistenercontext)<`Id`, `S`, `G`, {} extends `A` ? [`_ActionsTree`](pinia.md#_actionstree) : `A`\>) => `void`

#### Параметри типу

| Ім'я | Тип                                       |
| :------ |:------------------------------------------|
| `Id` | extends `string`                          |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | `G`                                       |
| `A` | `A`                                       |

#### Оголошення типу

▸ (`context`): `void`

Аргумент `store.$onAction()`

##### Параметри

| Ім'я | Тип |
| :------ | :------ |
| `context` | [`StoreOnActionListenerContext`](pinia.md#storeonactionlistenercontext)<`Id`, `S`, `G`, {} extends `A` ? [`_ActionsTree`](pinia.md#_actionstree) : `A`\> |

##### Повертає

`void`

___

### StoreOnActionListenerContext

Ƭ **StoreOnActionListenerContext**<`Id`, `S`, `G`, `A`\>: [`_ActionsTree`](pinia.md#_actionstree) extends `A` ? [`_StoreOnActionListenerContext`](../interfaces/pinia._StoreOnActionListenerContext.md)<[`StoreGeneric`](pinia.md#storegeneric), `string`, [`_ActionsTree`](pinia.md#_actionstree)\> : { [Name in keyof A]: Name extends string ? \_StoreOnActionListenerContext<Store<Id, S, G, A\>, Name, A\> : never }[keyof `A`]

Об'єкт контексту, що передається до функцій зворотного виклику `store.$onAction(context => {})`
ЗАВДАННЯ: повинен мати лише ідентифікатор, сховище та дії для створення відповідного об'єкта

#### Параметри типу

| Ім'я | Тип |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | `G` |
| `A` | `A` |

___

### StoreState

Ƭ **StoreState**<`SS`\>: `SS` extends [`Store`](pinia.md#store)<`string`, infer S, [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree)\> ? `UnwrapRef`<`S`\> : [`_ExtractStateFromSetupStore`](pinia.md#_extractstatefromsetupstore)<`SS`\>

Витягує стан типу сховища. Працює як зі сховищем Setup, так і зі сховищем Options. 
Зверніть увагу, що це розгортає посилання.

#### Параметри типу

| Ім'я |
| :------ |
| `SS` |

___

### SubscriptionCallback

Ƭ **SubscriptionCallback**<`S`\>: (`mutation`: [`SubscriptionCallbackMutation`](pinia.md#subscriptioncallbackmutation)<`S`\>, `state`: `UnwrapRef`<`S`\>) => `void`

#### Параметри типу

| Ім'я |
| :------ |
| `S` |

#### Оголошення типу

▸ (`mutation`, `state`): `void`

Функція зворотного виклику підписки

##### Parameters

| Ім'я | Type |
| :------ | :------ |
| `mutation` | [`SubscriptionCallbackMutation`](pinia.md#subscriptioncallbackmutation)<`S`\> |
| `state` | `UnwrapRef`<`S`\> |

##### Повертає

`void`

___

### SubscriptionCallbackMutation

Ƭ **SubscriptionCallbackMutation**<`S`\>: [`SubscriptionCallbackMutationDirect`](../interfaces/pinia.SubscriptionCallbackMutationDirect.md) \| [`SubscriptionCallbackMutationPatchObject`](../interfaces/pinia.SubscriptionCallbackMutationPatchObject.md)<`S`\> \| [`SubscriptionCallbackMutationPatchFunction`](../interfaces/pinia.SubscriptionCallbackMutationPatchFunction.md)

Об'єкт контексту, який передається у функцію зворотного виклику підписки.

#### Параметри типу

| Ім'я |
| :------ |
| `S` |

___

### \_ActionsTree %{#Type-Aliases-\_ActionsTree}%

Ƭ **\_ActionsTree**: `Record`<`string`, [`_Method`](pinia.md#_method)\>

Тип об'єкта дій. 
**Лише** для внутрішнього використання

___

### \_Awaited %{#Type-Aliases-\_Awaited}%

Ƭ **\_Awaited**<`T`\>: `T` extends ``null`` \| `undefined` ? `T` : `T` extends `object` & { `then`: (`onfulfilled`: `F`) => `any`  } ? `F` extends (`value`: infer V, ...`args`: `any`) => `any` ? [`_Awaited`](pinia.md#_awaited)<`V`\> : `never` : `T`

#### Параметри типу %{#Type-Aliases-\_Awaited-Type-parameters}%

| Ім'я |
| :------ |
| `T` |

___

### \_DeepPartial %{#Type-Aliases-\_DeepPartial}%

Ƭ **\_DeepPartial**<`T`\>: { [K in keyof T]?: \_DeepPartial<T[K]\> }

Рекурсивний `Partial<T>`. Використовується [['$patch']](pinia.md#store).

**Лише** для внутрішнього використання

#### Параметри типу %{#Type-Aliases-\_DeepPartial-Type-parameters}%

| Ім'я |
| :------ |
| `T` |

___

### \_ExtractActionsFromSetupStore %{#Type-Aliases-\_ExtractActionsFromSetupStore}%

Ƭ **\_ExtractActionsFromSetupStore**<`SS`\>: `SS` extends `undefined` \| `void` ? {} : [`_ExtractActionsFromSetupStore_Keys`](pinia.md#_extractactionsfromsetupstore_keys)<`SS`\> extends keyof `SS` ? `Pick`<`SS`, [`_ExtractActionsFromSetupStore_Keys`](pinia.md#_extractactionsfromsetupstore_keys)<`SS`\>\> : `never`

**Лише** для внутрішнього використання

#### Параметри типу %{#Type-Aliases-\_ExtractActionsFromSetupStore-Type-parameters}%

| Ім'я |
| :------ |
| `SS` |

___

### \_ExtractActionsFromSetupStore\_Keys %{#Type-Aliases-\_ExtractActionsFromSetupStore\_Keys}%

Ƭ **\_ExtractActionsFromSetupStore\_Keys**<`SS`\>: keyof { [K in keyof SS as SS[K] extends \_Method ? K : never]: any }

Тип, що дозволяє рефакторинг через IDE.
**Лише** для внутрішнього використання

#### Параметри типу %{#Type-Aliases-\_ExtractActionsFromSetupStore\_Keys-Type-parameters}%

| Ім'я |
| :------ |
| `SS` |

___

### \_ExtractGettersFromSetupStore %{#Type-Aliases-\_ExtractGettersFromSetupStore}%

Ƭ **\_ExtractGettersFromSetupStore**<`SS`\>: `SS` extends `undefined` \| `void` ? {} : [`_ExtractGettersFromSetupStore_Keys`](pinia.md#_extractgettersfromsetupstore_keys)<`SS`\> extends keyof `SS` ? `Pick`<`SS`, [`_ExtractGettersFromSetupStore_Keys`](pinia.md#_extractgettersfromsetupstore_keys)<`SS`\>\> : `never`

**Лише** для внутрішнього використання

#### Параметри типу %{#Type-Aliases-\_ExtractGettersFromSetupStore-Type-parameters}%

| Ім'я |
| :------ |
| `SS` |

___

### \_ExtractGettersFromSetupStore\_Keys %{#Type-Aliases-\_ExtractGettersFromSetupStore\_Keys}%

Ƭ **\_ExtractGettersFromSetupStore\_Keys**<`SS`\>: keyof { [K in keyof SS as SS[K] extends ComputedRef ? K : never]: any }

Тип, що дозволяє рефакторинг через IDE.
**Лише** для внутрішнього використання

#### Параметри типу %{#Type-Aliases-\_ExtractGettersFromSetupStore\_Keys-Type-parameters}%

| Ім'я |
| :------ |
| `SS` |

___

### \_ExtractStateFromSetupStore %{#Type-Aliases-\_ExtractStateFromSetupStore}%

Ƭ **\_ExtractStateFromSetupStore**<`SS`\>: `SS` extends `undefined` \| `void` ? {} : [`_ExtractStateFromSetupStore_Keys`](pinia.md#_extractstatefromsetupstore_keys)<`SS`\> extends keyof `SS` ? [`_UnwrapAll`](pinia.md#_unwrapall)<`Pick`<`SS`, [`_ExtractStateFromSetupStore_Keys`](pinia.md#_extractstatefromsetupstore_keys)<`SS`\>\>\> : `never`

**Лише** для внутрішнього використання

#### Параметри типу %{#Type-Aliases-\_ExtractStateFromSetupStore-Type-parameters}%

| Ім'я |
| :------ |
| `SS` |

___

### \_ExtractStateFromSetupStore\_Keys %{#Type-Aliases-\_ExtractStateFromSetupStore\_Keys}%

Ƭ **\_ExtractStateFromSetupStore\_Keys**<`SS`\>: keyof { [K in keyof SS as SS[K] extends \_Method \| ComputedRef ? never : K]: any }

Тип, що дозволяє рефакторинг через IDE.
**Лише** для внутрішнього використання

#### Параметри типу %{#Type-Aliases-\_ExtractStateFromSetupStore\_Keys-Type-parameters}%

| Ім'я |
| :------ |
| `SS` |

___

### \_GettersTree %{#Type-Aliases-\_GettersTree}%

Ƭ **\_GettersTree**<`S`\>: `Record`<`string`, (`state`: `UnwrapRef`<`S`\> & `UnwrapRef`<[`PiniaCustomStateProperties`](../interfaces/pinia.PiniaCustomStateProperties.md)<`S`\>\>) => `any` \| () => `any`\>

Тип об'єкту гетерів, що отримують аргумент.
**Лише** для внутрішнього використання

#### Параметри типу %{#Type-Aliases-\_GettersTree-Type-parameters}%

| Ім'я | Тип |
| :------ | :------ |
| `S` | extends [`StateTree`](pinia.md#statetree) |

___

### \_MapActionsObjectReturn %{#Type-Aliases-\_MapActionsObjectReturn}%

Ƭ **\_MapActionsObjectReturn**<`A`, `T`\>: { [key in keyof T]: A[T[key]] }

**Лише** для внутрішнього використання

#### Параметри типу %{#Type-Aliases-\_MapActionsObjectReturn-Type-parameters}%

| Ім'я | Тип |
| :------ | :------ |
| `A` | `A` |
| `T` | extends `Record`<`string`, keyof `A`\> |

___

### \_MapActionsReturn %{#Type-Aliases-\_MapActionsReturn}%

Ƭ **\_MapActionsReturn**<`A`\>: { [key in keyof A]: A[key] }

**Лише** для внутрішнього використання

#### Параметри типу %{#Type-Aliases-\_MapActionsReturn-Type-parameters}%

| Ім'я |
| :------ |
| `A` |

___

### \_MapStateObjectReturn %{#Type-Aliases-\_MapStateObjectReturn}%

Ƭ **\_MapStateObjectReturn**<`Id`, `S`, `G`, `A`, `T`\>: { [key in keyof T]: Function }

**Лише** для внутрішнього використання

#### Параметри типу %{#Type-Aliases-\_MapStateObjectReturn-Type-parameters}%

| Ім'я | Тип |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `T` | extends `Record`<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](pinia.md#store)<`Id`, `S`, `G`, `A`\>) => `any`\> = {} |

___

### \_MapStateReturn %{#Type-Aliases-\_MapStateReturn}%

Ƭ **\_MapStateReturn**<`S`, `G`, `Keys`\>: { [key in Keys]: Function }

**Лише** для внутрішнього використання

#### Параметри типу %{#Type-Aliases-\_MapStateReturn-Type-parameters}%

| Ім'я | Тип |
| :------ | :------ |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `Keys` | extends keyof `S` \| keyof `G` = keyof `S` \| keyof `G` |

___

### \_MapWritableStateObjectReturn %{#Type-Aliases-\_MapWritableStateObjectReturn}%

Ƭ **\_MapWritableStateObjectReturn**<`S`, `T`\>: { [key in keyof T]: Object }

**Лише** для внутрішнього використання

#### Параметри типу %{#Type-Aliases-\_MapWritableStateObjectReturn-Type-parameters}%

| Ім'я | Тип |
| :------ | :------ |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `T` | extends `Record`<`string`, keyof `S`\> |

___

### \_MapWritableStateReturn %{#Type-Aliases-\_MapWritableStateReturn}%

Ƭ **\_MapWritableStateReturn**<`S`\>: { [key in keyof S]: Object }

**Лише** для внутрішнього використання

#### Параметри типу %{#Type-Aliases-\_MapWritableStateReturn-Type-parameters}%

| Ім'я | Тип |
| :------ | :------ |
| `S` | extends [`StateTree`](pinia.md#statetree) |

___

### \_Method %{#Type-Aliases-\_Method}%

Ƭ **\_Method**: (...`args`: `any`[]) => `any`

#### Оголошення типу %{#Type-Aliases-\_Method-Type-declaration}%

▸ (`...args`): `any`

Загальний тип для функції, яка може виводити аргументи та повертати тип

**Лише** для внутрішнього використання

##### Параметри %{#Type-Aliases-\_Method-Type-declaration-Parameters}%

| Ім'я | Тип |
| :------ | :------ |
| `...args` | `any`[] |

##### Повертає %{#Type-Aliases-\_Method-Type-declaration-Returns}%

`any`

___

### \_Spread %{#Type-Aliases-\_Spread}%

Ƭ **\_Spread**<`A`\>: `A` extends [infer L, ...(infer R)] ? [`_StoreObject`](pinia.md#_storeobject)<`L`\> & [`_Spread`](pinia.md#_spread)<`R`\> : `unknown`

**Лише** для внутрішнього використання.

#### Параметри типу %{#Type-Aliases-\_Spread-Type-parameters}%

| Ім'я | Тип                               |
| :------ |:----------------------------------|
| `A` | extends readonly  `any`[] |

___

### \_StoreObject %{#Type-Aliases-\_StoreObject}%

Ƭ **\_StoreObject**<`S`\>: `S` extends [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<infer Ids, infer State, infer Getters, infer Actions\> ? { [Id in \`${Ids}${MapStoresCustomization extends Record<"suffix", infer Suffix\> ? Suffix : "Store"}\`]: Function } : {}

**Лише** для внутрішнього використання.

#### Параметри типу %{#Type-Aliases-\_StoreObject-Type-parameters}%

| Ім'я |
| :------ |
| `S` |

___

### \_StoreWithActions %{#Type-Aliases-\_StoreWithActions}%

Ƭ **\_StoreWithActions**<`A`\>: { [k in keyof A]: A[k] extends Function ? Function : never }

Сховище, що розширене для дій.
**Лише** для внутрішнього використання

#### Параметри типу %{#Type-Aliases-\_StoreWithActions-Type-parameters}%

| Ім'я |
| :------ |
| `A` |

___

### \_StoreWithGetters %{#Type-Aliases-\_StoreWithGetters}%

Ƭ **\_StoreWithGetters**<`G`\>: { readonly [k in keyof G]: G[k] extends Function ? R : UnwrapRef<G[k]\> }

Сховище, що розширене для гетерів.
**Лише** для внутрішнього використання

#### Параметри типу %{#Type-Aliases-\_StoreWithGetters-Type-parameters}%

| Ім'я |
| :------ |
| `G` |

___

### \_UnwrapAll %{#Type-Aliases-\_UnwrapAll}%

Ƭ **\_UnwrapAll**<`SS`\>: { [K in keyof SS]: UnwrapRef<SS[K]\> }

Тип, що дозволяє рефакторинг через IDE.
**Лише** для внутрішнього використання

#### Параметри типу %{#Type-Aliases-\_UnwrapAll-Type-parameters}%

| Ім'я |
| :------ |
| `SS` |

## Змінні

### PiniaVuePlugin

• `Const` **PiniaVuePlugin**: `Plugin`

Плагін для версії Vue 2, який має бути встановлений для роботи з pinia. Примітка: **вам не потрібен
цей плагін, якщо ви використовуєте Nuxt.js**. Замість нього використовуйте `buildModule`:
https://pinia.vuejs.org/ssr/nuxt.html.

**`Приклад`**

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

**`Параметр`**

`Vue`, який імпортується з 'vue'.

## Функції

### acceptHMRUpdate

▸ **acceptHMRUpdate**(`initialUseStore`, `hot`): (`newModule`: `any`) => `any`

**acceptHMRUpdate**<`Id`, `S`, `G`, `A`\>(`initialUseStore`, `hot`): (`newModule`: `any`) => `any`

**`Приклад`**

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` = `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) = [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> = [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | [`_ActionsTree`](pinia.md#_actionstree) |

#### Параметри

| Ім'я | Тип | Опис                                          |
| :------ | :------ |:----------------------------------------------|
| `initialUseStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | повернення defineStore до миттєвого оновлення |
| `hot` | `any` | `import.meta.hot`                             |

#### Повертає

`fn`

▸ (`newModule`): `any`

##### Параметри

| Ім'я | Тип |
| :------ | :------ |
| `newModule` | `any` |

##### Повертає

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

Створює екземпляр Pinia для використання додатком

#### Повертає

[`Pinia`](../interfaces/pinia.Pinia.md)

___

### defineStore

▸ **defineStore**<`Id`, `S`, `G`, `A`\>(`id`, `options`): [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

Створює функцію `useStore`, яка отримує екземпляр сховища

#### Параметри типу

| Ім'я | Тип                                                         |
| :------ |:------------------------------------------------------------|
| `Id` | extends `string`                                            |
| `S` | extends [`StateTree`](pinia.md#statetree) = {}             |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> = {} |
| `A` | {}                                                          |

#### Параметри

| Ім'я | Тип | Опис                                            |
| :------ | :------ |:------------------------------------------------|
| `id` | `Id` | ідентифікатор сховища (повинен бути унікальним) |
| `options` | `Omit`<[`DefineStoreOptions`](../interfaces/pinia.DefineStoreOptions.md)<`Id`, `S`, `G`, `A`\>, ``"id"``\> | параметри для визначення сховища                     |

#### Повертає

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

▸ **defineStore**<`Id`, `S`, `G`, `A`\>(`options`): [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

Створює функцію `useStore`, яка отримує екземпляр сховища

#### Параметри типу

| Ім'я | Тип |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) = {} |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> = {} |
| `A` | {} |

#### Параметри

| Ім'я | Тип | Опис |
| :------ | :------ | :------ |
| `options` | [`DefineStoreOptions`](../interfaces/pinia.DefineStoreOptions.md)<`Id`, `S`, `G`, `A`\> | параметри для визначення сховища |

#### Повертає

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

▸ **defineStore**<`Id`, `SS`\>(`id`, `storeSetup`, `options?`): [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, [`_ExtractStateFromSetupStore`](pinia.md#_extractstatefromsetupstore)<`SS`\>, [`_ExtractGettersFromSetupStore`](pinia.md#_extractgettersfromsetupstore)<`SS`\>, [`_ExtractActionsFromSetupStore`](pinia.md#_extractactionsfromsetupstore)<`SS`\>\>

Створює функцію `useStore`, яка отримує екземпляр сховища

#### Параметри типу

| Ім'я | Тип |
| :------ | :------ |
| `Id` | extends `string` |
| `SS` | `SS` |

#### Параметри

| Ім'я | Тип | Опис                                            |
| :------ | :------ |:------------------------------------------------|
| `id` | `Id` | ідентифікатор сховища (повинен бути унікальним) |
| `storeSetup` | () => `SS` | функція, яка оголошує сховище                   |
| `options?` | [`DefineSetupStoreOptions`](../interfaces/pinia.DefineSetupStoreOptions.md)<`Id`, [`_ExtractStateFromSetupStore`](pinia.md#_extractstatefromsetupstore)<`SS`\>, [`_ExtractGettersFromSetupStore`](pinia.md#_extractgettersfromsetupstore)<`SS`\>, [`_ExtractActionsFromSetupStore`](pinia.md#_extractactionsfromsetupstore)<`SS`\>\> | додаткові параметри                             |

#### Повертає

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, [`_ExtractStateFromSetupStore`](pinia.md#_extractstatefromsetupstore)<`SS`\>, [`_ExtractGettersFromSetupStore`](pinia.md#_extractgettersfromsetupstore)<`SS`\>, [`_ExtractActionsFromSetupStore`](pinia.md#_extractactionsfromsetupstore)<`SS`\>\>

___

### getActivePinia

▸ **getActivePinia**(): `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

Отримує поточну активну Pinia, якщо вона є.

#### Повертає

`undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

___

### mapActions

▸ **mapActions**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapActionsObjectReturn`](pinia.md#_mapactionsobjectreturn)<`A`, `KeyMapper`\>

Дозволяє безпосередньо використовувати дії з вашого сховища без використання 
композиційного API (`setup()`), генеруючи об'єкт для використання в полі `methods`
компонента. Значеннями об'єкта є дії,
а ключами назви отриманих методів.

#### Параметри типу

| Ім'я | Тип |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `KeyMapper` | extends `Record`<`string`, keyof `A`\> |

#### Параметри

| Ім'я | Тип | Опис                                       |
| :------ | :------ |:-------------------------------------------|
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | сховище, з якого мапити                    |
| `keyMapper` | `KeyMapper` | об'єкт, щоб визначити нові імена для дій |

#### Повертає

[`_MapActionsObjectReturn`](pinia.md#_mapactionsobjectreturn)<`A`, `KeyMapper`\>

**`Приклад`**

```js
export default {
  methods: {
    // інші методи
    // useCounterStore має дві дії під назвами `increment` і `setCount`
    ...mapActions(useCounterStore, { moar: 'increment', setIt: 'setCount' })
  },

  created() {
      this.moar()
      this.setIt(2)
  }
}
```

▸ **mapActions**<`Id`, `S`, `G`, `A`\>(`useStore`, `keys`): [`_MapActionsReturn`](pinia.md#_mapactionsreturn)<`A`\>

Дозволяє безпосередньо використовувати дії з вашого сховища без використання композиційного
API (`setup()`), генеруючи об’єкт для розширення в полі `methods`
компонента.

#### Параметри типу

| Ім'я | Тип |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |

#### Параметри

| Ім'я | Тип | Опис                             |
| :------ | :------ |:---------------------------------|
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | cховище, з якого зіставляти дані |
| `keys` | keyof `A`[] | масив назв дій для зіставлення   |

#### Повертає

[`_MapActionsReturn`](pinia.md#_mapactionsreturn)<`A`\>

**`Приклад`**

```js
export default {
  methods: {
    // інші властивості методів
    ...mapActions(useCounterStore, ['increment', 'setCount'])
  },

  created() {
    this.increment()
    this.setCount(2) // передавайте аргументи як зазвичай
  }
}
```

___

### mapGetters

▸ **mapGetters**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapStateObjectReturn`](pinia.md#_mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

Псевдонім для `mapState()`. Ви повинні використовувати `mapState()` натомість.

#### Параметри типу

| Ім'я | Тип |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `KeyMapper` | extends `Record`<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](pinia.md#store)<`Id`, `S`, `G`, `A`\>) => `any`\> |

#### Параметри

| Ім'я | Тип |
| :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> |
| `keyMapper` | `KeyMapper` |

#### Повертає

[`_MapStateObjectReturn`](pinia.md#_mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

**`Заборонено`**

використовуй `mapState()` натомість.

▸ **mapGetters**<`Id`, `S`, `G`, `A`, `Keys`\>(`useStore`, `keys`): [`_MapStateReturn`](pinia.md#_mapstatereturn)<`S`, `G`, `Keys`\>

Псевдонім для `mapState()`. Ви повинні використовувати `mapState()` натомість.

#### Параметри типу

| Ім'я | Тип |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `Keys` | extends `string` \| `number` \| `symbol` |

#### Параметри

| Ім'я | Тип |
| :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> |
| `keys` | readonly `Keys`[] |

#### Повертає

[`_MapStateReturn`](pinia.md#_mapstatereturn)<`S`, `G`, `Keys`\>

**`Заборонено`**

використовуй `mapState()` натомість.

___

### mapState

▸ **mapState**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapStateObjectReturn`](pinia.md#_mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

Дозволяє використовувати стан та гетери з одного сховища без використання 
композиційного API (`setup()`), генеруючи об'єкт для розширення
у полі `computed` компонента. Значеннями об'єкта є властивості стану та гетери,
а ключами - імена обчислюваних властивостей.
За бажанням, ви також можете передати користувацьку функцію, яка отримає сховище
як перший аргумент. Зауважте, що хоча вона має доступ до екземпляра компонента
через `this`, вона не буде типізована.

#### Параметри типу

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `KeyMapper` | extends `Record`<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](pinia.md#store)<`Id`, `S`, `G`, `A`\>) => `any`\> |

#### Параметри

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keyMapper` | `KeyMapper` | object of state properties or getters |

#### Повертає

[`_MapStateObjectReturn`](pinia.md#_mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

**`Приклад`**

```js
export default {
  computed: {
    // інші обчислювані властивості
    // useCounterStore має властивість стану що називається `count` і гетер `double`
    ...mapState(useCounterStore, {
      n: 'count',
      triple: store => store.n * 3,
      // зверніть увагу, що ми не можемо використовувати стрілочну функцію, якщо потрібно мати доступ до `this`
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

▸ **mapState**<`Id`, `S`, `G`, `A`, `Keys`\>(`useStore`, `keys`): [`_MapStateReturn`](pinia.md#_mapstatereturn)<`S`, `G`, `Keys`\>

Дозволяє використовувати стан і геттери з одного сховища без використання композиції
API (`setup()`), генеруючи об’єкт для розширення в полі `computed`
компонента.

#### Параметри типу

| Ім'я | Тип |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `Keys` | extends `string` \| `number` \| `symbol` |

#### Параметри

| Ім'я | Тип | Опис |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | cховище, з якого зіставляти дані |
| `keys` | readonly `Keys`[] | array of state properties or getters |

#### Повертає

[`_MapStateReturn`](pinia.md#_mapstatereturn)<`S`, `G`, `Keys`\>

**`Приклад`**

```js
export default {
  computed: {
    // інші обчислювані властивості
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

▸ **mapStores**<`Stores`\>(`...stores`): [`_Spread`](pinia.md#_spread)<`Stores`\>

Дозволяє використовувати магазини без API композиції (`setup()`) шляхом генерації
об’єкт, який буде розширено в полі `computed` компонента. Він приймає список
визначень магазину.

#### Параметри типу

| Name | Type |
| :------ | :------ |
| `Stores` | extends `any`[] |

#### Параметри

| Ім'я | Тип | Опис                                     |
| :------ | :------ |:-----------------------------------------|
| `...stores` | [...Stores[]] | список сховищ для зіставлення з об’єктом |

#### Повертає

[`_Spread`](pinia.md#_spread)<`Stores`\>

**`Приклад`**

```js
export default {
  computed: {
    // інші обчислювані властивості
    ...mapStores(useUserStore, useCartStore)
  },

  created() {
    this.userStore // сховище з ідентифікатором "user"
    this.cartStore // сховище з ідентифікатором "cart"
  }
}
```

___

### mapWritableState

▸ **mapWritableState**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapWritableStateObjectReturn`](pinia.md#_mapwritablestateobjectreturn)<`S`, `KeyMapper`\>

Те саме, що й `mapState()`, але створює також обчислювані сетери, щоб стан 
можна було змінювати. На відміну від `mapState()`, можна додавати лише 
властивості стану.

#### Параметри типу

| Ім'я | Тип |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `KeyMapper` | extends `Record`<`string`, keyof `S`\> |

#### Параметри

| Ім'я | Тип | Опис |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | cховище, з якого зіставляти дані |
| `keyMapper` | `KeyMapper` | об'єкт властивостей стану |

#### Повертає

[`_MapWritableStateObjectReturn`](pinia.md#_mapwritablestateobjectreturn)<`S`, `KeyMapper`\>

▸ **mapWritableState**<`Id`, `S`, `G`, `A`\>(`useStore`, `keys`): [`_MapWritableStateReturn`](pinia.md#_mapwritablestatereturn)<`S`\>

Дозволяє використовувати стан та гетери з одного сховища без використання 
композиційного API (`setup()`), генеруючи об'єкт для розширення у полі 
обчислюваних властивостей `computed` компонента.

#### Параметри типу

| Ім'я | Тип |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `G` | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A` | `A` |
| `Keys` | extends `string` \| `number` \| `symbol` |

#### Параметри

| Ім'я | Тип | Опис |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | cховище, з якого зіставляти дані |
| `keys` | keyof `S`[] | масив властивостей стану |

#### Повертає

[`_MapWritableStateReturn`](pinia.md#_mapwritablestatereturn)<`S`\>

___

### setActivePinia

▸ **setActivePinia**(`pinia`): [`Pinia`](../interfaces/pinia.Pinia.md)

Вмикає або вимикає активну Pinia.
Використовується в SSR та внутрішньо для виклику дій та гетерів.

#### Параметри

| Ім'я    | Тип                                     | Опис |
|:--------|:----------------------------------------| :------ |
| `pinia` |  [`Pinia`](../interfaces/pinia.Pinia.md)| Екземпляр Pinia |

#### Повертає

[`Pinia`](../interfaces/pinia.Pinia.md)

▸ **setActivePinia**(`pinia`): `undefined`

Вмикає або вимикає активну Pinia.
Використовується в SSR та внутрішньо для виклику дій та гетерів.

#### Параметри

| Ім'я    | Тип          | Опис |
|:--------|:-------------| :------ |
| `pinia` | `undefined`  | Екземпляр Pinia |

#### Повертає

`undefined`

▸ **setActivePinia**(`pinia`): `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

Вмикає або вимикає активну Pinia. 
Використовується в SSR та внутрішньо для виклику дій та гетерів.

#### Параметри

| Ім'я    | Тип | Опис |
|:--------| :------ | :------ |
| `pinia` | `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md) | Екземпляр Pinia |

#### Повертає

`undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

___

### setMapStoreSuffix

▸ **setMapStoreSuffix**(`suffix`): `void`

Змінює суфікс, доданий `mapStores()`. Може бути задано порожнім рядком. 
За замовчуванням `"Store"`. Переконайтеся, що ви розширили інтерфейс 
MapStoresCustomization, якщо ви використовуєте TypeScript.

#### Параметри

| Ім'я | Тип | Опис |
| :------ | :------ | :------ |
| `suffix` | `string` | новий суфікс |

#### Повертає

`void`

___

### skipHydrate

▸ **skipHydrate**<`T`\>(`obj`): `T`

Дозволяє Pinia пропустити процес гідратації даного об'єкта. Це корисно лише у налаштуваннях сховища, коли ви 
повертаєте об'єкт зі станом у сховищі, який насправді не є станом, наприклад, повернення екземпляра 
маршрутизатора зі сховища налаштувань. об'єкт зі станом у сховищі, який насправді не є станом, наприклад, 
повернення екземпляра маршрутизатора у налаштуваннях сховища.

#### Параметри типу

| Ім'я | Тип |
| :------ | :------ |
| `T` | `any` |

#### Параметри

| Ім'я | Тип | Опис |
| :------ | :------ | :------ |
| `obj` | `T` | цільовий об'єкт |

#### Повертає

`T`

obj

___

### storeToRefs

▸ **storeToRefs**<`SS`\>(`store`): `StoreToRefs`<`SS`\>

Створює об'єкт референції на всі властивості стану, гетери та додані плагінами 
властивості стану сховища. Подібний до `toRefs()`, але спеціально розроблений 
для сховищ Pinia, тому методи та нереактивні властивості повністю ігноруються.

#### Параметри типу

| Ім'я | Тип |
| :------ | :------ |
| `SS` | extends [`_StoreWithState`](../interfaces/pinia._StoreWithState.md)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree), `SS`\> & [`StateTree`](pinia.md#statetree) & [`_StoreWithGetters`](pinia.md#_storewithgetters)<[`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>\> & [`PiniaCustomProperties`](../interfaces/pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree), `SS`\> & [`PiniaCustomStateProperties`](../interfaces/pinia.PiniaCustomStateProperties.md)<[`StateTree`](pinia.md#statetree), `SS`\> |

#### Параметри

| Ім'я | Тип | Опис |
| :------ | :------ | :------ |
| `store` | `SS` | сховище для витягування референцій |

#### Повертає

`StoreToRefs`<`SS`\>
