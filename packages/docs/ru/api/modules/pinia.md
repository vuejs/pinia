---
editLink: false
---

[Документация API](../index.md) / pinia

# Модуль: pinia

## Перечисления %{#Enumerations}%

-   [MutationType](../enums/pinia.MutationType.md)

## Interfaces %{#Interfaces}%

-   [DefineSetupStoreOptions](../interfaces/pinia.DefineSetupStoreOptions.md)
-   [DefineStoreOptions](../interfaces/pinia.DefineStoreOptions.md)
-   [DefineStoreOptionsBase](../interfaces/pinia.DefineStoreOptionsBase.md)
-   [DefineStoreOptionsInPlugin](../interfaces/pinia.DefineStoreOptionsInPlugin.md)
-   [MapStoresCustomization](../interfaces/pinia.MapStoresCustomization.md)
-   [Pinia](../interfaces/pinia.Pinia.md)
-   [PiniaCustomProperties](../interfaces/pinia.PiniaCustomProperties.md)
-   [PiniaCustomStateProperties](../interfaces/pinia.PiniaCustomStateProperties.md)
-   [PiniaPlugin](../interfaces/pinia.PiniaPlugin.md)
-   [PiniaPluginContext](../interfaces/pinia.PiniaPluginContext.md)
-   [StoreDefinition](../interfaces/pinia.StoreDefinition.md)
-   [StoreProperties](../interfaces/pinia.StoreProperties.md)
-   [SubscriptionCallbackMutationDirect](../interfaces/pinia.SubscriptionCallbackMutationDirect.md)
-   [SubscriptionCallbackMutationPatchFunction](../interfaces/pinia.SubscriptionCallbackMutationPatchFunction.md)
-   [SubscriptionCallbackMutationPatchObject](../interfaces/pinia.SubscriptionCallbackMutationPatchObject.md)
-   [\_StoreOnActionListenerContext](../interfaces/pinia._StoreOnActionListenerContext.md)
-   [\_StoreWithState](../interfaces/pinia._StoreWithState.md)
-   [\_SubscriptionCallbackMutationBase](../interfaces/pinia._SubscriptionCallbackMutationBase.md)

## Type Aliases %{#Type-Aliases}%

### PiniaStorePlugin %{#Type-Aliases-PiniaStorePlugin}%

Ƭ **PiniaStorePlugin**: [`PiniaPlugin`](../interfaces/pinia.PiniaPlugin.md)

Плагин для расширения каждого хранилища.

**`Устарело`**

вместо этого используйте PiniaPlugin

---

### StateTree %{#Type-Aliases-StateTree}%

Ƭ **StateTree**: `Record`<`string` \| `number` \| `symbol`, `any`\>

Общее состояние хранилища

---

### Store %{#Type-Aliases-Store}%

