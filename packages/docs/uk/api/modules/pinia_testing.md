---
editLink: false
---

[Документація API](../index.md) / @pinia/testing

# Модуль: @pinia/testing

## Інтерфейси %{#Interfaces}%

- [TestingOptions](../interfaces/pinia_testing.TestingOptions.md)
- [TestingPinia](../interfaces/pinia_testing.TestingPinia.md)

## Функції %{#Functions}%

### createTestingPinia %{#Functions-createTestingPinia}%

▸ **createTestingPinia**(`options?`): [`TestingPinia`](../interfaces/pinia_testing.TestingPinia.md)

Створює екземпляр сховища Pinia, призначений для юніт-тестів, які 
**вимагають імітації** сховищ. За замовчуванням **всі дії імітуються** 
і тому не виконуються. Це дозволяє вам тестувати сховище і компоненти окремо.
Ви можете змінити це за допомогою опції `stubActions`. Якщо ви використовуєте
jest, вони замінюються на `jest.fn()`, в іншому випадку, ви повинні надати 
свій власний варіант за допомогою властивості `createSpy`.

#### Параметри %{#Functions-createTestingPinia-Parameters}%

| Ім'я | Тип | Опис                                    |
| :------ | :------ |:----------------------------------------|
| `options` | [`TestingOptions`](../interfaces/pinia_testing.TestingOptions.md) | опції для налаштування тестування Pinia |

#### Повертає %{#Functions-createTestingPinia-Returns}%

[`TestingPinia`](../interfaces/pinia_testing.TestingPinia.md)

доповнений екземпляр Pinia
