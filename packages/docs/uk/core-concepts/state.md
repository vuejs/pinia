# Стан

<VueSchoolLink
  href="https://vueschool.io/lessons/access-state-from-a-pinia-store"
  title="Дізнайтеся все про стан в Pinia"
/>

Стан - це, здебільшого, центральна частина вашого сховища. Люди часто починають з визначення стану, який представляє їхній додаток. У Pinia стан визначається як функція, яка повертає початковий стан. Це дозволяє Pinia працювати як на стороні сервера, так і на стороні клієнта.

```js
import { defineStore } from 'pinia'

export const useStore = defineStore('storeId', {
  // рекомендовано використовувати стрілочну функцію для автоматичного визначення типів
  state: () => {
    return {
      // для всіх цих властивостей тип буде визначено автоматично
      count: 0,
      name: 'Eduardo',
      isAdmin: true,
      items: [],
      hasChanged: true,
    }
  },
})
```

:::tip ПОРАДА
Якщо ви використовуєте версію Vue 2, дані, які ви створюєте в `state()`, відповідають тим самим правилам, що й `data()` в екземплярі Vue, тобто об'єкт стану має бути простим і вам потрібно викликати `Vue.set()`, коли ви **додаєте до нього нові властивості**. **Див. також [Vue#data](https://v2.vuejs.org/v2/api/#data)**.
:::

## TypeScript

