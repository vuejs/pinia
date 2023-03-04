# Экшены

<VueSchoolLink
  href="https://vueschool.io/lessons/synchronous-and-asynchronous-actions-in-pinia"
  title="Узнайте все о экшенах в Пинии"
/>

Действия - это эквивалент [методов](https://v3.vuejs.org/guide/data-methods.html#methods) в компонентах. Они могут быть определены с помощью свойства `actions` в `defineStore()` и **они идеально подходят для определения бизнес-логики**:

```js
export const useCounterStore = defineStore('counter', {
    state: () => ({
        count: 0,
    }),
    actions: {
        // поскольку мы полагаемся на `this`, мы не можем использовать функцию стрелки
        increment() {
            this.count++
        },
        randomizeCounter() {
            this.count = Math.round(100 * Math.random())
        },
    },
})
```

Как и [getters](./getters.md), действия получают доступ к _целому экземпляру хранилища_ через `this` с **полной поддержкой типизации (и автозаполнения ✨)**. **В отличие от геттеров, `actions` могут быть асинхронными**, вы можете `await` внутри действий любой вызов API или даже другие действия! Вот пример с использованием [Mande](https://github.com/posva/mande). Обратите внимание, что используемая библиотека не имеет значения, пока вы получаете `Promise`, вы даже можете использовать родную функцию `fetch` (только для браузера):

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
                // позволить компоненту формы отобразить ошибку
                return error
            }
        },
    },
})
```

Вы также можете задавать любые аргументы и возвращать что угодно. При вызове действий все будет автоматически выведено!

Действия вызываются как функции или обычные методы:

```vue
<script setup>
const store = useCounterStore()
// вызываем экшег как метод хранилища
store.randomizeCounter()
</script>

<template>
    <!-- Даже в шаблоне -->
    <button @click="store.randomizeCounter()">Randomize</button>
</template>
```

## Доступ к экшенам других хранилищ

Чтобы использовать другое хранилище, вы можете непосредственно _использовать его_ внутри _экшена_:

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
                throw new Error('Пользователь должен быть авторизован')
            }
        },
    },
})
```

## Использование с Options API

<VueSchoolLink
  href="https://vueschool.io/lessons/access-pinia-actions-in-the-options-api"
  title="Доступ к геттерам Pinia через Options API"
/>

Для следующих примеров можно предположить, что был создан следующие хранилище:

```js
// Пример пути к файлу:
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

### С `setup()`

Хотя Composition API не для всех, хук `setup()` может облегчить работу с Pinia в рамках API Options. Никаких дополнительных вспомогательных хелперов карты не требуется!

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
            console.log('Новое количество:', this.counterStore.count)
        },
    },
})
</script>
```

### Без `setup()`

Если вы предпочитаете вообще не использовать Composition API, вы можете использовать хелпер `mapActions()` для отображения свойств действий как методов в вашем компоненте:

```js
import { mapActions } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  methods: {
    // дает доступ к this.increment() внутри компонента
    // то же самое, что и вызов из store.increment()
    ...mapActions(useCounterStore, ['increment'])
    // то же самое, что и выше, но регистрируется как this.myOwnName()
    ...mapActions(useCounterStore, { myOwnName: 'increment' }),
  },
}
```

## Подписка на экшены

Наблюдать за экшенами и их результатом можно с помощью `store.$onAction()`. Callback, переданный ему, выполняется перед самим действием. `after` обрабатывает обещания и позволяет выполнить функцию после того, как действие разрешится. Аналогично, `onError` позволяет выполнить функцию, если действие бросает или отклоняет. Они полезны для отслеживания ошибок во время выполнения, подобно [этому совету в документации Vue](https://v3.vuejs.org/guide/tooling/deployment.html#tracking-runtime-errors).

Вот пример, который ведет журнал до выполнения действий и после их разрешения/отклонения.

```js
const unsubscribe = someStore.$onAction(
    ({
        name, // имя экшена
        store, // экземпляр хранилища, такой же, как `someStore`.
        args, // массив параметров, передаваемых экшену
        after, // хук после возврата или разрешения экшена
        onError, // хук, если экшен отбрасывает или отклоняется
    }) => {
        // общая переменная для данного конкретного вызова экшена
        const startTime = Date.now()
        // сработает перед выполнением действия над `store`.
        console.log(`Запустите "${name}" с параметрами [${args.join(', ')}].`)

        // это сработает, если экшен будет успешным, и после его полного выполнения.
        // оно ожидает возвращения любого обещанного
        after((result) => {
            console.log(
                `Завершено "${имя}" после ${
                    Date.now() - startTime
                }ms.\Результат: ${result}.`
            )
        })

        // сработает, если экшен бросает или возвращает promise, которое отвергает
        onError((error) => {
            console.warn(
                `Сбой "${имя}" после ${
                    Date.now() - startTime
                }ms.\nОшибка: ${error}.`
            )
        })
    }
)

// вручную удалить слушателя
unsubscribe()
```

По умолчанию _action subscriptions_ привязаны к компоненту, в который они добавлены (если хранилище находится внутри `setup()` компонента). Это означает, что они будут автоматически удалены при размонтировании компонента. Если вы хотите сохранить их и после размонтирования компонента, передайте `true` в качестве второго аргумента, чтобы _отсоединить_ подписку на _экшен_ от текущего компонента:

```vue
<script setup>
const someStore = useSomeStore()

// эта подписка будет сохранена даже после размонтирования компонента
someStore.$onAction(callback, true)
</script>
```
