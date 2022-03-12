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

## Fonctions

### createTestingPinia

▸ **createTestingPinia**(`options?`): [`TestingPinia`](../interfaces/pinia_testing.TestingPinia.md)

Crée une instance de pinia conçue pour les tests unitaires qui **nécessite un mocking**
les stores. Par défaut, **toutes les actions sont simulées** et ne sont donc pas
exécutées. Cela vous permet de tester votre store et vos composants séparément.
Vous pouvez changer cela avec l'option `stubActions`. Si vous utilisez jest,
ils sont remplacés par `jest.fn()`, sinon, vous devez fournir votre propre
option `createSpy`.

#### Les paramètres

| Name | Type | Description |
| :------ | :------ | :------ |
| `options` | [`TestingOptions`](../interfaces/pinia_testing.TestingOptions.md) | options pour configurer le pinia d'essai |

#### Renvoie à

[`TestingPinia`](../interfaces/pinia_testing.TestingPinia.md)

une instance de pinia augmentée

#### Défini dans

[testing/src/testing.ts:74](https://github.com/posva/pinia/blob/46c50b2/packages/testing/src/testing.ts#L74)
