---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / pinia

# Module: pinia

## Enumérations

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
- [\_StoreWithState](../interfaces/pinia._StoreWithState.md)
- [\_SubscriptionCallbackMutationBase](../interfaces/pinia._SubscriptionCallbackMutationBase.md)

## Alias de type

### PiniaStorePlugin

Ƭ **PiniaStorePlugin**: [`PiniaPlugin`](../interfaces/pinia.PiniaPlugin.md)

Plugin to extend every store.

**`deprecated`** use PiniaPlugin instead

#### Défini dans

[pinia/src/rootStore.ts:149](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L149)

___

### StateTree

Ƭ **StateTree**: `Record`<`string` \| `number` \| `symbol`, `any`\>

État générique d'un magasin

#### Défini dans

[pinia/src/types.ts:13](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L13)

___

### Store

Ƭ **Store**<`Id`, `S`, `G`, `A`\>: [`_StoreWithState`](../interfaces/pinia._StoreWithState.md)<`Id`, `S`, `G`, `A`\> & `UnwrapRef`<`S`\> & `_StoreWithGetters`<`G`\> & `_ActionsTree` extends `A` ? {} : `A` & [`PiniaCustomProperties`](../interfaces/pinia.PiniaCustomProperties.md)<`Id`, `S`, `G`, `A`\> & `PiniaCustomStateProperties`<`S`\>

Type de store pour construire un magasin.

#### Les types de paramètres

