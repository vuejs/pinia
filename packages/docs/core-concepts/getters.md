# Геттеры %{#getters}%

<VueSchoolLink
  href="https://vueschool.io/lessons/getters-in-pinia"
  title="Узнайте все о геттерах в Pinia"
/>

Геттеры (getters) являются эквивалентом [вычисляемых свойств](https://vuejs.org/guide/essentials/computed.html) для состояния хранилища. Их можно определить с помощью свойства `getters` в `defineStore()`. Они принимают `state` как первый параметр для поощрения использования стрелочной функции:

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

В большинстве случаев геттеры полагаются только на состояние, однако, им может потребоваться использовать другие геттеры. Для этого мы можем получить доступ к _экземпляру всего хранилища_ через `this` при определении через обычную функцию, **но при этом необходимо определить тип возвращаемого значения (в TypeScript)**. Это связано с известным ограничением в TypeScript и **не затрагивает геттеры, определенные с помощью стрелочной функции, а также геттеры, не использующие `this`**:

```ts
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  getters: {
    // автоматически определяет тип возвращаемого значения как число
    doubleCount(state) {
      return state.count * 2
    },
    // тип возвращаемого значения **должен** быть явно задан
    doublePlusOne(): number {
      // автозаполнение и типизация для всего хранилища ✨
      return this.doubleCount + 1
    },
  },
})
```

Теперь вы можете получить доступ к геттеру напрямую через экземпляр хранилища:

```vue
<script setup>
import { useCounterStore } from './counterStore'

const store = useCounterStore()
</script>

<template>
  <p>Double count is {{ store.doubleCount }}</p>
</template>
```

## Доступ к другим геттерам %{#accessing-other-getters}%

Как и с вычисляемыми свойствами, вы можете комбинировать несколько геттеров. Доступ к любому другому геттеру осуществляется через `this`. Даже если вы не используете TypeScript, вы можете подсказать вашей среде разработки типы с помощью [JSDoc](https://jsdoc.app/tags-returns.html):

```js
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  getters: {
    // тип выводится автоматически, поскольку мы не используем `this`
    doubleCount: (state) => state.count * 2,
    // здесь мы должны сами добавить тип (используя JSDoc в JS). Мы также можем
    // использовать это для документирования геттера
    /**
     * Возвращает значение count, умноженное на два плюс один.
     *
     * @returns {number}
     */
    doubleCountPlusOne() {
      // автозаполнение ✨
      return this.doubleCount + 1
    },
  },
})
```

## Передача аргументов в геттеры %{#passing-arguments-to-getters}%

_Геттеры_ на самом деле под капотом являются _вычисляемыми свойствами_, поэтому нельзя передавать им какие-либо параметры. Однако вы можете вернуть функцию из _геттера_, чтобы принимать любые аргументы:

```js
export const useStore = defineStore('main', {
  getters: {
    getUserById: (state) => {
      return (userId) => state.users.find((user) => user.id === userId)
    },
  },
})
```

и использовать в компоненте:

```vue
<script setup>
import { storeToRefs } from 'pinia'
import { useUserListStore } from './store'

const userList = useUserListStore()
const { getUserById } = storeToRefs(userList)
// обратите внимание, вам придется использовать `getUserById.value`,
// чтобы получить доступ к функции в пределах <script setup>
</script>

<template>
  <p>User 2: {{ getUserById(2) }}</p>
</template>
```

Обратите внимание, что при этом **геттеры больше не кэшируются**, они просто функции, которые вы вызываете. Однако вы можете кэшировать некоторые результаты внутри самого геттера, что необычно, но может оказаться более производительным:

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

## Доступ к геттерам других хранилищ %{#accessing-other-stores-getters}%

Чтобы использовать геттер другого хранилища , можно напрямую _использовать его_ внутри _геттера_:

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

## Использование с `setup()` %{#usage-with-setup}%

К любому геттеру можно напрямую обращаться как к свойству хранилища (точно так же, как к свойствам состояния):

```vue
<script setup>
const store = useCounterStore()

store.count = 3
store.doubleCount // 6
</script>
```

## Использование с Options API %{#usage-with-the-options-api}%

<VueSchoolLink
  href="https://vueschool.io/lessons/access-pinia-getters-in-the-options-api"
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
  getters: {
    doubleCount(state) {
      return state.count * 2
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

    // **необходимо вернуть все хранилище** вместо деструктуризации
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

Это полезно при переносе компонента из Options API в Composition API, но **должно быть только шагом миграции**, всегда старайтесь не смешивать оба стиля API в одном компоненте.

### Без `setup()` %{#without-setup}%

Вы можете использовать ту же функцию `mapState()`, которая используется в [предыдущем разделе о состоянии](./state.md#options-api), для отображения геттеров:

```js
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  computed: {
    // предоставляет доступ к this.doubleCount внутри компонента
    // то же самое, что и чтение из store.doubleCount
    ...mapState(useCounterStore, ['doubleCount']),
    // то же самое, что и выше, но регистрирует его как this.myOwnName
    ...mapState(useCounterStore, {
      myOwnName: 'doubleCount',
      // можно также написать функцию, которая получает доступ к хранилищу
      double: (store) => store.doubleCount,
    }),
  },
}
```
