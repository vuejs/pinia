# Состояние %{#state}%

<VueSchoolLink
  href="https://vueschool.io/lessons/access-state-from-a-pinia-store"
  title="Узнайте все о состоянии в Pinia"
/>

Состояние (state) - это, чаще всего, центральная часть вашего хранилища. Люди часто начинают с определения состояния, которое представляет их приложение. В Pinia состояние определяется как функция, которая возвращает начальное состояние. Это позволяет Pinia работать как на серверной, так и на клиентской стороне.

```js
import { defineStore } from 'pinia'

export const useStore = defineStore('storeId', {
  // рекомендуется стрелочная функция для полного вывода типа
  state: () => {
    return {
      // для всех этих свойств тип будет определяться автоматически
      count: 0,
      name: 'Eduardo',
      isAdmin: true,
      items: [],
      hasChanged: true,
    }
  },
})
```

:::tip Совет
Если вы используете Vue 2, данные, которые вы создаете в `state`, следуют тем же правилам, что и `data` в экземпляре Vue, то есть объект состояния должен быть простым, и вам нужно вызывать `Vue.set()`, когда вы **добавляете новые** свойства в него. **См. также: [Vue#data](https://v2.vuejs.org/v2/api/#data)**
:::

## TypeScript %{#typescript}%

Для того чтобы сделать ваше состояние совместимым с TypeScript, вам не нужно много делать: убедитесь, что включен флаг [`strict`](https://www.typescriptlang.org/tsconfig#strict) или, по крайней мере, [`noImplicitThis`](https://www.typescriptlang.org/tsconfig#noImplicitThis), и Pinia автоматически будет выводить тип вашего состояния! Тем не менее, есть несколько случаев, когда вам следует помочь TypeScript с некоторыми явными преобразованиями типов:

```ts
export const useUserStore = defineStore('user', {
  state: () => {
    return {
      // для изначально пустых списков
      userList: [] as UserInfo[],
      // для данных, которые еще не загружены
      user: null as UserInfo | null,
    }
  },
})

interface UserInfo {
  name: string
  age: number
}
```

Если вы хотите, вы можете определить состояние с использованием интерфейса и указать тип возвращаемого `state()` значения:

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

## Доступ к состоянию %{#accessing-the-state}%

По умолчанию вы можете напрямую читать и записывать состояние, обращаясь к нему через экземпляр `store`:

```js
const store = useStore()

store.count++
```

Обратите внимание, что нельзя добавить новое свойство состояния **если оно не было определено в `state()`**, оно должно содержаться в начальном состоянии. Например: мы не можем сделать `store.secondCount = 2`, если `secondCount` не определено в `state()`.

## Сброс состояния %{#resetting-the-state}%

В [option-хранилищах](/core-concepts/index.md#option-stores) вы можете сбросить состояние до его начального значения, вызвав на хранилище метод `$reset()` :

```js
const store = useStore()

store.$reset()
```

При этом вызывается функция `state()`, которая создает новый объект state и заменяет им текущее состояние.

В [setup-хранилищах](/core-concepts/index.md#setup-stores) необходимо создать собственный метод `$reset()`:

```ts
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)

  function $reset() {
    count.value = 0
  }

  return { count, $reset }
})
```

### Использование с Options API %{#usage-with-the-options-api}%

<VueSchoolLink
  href="https://vueschool.io/lessons/access-pinia-state-in-the-options-api"
  title="Доступ к состоянию Pinia через Options API"
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
})
```

Если вы не используете Composition API, а используете `computed`, `methods`, ..., вы можете использовать помощник `mapState()` для отображения свойств состояния как вычисляемых свойств, доступных только для чтения:

```js
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  computed: {
    // предоставляет доступ к this.count внутри компонента
    // то же самое, что и чтение из store.count
    ...mapState(useCounterStore, ['count'])
    // то же самое, что и выше, но регистрирует его как this.myOwnName
    ...mapState(useCounterStore, {
      myOwnName: 'count',
      // можно также написать функцию, которая получает доступ к хранилищу
      double: store => store.count * 2,
      // может иметь доступ к `this`, но это не будет корректно типизировано...
      magicValue(store) {
        return store.someGetter + this.count + this.double
      },
    }),
  },
}
```

#### Modifiable state %{#modifiable-state}%

Если вы хотите иметь возможность записи у этих свойства состояния (например, если у вас есть форма), вы можете использовать `mapWritableState()` вместо `mapState()`. Обратите внимание, что вы не можете передать функцию, как это делается с `mapState()`:

```js
import { mapWritableState } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  computed: {
    // предоставляет доступ к this.count внутри компонента и позволяет изменять его
    // this.count++
    // то же самое, что и чтение из store.count
    ...mapWritableState(useCounterStore, ['count']),
    // то же самое, что и выше, но регистрирует его под именем this.myOwnName
    ...mapWritableState(useCounterStore, {
      myOwnName: 'count',
    }),
  },
}
```

:::tip Совет
Вам не нужно использовать `mapWritableState()` для коллекций, таких как массивы, если вы не заменяете всю коллекцию, например, `cartItems = []`. `mapState()` все равно позволяет вызывать методы на ваших коллекциях.
:::

## Изменение состояния %{#mutating-the-state}%

<!-- TODO: disable this with `strictMode` -->

Помимо прямого изменения хранилища с помощью `store.count++`, вы также можете вызвать метод `$patch`. Он позволяет вам применить несколько изменений одновременно с частью объекта `state`:

```js
store.$patch({
  count: store.count + 1,
  age: 120,
  name: 'DIO',
})
```

Тем не менее, некоторые изменения действительно сложно или дорого применять с этим синтаксисом: любое изменение коллекции (например, добавление, удаление, присоединение элемента к массиву) требует создания новой коллекции. По этой причине метод `$patch` также принимает функцию для группировки таких изменений, которые сложно применять с помощью объекта:

```js
store.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```

<!-- TODO: disable this with `strictMode`, `{ noDirectPatch: true }` -->

Основное отличие заключается в том, что `$patch()` позволяет сгруппировать несколько изменений в одну запись в devtools. Обратите внимание, что **и прямые изменения в `state`, и `$patch()` появляются в devtools** и могут быть перемещены во времени (в Vue 3 этого пока нет).

## Замена состояния %{#replacing-the-state}%

Вы **не можете напрямую заменить** состояние хранилища, так как это нарушило бы реактивность. Однако вы можете _изменять его_:

```js
// на самом деле это не заменяет `$state`
store.$state = { count: 24 }
// а внутренне вызывает `$patch()`:
store.$patch({ count: 24 })
```

Вы также можете **установить начальное состояние** всего вашего приложения, изменив `state` экземпляра `pinia`. Это используется во время [рендеринга на стороне сервера (SSR) для гитратации](../ssr/#state-hydration).

```js
pinia.state.value = {}
```

## Подписка на состояние %{#subscribing-to-the-state}%

Вы можете следить за состоянием и его изменениями с помощью метода хранилища `$subscribe()`, аналогичного [методу subscribe](https://vuex.vuejs.org/api/#subscribe) во Vuex. Преимущество использования `$subscribe()` перед обычным `watch()` заключается в том, что _подписки_ будут срабатывать только один раз после _изменений_ (например, при использовании функциональной версии, как в примере выше).

```js
cartStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type // 'direct' | 'patch object' | 'patch function'
  // тоже самое что и cartStore.$id
  mutation.storeId // 'cart'
  // доступно только при mutation.type === 'patch object'
  mutation.payload // patch object passed to cartStore.$patch()

  // сохранять все состояние в local storage при каждом его изменении
  localStorage.setItem('cart', JSON.stringify(state))
})
```

По умолчанию _подписки на состояние_ привязаны к компоненту, в котором они добавлены (если хранилище находится в `setup()` компонента). Это означает, что они будут автоматически удалены, когда компонент будет размонтирован. Если вы также хотите сохранить их после того, как компонент будет размонтирован, передайте `{ detached: true }` в качестве второго аргумента, чтобы _отсоединить подписку на состояние_ от текущего компонента:

```vue
<script setup>
const someStore = useSomeStore()

// эта подписка будет сохраняться даже после размонтирования компонента
someStore.$subscribe(callback, { detached: true })
</script>
```

:::tip Совет
Вы можете _наблюдать_ за всем состоянием экземпляра `pinia` с помощью одного `watch()`:

```js
watch(
  pinia.state,
  (state) => {
    // сохранять все состояние в local storage при каждом его изменении
    localStorage.setItem('piniaState', JSON.stringify(state))
  },
  { deep: true }
)
```

:::
