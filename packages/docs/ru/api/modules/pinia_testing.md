---
editLink: false
---

[Документация API](../index.md) / @pinia/testing

# Module: @pinia/testing

## Interfaces %{#Interfaces}%

- [TestingOptions](../interfaces/pinia_testing.TestingOptions.md)
- [TestingPinia](../interfaces/pinia_testing.TestingPinia.md)

## Функции %{#Functions}%

### createTestingPinia %{#Functions-createTestingPinia}%

▸ **createTestingPinia**(`options?`): [`TestingPinia`](../interfaces/pinia_testing.TestingPinia.md)

Создает экземпляр pinia, предназначенный для модульных тестов, который **требует имитации** над хранилищами. По умолчанию **все действия имитируются** и, следовательно, не выполняются. Это позволяет вам проводить модульное тестирование вашего хранилища и компонентов по отдельности.
Вы можете изменить это с помощью опции `дополнительные действия`. Если вы используете jest, они заменяются на `just.fn()`, в противном случае вы должны предоставить свой собственный параметр `createSpy`.

#### Параметры %{#Functions-createTestingPinia-Parameters}%

| Имя       | Тип                                                               | Описание                              |
| :-------- | :---------------------------------------------------------------- | :------------------------------------ |
| `options` | [`TestingOptions`](../interfaces/pinia_testing.TestingOptions.md) | варианты настройки тестирования pinia |

#### Возвращает %{#Functions-createTestingPinia-Returns}%

[`TestingPinia`](../interfaces/pinia_testing.TestingPinia.md)

расширенный экземпляр pinia