| Name | Type                                           |
| :--- | :--------------------------------------------- |
| `Id` | extends `string` = `string`                    |
| `S`  | extends [`StateTree`](pinia.md#statetree) = {} |
| `G`  | {}                                             |
| `A`  | {}                                             |

#### Défini dans

[pinia/src/types.ts:472](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L472)

___

### StoreActions

Ƭ **StoreActions**<`SS`\>: `SS` extends [`Store`](pinia.md#store)<`string`, [`StateTree`](pinia.md#statetree), `_GettersTree`<[`StateTree`](pinia.md#statetree)\>, infer A\> ? `A` : `_ExtractActionsFromSetupStore`<`SS`\>

Extrayez les actions d'un type de store. Fonctionne avec un store de configuration ou un
store d'options.

#### Les types de paramètres

| Name |
| :--- |
| `SS` |

#### Défini dans

[pinia/src/store.ts:727](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/store.ts#L727)

___

### StoreGeneric

Ƭ **StoreGeneric**: [`Store`](pinia.md#store)<`string`, [`StateTree`](pinia.md#statetree), `_GettersTree`<[`StateTree`](pinia.md#statetree)\>, `_ActionsTree`\>

Version générique et non sécurisée de Store. N'échoue pas lors d'accès avec des
chaînes de caractères, ce qui facilite grandement l'écriture de fonctions génériques qui ne se
qui ne se soucient pas du type de store qui est passé.

#### Défini dans

[pinia/src/types.ts:491](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L491)

___

### StoreGetters

Ƭ **StoreGetters**<`SS`\>: `SS` extends [`Store`](pinia.md#store)<`string`, [`StateTree`](pinia.md#statetree), infer G, `_ActionsTree`\> ? `_StoreWithGetters`<`G`\> : `_ExtractGettersFromSetupStore`<`SS`\>

Extrait les getters d'un type de store. Fonctionne à la fois avec un magasin de configuration et un store d'options.
store d'options.

#### Les types de paramètres

| Name |
| :--- |
| `SS` |

#### Défini dans

[pinia/src/store.ts:740](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/store.ts#L740)

___

### StoreOnActionListener

Ƭ **StoreOnActionListener**<`Id`, `S`, `G`, `A`\>: (`context`: [`StoreOnActionListenerContext`](pinia.md#storeonactionlistenercontext)<`Id`, `S`, `G`, {} extends `A` ? `_ActionsTree` : `A`\>) => `void`

#### Les types de paramètres

| Name | Type                                      |
| :--- | :---------------------------------------- |
| `Id` | extends `string`                          |
| `S`  | extends [`StateTree`](pinia.md#statetree) |
| `G`  | `G`                                       |
| `A`  | `A`                                       |

#### Type declaration

▸ (`context`): `void`

Argument of `store.$onAction()`

##### Les paramètres

| Name      | Type                                                                                                                            |
| :-------- | :------------------------------------------------------------------------------------------------------------------------------ |
| `context` | [`StoreOnActionListenerContext`](pinia.md#storeonactionlistenercontext)<`Id`, `S`, `G`, {} extends `A` ? `_ActionsTree` : `A`\> |

##### Renvoie à

`void`

#### Défini dans

[pinia/src/types.ts:243](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L243)

___

### StoreOnActionListenerContext

Ƭ **StoreOnActionListenerContext**<`Id`, `S`, `G`, `A`\>: `_ActionsTree` extends `A` ? `_StoreOnActionListenerContext`<[`StoreGeneric`](pinia.md#storegeneric), `string`, `_ActionsTree`\> : { [Name in keyof A]: Name extends string ? \_StoreOnActionListenerContext<Store<Id, S, G, A\>, Name, A\> : never }[keyof `A`]

Context object passed to callbacks of `store.$onAction(context => {})`
TODO: should have only the Id, the Store and Actions to generate the proper object

#### Les types de paramètres

| Name | Type                                      |
| :--- | :---------------------------------------- |
| `Id` | extends `string`                          |
| `S`  | extends [`StateTree`](pinia.md#statetree) |
| `G`  | `G`                                       |
| `A`  | `A`                                       |

#### Défini dans

[pinia/src/types.ts:227](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L227)

___

### StoreState

Ƭ **StoreState**<`SS`\>: `SS` extends [`Store`](pinia.md#store)<`string`, infer S, `_GettersTree`<[`StateTree`](pinia.md#statetree)\>, `_ActionsTree`\> ? `UnwrapRef`<`S`\> : `_ExtractStateFromSetupStore`<`SS`\>

Extract the state of a store type. Works with both a Setup Store or an
Options Store. Note this unwraps refs.

#### Les types de paramètres

| Name |
| :--- |
| `SS` |

#### Défini dans

[pinia/src/store.ts:753](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/store.ts#L753)

___

### SubscriptionCallback

Ƭ **SubscriptionCallback**<`S`\>: (`mutation`: [`SubscriptionCallbackMutation`](pinia.md#subscriptioncallbackmutation)<`S`\>, `state`: `UnwrapRef`<`S`\>) => `void`

#### Les types de paramètres

| Name |
| :--- |
| `S`  |

#### Type declaration

▸ (`mutation`, `state`): `void`

Callback of a subscription

##### Les paramètres

| Name       | Type                                                                          |
| :--------- | :---------------------------------------------------------------------------- |
| `mutation` | [`SubscriptionCallbackMutation`](pinia.md#subscriptioncallbackmutation)<`S`\> |
| `state`    | `UnwrapRef`<`S`\>                                                             |

##### Renvoie à

`void`

#### Défini dans

[pinia/src/types.ts:148](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L148)

___

### SubscriptionCallbackMutation

Ƭ **SubscriptionCallbackMutation**<`S`\>: [`SubscriptionCallbackMutationDirect`](../interfaces/pinia.SubscriptionCallbackMutationDirect.md) \| [`SubscriptionCallbackMutationPatchObject`](../interfaces/pinia.SubscriptionCallbackMutationPatchObject.md)<`S`\> \| [`SubscriptionCallbackMutationPatchFunction`](../interfaces/pinia.SubscriptionCallbackMutationPatchFunction.md)

Objet de contexte transmis à un appel d'abonnement.

#### Les types de paramètres

| Name |
| :--- |
| `S`  |

#### Défini dans

[pinia/src/types.ts:140](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L140)

___

### \_Awaited

Ƭ **\_Awaited**<`T`\>: `T` extends ``null`` \| `undefined` ? `T` : `T` extends `object` & { `then`: (`onfulfilled`: `F`) => `any`  } ? `F` extends (`value`: infer V, ...`args`: `any`) => `any` ? [`_Awaited`](pinia.md#_awaited)<`V`\> : `never` : `T`

#### Les types de paramètres

| Name |
| :--- |
| `T`  |

#### Défini dans

[pinia/src/types.ts:164](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L164)

## Variables

### PiniaVuePlugin

• **PiniaVuePlugin**: `Plugin`

Plugin Vue 2 qui doit être installé pour que pinia fonctionne. Remarque **vous n'avez pas besoin de
ce plugin si vous utilisez Nuxt.js**. Utilisez le `buildModule` à la place :
https://pinia.vuejs.org/ssr/nuxt.html.

**`exemple`**
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

**`param`** `Vue` importé de 'vue'.

#### Défini dans

[pinia/src/vue2-plugin.ts:28](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/vue2-plugin.ts#L28)

## Func## Fonctions
tions

### acceptHMRUpdate

▸ **acceptHMRUpdate**(`initialUseStore`, `hot`): (`newModule`: `any`) => `any`

Crée une fonction _accept_ à passer à `import.meta.hot` dans les applications Vite.

**`exemple`**
```js
const useUser = defineStore(...)
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot))
}
```

#### Les paramètres

| Name              | Type                                                                                                                                                                          | Description                             |
| :---------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------- |
| `initialUseStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`string`, [`StateTree`](pinia.md#statetree), `_GettersTree`<[`StateTree`](pinia.md#statetree)\>, `_ActionsTree`\> | return of the defineStore to hot update |
| `hot`             | `any`                                                                                                                                                                         | `import.meta.hot`                       |

#### Renvoie à

`fn`

▸ (`newModule`): `any`

##### Les paramètres

| Name        | Type  |
| :---------- | :---- |
| `newModule` | `any` |

##### Renvoie à

`any`

#### Défini dans

[pinia/src/hmr.ts:73](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/hmr.ts#L73)

___

### createPinia

▸ **createPinia**(): [`Pinia`](../interfaces/pinia.Pinia.md)

Crée une instance de Pinia qui sera utilisée par l'application.

#### Renvoie à

[`Pinia`](../interfaces/pinia.Pinia.md)

#### Défini dans

[pinia/src/createPinia.ts:10](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/createPinia.ts#L10)

___

### defineStore

▸ **defineStore**<`Id`, `S`, `G`, `A`\>(`id`, `options`): [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

Crée une fonction `useStore` qui récupère l'instance du magasin.

#### Les types de paramètres

| Name | Type                                           |
| :--- | :--------------------------------------------- |
| `Id` | extends `string`                               |
| `S`  | extends [`StateTree`](pinia.md#statetree) = {} |
| `G`  | extends `_GettersTree`<`S`\> = {}              |
| `A`  | {}                                             |

#### Les paramètres

| Name      | Type                                                                                                       | Description                      |
| :-------- | :--------------------------------------------------------------------------------------------------------- | :------------------------------- |
| `id`      | `Id`                                                                                                       | id du store (doit être unique) |
| `options` | `Omit`<[`DefineStoreOptions`](../interfaces/pinia.DefineStoreOptions.md)<`Id`, `S`, `G`, `A`\>, ``"id"``\> | options pour définir le store      |

#### Renvoie à

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

#### Défini dans

[pinia/src/store.ts:776](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/store.ts#L776)

▸ **defineStore**<`Id`, `S`, `G`, `A`\>(`options`): [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

Crée une fonction `useStore` qui récupère l'instance du store.

#### Les types de paramètres

| Name | Type                                           |
| :--- | :--------------------------------------------- |
| `Id` | extends `string`                               |
| `S`  | extends [`StateTree`](pinia.md#statetree) = {} |
| `G`  | extends `_GettersTree`<`S`\> = {}              |
| `A`  | {}                                             |

#### Les paramètres

| Name      | Type                                                                                    | Description                 |
| :-------- | :-------------------------------------------------------------------------------------- | :-------------------------- |
| `options` | [`DefineStoreOptions`](../interfaces/pinia.DefineStoreOptions.md)<`Id`, `S`, `G`, `A`\> | options pour définir le store |

#### Renvoie à

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

#### Défini dans

[pinia/src/store.ts:792](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/store.ts#L792)

▸ **defineStore**<`Id`, `SS`\>(`id`, `storeSetup`, `options?`): [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `_ExtractStateFromSetupStore`<`SS`\>, `_ExtractGettersFromSetupStore`<`SS`\>, `_ExtractActionsFromSetupStore`<`SS`\>\>

Crée une fonction `useStore` qui récupère l'instance du store.

#### Les types de paramètres

| Name | Type             |
| :--- | :--------------- |
| `Id` | extends `string` |
| `SS` | `SS`             |

#### Les paramètres

| Name         | Type                                                                                                                                                                                                     | Description                      |
| :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------- |
| `id`         | `Id`                                                                                                                                                                                                     | id du store (doit être unique) |
| `storeSetup` | () => `SS`                                                                                                                                                                                               | qui définit le store  |
| `options?`   | [`DefineSetupStoreOptions`](../interfaces/pinia.DefineSetupStoreOptions.md)<`Id`, `_ExtractStateFromSetupStore`<`SS`\>, `_ExtractGettersFromSetupStore`<`SS`\>, `_ExtractActionsFromSetupStore`<`SS`\>\> | extra options                    |

#### Renvoie à

[`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `_ExtractStateFromSetupStore`<`SS`\>, `_ExtractGettersFromSetupStore`<`SS`\>, `_ExtractActionsFromSetupStore`<`SS`\>\>

#### Défini dans

[pinia/src/store.ts:807](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/store.ts#L807)

___

### getActivePinia

▸ `Const` **getActivePinia**(): `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

Récupère la pinia actuellement active, s'il y en a une.

#### Renvoie à

`undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

#### Défini dans

[pinia/src/rootStore.ts:39](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L39)

___

### mapActions

▸ **mapActions**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): `_MapActionsObjectReturn`<`A`, `KeyMapper`\>

Permet d'utiliser directement les actions de votre store sans utiliser l'API de composition (`setup()`).
(`setup()`) en générant un objet à diffuser dans le champ `methods` du composant.
d'un composant. Les valeurs de l'objet sont les actions tandis que les clés sont
les noms des méthodes résultantes.

**`exemple`**
```js
export default {
  methods: {
    // autres propriétés des méthodes
    // useCounterStore possède deux actions nommées `increment` et `setCount`.
    ...mapActions(useCounterStore, { moar: 'increment', setIt: 'setCount' })
  },

  created() {
    this.moar()
    this.setIt(2)
  }
}
```

#### Les types de paramètres

| Name        | Type                                      |
| :---------- | :---------------------------------------- |
| `Id`        | extends `string`                          |
| `S`         | extends [`StateTree`](pinia.md#statetree) |
| `G`         | extends `_GettersTree`<`S`\>              |
| `A`         | `A`                                       |
| `KeyMapper` | extends `Record`<`string`, keyof `A`\>    |

#### Les paramètres

| Name        | Type                                                                              | Description                                |
| :---------- | :-------------------------------------------------------------------------------- | :----------------------------------------- |
| `useStore`  | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | nu store pour mapper depuis                          |
| `keyMapper` | `KeyMapper`                                                                       | pour définir de nouveaux noms pour les actions |

#### Renvoie à

`_MapActionsObjectReturn`<`A`, `KeyMapper`\>

#### Défini dans

[pinia/src/mapHelpers.ts:326](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/mapHelpers.ts#L326)

▸ **mapActions**<`Id`, `S`, `G`, `A`\>(`useStore`, `keys`): `_MapActionsReturn`<`A`\>

Permet d'utiliser directement les actions de votre store sans utiliser l'API de composition (`setup()`).
(`setup()`) en générant un objet à diffuser dans le champ `methods` du composant.
d'un composant.

**`exemple`**
```js
export default {
  methods: {
    // autres méthodes propriétés
    ...mapActions(useCounterStore, ['increment', 'setCount'])
  },

  created() {
    this.increment()
    this.setCount(2) // passer les arguments comme d'habitude
  }
}
```

#### Les types de paramètres

| Name | Type                                      |
| :--- | :---------------------------------------- |
| `Id` | extends `string`                          |
| `S`  | extends [`StateTree`](pinia.md#statetree) |
| `G`  | extends `_GettersTree`<`S`\>              |
| `A`  | `A`                                       |

#### Les paramètres

| Name       | Type                                                                              | Description                  |
| :--------- | :-------------------------------------------------------------------------------- | :--------------------------- |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | Un store pour mapper depuis            |
| `keys`     | keyof `A`[]                                                                       | tableau de noms d'actions à mettre en correspondance |

#### Renvoie à

`_MapActionsReturn`<`A`\>

#### Défini dans

[pinia/src/mapHelpers.ts:359](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/mapHelpers.ts#L359)

___

### mapGetters

▸ `Const` **mapGetters**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): `_MapStateObjectReturn`<`Id`, `S`, `G`, `A`, `KeyMapper`\>

Alias pour `mapState()`. Vous devriez utiliser `mapState()` à la place.

**`déprécié`** utilisez `mapState()` à la place.

#### Les types de paramètres

| Name        | Type                                                                                                                       |
| :---------- | :------------------------------------------------------------------------------------------------------------------------- |
| `Id`        | extends `string`                                                                                                           |
| `S`         | extends [`StateTree`](pinia.md#statetree)                                                                                  |
| `G`         | extends `_GettersTree`<`S`\>                                                                                               |
| `A`         | `A`                                                                                                                        |
| `KeyMapper` | extends `Record`<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](pinia.md#store)<`Id`, `S`, `G`, `A`\>) => `any`\> |

#### Les paramètres

| Name        | Type                                                                              |
| :---------- | :-------------------------------------------------------------------------------- |
| `useStore`  | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> |
| `keyMapper` | `KeyMapper`                                                                       |

#### Renvoie à

`_MapStateObjectReturn`<`Id`, `S`, `G`, `A`, `KeyMapper`\>

#### Défini dans

[pinia/src/mapHelpers.ts:285](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/mapHelpers.ts#L285)

▸ `Const` **mapGetters**<`Id`, `S`, `G`, `A`, `Keys`\>(`useStore`, `keys`): `_MapStateReturn`<`S`, `G`, `Keys`\>

Alias pour `mapState()`. Vous devriez utiliser `mapState()` à la place.

**`déprécié`** utilisez `mapState()` à la place.

#### Les types de paramètres

| Name   | Type                                      |
| :----- | :---------------------------------------- |
| `Id`   | extends `string`                          |
| `S`    | extends [`StateTree`](pinia.md#statetree) |
| `G`    | extends `_GettersTree`<`S`\>              |
| `A`    | `A`                                       |
| `Keys` | extends `string` \| `number` \| `symbol`  |

#### Les paramètres

| Name       | Type                                                                              |
| :--------- | :-------------------------------------------------------------------------------- |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> |
| `keys`     | readonly `Keys`[]                                                                 |

#### Renvoie à

`_MapStateReturn`<`S`, `G`, `Keys`\>

#### Défini dans

[pinia/src/mapHelpers.ts:285](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/mapHelpers.ts#L285)

___

### mapState

▸ **mapState**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): `_MapStateObjectReturn`<`Id`, `S`, `G`, `A`, `KeyMapper`\>

Permet d'utiliser l'état et les getters d'un store sans utiliser l'API de composition (`setup()`).
(`setup()`) en générant un objet à diffuser dans le champ `computed`.
d'un composant. Les valeurs de l'objet sont les propriétés/getters de l'état
tandis que les clés sont les noms des propriétés calculées résultantes.
Optionnellement, vous pouvez aussi passer une fonction personnalisée qui recevra le store
comme premier argument. Notez que même si elle a accès à l'instance du composant
via `this`, elle ne sera pas typée.

**`exemple`**
```js
export default {
  computed: {
    // autres propriétés calculées
    // useCounterStore a une propriété d'état nommée `count` et un getter `double`.
    ...mapState(useCounterStore, {
      n: 'count',
      triple: store => store.n * 3,
      // notez que nous ne pouvons pas utiliser une fonction flèche si nous voulons utiliser `this`.
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

#### Les types de paramètres

| Name        | Type                                                                                                                       |
| :---------- | :------------------------------------------------------------------------------------------------------------------------- |
| `Id`        | extends `string`                                                                                                           |
| `S`         | extends [`StateTree`](pinia.md#statetree)                                                                                  |
| `G`         | extends `_GettersTree`<`S`\>                                                                                               |
| `A`         | `A`                                                                                                                        |
| `KeyMapper` | extends `Record`<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](pinia.md#store)<`Id`, `S`, `G`, `A`\>) => `any`\> |

#### Les paramètres

| Name        | Type                                                                              | Description                           |
| :---------- | :-------------------------------------------------------------------------------- | :------------------------------------ |
| `useStore`  | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | un store pour mapper depuis                     |
| `keyMapper` | `KeyMapper`                                                                       | object of state properties or getters |

#### Renvoie à

`_MapStateObjectReturn`<`Id`, `S`, `G`, `A`, `KeyMapper`\>

#### Défini dans

[pinia/src/mapHelpers.ts:194](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/mapHelpers.ts#L194)

▸ **mapState**<`Id`, `S`, `G`, `A`, `Keys`\>(`useStore`, `keys`): `_MapStateReturn`<`S`, `G`, `Keys`\>

Permet d'utiliser l'état et les getters d'un store sans utiliser l'API de composition (`setup()`).
(`setup()`) en générant un objet à diffuser dans le champ `computed`.
d'un composant.

**`exemple`**
```js
export default {
  computed: {
    // autres propriétés calculées
    ...mapState(useCounterStore, ['count', 'double'])
  },

  created() {
    this.count // 2
    this.double // 4
  }
}
```

#### Les types de paramètres

| Name   | Type                                      |
| :----- | :---------------------------------------- |
| `Id`   | extends `string`                          |
| `S`    | extends [`StateTree`](pinia.md#statetree) |
| `G`    | extends `_GettersTree`<`S`\>              |
| `A`    | `A`                                       |
| `Keys` | extends `string` \| `number` \| `symbol`  |

#### Les paramètres

| Name       | Type                                                                              | Description                          |
| :--------- | :-------------------------------------------------------------------------------- | :----------------------------------- |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | Un store pour mapper depuis                    |
| `keys`     | readonly `Keys`[]                                                                 | tableau de propriétés ou de récupérateurs d'état |

#### Renvoie à

`_MapStateReturn`<`S`, `G`, `Keys`\>

#### Défini dans

[pinia/src/mapHelpers.ts:231](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/mapHelpers.ts#L231)

___

### mapStores

▸ **mapStores**<`Stores`\>(...`stores`): `_Spread`<`Stores`\>

Permet d'utiliser les stores sans l'API de composition (`setup()`) en générant un
qui sera étalé dans le champ `computed` d'un composant. Il accepte une liste
de définitions de stores.

**`exemple`**
```js
export default {
  computed: {
    // autres propriétés calculées
    ...mapStores(useUserStore, useCartStore)
  },

  created() {
    this.userStore // stocker avec l'id "user"
    this.cartStore // stocker avec l'id "cart"
  }
}
```

#### Les types de paramètres

| Name     | Type            |
| :------- | :-------------- |
| `Stores` | extends `any`[] |

#### Les paramètres

| Name        | Type          | Description                        |
| :---------- | :------------ | :--------------------------------- |
| `...stores` | [...Stores[]] | liste des stores à associer à un objet |

#### Renvoie à

`_Spread`<`Stores`\>

#### Défini dans

[pinia/src/mapHelpers.ts:96](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/mapHelpers.ts#L96)

___

### mapWritableState

▸ **mapWritableState**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): `_MapWritableStateObjectReturn`<`S`, `KeyMapper`\>

Identique à `mapState()` mais crée également des computed setters afin que l'état puisse être
être modifié. A la différence de `mapState()`, seules les propriétés `state` peuvent être
être ajoutées.

#### Les types de paramètres

| Name        | Type                                      |
| :---------- | :---------------------------------------- |
| `Id`        | extends `string`                          |
| `S`         | extends [`StateTree`](pinia.md#statetree) |
| `G`         | extends `_GettersTree`<`S`\>              |
| `A`         | `A`                                       |
| `KeyMapper` | extends `Record`<`string`, keyof `S`\>    |

#### Les paramètres

| Name        | Type                                                                              | Description                |
| :---------- | :-------------------------------------------------------------------------------- | :------------------------- |
| `useStore`  | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | un store pour mapper depuis          |
| `keyMapper` | `KeyMapper`                                                                       | objet de propriétés d'état |

#### Renvoie à

`_MapWritableStateObjectReturn`<`S`, `KeyMapper`\>

#### Défini dans

[pinia/src/mapHelpers.ts:440](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/mapHelpers.ts#L440)

▸ **mapWritableState**<`Id`, `S`, `G`, `A`\>(`useStore`, `keys`): `_MapWritableStateReturn`<`S`\>

Permet d'utiliser l'état et les getters d'un store sans utiliser l'API de composition (`setup()`).
(`setup()`) en générant un objet à diffuser dans le champ `computed`.
d'un composant.

#### Les types de paramètres

| Name | Type                                      |
| :--- | :---------------------------------------- |
| `Id` | extends `string`                          |
| `S`  | extends [`StateTree`](pinia.md#statetree) |
| `G`  | extends `_GettersTree`<`S`\>              |
| `A`  | `A`                                       |

#### Les paramètres

| Name       | Type                                                                              | Description               |
| :--------- | :-------------------------------------------------------------------------------- | :------------------------ |
| `useStore` | [`StoreDefinition`](../interfaces/pinia.StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | un store pour mapper depuis         |
| `keys`     | keyof `S`[]                                                                       | tableau de propriétés d'état |

#### Renvoie à

`_MapWritableStateReturn`<`S`\>

#### Défini dans

[pinia/src/mapHelpers.ts:458](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/mapHelpers.ts#L458)

___

### setActivePinia

▸ `Const` **setActivePinia**(`pinia`): `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

Active ou désactive la pinia active. Utilisé dans SSR et en interne lors de l'appel des
actions et getters

#### Les paramètres

| Name    | Type                                                   | Description    |
| :------ | :----------------------------------------------------- | :------------- |
| `pinia` | `undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md) | Pinia instance |

#### Renvoie à

`undefined` \| [`Pinia`](../interfaces/pinia.Pinia.md)

#### Défini dans

[pinia/src/rootStore.ts:33](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/rootStore.ts#L33)

___

### setMapStoreSuffix

▸ **setMapStoreSuffix**(`suffix`): `void`

Change le suffixe ajouté par `mapStores()`. Peut être défini comme une chaîne vide.
La valeur par défaut est `"Store"`. Assurez-vous d'étendre l'interface MapStoresCustomization
si vous utilisez TypeScript.

#### Les paramètres

| Name     | Type     | Description |
| :------- | :------- | :---------- |
| `suffix` | `string` | new suffix  |

#### Renvoie à

`void`

#### Défini dans

[pinia/src/mapHelpers.ts:66](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/mapHelpers.ts#L66)

___

### skipHydrate

▸ **skipHydrate**<`T`\>(`obj`): `T`

#### Les types de paramètres

| Name | Type  |
| :--- | :---- |
| `T`  | `any` |

#### Les paramètres

| Name  | Type |
| :---- | :--- |
| `obj` | `T`  |

#### Renvoie à

`T`

#### Défini dans

[pinia/src/store.ts:85](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/store.ts#L85)

___

### storeToRefs

▸ **storeToRefs**<`SS`\>(`store`): `ToRefs`<[`StoreState`](pinia.md#storestate)<`SS`\> & [`StoreGetters`](pinia.md#storegetters)<`SS`\> & [`PiniaCustomStateProperties`](../interfaces/pinia.PiniaCustomStateProperties.md)<[`StoreState`](pinia.md#storestate)<`SS`\>\>\>

Crée un objet de références avec tous les états, getters et propriétés d'état ajoutés par les plugins
du store. Similaire à `toRefs()` mais spécifiquement
spécialement conçu pour les magasins Pinia, donc les méthodes et les propriétés non
sont complètement ignorées.

#### Les types de paramètres

| Name | Type                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| :--- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SS` | extends [`_StoreWithState`](../interfaces/pinia._StoreWithState.md)<`string`, [`StateTree`](pinia.md#statetree), `_GettersTree`<[`StateTree`](pinia.md#statetree)\>, `_ActionsTree`, `SS`\> & {} & `_StoreWithGetters`<`_GettersTree`<[`StateTree`](pinia.md#statetree)\>\> & [`PiniaCustomProperties`](../interfaces/pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](pinia.md#statetree), `_GettersTree`<[`StateTree`](pinia.md#statetree)\>, `_ActionsTree`, `SS`\> & `PiniaCustomStateProperties`<[`StateTree`](pinia.md#statetree), `SS`\> |

#### Les paramètres

| Name    | Type | Description                    |
| :------ | :--- | :----------------------------- |
| `store` | `SS` | store to extract the refs from |

#### Renvoie à

`ToRefs`<[`StoreState`](pinia.md#storestate)<`SS`\> & [`StoreGetters`](pinia.md#storegetters)<`SS`\> & [`PiniaCustomStateProperties`](../interfaces/pinia.PiniaCustomStateProperties.md)<[`StoreState`](pinia.md#storestate)<`SS`\>\>\>

#### Défini dans

[pinia/src/storeToRefs.ts:13](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/storeToRefs.ts#L13)
