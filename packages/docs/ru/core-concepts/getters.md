# Геттеры

<VueSchoolLink
  href="https://vueschool.io/lessons/getters-in-pinia"
  title="Узнайте все о геттерах в Pinia"
/>

Геттеры являются точным эквивалентом [computed значений](https://vuejs.org/guide/essentials/computed.html) для состояния хранилища. Они могут быть определены с помощью свойства `getters` в `defineStore()`. Они получают `state` в качестве первого параметра **чтобы стимулировать** использование функции arrow:

```js
export const useCounterStore = defineStore('counter', {
    state: () => ({
        count: 0,
    }),
    getters: {
        doubleCount: (state) => state.count * 2,
    },
})
```

В большинстве случаев геттеры будут полагаться только на состояние, однако, возможно, им придется использовать и другие геттеры. Из-за этого мы можем получить доступ к _целому экземпляру хранилища_ через `this` при определении обычной функции **но при этом необходимо определить тип возвращаемого типа (в TypeScript)**. Это связано с известным ограничением в TypeScript и **не влияет ни на геттеры, определенные с помощью стрелочной функции, ни на геттеры, не использующие `this`**:

```ts
export const useCounterStore = defineStore('counter', {
    state: () => ({
        count: 0,
    }),
    getters: {
        // автоматически определяет возвращаемый тип как число
        doubleCount(state) {
            return state.count * 2
        },
        // тип возврата **должен** быть явно задан
        doublePlusOne(): number {
            // autocompletion и наборы для всего хранилища ✨
            return this.doubleCount + 1
        },
    },
})
```

Затем вы можете получить доступ к геттеру непосредственно на экземпляре хранилища:

```vue
<script setup>
import { useCounterStore } from './counterStore'

const store = useCounterStore()
</script>

<template>
    <p>Double count is {{ store.doubleCount }}</p>
</template>
```

## Доступ к другим геттерам

Как и в случае с вычисляемыми свойствами, вы можете объединить несколько геттеров. Доступ к любому другому геттеру осуществляется через `this`. Даже если вы не используете TypeScript, вы можете подсказать вашей IDE для типов с помощью [JSDoc](https://jsdoc.app/tags-returns.html):

```js
export const useCounterStore = defineStore('counter', {
    state: () => ({
        count: 0,
    }),
    getters: {
        // тип выводится автоматически, поскольку мы не используем `this`.
        doubleCount: (state) => state.count * 2,
        // здесь нам нужно добавить тип самостоятельно (используя JSDoc в JS). Мы также можем
        // использовать это для документирования геттера
        /**
         * Возвращает значение счета, умноженное на два плюс один.
         *
         * @returns {number}
         */
        doubleCountPlusOne() {
            // autocompletion ✨
            return this.doubleCount + 1
        },
    },
})
```

## Передача аргументов геттерам

_Геттеры_ - это просто _computed_ свойства за кулисами, поэтому им невозможно передать какие-либо параметры. Однако вы можете вернуть функцию из _геттера_, которая будет принимать любые аргументы:

```js
export const useStore = defineStore('main', {
    getters: {
        getUserById: (state) => {
            return (userId) => state.users.find((user) => user.id === userId)
        },
    },
})
```

и использовать в компонентах:

```vue
<script setup>
import { useUserListStore } from './store'

const userList = useUserListStore()
const { getUserById } = storeToRefs(userList)
// обратите внимание, что для доступа к `getUserById.value` вам придется использовать `getUserById.value`.
// к функции внутри <script setup>
</script>

<template>
    <p>User 2: {{ getUserById(2) }}</p>
</template>
```

Обратите внимание, что при этом **геттеры больше не кэшируются**, это просто функции, которые вы вызываете. Однако вы можете кэшировать некоторые результаты внутри самого геттера, что является необычным, но должно оказаться более эффективным:

```js
export const useStore = defineStore('main', {
    getters: {
        getActiveUserById(state) {
            const activeUsers = state.users.filter((user) => user.active)
            return (userId) => activeUsers.find((user) => user.id === userId)
        },
    },
})
```

## Доступ к геттерам других хранилищ

Чтобы использовать геттеры других хранилищ, вы можете непосредственно _использовать его_ внутри _геттера_:

```js
import { useOtherStore } from './other-store'

export const useStore = defineStore('main', {
    state: () => ({
        // ...
    }),
    getters: {
        otherGetter(state) {
            const otherStore = useOtherStore()
            return state.localData + otherStore.data
        },
    },
})
```

## Использование с `setup()`

Вы можете получить прямой доступ к любому геттеру как к свойству хранилища (точно так же, как к свойствам состояния):

```vue
<script setup>
const store = useCounterStore()

store.count = 3
store.doubleCount // 6
</script>
```

## Использование с API опций

<VueSchoolLink
  href="https://vueschool.io/lessons/access-pinia-getters-in-the-options-api"
  title="Доступ к геттерам пинии через API опций"
/>

Для следующих примеров можно предположить, что был создано следующее хранилище:

```js
// Пример пути к файлу:
// ./src/stores/counter.js

import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
    state: () => ({
        count: 0,
    }),
    getters: {
        doubleCount(state) {
            return state.count * 2
        },
    },
})
```

### With `setup()`

While Composition API is not for everyone, the `setup()` hook can make using Pinia easier to work with in the Options API. No extra map helper functions needed!

```vue
<script>
import { useCounterStore } from '../stores/counter'

export default defineComponent({
    setup() {
        const counterStore = useCounterStore()

        // **only return the whole store** instead of destructuring
        return { counterStore }
    },
    computed: {
        quadrupleCounter() {
            return this.counterStore.doubleCount * 2
        },
    },
})
</script>
```

This is useful while migrating a component from the Options API to the Composition API but **should only be a migration step**, always try not to mix both API styles within the same component.

### Without `setup()`

You can use the same `mapState()` function used in the [previous section of state](./state.md#options-api) to map to getters:

```js
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
    computed: {
        // gives access to this.doubleCount inside the component
        // same as reading from store.doubleCount
        ...mapState(useCounterStore, ['doubleCount']),
        // same as above but registers it as this.myOwnName
        ...mapState(useCounterStore, {
            myOwnName: 'doubleCount',
            // you can also write a function that gets access to the store
            double: (store) => store.doubleCount,
        }),
    },
}
```
