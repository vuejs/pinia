# Действия %{#actions}%

<VueSchoolLink
  href="https://vueschool.io/lessons/synchronous-and-asynchronous-actions-in-pinia"
  title="Узнайте все о действиях в Pinia"
/>

Действия (actions) являются эквивалентом [методов](https://v3.vuejs.org/guide/data-methods.html#methods) в компонентах. Их можно определить с помощью свойства `actions` в `defineStore()`, и **они отлично подходят для определения бизнес-логики**:

```js
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  actions: {
    // поскольку мы опираемся на `this`, мы не можем использовать стрелочную функцию
    increment() {
      this.count++
    },
    randomizeCounter() {
      this.count = Math.round(100 * Math.random())
    },
  },
})
```

Как и [геттеры](./getters.md), действия получают доступ ко _всему экземпляру хранилища_ через `this` с **полной поддержкой типизации (и автозаполнением ✨)**. **В отличие от геттеров, действия могут быть асинхронными**, вы можете использовать `await` внутри действий для любого вызова API или даже вызова других действий! Вот пример с использованием [Mande](https://github.com/posva/mande). Обратите внимание, что библиотека, которую вы используете, не имеет значения, пока она возвращает `Promise`, вы даже можете использовать нативный `fetch` (только для браузера):

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
        // пусть компонент формы отображает ошибку
        return error
      }
    },
  },
})
```

Вы также абсолютно свободны устанавливать любые аргументы и возвращать что угодно. При вызове действий все будет автоматически выведено!

Действия вызываются подобно функциям или обычным методам:

```vue
<script setup>
const store = useCounterStore()
// вызов действия как метода хранилища
store.randomizeCounter()
</script>

<template>
  <!-- Даже в шаблоне -->
  <button @click="store.randomizeCounter()">Randomize</button>
</template>
```

## Доступ к действиям других хранилищ %{#accessing-other-stores-actions}%

Чтобы использовать другое хранилище, можно напрямую _использовать его_ внутри _действия_:

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
        throw new Error('User must be authenticated')
      }
    },
  },
})
```

## Использование с Options API %{#usage-with-the-options-api}%

<VueSchoolLink
  href="https://vueschool.io/lessons/access-pinia-actions-in-the-options-api"
  title="Доступ к геттерам Pinia через Options API"
/>

Предположим, для следующих примеров было создано хранилище:

```js
// Пример пути файла:
// ./src/stores/counter.js

import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++
    },
  },
})
```

### С `setup()` %{#with-setup}%

Хотя Composition API не для всех, хук `setup()` может упростить работу с Pinia в Options API. Дополнительных функций map-помощников не требуется!

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
      console.log('New Count:', this.counterStore.count)
    },
  },
})
</script>
```

### Without `setup()` %{#without-setup}%

Если вы предпочитаете вообще не использовать Composition API, вы можете использовать помощник `mapActions()`, чтобы отображать свойства действий как методы в вашем компоненте:

```js
import { mapActions } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  methods: {
    // предоставляет доступ к this.increment() внутри компонента
    // то же самое, что и вызов из store.increment()
    ...mapActions(useCounterStore, ['increment']),
    // то же самое, что и выше, но регистрирует его как this.myOwnName()
    ...mapActions(useCounterStore, { myOwnName: 'increment' }),
  },
}
```

## Подписка на действия %{#subscribing-to-actions}%

Вы можете наблюдать за действиями и их результатом с помощью `store.$onAction()`. Обратный вызов, переданный ему, выполняется перед самим действием. `after` обрабатывает promise и позволяет выполнить функцию после выполнения действия. Аналогично `onError` позволяет выполнить функцию, если действие выбрасывает исключение или отклоняется (rejects). Эти функции полезны для отслеживания ошибок во время выполнения, аналогично [этому совету в документации Vue](https://v3.vuejs.org/guide/tooling/deployment.html#tracking-runtime-errors).

Приведем пример, в котором ведется журнал до выполнения действий и после их разрешения/отклонения.

```js
const unsubscribe = someStore.$onAction(
  ({
    name, // название действия
    store, // экземпляр хранилища, тоже самое что и `someStore`
    args, // массив параметров, передаваемых действию
    after, // // хук, выполняемый после return или promise resolve
    onError, // хук, если действие выбрасывает исключение или promise reject
  }) => {
    // общая переменная для данного конкретного вызова действия
    const startTime = Date.now()
    // сработает перед выполнением действия над `store`
    console.log(`Start "${name}" with params [${args.join(', ')}].`)

    // будет вызвано, если действие завершится успешно и после его полного выполнения
    // ждет любого возврата promise
    after((result) => {
      console.log(
        `Finished "${name}" after ${
          Date.now() - startTime
        }ms.\nResult: ${result}.`
      )
    })

    // сработает, если действие выбросит исключение или вернет promise, который отклонен
    // this will trigger if the action throws or returns a promise that rejects
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })
  }
)

// вручную удалить слушателя
unsubscribe()
```

По умолчанию _подписки на действия_ привязываются к компоненту, в который они добавляются (если хранилище находится внутри `setup()` компонента). Это означает, что они будут автоматически удалены при размонтировании компонента. Если вы хотите сохранить их и после размонтирования компонента, передайте `true` в качестве второго аргумента, чтобы _отсоединить подписку на действие_ от текущего компонента:

```vue
<script setup>
const someStore = useSomeStore()

// эта подписка будет сохраняться даже после размонтирования компонента
someStore.$onAction(callback, true)
</script>
```
