# Interface: DefineStoreOptionsBase<S, Store\>

Options passed to `defineStore()` that are common between option and setup
stores. Extend this interface if you want to add custom options to both kinds
of stores.

## Type parameters

| Name | Type |
| :------ | :------ |
| `S` | extends [`StateTree`](../type_aliases.md#statetree) |
| `Store` | `Store` |

## Hierarchy

- **`DefineStoreOptionsBase`**

  ↳ [`DefineStoreOptions`](DefineStoreOptions.md)

  ↳ [`DefineSetupStoreOptions`](DefineSetupStoreOptions.md)