Вам не потрібно докладати багато зусиль для того, щоб зробити ваш стан сумісним з TypeScript: переконайтеся, що увімкнено режим [`strict`](https://www.typescriptlang.org/tsconfig#strict) або, принаймні, [`noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis), і Pinia автоматично визначить тип вашого стану! Проте, є кілька випадків, коли вам варто допомогти їй з цим:

```ts
export const useUserStore = defineStore('user', {
  state: () => {
    return {
      // для початково порожніх списків
      userList: [] as UserInfo[],
      // для даних, які ще не завантажено
      user: null as UserInfo | null,
    }
  },
})

interface UserInfo {
  name: string
  age: number
}
```

Якщо бажаєте, ви можете визначити стан за допомогою інтерфейсу і присвоїти значення, що повертаються у `state()`:

```ts
interface State {
  userList: UserInfo[]
  user: UserInfo | null
}

export const useUserStore = defineStore('user', {
  state: (): State => {
    return {
      userList: [],
      user: null,
    }
  },
})

interface UserInfo {
  name: string
  age: number
}
```

## Доступ до `стану`

За замовчуванням, ви можете безпосередньо читати та записувати значення властивостей в стані, отримавши доступ до нього через екземпляр `сховища`:

```js
const store = useStore()

store.count++
```

Зверніть увагу, що ви не можете додати нову властивість стану, **якщо ви не оголосили її в `state()`**, вона повинна містити початковий стан. Наприклад: ви не можете зробити `store.secondCount = 2`, якщо `secondCount` не оголошено в `state()`.

## Скидання стану

В [опційних сховищах](/uk/core-concepts/index.md#option-stores) ви можете _обнулити_ стан до початкового значення, викликавши метод `$reset()`:

```js
const store = useStore()

store.$reset()
```

Внутрішньо це викликає функцію `state()` для створення нового об'єкта стану і замінює ним поточний стан.

У [функціональних сховищах](/uk/core-concepts/index.md#setup-stores) вам потрібно створити власний метод `$reset()`:

```ts
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)

  function $reset() {
    count.value = 0
  }

  return { count, $reset }
})
```

### Використання з опційним API

<VueSchoolLink
  href="https://vueschool.io/lessons/access-pinia-state-in-the-options-api"
  title="Доступ до стану Pinia через опційний API"
/>

Для наступних прикладів можна вважати, що було створено наступне сховище:

```js
// Приклад шляху до файлу:
// ./src/stores/counter.js

import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
})
```

Якщо ви не використовуєте композиційний API, а використовуєте опційний, то ви можете скористатися допоміжним методом `mapState()` для співставлення властивостей стану з обчислюваними властивостями, доступними лише для читання:

```js
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  computed: {
    // дає доступ до this.count всередині компонента
    // аналогічно до отримання доступу через store.count
    ...mapState(useCounterStore, ['count'])
    // те саме, що й вище, але реєструє його як this.myOwnName
    ...mapState(useCounterStore, {
      myOwnName: 'count',
      // також можна написати функцію, яка отримує доступ до сховища
      double: store => store.count * 2,
      // він може мати доступ до `this`, але він не буде коректним...
      magicValue(store) {
        return store.someGetter + this.count + this.double
      },
    }),
  },
}
```

#### Модифікований стан

Якщо ви хочете мати можливість записувати нові значення до цих властивостей стану (наприклад, якщо у вас є форма), ви можете використовувати `mapWritableState()` замість цього. Зауважте, що ви не можете передати функцію, як у випадку з `mapState()`:

```js
import { mapWritableState } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  computed: {
    // дає доступ до this.count всередині компонента і дозволяє його модифікувати
    // this.count++
    // аналогічно до отримання доступу через store.count
    ...mapWritableState(useCounterStore, ['count'])
    // те саме, що й вище, але реєструє його як this.myOwnName
    ...mapWritableState(useCounterStore, {
      myOwnName: 'count',
    }),
  },
}
```

:::tip ПОРАДА
Вам не потрібен `mapWritableState()` для колекцій типу масивів, якщо ви не замінюєте весь масив на `cartItems = []`, `mapState()` все одно дозволяє вам викликати методи для ваших колекцій.
:::

## Зміна стану

<!-- TODO: disable this with `strictMode` -->

Окрім безпосередньої зміни сховища за допомогою `store.count++`, ви також можете викликати метод `$patch`. Він дозволяє застосувати декілька змін одночасно з об'єктом часткового стану:

```js
store.$patch({
  count: store.count + 1,
  age: 120,
  name: 'DIO',
})
```

Однак, деякі зміни за допомогою цього синтаксису дуже складно або дорого застосувати: будь-яка модифікація колекції (наприклад, додавання, видалення, приєднання елемента до масиву) вимагає створення нової колекції. Через це метод `$patch` також приймає функцію для групування таких змін, які важко застосувати за допомогою об'єкта:

```js
store.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```

<!-- TODO: disable this with `strictMode`, `{ noDirectPatch: true }` -->

Основна відмінність полягає в тому, що `$patch()` дозволяє вам згрупувати декілька змін в один запис у devtools. Зверніть увагу, що **як і прямі зміни стану, так і `$patch()` з'являються у devtools** і можуть бути перенесені у часі (поки що недоступно у версії Vue 3).

## Заміна `стану`

Ви не можете **саме замінити** стан сховища, оскільки це порушить реактивність. Однак ви можете його _підправити_:

```js
// це насправді не замінює `$state`
store.$state = { count: 24 }
// а внутрішньо викликає `$patch()`:
store.$patch({ count: 24 })
```

Ви також можете **встановити початковий стан** всієї програми, змінивши `стан` екземпляра `pinia`. Це використовується під час [SSR для гідратації](../ssr/#state-hydration).

```js
pinia.state.value = {}
```

## Підписка на стан

Ви можете спостерігати за станом та його змінами за допомогою методу сховища `$subscribe()`, подібно до [методу subscribe](https://vuex.vuejs.org/api/#subscribe) у Vuex. Перевага використання `$subscribe()` над звичайним `watch()` полягає в тому, що _підписки_ спрацьовують лише один раз після _оновлення_ (наприклад, при використанні версії функції зверху).

```js
cartStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type // 'прямі зміни' | 'об'єкт з оновленими значеннями' | 'функція з оновленими значеннями'
  // теж саме, що й cartStore.$id
  mutation.storeId // 'cart'
  // доступний лише з mutation.type === 'об'єкт з оновленими значеннями'
  mutation.payload // об'єкт з оновленими значеннями передається в cartStore.$patch()

  // зберігати весь стан у локальному сховищі щоразу, коли він змінюється
  localStorage.setItem('cart', JSON.stringify(state))
})
```

За замовчуванням, _підписки на стан_ прив'язуються до компонента, в якому вони були додані (якщо сховище знаходиться в `setup()` компонента). Це означає, що вони будуть автоматично видалені, коли компонент буде демонтовано. Якщо ви також хочете зберегти їх після демонтажу компонента, передайте `{ detached: true }` як другий аргумент, щоб _відокремити_ _підписку на стан_ від поточного компонента:

```vue
<script setup>
const someStore = useSomeStore()

// ця підписка буде збережена навіть після того, як компонент буде демонтовано
someStore.$subscribe(callback, { detached: true })
</script>
```

:::tip ПОРАДА
Ви можете _спостерігати_ весь стан екземпляра `pinia` за допомогою однієї функції `watch()`:

```js
watch(
  pinia.state,
  (state) => {
    // зберігати весь стан у локальному сховищі щоразу, коли він змінюється
    localStorage.setItem('piniaState', JSON.stringify(state))
  },
  { deep: true }
)
```

:::
