# Гетери %{#getters}%

<VueSchoolLink
  href="https://vueschool.io/lessons/getters-in-pinia"
  title="Дізнайтеся все про гетери у Pinia"
/>

Гетери є еквівалентом [обчисленим значенням](https://vuejs.org/guide/essentials/computed.html) для стану сховища. Їх можна визначити за допомогою властивості `getters` у `defineStore()`. Вони отримують `state` як перший параметр, щоб **заохочувати** використання функції стрілки:

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

У більшості випадків гетери покладаються лише на стан, однак їм може знадобитися використовувати інші гетери. Через це ми можемо отримати доступ до _примірника всього сховища_ через `this` під час визначення звичайної функції **але необхідно визначити тип, який повертається (у TypeScript)**. Це пов'язано з відомим обмеженням у TypeScript і **не впливає ні на гетери, визначені за допомогою функції стрілки, ні на гетери, які не використовують `this`**:

```ts
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  getters: {
    // автоматично виводить тип, який повертається, як число
    doubleCount(state) {
      return state.count * 2
    },
    // тип повернення **має** бути встановлений явно
    doublePlusOne(): number {
      // автозаповнення та типізація для всього сховища ✨
      return this.doubleCount + 1
    },
  },
})
```

Потім ви можете отримати доступ безпосередньо до екземпляра сховища:

```vue
<script setup>
import { useCounterStore } from './counterStore'

const store = useCounterStore()
</script>

<template>
  <p>Подвоєна кількість є {{ store.doubleCount }}</p>
</template>
```

## Доступ до інших гетерів %{#accessing-other-getters}%

Як і у випадку з обчисленими властивостями, ви можете комбінувати кілька гетерів. Доступ є до будь-якого іншого гетера через `this`. ви можете дати підказки своєму IDE щодо типів за допомогою [JSDoc](https://jsdoc.app/tags-returns.html):

```js
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  getters: {
    // тип визначається автоматично, оскільки ми не використовуємо `this`
    doubleCount: (state) => state.count * 2,
    // тут нам потрібно самостійно додати тип (за допомогою JSDoc у JS). Ми
    // також можемо використовувати це для документування гетера
    /**
     * Повертає значення підрахунку, помножене на два і додано один.
     *
     * @returns {number}
     */
    doubleCountPlusOne() {
      // автозаповнення ✨
      return this.doubleCount + 1
    },
  },
})
```

## Передача аргументів до гетерів %{#passing-arguments-to-getters}%

_Гетери_ - це лише _обчислені_ властивості за лаштунками, тому неможливо передати їм жодних параметрів. Однак ви можете повернути функцію з _гетера_ , яка прийматиме будь-які аргументи:

```js
export const useStore = defineStore('main', {
  getters: {
    getUserById: (state) => {
      return (userId) => state.users.find((user) => user.id === userId)
    },
  },
})
```

і використання в компоненті:

```vue
<script setup>
import { storeToRefs } from 'pinia'
import { useUserListStore } from './store'

const userList = useUserListStore()
const { getUserById } = storeToRefs(userList)
// зауважте, що вам доведеться використовувати `getUserById.value`,
// щоб отримати доступ до функції в межах <script setup>
</script>

<template>
  <p>Користувач 2: {{ getUserById(2) }}</p>
</template>
```

Зауважте, що під час цього **гетери більше не кешуються**, це просто функції, які ви викликаєте. Однак ви можете кешувати деякі результати в самому гетері, що є рідкісним явищем, але може бути більш продуктивним:

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

## Доступ до гетерів інших сховищ %{#accessing-other-stores-getters}%

Для використання гетерів іншого сховища, ви можете _використовувати його_ безпосередньо всередині _гетера_:

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

## Використання з `setup()` %{#usage-with-setup}%

Ви можете отримати прямий доступ до будь-якого гетера як до властивості сховища (точно як до властивостей стану):

```vue
<script setup>
const store = useCounterStore()

store.count = 3
store.doubleCount // 6
</script>
```

## Використання з опційним API %{#usage-with-the-options-api}%

<VueSchoolLink
  href="https://vueschool.io/lessons/access-pinia-getters-in-the-options-api"
  title="Доступ до Pinia гетерів через опційний API"
/>

Для наведених нижче прикладів ви можете припустити, що було створено таке сховище:

```js
// Шлях до файлу прикладу:
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

### З `setup()` %{#with-setup}%

Хоча композиційний API не для всіх, хук `setup()` може полегшити використання Pinia при роботі з опційним API. Додаткові допоміжні функції зіставлення не потрібні!

```vue
<script>
import { useCounterStore } from '../stores/counter'

export default defineComponent({
  setup() {
    const counterStore = useCounterStore()

    // **повертає тільки ціле сховище** замість деструктуризації
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

Це корисно під час міграції компонента з опційного API до композиційного API, але **це має бути лише кроком міграції**, завжди намагайтеся не змішувати обидва стилі API в одному компоненті.

### Без `setup()` %{#without-setup}%

Ви можете використати ту саму функцію `mapState()` , яка використовується в [попередньому розділі про стан](./state.md#options-api), щоб заставити гетери:

```js
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  computed: {
    // надає доступ до this.doubleCount всередині компонента
    // те саме, що читання з store.doubleCount
    ...mapState(useCounterStore, ['doubleCount']),
    // те саме, що й вище, але реєструє його як this.myOwnName
    ...mapState(useCounterStore, {
      myOwnName: 'doubleCount',
      // ви також можете написати функцію, яка отримує доступ до сховища
      double: (store) => store.doubleCount,
    }),
  },
}
```
