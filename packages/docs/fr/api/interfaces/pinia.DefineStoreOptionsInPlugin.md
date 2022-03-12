---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / DefineStoreOptionsInPlugin

# Interface: DefineStoreOptionsInPlugin<Id, S, G, A\>

[pinia](../modules/pinia.md).DefineStoreOptionsInPlugin

Available `options` when creating a pinia plugin.

## Les types de paramètres

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) |
| `G` | `G` |
| `A` | `A` |

## Hiérarchie

- `Omit`<[`DefineStoreOptions`](pinia.DefineStoreOptions.md)<`Id`, `S`, `G`, `A`\>, ``"id"`` \| ``"actions"``\>

  ↳ **`DefineStoreOptionsInPlugin`**

## Propriétés

### actions

• **actions**: `A`

Objet extrait des actions. Ajouté par useStore() lorsque le store est construit
en utilisant l'API de configuration, sinon utilise celui passé à `defineStore()`.
La valeur par défaut est un objet vide si aucune action n'est définie.

#### Défini dans

[pinia/src/types.ts:723](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L723)

___

### getters

• `Optional` **getters**: `G` & `ThisType`<`UnwrapRef`<`S`\> & `_StoreWithGetters`<`G`\> & [`PiniaCustomProperties`](pinia.PiniaCustomProperties.md)<`string`, [`StateTree`](../modules/pinia.md#statetree), `_GettersTree`<[`StateTree`](../modules/pinia.md#statetree)\>, `_ActionsTree`\>\> & `_GettersTree`<`S`\>

Objet optionnel de getters.

#### Hérité de

Omit.getters

#### Défini dans

[pinia/src/types.ts:647](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L647)

## Les méthodes

### hydrater

▸ `Optional` **hydrate**(`storeState`, `initialState`): `void`

Permet d'hydrater le store pendant le SSR lorsque des états complexes (comme des refs côté client uniquement) sont utilisés dans la définition du store et que copier la valeur de `pinia.state` n'est pas suffisant.
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

#### Les paramètres

| Name | Type | Description |
| :------ | :------ | :------ |
| `storeState` | `UnwrapRef`<`S`\> | the current state in the store |
| `initialState` | `UnwrapRef`<`S`\> | initialState |

#### Renvoie à

`void`

#### Hérité de

Omit.hydrate

#### Défini dans

[pinia/src/types.ts:687](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L687)

___

### state

▸ `Optional` **state**(): `S`

Fonction permettant de créer un nouvel état. **Doit être une fonction flèche** pour garantir
des typages corrects!

#### Renvoie à

`S`

#### Hérité de

Omit.state

#### Défini dans

[pinia/src/types.ts:642](https://github.com/posva/pinia/blob/46c50b2/packages/pinia/src/types.ts#L642)
