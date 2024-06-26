---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / \_ExtractGettersFromSetupStore\_Keys

# Type Alias: \_ExtractGettersFromSetupStore\_Keys\<SS\>

> **\_ExtractGettersFromSetupStore\_Keys**\<`SS`\>: keyof `{ [K in keyof SS as SS[K] extends ComputedRef ? K : never]: any }`

Type that enables refactoring through IDE.
For internal use **only**

## Type Parameters

• **SS**
