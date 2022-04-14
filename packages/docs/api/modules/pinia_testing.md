---
sidebar: "auto"
editLinks: false
sidebarDepth: 3
---

[API Documentation](../index.md) / @pinia/testing

# Module: @pinia/testing

## Interfaces

- [TestingOptions](../interfaces/pinia_testing.TestingOptions.md)
- [TestingPinia](../interfaces/pinia_testing.TestingPinia.md)

## Functions

### createTestingPinia

▸ **createTestingPinia**(`options?`): [`TestingPinia`](../interfaces/pinia_testing.TestingPinia.md)

Creates a pinia instance designed for unit tests that **requires mocking**
the stores. By default, **all actions are mocked** and therefore not
executed. This allows you to unit test your store and components separately.
You can change this with the `stubActions` option. If you are using jest,
they are replaced with `jest.fn()`, otherwise, you must provide your own
`createSpy` option.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`TestingOptions`](../interfaces/pinia_testing.TestingOptions.md) | options to configure the testing pinia |

#### Returns

[`TestingPinia`](../interfaces/pinia_testing.TestingPinia.md)

a augmented pinia instance

#### Defined in

[packages/testing/src/testing.ts:92](https://github.com/vuejs/pinia/blob/2b998ee/packages/testing/src/testing.ts#L92)
