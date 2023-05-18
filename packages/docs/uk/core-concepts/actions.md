# Дії %{#actions}%

<VueSchoolLink
  href="https://vueschool.io/lessons/synchronous-and-asynchronous-actions-in-pinia"
  title="Дізнайтеся все про дії в Pinia"
/>

Дії є еквівалентом [методів](https://v3.vuejs.org/guide/data-methods.html#methods) у компонентах. Їх можна визначити за допомогою властивості `actions` у `defineStore()` і **вони ідеальні для визначення бізнес-логіки**:

```js
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  actions: {
    // оскільки ми покладаємося на `this`, ми не можемо використовувати стрілочну функцію
    increment() {
      this.count++
    },
    randomizeCounter() {
      this.count = Math.round(100 * Math.random())
    },
  },
})
```

Подібно до [гетерів](./getters.md), дії отримують доступ до _всього екземпляра сховища_ через `this` із **повною підтримкою введення (і автозаповнення ✨)**. **На відміну від гетерів, `actions` можуть бути асинхронними**, всередині дій ви можете зробити `await` будь-якого виклику API або навіть інших дій! Ось приклад використання [Mande](https://github.com/posva/mande). Зауважте, що бібліотека, яку ви використовуєте, не має значення, якщо ви отримуєте `Promise`, ви навіть можете використовувати власну функцію `fetch` (тільки для браузера):

```js
import { mande } from 'mande'

const api = mande('/api/users')

export const useUsers = defineStore('users', {
  state: () => ({
    userData: null,
    // ...
  }),

  actions: {
    async registerUser(login, password) {
      try {
        this.userData = await api.post({ login, password })
        showTooltip(`Welcome back ${this.userData.name}!`)
      } catch (error) {
        showTooltip(error)
        // нехай компонент форми відображає помилку
        return error
      }
    },
  },
})
```

Ви також абсолютно вільні встановлювати будь-які аргументи та повертати будь-що. При виклику дій все буде виведено автоматично!

Дії викликаються як функція або звичайні методи:

```vue
<script setup>
const store = useCounterStore()
// викличте дію як метод сховища
store.randomizeCounter()
</script>

<template>
  <!-- Навіть у шаблоні -->
  <button @click="store.randomizeCounter()">Рандомізувати</button>
</template>
```

## Доступ до дій інших сховищ %{#accessing-other-stores-actions}%

Щоб використовувати інше сховище, ви можете _використовувати його_ безпосередньо всередині _дії_:

```js
import { useAuthStore } from './auth-store'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    preferences: null,
    // ...
  }),
  actions: {
    async fetchUserPreferences() {
      const auth = useAuthStore()
      if (auth.isAuthenticated) {
        this.preferences = await fetchPreferences()
      } else {
        throw new Error('Користувач має пройти автентифікацію')
      }
    },
  },
})
```

## Використання з опційним API %{#usage-with-the-options-api}%

<VueSchoolLink
  href="https://vueschool.io/lessons/access-pinia-actions-in-the-options-api"
  title="Доступ до гетерів Pinia через опційного API"
/>

Для наведених нижче прикладів ви можете припустити, що було створено таке сховище:

```js
// Шлях до файлу прикладу:
// ./src/stores/counter.js

import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++
    }
  }
})
```

### З `setup()` %{#with-setup}%

Хоча композиційне API не для всіх, хук `setup()` може полегшити роботу з Pinia в опційному API. Додаткові допоміжні функції зіставлення не потрібні!

```vue
<script>
import { useCounterStore } from '../stores/counter'

export default defineComponent({
  setup() {
    const counterStore = useCounterStore()

    return { counterStore }
  },
  methods: {
    incrementAndPrint() {
      this.counterStore.increment()
      console.log('Новий підрахунок:', this.counterStore.count)
    },
  },
})
</script>
```

### Без `setup()` %{#without-setup}%

Якщо ви взагалі не бажаєте використовувати композиційний API, ви можете скористатися помічником `mapActions()`, щоб зіставити властивості дій як методи у вашому компоненті:

```js
import { mapActions } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  methods: {
    // надає доступ до this.increment() всередині компонента
    // те саме, що виклик із store.increment()
    ...mapActions(useCounterStore, ['increment']),
    // те саме, що й вище, але реєструє його як this.myOwnName()
    ...mapActions(useCounterStore, { myOwnName: 'increment' }),
  },
}
```

## Підписка на дії %{#subscribing-to-actions}%

Можна спостерігати за діями та їх результатами за допомогою `store.$onAction()`. Зворотний виклик, переданий йому, виконується перед самою дією. `after` обробляє promises та дозволяє вам виконувати функцію після завершення дії. Подібним чином `onError` дозволяє вам виконувати функцію, якщо дія викидає з помилкою або відхиляє promise. Вони корисні для відстеження помилок під час виконання, подібно до [цієї підказки в документах Vue](https://v3.vuejs.org/guide/tooling/deployment.html#tracking-runtime-errors).

Ось приклад, який реєструється перед виконанням дій і після їх вирішення/відхилення.

```js
const unsubscribe = someStore.$onAction(
  ({
    name, // назва дії
    store, // екземпляр сховища, те саме, що `someStore`
    args, // масив параметрів, переданих дії
    after, // хук після повернення або вирішення дії
    onError, // гачок, якщо дія відкидає або відхиляє
  }) => {
    // спільна змінна для цього конкретного виклику дії
    const startTime = Date.now()
    // це буде викликано перед виконанням дії на `store`
    console.log(`Старт "${name}" з параметрами [${args.join(', ')}].`)

    // це буде викликано, якщо дія завершиться вдало та після її повного виконання
    // це чекає на будь-яке повернення promise
    after((result) => {
      console.log(
        `Завершення "${name}" після ${
          Date.now() - startTime
        }мс.\nРезультат: ${result}.`
      )
    })

    // це спрацює, якщо дія відкидає або повертає promise, який відхиляється
    onError((error) => {
      console.warn(
        `Невдале виконання "${name}" після ${Date.now() - startTime}мс.\nПомилка: ${error}.`
      )
    })
  }
)

// вручну видалити слухача
unsubscribe()
```

За замовчуванням _підписки на дії_ прив'язані до компонента, до якого вони додані (якщо сховище знаходиться всередині `setup()` компонента). Це означає, що вони будуть автоматично видалені, коли компонент буде відмонтовано. Якщо ви також хочете зберегти їх після демонтування компонента, передайте `true` як другий аргумент, щоб _від'єднати_ _підписку на дію_ від поточного компонента:

```vue
<script setup>
const someStore = useSomeStore()

// ця підписка збережеться навіть після того, як компонент буде демонтовано
someStore.$onAction(callback, true)
</script>
```
