---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / \_StoreWithState

# Interface: \_StoreWithState<Id, S, G, A\> %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>}%

[pinia](../modules/pinia.md)._StoreWithState

Base store with state and functions. Should not be used directly.

## Type parameters %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) |
| `G` | `G` |
| `A` | `A` |

## Hierarchy %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Hierarchy}%

- [`StoreProperties`](pinia.StoreProperties.md)<`Id`\>

  ↳ **`_StoreWithState`**

## Properties %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Properties}%

### $id %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Properties-$id}%

• **$id**: `Id`

Unique identifier of the store

#### Inherited from %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Properties-$id-Inherited-from}%

[StoreProperties](pinia.StoreProperties.md).[$id](pinia.StoreProperties.md#$id)

___

### $state %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Properties-$state}%

• **$state**: `UnwrapRef`<`S`\> & [`PiniaCustomStateProperties`](pinia.PiniaCustomStateProperties.md)<`S`\>

State of the Store. Setting it will replace the whole state.

___

### \_customProperties %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Properties-\_customProperties}%

• **\_customProperties**: `Set`<`string`\>

Used by devtools plugin to retrieve properties added with plugins. Removed
in production. Can be used by the user to add property keys of the store
that should be displayed in devtools.

#### Inherited from %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Properties-\_customProperties-Inherited-from}%

[StoreProperties](pinia.StoreProperties.md).[_customProperties](pinia.StoreProperties.md#_customproperties)

## Methods %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Methods}%

### $dispose %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Methods-$dispose}%

▸ **$dispose**(): `void`

Stops the associated effect scope of the store and remove it from the store
registry. Plugins can override this method to cleanup any added effects.
e.g. devtools plugin stops displaying disposed stores from devtools.
Note this doesn't delete the state of the store, you have to do it manually with
`delete pinia.state.value[store.$id]` if you want to. If you don't and the
store is used again, it will reuse the previous state.

#### Returns %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Methods-$dispose-Returns}%

`void`

___

### $onAction %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Methods-$onAction}%

▸ **$onAction**(`callback`, `detached?`): () => `void`

Setups a callback to be called every time an action is about to get
invoked. The callback receives an object with all the relevant information
of the invoked action:
- `store`: the store it is invoked on
- `name`: The name of the action
- `args`: The parameters passed to the action

On top of these, it receives two functions that allow setting up a callback
once the action finishes or when it fails.

It also returns a function to remove the callback. Note than when calling
`store.$onAction()` inside of a component, it will be automatically cleaned
up when the component gets unmounted unless `detached` is set to true.

**`Example`**

```js
store.$onAction(({ after, onError }) => {
 // Here you could share variables between all of the hooks as well as
 // setting up watchers and clean them up
 after((resolvedValue) => {
   // can be used to cleanup side effects
.  // `resolvedValue` is the value returned by the action, if it's a
.  // Promise, it will be the resolved value instead of the Promise
 })
 onError((error) => {
   // can be used to pass up errors
 })
})
```

#### Parameters %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Methods-$onAction-Parameters}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | [`StoreOnActionListener`](../modules/pinia.md#storeonactionlistener)<`Id`, `S`, `G`, `A`\> | callback called before every action |
| `detached?` | `boolean` | detach the subscription from the context this is called from |

#### Returns %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Methods-$onAction-Returns}%

`fn`

function that removes the watcher

▸ (): `void`

Setups a callback to be called every time an action is about to get
invoked. The callback receives an object with all the relevant information
of the invoked action:
- `store`: the store it is invoked on
- `name`: The name of the action
- `args`: The parameters passed to the action

On top of these, it receives two functions that allow setting up a callback
once the action finishes or when it fails.

It also returns a function to remove the callback. Note than when calling
`store.$onAction()` inside of a component, it will be automatically cleaned
up when the component gets unmounted unless `detached` is set to true.

**`Example`**

```js
store.$onAction(({ after, onError }) => {
 // Here you could share variables between all of the hooks as well as
 // setting up watchers and clean them up
 after((resolvedValue) => {
   // can be used to cleanup side effects
.  // `resolvedValue` is the value returned by the action, if it's a
.  // Promise, it will be the resolved value instead of the Promise
 })
 onError((error) => {
   // can be used to pass up errors
 })
})
```

##### Returns %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Methods-$onAction-Returns-Returns}%

`void`

function that removes the watcher

___

### $patch %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Methods-$patch}%

▸ **$patch**(`partialState`): `void`

Applies a state patch to current state. Allows passing nested values

#### Parameters %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Methods-$patch-Parameters}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `partialState` | [`_DeepPartial`](../modules/pinia.md#_deeppartial)<`UnwrapRef`<`S`\>\> | patch to apply to the state |

#### Returns %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Methods-$patch-Returns}%

`void`

▸ **$patch**<`F`\>(`stateMutator`): `void`

Group multiple changes into one function. Useful when mutating objects like
Sets or arrays and applying an object patch isn't practical, e.g. appending
to an array. The function passed to `$patch()` **must be synchronous**.

#### Type parameters %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Methods-$patch-Type-parameters}%

| Name | Type |
| :------ | :------ |
| `F` | extends (`state`: `UnwrapRef`<`S`\>) => `any` |

#### Parameters %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Methods-$patch-Parameters_1}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `stateMutator` | `ReturnType`<`F`\> extends `Promise`<`any`\> ? `never` : `F` | function that mutates `state`, cannot be async |

#### Returns %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Methods-$patch-Returns_1}%

`void`

___

### $reset %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Methods-$reset}%

▸ **$reset**(): `void`

Resets the store to its initial state by building a new state object.
TODO: make this options only

#### Returns %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Methods-$reset-Returns}%

`void`

___

### $subscribe %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Methods-$subscribe}%

▸ **$subscribe**(`callback`, `options?`): () => `void`

Setups a callback to be called whenever the state changes. It also returns a function to remove the callback. Note
that when calling `store.$subscribe()` inside of a component, it will be automatically cleaned up when the
component gets unmounted unless `detached` is set to true.

#### Parameters %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Methods-$subscribe-Parameters}%

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | [`SubscriptionCallback`](../modules/pinia.md#subscriptioncallback)<`S`\> | callback passed to the watcher |
| `options?` | { `detached?`: `boolean`  } & `WatchOptions`<`boolean`\> | `watch` options + `detached` to detach the subscription from the context (usually a component) this is called from. Note that the `flush` option does not affect calls to `store.$patch()`. |

#### Returns %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Methods-$subscribe-Returns}%

`fn`

function that removes the watcher

▸ (): `void`

Setups a callback to be called whenever the state changes. It also returns a function to remove the callback. Note
that when calling `store.$subscribe()` inside of a component, it will be automatically cleaned up when the
component gets unmounted unless `detached` is set to true.

##### Returns %{#Interface:-\_StoreWithState<Id,-S,-G,-A\>-Methods-$subscribe-Returns-Returns}%

`void`

function that removes the watcher
