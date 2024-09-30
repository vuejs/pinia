---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / \_StoreWithState

# Interface: \_StoreWithState\<Id, S, G, A\>

Base store with state and functions. Should not be used directly.

## Extends

- [`StoreProperties`](StoreProperties.md)\<`Id`\>

## Type Parameters

• **Id** *extends* `string`

• **S** *extends* [`StateTree`](../type-aliases/StateTree.md)

• **G**

• **A**

## Properties

### \_customProperties

> **\_customProperties**: `Set`\<`string`\>

Used by devtools plugin to retrieve properties added with plugins. Removed
in production. Can be used by the user to add property keys of the store
that should be displayed in devtools.

#### Inherited from

[`StoreProperties`](StoreProperties.md).[`_customProperties`](StoreProperties.md#_customProperties)

***

### $id

> **$id**: `Id`

Unique identifier of the store

#### Inherited from

[`StoreProperties`](StoreProperties.md).[`$id`](StoreProperties.md#$id)

***

### $state

> **$state**: `UnwrapRef`\<`S`\> & [`PiniaCustomStateProperties`](PiniaCustomStateProperties.md)\<`S`\>

State of the Store. Setting it will internally call `$patch()` to update the state.

## Methods

### $dispose()

> **$dispose**(): `void`

Stops the associated effect scope of the store and remove it from the store
registry. Plugins can override this method to cleanup any added effects.
e.g. devtools plugin stops displaying disposed stores from devtools.
Note this doesn't delete the state of the store, you have to do it manually with
`delete pinia.state.value[store.$id]` if you want to. If you don't and the
store is used again, it will reuse the previous state.

#### Returns

`void`

***

### $onAction()

> **$onAction**(`callback`, `detached`?): () => `void`

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

#### Parameters

• **callback**: [`StoreOnActionListener`](../type-aliases/StoreOnActionListener.md)\<`Id`, `S`, `G`, `A`\>

callback called before every action

• **detached?**: `boolean`

detach the subscription from the context this is called from

#### Returns

`Function`

function that removes the watcher

##### Returns

`void`

#### Example

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

***

### $patch()

#### $patch(partialState)

> **$patch**(`partialState`): `void`

Applies a state patch to current state. Allows passing nested values

##### Parameters

• **partialState**: [`_DeepPartial`](../type-aliases/DeepPartial.md)\<`UnwrapRef`\<`S`\>\>

patch to apply to the state

##### Returns

`void`

#### $patch(stateMutator)

> **$patch**\<`F`\>(`stateMutator`): `void`

Group multiple changes into one function. Useful when mutating objects like
Sets or arrays and applying an object patch isn't practical, e.g. appending
to an array. The function passed to `$patch()` **must be synchronous**.

##### Type Parameters

• **F** *extends* (`state`) => `any`

##### Parameters

• **stateMutator**: `ReturnType`\<`F`\> *extends* `Promise`\<`any`\> ? `never` : `F`

function that mutates `state`, cannot be asynchronous

##### Returns

`void`

***

### $reset()

> **$reset**(): `void`

Resets the store to its initial state by building a new state object.

#### Returns

`void`

***

### $subscribe()

> **$subscribe**(`callback`, `options`?): () => `void`

Setups a callback to be called whenever the state changes. It also returns a function to remove the callback. Note
that when calling `store.$subscribe()` inside of a component, it will be automatically cleaned up when the
component gets unmounted unless `detached` is set to true.

#### Parameters

• **callback**: [`SubscriptionCallback`](../type-aliases/SubscriptionCallback.md)\<`S`\>

callback passed to the watcher

• **options?**: `object` & `WatchOptions`\<`boolean`\>

`watch` options + `detached` to detach the subscription from the context (usually a component)
this is called from. Note that the `flush` option does not affect calls to `store.$patch()`.

#### Returns

`Function`

function that removes the watcher

##### Returns

`void`
