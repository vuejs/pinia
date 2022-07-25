---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / [pinia](../modules/pinia.md) / \_StoreWithState

# Interface: \_StoreWithState<Id, S, G, A\>

[pinia](../modules/pinia.md)._StoreWithState

Base store with state and functions. Should not be used directly.

## Type parameters

| Name | Type |
| :------ | :------ |
| `Id` | extends `string` |
| `S` | extends [`StateTree`](../modules/pinia.md#statetree) |
| `G` | `G` |
| `A` | `A` |

## Hierarchy

- [`StoreProperties`](pinia.StoreProperties.md)<`Id`\>

  ↳ **`_StoreWithState`**

## Properties

### $id

• **$id**: `Id`

Unique identifier of the store

#### Inherited from

[StoreProperties](pinia.StoreProperties.md).[$id](pinia.StoreProperties.md#$id)

___

### $state

• **$state**: `UnwrapRef`<`S`\> & [`PiniaCustomStateProperties`](pinia.PiniaCustomStateProperties.md)<`S`\>

State of the Store. Setting it will replace the whole state.

___

### \_customProperties

• **\_customProperties**: `Set`<`string`\>

Used by devtools plugin to retrieve properties added with plugins. Removed
in production. Can be used by the user to add property keys of the store
that should be displayed in devtools.

#### Inherited from

[StoreProperties](pinia.StoreProperties.md).[_customProperties](pinia.StoreProperties.md#_customproperties)

## Methods

### $dispose

▸ **$dispose**(): `void`

Stops the associated effect scope of the store and remove it from the store
registry. Plugins can override this method to cleanup any added effects.
e.g. devtools plugin stops displaying disposed stores from devtools.

#### Returns

`void`

___

### $onAction

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

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | [`StoreOnActionListener`](../modules/pinia.md#storeonactionlistener)<`Id`, `S`, `G`, `A`\> | callback called before every action |
| `detached?` | `boolean` | detach the subscription from the context this is called from |

#### Returns

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

##### Returns

`void`

function that removes the watcher

___

### $patch

▸ **$patch**(`partialState`): `void`

Applies a state patch to current state. Allows passing nested values

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `partialState` | [`_DeepPartial`](../modules/pinia.md#_deeppartial)<`UnwrapRef`<`S`\>\> | patch to apply to the state |

#### Returns

`void`

▸ **$patch**<`F`\>(`stateMutator`): `void`

Group multiple changes into one function. Useful when mutating objects like
Sets or arrays and applying an object patch isn't practical, e.g. appending
to an array. The function passed to `$patch()` **must be synchronous**.

#### Type parameters

| Name | Type |
| :------ | :------ |
| `F` | extends (`state`: `UnwrapRef`<`S`\>) => `any` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stateMutator` | `ReturnType`<`F`\> extends `Promise`<`any`\> ? `never` : `F` | function that mutates `state`, cannot be async |

#### Returns

`void`

___

### $reset

▸ **$reset**(): `void`

Resets the store to its initial state by building a new state object.
TODO: make this options only

#### Returns

`void`

___

### $subscribe

▸ **$subscribe**(`callback`, `options?`): () => `void`

Setups a callback to be called whenever the state changes. It also returns a function to remove the callback. Note
that when calling `store.$subscribe()` inside of a component, it will be automatically cleaned up when the
component gets unmounted unless `detached` is set to true.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | [`SubscriptionCallback`](../modules/pinia.md#subscriptioncallback)<`S`\> | callback passed to the watcher |
| `options?` | { `detached?`: `boolean`  } & `WatchOptions`<`boolean`\> | `watch` options + `detached` to detach the subscription from the context (usually a component) this is called from. Note that the `flush` option does not affect calls to `store.$patch()`. |

#### Returns

`fn`

function that removes the watcher

▸ (): `void`

Setups a callback to be called whenever the state changes. It also returns a function to remove the callback. Note
that when calling `store.$subscribe()` inside of a component, it will be automatically cleaned up when the
component gets unmounted unless `detached` is set to true.

##### Returns

`void`

function that removes the watcher
