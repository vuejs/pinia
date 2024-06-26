---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / disposePinia

# Function: disposePinia()

> **disposePinia**(`pinia`): `void`

Dispose a Pinia instance by stopping its effectScope and removing the state, plugins and stores. This is mostly
useful in tests, with both a testing pinia or a regular pinia and in applications that use multiple pinia instances.
Once disposed, the pinia instance cannot be used anymore.

## Parameters

• **pinia**: [`Pinia`](../interfaces/Pinia.md)

pinia instance

## Returns

`void`
