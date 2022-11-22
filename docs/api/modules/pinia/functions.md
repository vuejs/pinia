# Functions

## acceptHMRUpdate

▸ **acceptHMRUpdate**(`initialUseStore`, `hot`): (`newModule`: `any`) => `any`

Creates an _accept_ function to pass to `import.meta.hot` in Vite applications.

**`Example`**

```js
const useUser = defineStore(/* ... */)
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUser, import.meta.hot))
}
```

### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialUseStore` | [`StoreDefinition`](/api/modules/pinia/interfaces/StoreDefinition.md)<`string`, [`StateTree`](type_aliases.md#statetree), [`_GettersTree`](type_aliases.md#getterstree)<[`StateTree`](type_aliases.md#statetree)\>, [`_ActionsTree`](type_aliases.md#actionstree)\> | return of the defineStore to hot update |
| `hot` | `any` | `import.meta.hot` |

### Returns

`fn`

▸ (`newModule`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `newModule` | `any` |

#### Returns

`any`

## createPinia

▸ **createPinia**(): [`Pinia`](/api/modules/pinia/interfaces/Pinia.md)

Creates a Pinia instance to be used by the application

### Returns

[`Pinia`](/api/modules/pinia/interfaces/Pinia.md)

## defineStore

▸ **defineStore**<`Id`, `S`, `G`, `A`\>(`id`, `options`): [`StoreDefinition`](/api/modules/pinia/interfaces/StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

Creates a `useStore` function that retrieves the store instance

### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](type_aliases.md#statetree) = {} |
| `G` | extends [`_GettersTree`](type_aliases.md#getterstree)<`S`\> = {} |
| `A` | {} |

### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `Id` | id of the store (must be unique) |
| `options` | `Omit`<[`DefineStoreOptions`](/api/modules/pinia/interfaces/DefineStoreOptions.md)<`Id`, `S`, `G`, `A`\>, ``"id"``\> | options to define the store |

### Returns

[`StoreDefinition`](/api/modules/pinia/interfaces/StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

▸ **defineStore**<`Id`, `S`, `G`, `A`\>(`options`): [`StoreDefinition`](/api/modules/pinia/interfaces/StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

Creates a `useStore` function that retrieves the store instance

### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](type_aliases.md#statetree) = {} |
| `G` | extends [`_GettersTree`](type_aliases.md#getterstree)<`S`\> = {} |
| `A` | {} |

### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`DefineStoreOptions`](/api/modules/pinia/interfaces/DefineStoreOptions.md)<`Id`, `S`, `G`, `A`\> | options to define the store |

### Returns

[`StoreDefinition`](/api/modules/pinia/interfaces/StoreDefinition.md)<`Id`, `S`, `G`, `A`\>

▸ **defineStore**<`Id`, `SS`\>(`id`, `storeSetup`, `options?`): [`StoreDefinition`](/api/modules/pinia/interfaces/StoreDefinition.md)<`Id`, [`_ExtractStateFromSetupStore`](type_aliases.md#extractstatefromsetupstore)<`SS`\>, [`_ExtractGettersFromSetupStore`](type_aliases.md#extractgettersfromsetupstore)<`SS`\>, [`_ExtractActionsFromSetupStore`](type_aliases.md#extractactionsfromsetupstore)<`SS`\>\>

Creates a `useStore` function that retrieves the store instance

### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `SS` | `SS` |

### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `Id` | id of the store (must be unique) |
| `storeSetup` | () => `SS` | function that defines the store |
| `options?` | [`DefineSetupStoreOptions`](/api/modules/pinia/interfaces/DefineSetupStoreOptions.md)<`Id`, [`_ExtractStateFromSetupStore`](type_aliases.md#extractstatefromsetupstore)<`SS`\>, [`_ExtractGettersFromSetupStore`](type_aliases.md#extractgettersfromsetupstore)<`SS`\>, [`_ExtractActionsFromSetupStore`](type_aliases.md#extractactionsfromsetupstore)<`SS`\>\> | extra options |

### Returns

[`StoreDefinition`](/api/modules/pinia/interfaces/StoreDefinition.md)<`Id`, [`_ExtractStateFromSetupStore`](type_aliases.md#extractstatefromsetupstore)<`SS`\>, [`_ExtractGettersFromSetupStore`](type_aliases.md#extractgettersfromsetupstore)<`SS`\>, [`_ExtractActionsFromSetupStore`](type_aliases.md#extractactionsfromsetupstore)<`SS`\>\>

## getActivePinia

▸ **getActivePinia**(): `undefined` \| [`Pinia`](/api/modules/pinia/interfaces/Pinia.md)

Get the currently active pinia if there is any.

### Returns

`undefined` \| [`Pinia`](/api/modules/pinia/interfaces/Pinia.md)

## mapActions

▸ **mapActions**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapActionsObjectReturn`](type_aliases.md#mapactionsobjectreturn)<`A`, `KeyMapper`\>

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

### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](type_aliases.md#statetree) |
| `G` | extends [`_GettersTree`](type_aliases.md#getterstree)<`S`\> |
| `A` | `A` |
| `KeyMapper` | extends `Record`<`string`, keyof `A`\> |

### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](/api/modules/pinia/interfaces/StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keyMapper` | `KeyMapper` | object to define new names for the actions |

### Returns

[`_MapActionsObjectReturn`](type_aliases.md#mapactionsobjectreturn)<`A`, `KeyMapper`\>

▸ **mapActions**<`Id`, `S`, `G`, `A`\>(`useStore`, `keys`): [`_MapActionsReturn`](type_aliases.md#mapactionsreturn)<`A`\>

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

### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](type_aliases.md#statetree) |
| `G` | extends [`_GettersTree`](type_aliases.md#getterstree)<`S`\> |
| `A` | `A` |

### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](/api/modules/pinia/interfaces/StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keys` | keyof `A`[] | array of action names to map |

### Returns

[`_MapActionsReturn`](type_aliases.md#mapactionsreturn)<`A`\>

## mapGetters

▸ **mapGetters**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapStateObjectReturn`](type_aliases.md#mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

Alias for `mapState()`. You should use `mapState()` instead.

**`Deprecated`**

use `mapState()` instead.

### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](type_aliases.md#statetree) |
| `G` | extends [`_GettersTree`](type_aliases.md#getterstree)<`S`\> |
| `A` | `A` |
| `KeyMapper` | extends `Record`<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](type_aliases.md#store)<`Id`, `S`, `G`, `A`\>) => `any`\> |

### Parameters

| Name | Type |
| :------ | :------ |
| `useStore` | [`StoreDefinition`](./interfaces/StoreDefinition.md)<`Id`, `S`, `G`, `A`\> |
| `keyMapper` | `KeyMapper` |

### Returns

[`_MapStateObjectReturn`](type_aliases.md#mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

▸ **mapGetters**<`Id`, `S`, `G`, `A`, `Keys`\>(`useStore`, `keys`): [`_MapStateReturn`](type_aliases.md#mapstatereturn)<`S`, `G`, `Keys`\>

Alias for `mapState()`. You should use `mapState()` instead.

**`Deprecated`**

use `mapState()` instead.

### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](type_aliases.md#statetree) |
| `G` | extends [`_GettersTree`](type_aliases.md#getterstree)<`S`\> |
| `A` | `A` |
| `Keys` | extends `string` \| `number` \| `symbol` |

### Parameters

| Name | Type |
| :------ | :------ |
| `useStore` | [`StoreDefinition`](./interfaces/StoreDefinition.md)<`Id`, `S`, `G`, `A`\> |
| `keys` | readonly `Keys`[] |

### Returns

[`_MapStateReturn`](type_aliases.md#mapstatereturn)<`S`, `G`, `Keys`\>

## mapState

▸ **mapState**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapStateObjectReturn`](type_aliases.md#mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

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

### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](type_aliases.md#statetree) |
| `G` | extends [`_GettersTree`](type_aliases.md#getterstree)<`S`\> |
| `A` | `A` |
| `KeyMapper` | extends `Record`<`string`, keyof `S` \| keyof `G` \| (`store`: [`Store`](type_aliases.md#store)<`Id`, `S`, `G`, `A`\>) => `any`\> |

### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](/api/modules/pinia/interfaces/StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keyMapper` | `KeyMapper` | object of state properties or getters |

### Returns

[`_MapStateObjectReturn`](type_aliases.md#mapstateobjectreturn)<`Id`, `S`, `G`, `A`, `KeyMapper`\>

▸ **mapState**<`Id`, `S`, `G`, `A`, `Keys`\>(`useStore`, `keys`): [`_MapStateReturn`](type_aliases.md#mapstatereturn)<`S`, `G`, `Keys`\>

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

### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](type_aliases.md#statetree) |
| `G` | extends [`_GettersTree`](type_aliases.md#getterstree)<`S`\> |
| `A` | `A` |
| `Keys` | extends `string` \| `number` \| `symbol` |

### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](/api/modules/pinia/interfaces/StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keys` | readonly `Keys`[] | array of state properties or getters |

### Returns

[`_MapStateReturn`](type_aliases.md#mapstatereturn)<`S`, `G`, `Keys`\>

## mapStores

▸ **mapStores**<`Stores`\>(...`stores`): [`_Spread`](type_aliases.md#spread)<`Stores`\>

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

### Type parameters

| Name | Type |
| :------ | :------ |
| `Stores` | extends `any`[] |

### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `...stores` | [...Stores[]] | list of stores to map to an object |

### Returns

[`_Spread`](type_aliases.md#spread)<`Stores`\>

## mapWritableState

▸ **mapWritableState**<`Id`, `S`, `G`, `A`, `KeyMapper`\>(`useStore`, `keyMapper`): [`_MapWritableStateObjectReturn`](type_aliases.md#mapwritablestateobjectreturn)<`S`, `KeyMapper`\>

Same as `mapState()` but creates computed setters as well so the state can be
modified. Differently from `mapState()`, only `state` properties can be
added.

### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](type_aliases.md#statetree) |
| `G` | extends [`_GettersTree`](type_aliases.md#getterstree)<`S`\> |
| `A` | `A` |
| `KeyMapper` | extends `Record`<`string`, keyof `S`\> |

### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](/api/modules/pinia/interfaces/StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keyMapper` | `KeyMapper` | object of state properties |

### Returns

[`_MapWritableStateObjectReturn`](type_aliases.md#mapwritablestateobjectreturn)<`S`, `KeyMapper`\>

▸ **mapWritableState**<`Id`, `S`, `G`, `A`\>(`useStore`, `keys`): [`_MapWritableStateReturn`](type_aliases.md#mapwritablestatereturn)<`S`\>

Allows using state and getters from one store without using the composition
API (`setup()`) by generating an object to be spread in the `computed` field
of a component.

### Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](type_aliases.md#statetree) |
| `G` | extends [`_GettersTree`](type_aliases.md#getterstree)<`S`\> |
| `A` | `A` |

### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `useStore` | [`StoreDefinition`](/api/modules/pinia/interfaces/StoreDefinition.md)<`Id`, `S`, `G`, `A`\> | store to map from |
| `keys` | keyof `S`[] | array of state properties |

### Returns

[`_MapWritableStateReturn`](type_aliases.md#mapwritablestatereturn)<`S`\>

## setActivePinia

▸ **setActivePinia**(`pinia`): `undefined` \| [`Pinia`](/api/modules/pinia/interfaces/Pinia.md)

Sets or unsets the active pinia. Used in SSR and internally when calling
actions and getters

### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `pinia` | `undefined` \| [`Pinia`](/api/modules/pinia/interfaces/Pinia.md) | Pinia instance |

### Returns

`undefined` \| [`Pinia`](/api/modules/pinia/interfaces/Pinia.md)

## setMapStoreSuffix

▸ **setMapStoreSuffix**(`suffix`): `void`

Changes the suffix added by `mapStores()`. Can be set to an empty string.
Defaults to `"Store"`. Make sure to extend the MapStoresCustomization
interface if you are using TypeScript.

### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `suffix` | `string` | new suffix |

### Returns

`void`

## skipHydrate

▸ **skipHydrate**<`T`\>(`obj`): `T`

Tells Pinia to skip the hydration process of a given object. This is useful in setup stores (only) when you return a
stateful object in the store but it isn't really state. e.g. returning a router instance in a setup store.

### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `obj` | `T` | target object |

### Returns

`T`

obj

## storeToRefs

▸ **storeToRefs**<`SS`\>(`store`): `ToRefs`<[`StoreState`](type_aliases.md#storestate)<`SS`\> & [`StoreGetters`](type_aliases.md#storegetters)<`SS`\> & [`PiniaCustomStateProperties`](/api/modules/pinia/interfaces/PiniaCustomStateProperties.md)<[`StoreState`](type_aliases.md#storestate)<`SS`\>\>\>

Creates an object of references with all the state, getters, and plugin-added
state properties of the store. Similar to `toRefs()` but specifically
designed for Pinia stores so methods and non reactive properties are
completely ignored.

### Type parameters

| Name | Type |
| :------ | :------ |
| `SS` | extends [`_StoreWithState`](/api/modules/pinia/interfaces/_StoreWithState.md)<`string`, [`StateTree`](type_aliases.md#statetree), [`_GettersTree`](type_aliases.md#getterstree)<[`StateTree`](type_aliases.md#statetree)\>, [`_ActionsTree`](type_aliases.md#actionstree), `SS`\> & [`StateTree`](type_aliases.md#statetree) & [`_StoreWithGetters`](type_aliases.md#storewithgetters)<[`_GettersTree`](type_aliases.md#getterstree)<[`StateTree`](type_aliases.md#statetree)\>\> & [`PiniaCustomProperties`](/api/modules/pinia/interfaces/PiniaCustomProperties.md)<`string`, [`StateTree`](type_aliases.md#statetree), [`_GettersTree`](type_aliases.md#getterstree)<[`StateTree`](type_aliases.md#statetree)\>, [`_ActionsTree`](type_aliases.md#actionstree), `SS`\> & [`PiniaCustomStateProperties`](/api/modules/pinia/interfaces/PiniaCustomStateProperties.md)<[`StateTree`](type_aliases.md#statetree), `SS`\> |

### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `store` | `SS` | store to extract the refs from |

### Returns

`ToRefs`<[`StoreState`](type_aliases.md#storestate)<`SS`\> & [`StoreGetters`](type_aliases.md#storegetters)<`SS`\> & [`PiniaCustomStateProperties`](/api/modules/pinia/interfaces/PiniaCustomStateProperties.md)<[`StoreState`](type_aliases.md#storestate)<`SS`\>\>\>
