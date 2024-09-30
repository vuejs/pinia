---
editLink: false
---

[**API Documentation**](../../../index.md) • **Docs**

***

[API Documentation](../../../index.md) / [@pinia/testing](../index.md) / TestingPinia

# Interface: TestingPinia

Pinia instance specifically designed for testing. Extends a regular
`Pinia` instance with test specific properties.

## Extends

- [`Pinia`](../../../pinia/interfaces/Pinia.md)

## Properties

### app

> **app**: `App`\<`any`\>

App used by Pinia

***

### install()

> **install**: (`app`) => `void`

#### Parameters

• **app**: `App`\<`any`\>

#### Returns

`void`

#### Inherited from

[`Pinia`](../../../pinia/interfaces/Pinia.md).[`install`](../../../pinia/interfaces/Pinia.md#install)

***

### state

> **state**: `Ref`\<`Record`\<`string`, [`StateTree`](../../../pinia/type-aliases/StateTree.md)\>, `Record`\<`string`, [`StateTree`](../../../pinia/type-aliases/StateTree.md)\>\>

root state

#### Inherited from

[`Pinia`](../../../pinia/interfaces/Pinia.md).[`state`](../../../pinia/interfaces/Pinia.md#state)

## Methods

### use()

> **use**(`plugin`): [`Pinia`](../../../pinia/interfaces/Pinia.md)

Adds a store plugin to extend every store

#### Parameters

• **plugin**: [`PiniaPlugin`](../../../pinia/interfaces/PiniaPlugin.md)

store plugin to add

#### Returns

[`Pinia`](../../../pinia/interfaces/Pinia.md)

#### Inherited from

[`Pinia`](../../../pinia/interfaces/Pinia.md).[`use`](../../../pinia/interfaces/Pinia.md#use)
