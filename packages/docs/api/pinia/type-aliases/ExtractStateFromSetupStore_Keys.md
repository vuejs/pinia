---
editLink: false
---

[**API Documentation**](../../index.md) • **Docs**

***

[API Documentation](../../index.md) / [pinia](../index.md) / \_ExtractStateFromSetupStore\_Keys

# Type Alias: \_ExtractStateFromSetupStore\_Keys\<SS\>

> **\_ExtractStateFromSetupStore\_Keys**\<`SS`\>: keyof \{ \[K in keyof SS as SS\[K\] extends \_Method \| ComputedRef ? never : K\]: any \}

Type that enables refactoring through IDE.
For internal use **only**

## Type Parameters

• **SS**
