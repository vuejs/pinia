---
editLink: false
---

[Документация API](../index.md) / [@pinia/testing](../modules/pinia_testing.md) / TestingOptions

# Интерфейс: TestingOptions

[@pinia/testing](../modules/pinia_testing.md).TestingOptions

## Свойства %{#Properties}%

### createSpy %{#Properties-createSpy}%

• `Optional` **createSpy**: (`fn?`: (...`args`: `any`[]) => `any`) => (...`args`: `any`[]) => `any`

#### Объявление типа %{#Properties-createSpy-Type-declaration}%

▸ (`fn?`): (...`args`: `any`[]) => `any`

Функция, используемая для создания шпиона для действий и `$patch()`. Предварительно настроена с помощью `just.fn()` для инвестиционных проектов или `vi.fn()` в проектах vitest.

##### Параметры %{#Properties-createSpy-Type-declaration-Parameters}%

| Имя   | Тип                           |
| :---- | :---------------------------- |
| `fn?` | (...`args`: `any`[]) => `any` |

##### Возвращает %{#Properties-createSpy-Type-declaration-Returns}%

`fn`

▸ (`...args`): `any`

##### Параметры %{#Properties-createSpy-Type-declaration-Parameters_1}%

| Имя      | Тип    |
| :-------- | :------ |
| `...args` | `any`[] |

##### Возвращает %{#Properties-createSpy-Type-declaration-Returns_1}%

`any`

---

### fakeApp %{#Properties-fakeApp}%

• `Optional` **fakeApp**: `boolean`

Создает пустое приложение и вызывает `app.use(pinia)` с созданным тестированием pinia. Это позволяет вам использовать плагины во время юнит-тестирования, поскольку плагины **будут ждать установки pinia для того, чтобы быть выполненными**. По умолчанию имеет значение false.

---

### initialState %{#Properties-initialState}%

• `Optional` **initialState**: [`StateTree`](../modules/pinia.md#statetree)

Позволяет определить частичное начальное состояние всех ваших хранилищ. Это состояние применяется после создания хранилища,
позволяя вам установить только несколько свойств, которые необходимы в вашем тесте.

---

### плагины %{#Properties-plugins}%

• `Optional` **plugins**: [`PiniaPlugin`](pinia.PiniaPlugin.md)[]

Плагины, которые должны быть установлены перед плагином тестирования. Добавьте все плагины, используемые в вашем приложении, которые будут использоваться во время тестирования.

---

### stubActions %{#Properties-stubActions}%

• `Optional` **stubActions**: `boolean`

Если установлено значение false, действия только шпионят, но все равно выполняются. При значении true действия будут заменены на шпионов, в результате чего их код не будет выполняться. По умолчанию установлено значение true. ПРИМЕЧАНИЕ: при использовании `createSpy()`, она **только** сделает аргумент `fn` `неопределенным`. Вы все равно должны обработать его в `createSpy()`.

---

### stubPatch %{#Properties-stubPatch}%

• `Optional` **stubPatch**: `boolean`

Если установлено значение true, вызовы `$patch()` не будут изменять состояние. По умолчанию установлено значение false. ПРИМЕЧАНИЕ: при использовании `createSpy()`, она **только** сделает аргумент `fn` `неопределенным`. Вы все равно должны обработать его в `createSpy()`.