Ƭ **Store**<`Id`, `S`, `G`, `A`\>: [`_StoreWithState`](../interfaces/pinia._StoreWithState.md)<`Id`, `S`, `G`, `A`\> & `UnwrapRef`<`S`\> & [`_StoreWithGetters`](pinia.md#_storewithgetters)<`G`\> & [`_ActionsTree`](pinia.md#_actionstree) extends `A` ? {} : `A` & [`PiniaCustomProperties`](../interfaces/pinia.PiniaCustomProperties.md)<`Id`, `S`, `G`, `A`\> & [`PiniaCustomStateProperties`](../interfaces/pinia.PiniaCustomStateProperties.md)<`S`\>

Тип хранилища для создания хранилища.

#### Типы параметров %{#Type-Aliases-Store-Type-parameters}%

| Имя  | Тип                                            |
| :--- | :--------------------------------------------- |
| `Id` | extends `string` = `string`                    |
| `S`  | extends [`StateTree`](pinia.md#statetree) = {} |
| `G`  | {}                                             |
| `A`  | {}                                             |

---

### StoreActions %{#Type-Aliases-StoreActions}%

Ƭ **StoreActions**<`SS`\>: `SS` extends [`Store`](pinia.md#store)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, infer A\> ? `A` : [`_ExtractActionsFromSetupStore`](pinia.md#_extractactionsfromsetupstore)<`SS`\>

Извлечение экшенов типа хранилища. Работает как с хранилищем настроек, так и с хранилищем опций.

#### Типы параметров %{#Type-Aliases-StoreActions-Type-parameters}%

| Имя  |
| :--- |
| `SS` |

---

### StoreGeneric %{#Type-Aliases-StoreGeneric}%

Ƭ **StoreGeneric**: [`Store`](pinia.md#store)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree)\>

Обобщенная и небезопасная для типов версия Store. Не дает сбоев при доступе к строкам, что значительно упрощает написание универсальных функций, которым не важен тип передаваемого хранилища.

---

### StoreGetters %{#Type-Aliases-StoreGetters}%

Ƭ **StoreGetters**<`SS`\>: `SS` extends [`Store`](pinia.md#store)<`string`, [`StateTree`](pinia.md#statetree), infer G, [`_ActionsTree`](pinia.md#_actionstree)\> ? [`_StoreWithGetters`](pinia.md#_storewithgetters)<`G`\> : [`_ExtractGettersFromSetupStore`](pinia.md#_extractgettersfromsetupstore)<`SS`\>

Извлечение геттеров типа хранилища. Работает как с хранилищем настроек, так и с хранилищем опций.

#### Типы параметров %{#Type-Aliases-StoreGetters-Type-parameters}%

| Имя  |
| :--- |
| `SS` |

---

### StoreOnActionListener %{#Type-Aliases-StoreOnActionListener}%

Ƭ **StoreOnActionListener**<`Id`, `S`, `G`, `A`\>: (`context`: [`StoreOnActionListenerContext`](pinia.md#storeonactionlistenercontext)<`Id`, `S`, `G`, {} extends `A` ? [`_ActionsTree`](pinia.md#_actionstree) : `A`\>) => `void`

#### Типы параметров %{#Type-Aliases-StoreOnActionListener-Type-parameters}%

| Имя  | Тип                                       |
| :--- | :---------------------------------------- |
| `Id` | extends `string`                          |
| `S`  | extends [`StateTree`](pinia.md#statetree) |
| `G`  | `G`                                       |
| `A`  | `A`                                       |

#### Объявление типа %{#Type-Aliases-StoreOnActionListener-Type-declaration}%

▸ (`context`): `void`

Аргумент из `store.$onAction()`

##### Параметры %{#Type-Aliases-StoreOnActionListener-Type-declaration-Parameters}%

| Имя       | Тип                                                                                                                                                      |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `context` | [`StoreOnActionListenerContext`](pinia.md#storeonactionlistenercontext)<`Id`, `S`, `G`, {} extends `A` ? [`_ActionsTree`](pinia.md#_actionstree) : `A`\> |

##### Возвращает %{#Type-Aliases-StoreOnActionListener-Type-declaration-Returns}%

`void`

---

### StoreOnActionListenerContext %{#Type-Aliases-StoreOnActionListenerContext}%

Ƭ **StoreOnActionListenerContext**<`Id`, `S`, `G`, `A`\>: [`_ActionsTree`](pinia.md#_actionstree) extends `A` ? [`_StoreOnActionListenerContext`](../interfaces/pinia._StoreOnActionListenerContext.md)<[`StoreGeneric`](pinia.md#storegeneric), `string`, [`_ActionsTree`](pinia.md#_actionstree)\> : { [Name in keyof A]: Name extends string ? \_StoreOnActionListenerContext<Store<Id, S, G, A\>, Name, A\> : never }[keyof `A`]

Объект контекста, передаваемый в callback `store.$onAction(context => {})`.
TODO: должен иметь только Id, Store и Actions для создания соответствующего объекта

#### Типы параметров %{#Type-Aliases-StoreOnActionListenerContext-Type-parameters}%

| Имя  | Тип                                       |
| :--- | :---------------------------------------- |
| `Id` | extends `string`                          |
| `S`  | extends [`StateTree`](pinia.md#statetree) |
| `G`  | `G`                                       |
| `A`  | `A`                                       |

---

### StoreState %{#Type-Aliases-StoreState}%

Ƭ **StoreState**<`SS`\>: `SS` extends [`Store`](pinia.md#store)<`string`, infer S, [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree)\> ? `UnwrapRef`<`S`\> : [`_ExtractStateFromSetupStore`](pinia.md#_extractstatefromsetupstore)<`SS`\>

Извлечение состояния типа хранилища. Работает как с хранилищем настроек, так и с хранилищем опций. Обратите внимание, что это разворачивает ссылки.

#### Типы параметров %{#Type-Aliases-StoreState-Type-parameters}%

| Имя  |
| :--- |
| `SS` |

---

### SubscriptionCallback %{#Type-Aliases-SubscriptionCallback}%

Ƭ **SubscriptionCallback**<`S`\>: (`mutation`: [`SubscriptionCallbackMutation`](pinia.md#subscriptioncallbackmutation)<`S`\>, `state`: `UnwrapRef`<`S`\>) => `void`

#### Типы параметров %{#Type-Aliases-SubscriptionCallback-Type-parameters}%

| Имя |
| :-- |
| `S` |

#### Объявление типа %{#Type-Aliases-SubscriptionCallback-Type-declaration}%

▸ (`mutation`, `state`): `void`

Callback подписки

##### Параметры %{#Type-Aliases-SubscriptionCallback-Type-declaration-Parameters}%

| Имя        | Тип                                                                           |
| :--------- | :---------------------------------------------------------------------------- |
| `mutation` | [`SubscriptionCallbackMutation`](pinia.md#subscriptioncallbackmutation)<`S`\> |
| `state`    | `UnwrapRef`<`S`\>                                                             |

##### Возвращает %{#Type-Aliases-SubscriptionCallback-Type-declaration-Returns}%

`void`

---

### SubscriptionCallbackMutation %{#Type-Aliases-SubscriptionCallbackMutation}%

Ƭ **SubscriptionCallbackMutation**<`S`\>: [`SubscriptionCallbackMutationDirect`](../interfaces/pinia.SubscriptionCallbackMutationDirect.md) \| [`SubscriptionCallbackMutationPatchObject`](../interfaces/pinia.SubscriptionCallbackMutationPatchObject.md)<`S`\> \| [`SubscriptionCallbackMutationPatchFunction`](../interfaces/pinia.SubscriptionCallbackMutationPatchFunction.md)

Объект контекста, передаваемый подписке callback.

#### Типы параметров %{#Type-Aliases-SubscriptionCallbackMutation-Type-parameters}%

| Имя |
| :-- |
| `S` |

---

### \_ActionsTree %{#Type-Aliases-\_ActionsTree}%

Ƭ **\_ActionsTree**: `Record`<`string`, [`_Method`](pinia.md#_method)\>

Тип объекта Экшенов. Только для внутреннего использования.
Только для **внутреннего использования**

---

### \_Awaited %{#Type-Aliases-\_Awaited}%

Ƭ **\_Awaited**<`T`\>: `T` extends `null` \| `undefined` ? `T` : `T` extends `object` & { `then`: (`onfulfilled`: `F`) => `any` } ? `F` extends (`value`: infer V, ...`args`: `any`) => `any` ? [`_Awaited`](pinia.md#_awaited)<`V`\> : `never` : `T`

#### Типы параметров %{#Type-Aliases-\_Awaited-Type-parameters}%

| Имя |
| :-- |
| `T` |

---

### \_DeepPartial %{#Type-Aliases-\_DeepPartial}%

Ƭ **\_DeepPartial**<`T`\>: { [K in keyof T]?: \_DeepPartial<T[K]\> }

Recursive `Partial<T>`. Used by [['$patch']](pinia.md#store).

Только для **внутреннего использования**

#### Типы параметров %{#Type-Aliases-\_DeepPartial-Type-parameters}%

| Имя |
| :-- |
| `T` |

---

### \_ExtractActionsFromSetupStore %{#Type-Aliases-\_ExtractActionsFromSetupStore}%

Ƭ **\_ExtractActionsFromSetupStore**<`SS`\>: `SS` extends `undefined` \| `void` ? {} : [`_ExtractActionsFromSetupStore_Keys`](pinia.md#_extractactionsfromsetupstore_keys)<`SS`\> extends keyof `SS` ? `Pick`<`SS`, [`_ExtractActionsFromSetupStore_Keys`](pinia.md#_extractactionsfromsetupstore_keys)<`SS`\>\> : `never`

Только для **внутреннего использования**

#### Типы параметров %{#Type-Aliases-\_ExtractActionsFromSetupStore-Type-parameters}%

| Имя  |
| :--- |
| `SS` |

---

### \_ExtractActionsFromSetupStore_Keys %{#Type-Aliases-\_ExtractActionsFromSetupStore_Keys}%

Ƭ **\_ExtractActionsFromSetupStore_Keys**<`SS`\>: keyof { [K in keyof SS as SS[K] extends \_Method ? K : never]: any }

Тип, позволяющий проводить рефакторинг через IDE.
Только для **внутреннего использования**

#### Типы параметров %{#Type-Aliases-\_ExtractActionsFromSetupStore_Keys-Type-parameters}%

| Имя  |
| :--- |
| `SS` |

---

### \_ExtractGettersFromSetupStore %{#Type-Aliases-\_ExtractGettersFromSetupStore}%

Ƭ **\_ExtractGettersFromSetupStore**<`SS`\>: `SS` extends `undefined` \| `void` ? {} : [`_ExtractGettersFromSetupStore_Keys`](pinia.md#_extractgettersfromsetupstore_keys)<`SS`\> extends keyof `SS` ? `Pick`<`SS`, [`_ExtractGettersFromSetupStore_Keys`](pinia.md#_extractgettersfromsetupstore_keys)<`SS`\>\> : `never`

Только для **внутреннего использования**

#### Типы параметров %{#Type-Aliases-\_ExtractGettersFromSetupStore-Type-parameters}%

| Имя  |
| :--- |
| `SS` |

---

### \_ExtractGettersFromSetupStore_Keys %{#Type-Aliases-\_ExtractGettersFromSetupStore_Keys}%

Ƭ **\_ExtractGettersFromSetupStore_Keys**<`SS`\>: keyof { [K in keyof SS as SS[K] extends ComputedRef ? K : never]: any }

Тип, позволяющий проводить рефакторинг через IDE.
Только для **внутреннего использования**

#### Типы параметров %{#Type-Aliases-\_ExtractGettersFromSetupStore_Keys-Type-parameters}%

| Имя  |
| :--- |
| `SS` |

---

### \_ExtractStateFromSetupStore %{#Type-Aliases-\_ExtractStateFromSetupStore}%

Ƭ **\_ExtractStateFromSetupStore**<`SS`\>: `SS` extends `undefined` \| `void` ? {} : [`_ExtractStateFromSetupStore_Keys`](pinia.md#_extractstatefromsetupstore_keys)<`SS`\> extends keyof `SS` ? [`_UnwrapAll`](pinia.md#_unwrapall)<`Pick`<`SS`, [`_ExtractStateFromSetupStore_Keys`](pinia.md#_extractstatefromsetupstore_keys)<`SS`\>\>\> : `never`

Только для **внутреннего использования**

#### Типы параметров %{#Type-Aliases-\_ExtractStateFromSetupStore-Type-parameters}%

| Имя  |
| :--- |
| `SS` |

---

### \_ExtractStateFromSetupStore_Keys %{#Type-Aliases-\_ExtractStateFromSetupStore_Keys}%

Ƭ **\_ExtractStateFromSetupStore_Keys**<`SS`\>: keyof { [K in keyof SS as SS[K] extends \_Method \| ComputedRef ? never : K]: any }

Тип, позволяющий проводить рефакторинг через IDE.
Только для **внутреннего использования**

#### Типы параметров %{#Type-Aliases-\_ExtractStateFromSetupStore_Keys-Type-parameters}%

| Имя  |
| :--- |
| `SS` |

---

### \_GettersTree %{#Type-Aliases-\_GettersTree}%

Ƭ **\_GettersTree**<`S`\>: `Record`<`string`, (`state`: `UnwrapRef`<`S`\> & `UnwrapRef`<[`PiniaCustomStateProperties`](../interfaces/pinia.PiniaCustomStateProperties.md)<`S`\>\>) => `any` \| () => `any`\>

Тип объекта Getters, который определяет аргумент. Только для внутреннего использования.
Только для **внутреннего использования**

#### Типы параметров %{#Type-Aliases-\_GettersTree-Type-parameters}%

| Имя | Тип                                       |
| :-- | :---------------------------------------- |
| `S` | extends [`StateTree`](pinia.md#statetree) |

---

### \_MapActionsObjectReturn %{#Type-Aliases-\_MapActionsObjectReturn}%

Ƭ **\_MapActionsObjectReturn**<`A`, `T`\>: { [key in keyof T]: A[T[key]] }

Только для **внутреннего использования**

#### Типы параметров %{#Type-Aliases-\_MapActionsObjectReturn-Type-parameters}%

| Имя | Тип                                    |
| :-- | :------------------------------------- |
| `A` | `A`                                    |
| `T` | extends `Record`<`string`, keyof `A`\> |

---

### \_MapActionsReturn %{#Type-Aliases-\_MapActionsReturn}%

Ƭ **\_MapActionsReturn**<`A`\>: { [key in keyof A]: A[key] }

Только для **внутреннего использования**

#### Типы параметров %{#Type-Aliases-\_MapActionsReturn-Type-parameters}%

| Имя |
| :-- |
| `A` |

---

### \_MapStateObjectReturn %{#Type-Aliases-\_MapStateObjectReturn}%

Ƭ **\_MapStateObjectReturn**<`Id`, `S`, `G`, `A`, `T`\>: { [key in keyof T]: Function }

Только для **внутреннего использования**

#### Типы параметров %{#Type-Aliases-\_MapStateObjectReturn-Type-parameters}%

| Имя  | Тип                                                                                                                             |
| :--- | :------------------------------------------------------------------------------------------------------------------------------ |
| `Id` | extends `string`                                                                                                                |
| `S`  | extends [`StateTree`](pinia.md#statetree)                                                                                       |
| `G`  | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\>                                                                           |
| `A`  | `A`                                                                                                                             |
| `T`  | extends `Record`<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](pinia.md#store)<`Id`, `S`, `G`, `A`\>) => `any`\> = {} |

---

### \_MapStateReturn %{#Type-Aliases-\_MapStateReturn}%

Ƭ **\_MapStateReturn**<`S`, `G`, `Keys`\>: { [key in Keys]: Function }

Только для **внутреннего использования**

#### Типы параметров %{#Type-Aliases-\_MapStateReturn-Type-parameters}%

| Имя    | Тип                                                     |
| :----- | :------------------------------------------------------ |
| `S`    | extends [`StateTree`](pinia.md#statetree)               |
| `G`    | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\>   |
| `Keys` | extends keyof `S` \| keyof `G` = keyof `S` \| keyof `G` |

---

### \_MapWritableStateObjectReturn %{#Type-Aliases-\_MapWritableStateObjectReturn}%

Ƭ **\_MapWritableStateObjectReturn**<`S`, `T`\>: { [key in keyof T]: Object }

Только для **внутреннего использования**

#### Типы параметров %{#Type-Aliases-\_MapWritableStateObjectReturn-Type-parameters}%

| Имя | Тип                                       |
| :-- | :---------------------------------------- |
| `S` | extends [`StateTree`](pinia.md#statetree) |
| `T` | extends `Record`<`string`, keyof `S`\>    |

---

### \_MapWritableStateReturn %{#Type-Aliases-\_MapWritableStateReturn}%

Ƭ **\_MapWritableStateReturn**<`S`\>: { [key in keyof S]: Object }

Только для **внутреннего использования**

#### Типы параметров %{#Type-Aliases-\_MapWritableStateReturn-Type-parameters}%

| Имя | Тип                                       |
| :-- | :---------------------------------------- |
| `S` | extends [`StateTree`](pinia.md#statetree) |

---

### \_Method %{#Type-Aliases-\_Method}%

Ƭ **\_Method**: (...`args`: `any`[]) => `any`

#### Объявление типа %{#Type-Aliases-\_Method-Type-declaration}%

▸ (`...args`): `any`

Общий тип для функции, которая может выводить аргументы и возвращаемый тип

Только для **внутреннего использования**

##### Параметры %{#Type-Aliases-\_Method-Type-declaration-Parameters}%

| Имя       | Тип     |
| :-------- | :------ |
| `...args` | `any`[] |

##### Возвращает %{#Type-Aliases-\_Method-Type-declaration-Returns}%

`any`

---

### \_Spread %{#Type-Aliases-\_Spread}%

Ƭ **\_Spread**<`A`\>: `A` extends [infer L, ...(infer R)] ? [`_StoreObject`](pinia.md#_storeobject)<`L`\> & [`_Spread`](pinia.md#_spread)<`R`\> : `unknown`

Только для **внутреннего использования**.

#### Типы параметров %{#Type-Aliases-\_Spread-Type-parameters}%

| Имя | Тип                      |
| :-- | :----------------------- |
| `A` | extends readonly `any`[] |

---

### \_StoreObject %{#Type-Aliases-\_StoreObject}%

Ƭ **\_StoreObject**<`S`\>: `S` extends [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<infer Ids, infer State, infer Getters, infer Actions\> ? { [Id in \`${Ids}${MapStoresCustomization extends Record<"suffix", infer Suffix\> ? Suffix : "Store"}\`]: Function } : {}

Только для **внутреннего использования**.

#### Типы параметров %{#Type-Aliases-\_StoreObject-Type-parameters}%

| Имя |
| :-- |
| `S` |

---

### \_StoreWithActions %{#Type-Aliases-\_StoreWithActions}%

Ƭ **\_StoreWithActions**<`A`\>: { [k in keyof A]: A[k] extends Function ? Function : never }

Store augmented for actions. For internal usage only.
Только для **внутреннего использования**

#### Типы параметров %{#Type-Aliases-\_StoreWithActions-Type-parameters}%

| Имя |
| :-- |
| `A` |

---

### \_StoreWithGetters %{#Type-Aliases-\_StoreWithGetters}%

Ƭ **\_StoreWithGetters**<`G`\>: { readonly [k in keyof G]: G[k] extends Function ? R : UnwrapRef<G[k]\> }

Хранилище, дополненное геттерами. Только для внутреннего использования.
Только для **внутреннего использования**

#### Типы параметров %{#Type-Aliases-\_StoreWithGetters-Type-parameters}%

| Имя |
| :-- |
| `G` |

---

### \_UnwrapAll %{#Type-Aliases-\_UnwrapAll}%

Ƭ **\_UnwrapAll**<`SS`\>: { [K in keyof SS]: UnwrapRef<SS[K]\> }

Тип, позволяющий проводить рефакторинг через IDE.
Только для **внутреннего использования**

#### Типы параметров %{#Type-Aliases-\_UnwrapAll-Type-parameters}%

| Имя  |
| :--- |
| `SS` |

## Variables %{#Variables}%

### PiniaVuePlugin %{#Variables-PiniaVuePlugin}%

• `Const` **PiniaVuePlugin**: `Plugin`

Плагин Vue 2, который должен быть установлен для работы pinia. Примечание **вам не нужен этот плагин, если вы используете Nuxt.js**. Вместо него используйте `buildModule`: <https://pinia.vuejs.org/ssr/nuxt.html>.

**`Пример`**

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

## Функции %{#Functions}%

### acceptHMRUpdate %{#Functions-acceptHMRUpdate}%

▸ **acceptHMRUpdate**(`initialUseStore`, `hot`): (`newModule`: `any`) => `any`

Создает функцию _accept_ для передачи в `import.meta.hot` в приложениях Vite.

**`Пример`**

```js
const useUser = defineStore(...)
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot))
}
```

#### Параметры %{#Functions-acceptHMRUpdate-Parameters}%

| Имя               | Тип                                                                                                                                                                                                                             | Описание                                |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------- |
| `initialUseStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree)\> | return of the defineStore to hot update |
| `hot`             | `any`                                                                                                                                                                                                                           | `import.meta.hot`                       |

#### Возвращает %{#Functions-acceptHMRUpdate-Returns}%

`fn`

▸ (`newModule`): `any`

##### Параметры %{#Functions-acceptHMRUpdate-Returns-Parameters}%

| Имя         | Тип   |
| :---------- | :---- |
| `newModule` | `any` |

##### Возвращает %{#Functions-acceptHMRUpdate-Returns-Returns}%

`any`

---

### createPinia %{#Functions-createPinia}%

▸ **createPinia**(): [`Pinia`](../interfaces/pinia.Pinia.md)

Создает экземпляр Pinia, который будет использоваться приложением

#### Возвращает %{#Functions-createPinia-Returns}%

[`Pinia`](../interfaces/pinia.Pinia.md)

---

### defineStore %{#Functions-defineStore}%

▸ **defineStore**<`Id`, `S`, `G`, `A`\>(`id`, `options`): [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

Создает функцию `useStore`, которая извлекает экземпляр хранилища

#### Типы параметров %{#Functions-defineStore-Type-parameters}%

| Имя  | Тип                                                        |
| :--- | :--------------------------------------------------------- |
| `Id` | extends `string`                                           |
| `S`  | extends [`StateTree`](pinia.md#statetree) = {}             |
| `G`  | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> = {} |
| `A`  | {}                                                         |

#### Параметры %{#Functions-defineStore-Parameters}%

| Имя       | Тип                                                                                                      | Описание                                         |
| :-------- | :------------------------------------------------------------------------------------------------------- | :----------------------------------------------- |
| `id`      | `Id`                                                                                                     | идентификатор хранилища (должен быть уникальным) |
| `options` | `Omit`<[`DefineStoreOptions`](../interfaces/pinia.DefineStoreOptions.md)<`Id`, `S`, `G`, `A`\>, `"id"`\> | параметры для определения хранилища              |

#### Возвращает %{#Functions-defineStore-Returns}%

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

▸ **defineStore**<`Id`, `S`, `G`, `A`\>(`options`): [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

Создает функцию `useStore`, которая извлекает экземпляр хранилища

#### Типы параметров %{#Functions-defineStore-Type-parameters_1}%

| Имя  | Тип                                                        |
| :--- | :--------------------------------------------------------- |
| `Id` | extends `string`                                           |
| `S`  | extends [`StateTree`](pinia.md#statetree) = {}             |
| `G`  | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> = {} |
| `A`  | {}                                                         |

#### Параметры %{#Functions-defineStore-Parameters_1}%

| Имя       | Тип                                                                                     | Описание                            |
| :-------- | :-------------------------------------------------------------------------------------- | :---------------------------------- |
| `options` | [`DefineStoreOptions`](../interfaces/pinia.DefineStoreOptions.md)<`Id`, `S`, `G`, `A`\> | параметры для определения хранилища |

#### Возвращает %{#Functions-defineStore-Returns_1}%

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

▸ **defineStore**<`Id`, `SS`\>(`id`, `storeSetup`, `options?`): [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, [`_ExtractStateFromSetupStore`](pinia.md#_extractstatefromsetupstore)<`SS`\>, [`_ExtractGettersFromSetupStore`](pinia.md#_extractgettersfromsetupstore)<`SS`\>, [`_ExtractActionsFromSetupStore`](pinia.md#_extractactionsfromsetupstore)<`SS`\>\>

Создает функцию `useStore`, которая извлекает экземпляр хранилища

#### Типы параметров %{#Functions-defineStore-Type-parameters_2}%

| Имя  | Тип              |
| :--- | :--------------- |
| `Id` | extends `string` |
| `SS` | `SS`             |

#### Параметры %{#Functions-defineStore-Parameters_2}%

| Имя          | Тип                                                                                                                                                                                                                                                                                                                                  | Описание                                         |
| :----------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------- |
| `id`         | `Id`                                                                                                                                                                                                                                                                                                                                 | идентификатор хранилища (должен быть уникальным) |
| `storeSetup` | () => `SS`                                                                                                                                                                                                                                                                                                                           | функция, определяющая хранилище                  |
| `options?`   | [`DefineSetupStoreOptions`](../interfaces/pinia.DefineSetupStoreOptions.md)<`Id`, [`_ExtractStateFromSetupStore`](pinia.md#_extractstatefromsetupstore)<`SS`\>, [`_ExtractGettersFromSetupStore`](pinia.md#_extractgettersfromsetupstore)<`SS`\>, [`_ExtractActionsFromSetupStore`](pinia.md#_extractactionsfromsetupstore)<`SS`\>\> | дополнительные опции                             |

#### Возвращает %{#Functions-defineStore-Returns_2}%

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, [`_ExtractStateFromSetupStore`](pinia.md#_extractstatefromsetupstore)<`SS`\>, [`_ExtractGettersFromSetupStore`](pinia.md#_extractgettersfromsetupstore)<`SS`\>, [`_ExtractActionsFromSetupStore`](pinia.md#_extractactionsfromsetupstore)<`SS`\>\>

---

### getActivePinia %{#Functions-getActivePinia}%

▸ **getActivePinia**(): `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

Получает текущую активную pinia, если таковая имеется.

#### Возвращает %{#Functions-getActivePinia-Returns}%

`undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

---

### mapActions %{#Functions-mapActions}%

▸ **mapActions**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapActionsObjectReturn`](pinia.md#_mapactionsobjectreturn)<`A`, `KeyMapper`\>

Позволяет напрямую использовать действия из вашего хранилища без использования composition API (`setup()`), генерируя объект для распространения в поле `methods` компонента. Значениями объекта являются действия, а ключами - имена результирующих методов.

**`Пример`**

```js
export default {
    methods: {
        // свойства других методов
        // useCounterStore имеет два действия с именами `increment` и `setCount`
        ...mapActions(useCounterStore, {
            moar: 'increment',
            setIt: 'setCount',
        }),
    },

    created() {
        this.moar()
        this.setIt(2)
    },
}
```

#### Типы параметров %{#Functions-mapActions-Type-parameters}%

| Имя         | Тип                                                   |
| :---------- | :---------------------------------------------------- |
| `Id`        | extends `string`                                      |
| `S`         | extends [`StateTree`](pinia.md#statetree)             |
| `G`         | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A`         | `A`                                                   |
| `KeyMapper` | extends `Record`<`string`, keyof `A`\>                |

#### Параметры %{#Functions-mapActions-Parameters}%

| Имя         | Тип                                                                               | Описание                                      |
| :---------- | :-------------------------------------------------------------------------------- | :-------------------------------------------- |
| `useStore`  | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | хранилище для создания карты                  |
| `keyMapper` | `KeyMapper`                                                                       | объект для определения новых имен для экшенов |

#### Возвращает %{#Functions-mapActions-Returns}%

[`_MapActionsObjectReturn`](pinia.md#_mapactionsobjectreturn)<`A`, `KeyMapper`\>

▸ **mapActions**<`Id`, `S`, `G`, `A`\>(`useStore`, `keys`): [`_MapActionsReturn`](pinia.md#_mapactionsreturn)<`A`\>

Позволяет напрямую использовать экшены из вашего хранилища без использования composition API (`setup()`) путем генерации объекта для распространения в поле `methods` компонента.

**`Пример`**

```js
export default {
    methods: {
        // свойства других методов
        ...mapActions(useCounterStore, ['increment', 'setCount']),
    },

    created() {
        this.increment()
        this.setCount(2) // передаем аргументы как обычно
    },
}
```

#### Типы параметров %{#Functions-mapActions-Type-parameters_1}%

| Имя  | Тип                                                   |
| :--- | :---------------------------------------------------- |
| `Id` | extends `string`                                      |
| `S`  | extends [`StateTree`](pinia.md#statetree)             |
| `G`  | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A`  | `A`                                                   |

#### Параметры %{#Functions-mapActions-Parameters_1}%

| Имя        | Тип                                                                               | Описание                              |
| :--------- | :-------------------------------------------------------------------------------- | :------------------------------------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | хранилище для создания карты          |
| `keys`     | keyof `A`[]                                                                       | массив имен экшенов для сопоставления |

#### Возвращает %{#Functions-mapActions-Returns_1}%

[`_MapActionsReturn`](pinia.md#_mapactionsreturn)<`A`\>

---

### mapGetters %{#Functions-mapGetters}%

▸ **mapGetters**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapStateObjectReturn`](pinia.md#_mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

Псевдоним для `mapState()`. Вместо него следует использовать `mapState()`.

**`Устарело`**

используйте `mapState()` вместо этого.

#### Типы параметров %{#Functions-mapGetters-Type-parameters}%

| Имя         | Тип                                                                                                                        |
| :---------- | :------------------------------------------------------------------------------------------------------------------------- |
| `Id`        | extends `string`                                                                                                           |
| `S`         | extends [`StateTree`](pinia.md#statetree)                                                                                  |
| `G`         | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\>                                                                      |
| `A`         | `A`                                                                                                                        |
| `KeyMapper` | extends `Record`<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](pinia.md#store)<`Id`, `S`, `G`, `A`\>) => `any`\> |

#### Параметры %{#Functions-mapGetters-Parameters}%

| Имя         | Тип                                                                               |
| :---------- | :-------------------------------------------------------------------------------- |
| `useStore`  | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> |
| `keyMapper` | `KeyMapper`                                                                       |

#### Возвращает %{#Functions-mapGetters-Returns}%

[`_MapStateObjectReturn`](pinia.md#_mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

▸ **mapGetters**<`Id`, `S`, `G`, `A`, `Keys`\>(`useStore`, `keys`): [`_MapStateReturn`](pinia.md#_mapstatereturn)<`S`, `G`, `Keys`\>

Псевдоним для `mapState()`. Вместо него следует использовать `mapState()`.

**`Устарело`**

используйте `mapState()` вместо этого.

#### Типы параметров %{#Functions-mapGetters-Type-parameters_1}%

| Имя    | Тип                                                   |
| :----- | :---------------------------------------------------- |
| `Id`   | extends `string`                                      |
| `S`    | extends [`StateTree`](pinia.md#statetree)             |
| `G`    | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A`    | `A`                                                   |
| `Keys` | extends `string` \| `number` \| `symbol`              |

#### Параметры %{#Functions-mapGetters-Parameters_1}%

| Имя        | Тип                                                                               |
| :--------- | :-------------------------------------------------------------------------------- |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> |
| `keys`     | readonly `Keys`[]                                                                 |

#### Возвращает %{#Functions-mapGetters-Returns_1}%

[`_MapStateReturn`](pinia.md#_mapstatereturn)<`S`, `G`, `Keys`\>

---

### mapState %{#Functions-mapState}%

▸ **mapState**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapStateObjectReturn`](pinia.md#_mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

Позволяет использовать состояние и геттеры из одного хранилища без использования composition API (`setup()`) путем создания объекта, который будет размещен в поле `computed` компонента. Значения объекта - это свойства состояния/геттеров, в то время как ключи - это имена результирующих вычисленных свойств.
При желании вы также можете передать пользовательскую функцию, которая получит хранилище в качестве своего первого аргумента. Обратите внимание, что, хотя у него есть доступ к экземпляру компонента через `this`, он не будет введен.

**`Пример`**

```js
export default {
    computed: {
        // другие вычисляемые свойства
        // хранилище use Counter имеет свойство состояния с именем `count` и средство получения `double`
        ...mapState(useCounterStore, {
            n: 'count',
            triple: (store) => store.n * 3,
            // обратите внимание, что мы не можем использовать функцию стрелки, если мы хотим использовать `this`
            custom(store) {
                return this.someComponentValue + store.n
            },
            doubleN: 'double',
        }),
    },

    created() {
        this.n // 2
        this.doubleN // 4
    },
}
```

#### Типы параметров %{#Functions-mapState-Type-parameters}%

| Имя         | Тип                                                                                                                        |
| :---------- | :------------------------------------------------------------------------------------------------------------------------- |
| `Id`        | extends `string`                                                                                                           |
| `S`         | extends [`StateTree`](pinia.md#statetree)                                                                                  |
| `G`         | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\>                                                                      |
| `A`         | `A`                                                                                                                        |
| `KeyMapper` | extends `Record`<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](pinia.md#store)<`Id`, `S`, `G`, `A`\>) => `any`\> |

#### Параметры %{#Functions-mapState-Parameters}%

| Имя         | Тип                                                                               | Описание                              |
| :---------- | :-------------------------------------------------------------------------------- | :------------------------------------ |
| `useStore`  | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | хранилище для создания карты          |
| `keyMapper` | `KeyMapper`                                                                       | объект свойств состояния или геттеров |

#### Возвращает %{#Functions-mapState-Returns}%

[`_MapStateObjectReturn`](pinia.md#_mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

▸ **mapState**<`Id`, `S`, `G`, `A`, `Keys`\>(`useStore`, `keys`): [`_MapStateReturn`](pinia.md#_mapstatereturn)<`S`, `G`, `Keys`\>

Позволяет использовать состояние и геттеры из одного хранилища без использования composition API (`setup()`) путем создания объекта, который будет размещен в поле `вычисляемый` компонента.

**`Пример`**

```js
export default {
    computed: {
        // другие вычисляемые свойства
        ...mapState(useCounterStore, ['count', 'double']),
    },

    created() {
        this.count // 2
        this.double // 4
    },
}
```

#### Типы параметров %{#Functions-mapState-Type-parameters_1}%

| Имя    | Тип                                                   |
| :----- | :---------------------------------------------------- |
| `Id`   | extends `string`                                      |
| `S`    | extends [`StateTree`](pinia.md#statetree)             |
| `G`    | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A`    | `A`                                                   |
| `Keys` | extends `string` \| `number` \| `symbol`              |

#### Параметры %{#Functions-mapState-Parameters_1}%

| Имя        | Тип                                                                               | Описание                              |
| :--------- | :-------------------------------------------------------------------------------- | :------------------------------------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | хранилище для создания карты          |
| `keys`     | readonly `Keys`[]                                                                 | массив свойств состояния или геттеров |

#### Возвращает %{#Functions-mapState-Returns_1}%

[`_MapStateReturn`](pinia.md#_mapstatereturn)<`S`, `G`, `Keys`\>

---

### mapStores %{#Functions-mapStores}%

▸ **mapStores**<`Stores`\>(`...stores`): [`_Spread`](pinia.md#_spread)<`Stores`\>

Позволяет использовать хранилища без composition API (`setup()`) путем создания объекта для распространения в поле `вычисляемый` компонента. Он принимает список определений хранилища.

**`Пример`**

```js
export default {
    computed: {
        // другие вычисляемые свойства
        ...mapStores(useUserStore, useCartStore),
    },

    created() {
        this.userStore // store с id "user"
        this.cartStore // store с id "cart"
    },
}
```

#### Типы параметров %{#Functions-mapStores-Type-parameters}%

| Имя      | Тип             |
| :------- | :-------------- |
| `Stores` | extends `any`[] |

#### Параметры %{#Functions-mapStores-Parameters}%

| Имя         | Тип           | Описание                                     |
| :---------- | :------------ | :------------------------------------------- |
| `...stores` | [...Stores[]] | список хранилищ для сопоставления с объектом |

#### Возвращает %{#Functions-mapStores-Returns}%

[`_Spread`](pinia.md#_spread)<`Stores`\>

---

### mapWritableState %{#Functions-mapWritableState}%

▸ **mapWritableState**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapWritableStateObjectReturn`](pinia.md#_mapwritablestateobjectreturn)<`S`, `KeyMapper`\>

То же, что и `map State()`, но также создает computed setters, чтобы состояние можно было изменить. В отличие от `map State()`, могут быть добавлены только свойства `state`.

#### Типы параметров %{#Functions-mapWritableState-Type-parameters}%

| Имя         | Тип                                                   |
| :---------- | :---------------------------------------------------- |
| `Id`        | extends `string`                                      |
| `S`         | extends [`StateTree`](pinia.md#statetree)             |
| `G`         | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A`         | `A`                                                   |
| `KeyMapper` | extends `Record`<`string`, keyof `S`\>                |

#### Параметры %{#Functions-mapWritableState-Parameters}%

| Имя         | Тип                                                                               | Описание                     |
| :---------- | :-------------------------------------------------------------------------------- | :--------------------------- |
| `useStore`  | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | хранилище для создания карты |
| `keyMapper` | `KeyMapper`                                                                       | объект свойств состояния     |

#### Возвращает %{#Functions-mapWritableState-Returns}%

[`_MapWritableStateObjectReturn`](pinia.md#_mapwritablestateobjectreturn)<`S`, `KeyMapper`\>

▸ **mapWritableState**<`Id`, `S`, `G`, `A`\>(`useStore`, `keys`): [`_MapWritableStateReturn`](pinia.md#_mapwritablestatereturn)<`S`\>

Позволяет использовать состояние и геттеры из одного хранилища без использования API композиции (`setup()`) путем генерации объекта для распространения в `computed` поле компонента.

#### Типы параметров %{#Functions-mapWritableState-Type-parameters_1}%

| Имя  | Тип                                                   |
| :--- | :---------------------------------------------------- |
| `Id` | extends `string`                                      |
| `S`  | extends [`StateTree`](pinia.md#statetree)             |
| `G`  | extends [`_GettersTree`](pinia.md#_getterstree)<`S`\> |
| `A`  | `A`                                                   |

#### Параметры %{#Functions-mapWritableState-Parameters_1}%

| Имя        | Тип                                                                               | Описание                     |
| :--------- | :-------------------------------------------------------------------------------- | :--------------------------- |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | хранилище для создания карты |
| `keys`     | keyof `S`[]                                                                       | массив свойств состояния     |

#### Возвращает %{#Functions-mapWritableState-Returns_1}%

[`_MapWritableStateReturn`](pinia.md#_mapwritablestatereturn)<`S`\>

---

### setActivePinia %{#Functions-setActivePinia}%

▸ **setActivePinia**(`pinia`): `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

Устанавливает или снимает активную pinia. Используется в SSR и внутренне при вызове действий и геттеров

#### Параметры %{#Functions-setActivePinia-Parameters}%

| Имя     | Тип                                                    | Описание       |
| :------ | :----------------------------------------------------- | :------------- |
| `pinia` | `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md) | Pinia instance |

#### Возвращает %{#Functions-setActivePinia-Returns}%

`undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

---

### setMapStoreSuffix %{#Functions-setMapStoreSuffix}%

▸ **setMapStoreSuffix**(`suffix`): `void`

Изменяет суффикс, добавляемый `mapStores()`. Может быть установлен на пустую строку.
По умолчанию используется `"Store"`. Обязательно расширьте интерфейс `MapStoresCustomization`, если вы используете TypeScript.

#### Параметры %{#Functions-setMapStoreSuffix-Parameters}%

| Имя      | Тип      | Описание      |
| :------- | :------- | :------------ |
| `suffix` | `string` | новый суффикс |

#### Возвращает %{#Functions-setMapStoreSuffix-Returns}%

`void`

---

### skipHydrate %{#Functions-skipHydrate}%

▸ **skipHydrate**<`T`\>(`obj`): `T`

Tells Pinia to skip the hydration process of a given object. This is useful in setup stores (only) when you return a
stateful object in the store but it isn't really state. e.g. returning a router instance in a setup store.

#### Типы параметров %{#Functions-skipHydrate-Type-parameters}%

| Имя | Тип   |
| :-- | :---- |
| `T` | `any` |

#### Параметры %{#Functions-skipHydrate-Parameters}%

| Имя   | Тип | Описание      |
| :---- | :-- | :------------ |
| `obj` | `T` | target object |

#### Возвращает %{#Functions-skipHydrate-Returns}%

`T`

obj

---

### storeToRefs %{#Functions-storeToRefs}%

▸ **storeToRefs**<`SS`\>(`store`): `StoreToRefs`<`SS`\>

Создает объект ссылок со всем состоянием, геттерами и добавленными плагином свойствами состояния хранилища. Аналогичен `toRefs()`, но специально разработан для хранилищ Pinia, поэтому методы и нереактивные свойства полностью игнорируются.

#### Типы параметров %{#Functions-storeToRefs-Type-parameters}%

| Имя  | Тип                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :--- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SS` | extends [`_StoreWithState`](../interfaces/pinia._StoreWithState.md)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree), `SS`\> & [`StateTree`](pinia.md#statetree) & [`_StoreWithGetters`](pinia.md#_storewithgetters)<[`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>\> & [`PiniaCustomProperties`](../interfaces/pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](pinia.md#statetree), [`_GettersTree`](pinia.md#_getterstree)<[`StateTree`](pinia.md#statetree)\>, [`_ActionsTree`](pinia.md#_actionstree), `SS`\> & [`PiniaCustomStateProperties`](../interfaces/pinia.PiniaCustomStateProperties.md)<[`StateTree`](pinia.md#statetree), `SS`\> |

#### Параметры %{#Functions-storeToRefs-Parameters}%

| Имя     | Тип  | Описание                       |
| :------ | :--- | :----------------------------- |
| `store` | `SS` | store to extract the refs from |

#### Возвращает %{#Functions-storeToRefs-Returns}%

`StoreToRefs`<`SS`\>
