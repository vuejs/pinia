---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[Documentation de l'API](../index.md) / [pinia](../modules/pinia.md) / DefineStoreOptions

# Interface: DefineStoreOptions<Id, S, G, A\>

[pinia](../modules/pinia.md).DefineStoreOptions

Paramètre d'options de `defineStore()` pour les stores d'options. Peut être étendu pour
stores avec l'API des plugins. Voir [DefineStoreOptionsBase](pinia.DefineStoreOptionsBase.md).

## Les types de paramètres

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) |
| `G` | `G` |
| `A` | `A` |

## Hiérarchie

- [`DefineStoreOptionsBase`](pinia.DefineStoreOptionsBase.md)<`S`, [`Store`](../modules/pinia.md#store)<`Id`, `S`, `G`, `A`\>\>

  ↳ **`DefineStoreOptions`**

## Propriétés

### actions

• `Optional` **actions**: `A` & `ThisType`<`A` & `UnwrapRef`<`S`\> & [`_StoreWithState`](pinia._StoreWithState.md)<`Id`, `S`, `G`, `A`\> & `_StoreWithGetters`<`G`\> & [`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), `_GettersTree`<[`StateTree`](../modules/pinia.md#statetree)\>, `_ActionsTree`\>\>

Objet facultatif des actions.

#### Défini dans

[pinia/src/types.ts:654](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L654)

___

### getters

• `Optional` **getters**: `G` & `ThisType`<`UnwrapRef`<`S`\> & `_StoreWithGetters`<`G`\> & [`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), `_GettersTree`<[`StateTree`](../modules/pinia.md#statetree)\>, `_ActionsTree`\>\> & `_GettersTree`<`S`\>

Objet optionnel de getters.

#### Défini dans

[pinia/src/types.ts:647](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L647)

___

### id

• **id**: `Id`

Clé de chaîne unique permettant d'identifier le store dans l'application.

#### Défini dans

[pinia/src/types.ts:636](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L636)

## Les méthodes

### hydrate

▸ `Optional` **hydrate**(`storeState`, `initialState`): `void`

Permet d'hydrater le magasin pendant le SSR lorsque des états complexes (comme des références côté client uniquement) sont utilisés dans la définition du store et que copier la valeur de `pinia.state` n'est pas suffisant.
et que copier la valeur de `pinia.state` n'est pas suffisant.

**`exemple`**
Si dans votre `state`, vous utilisez des `customRef`, des `computed` ou des `ref` qui ont une valeur différente sur le serveur et le client, vous devez les hydrater manuellement.
serveur et le client, vous devez les hydrater manuellement. Par exemple, une référence personnalisée qui est stockée dans la mémoire locale
local :

```ts
const useStore = defineStore('main', {
  state: () => ({
    n: useLocalStorage('key', 0)
  }),
  hydrate(storeState, initialState) {
    // @ts-expect-error: https://github.com/microsoft/TypeScript/issues/43826
    storeState.n = useLocalStorage('key', 0)
  }
})
```

#### Les Paramètres

| Name | Type | Description |
| :------ | :------ | :------ |
| `storeState` | `UnwrapRef`<`S`\> | l'état actuel dans le store |
| `initialState` | `UnwrapRef`<`S`\> | initialState |

#### Renvoie à

`void`

#### Défini dans

[pinia/src/types.ts:687](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L687)

___

### state

▸ `Optional` **state**(): `S`

Fonction permettant de créer un nouvel état. **Il doit s'agir d'une fonction flèche** pour garantir
des typages corrects !

#### Renvoie à

`S`

#### Défini dans

[pinia/src/types.ts:642](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L642)
