---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / Pinia

# Interface: Pinia

Every application must own its own pinia to be able to create stores

## Extended by

- [`TestingPinia`](../../@pinia/testing/interfaces/TestingPinia.md)

## Properties

### install()

> **install**: (`app`) => `void`

#### Parameters

• **app**: `App`\<`any`\>

#### Returns

`void`

***

### state

> **state**: `Ref`\<`Record`\<`string`, [`StateTree`](../type-aliases/StateTree.md)\>, `Record`\<`string`, [`StateTree`](../type-aliases/StateTree.md)\>\>

root state

## Methods

### use()

> **use**(`plugin`): [`Pinia`](Pinia.md)

Adds a store plugin to extend every store

#### Parameters

• **plugin**: [`PiniaPlugin`](PiniaPlugin.md)

store plugin to add

#### Returns

[`Pinia`](Pinia.md)
