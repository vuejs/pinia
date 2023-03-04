# Состояние

<VueSchoolLink
  href="https://vueschool.io/lessons/access-state-from-a-pinia-store"
  title="Узнайте все о состояниях в Пинии"
/>

Состояние - это, в большинстве случаев, центральная часть вашего хранилища. Люди часто начинают с определения состояния, которое представляет их приложение. В Pinia состояние определяется как функция, которая возвращает начальное состояние. Это позволяет Pinia работать как на стороне сервера, так и на стороне клиента.

```js
import { defineStore } from 'pinia'

export const useStore = defineStore('storeId', {
    // функция стрелки рекомендуется для полного вывода типа
    state: () => {
        return {
            // тип всех этих свойств будет определен автоматически
            count: 0,
            name: 'Eduardo',
            isAdmin: true,
            items: [],
            hasChanged: true,
        }
    },
})
```

:::tip
Если вы используете Vue 2, данные, которые вы создаете в `state`, следуют тем же правилам, что и `data` в экземпляре Vue, т.е. объект state должен быть простым, и вам нужно вызвать `Vue.set()` при **добавлении к нему новых** свойств. **Смотрите также: [Vue#данные](https://v2.vuejs.org/v2/api/#data)**.
:::

## TypeScript

Вам не нужно много делать, чтобы сделать ваше состояние совместимым с TS: убедитесь, что [`strict`](https://www.typescriptlang.org/tsconfig#strict), или, по крайней мере, [`Noimplicit this`](https://www.typescriptlang.org/tsconfig#noImplicitThis), включены, и Pinia автоматически определит тип вашего состояния! Тем не менее, есть несколько случаев, когда вам следует попробовать свои силы с помощью некоторых кастингов:

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

Если вы предпочитаете, вы можете определить состояние с помощью интерфейса и ввести возвращаемое значение `state()`:

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

## Доступ к `state`

По умолчанию вы можете напрямую считывать и записывать в состояние, получая к нему доступ через экземпляр `store`:

```js
const store = useStore()

store.count++
```

Примечание. вы не можете добавить новое свойство состояния, **если вы не определили его в `state()`**, оно должно содержать начальное состояние. например: мы не можем выполнить `store.secondCount = 2`, если `secondCount` не определен в `state()`.

## Сброс состояния

В [Хранилища опций](/core-concepts/index.md#option-stores) вы можете _reset_ состояние к его первоначальному значению, вызвав метод `$reset()` в хранилище:

```js
const store = useStore()

store.$reset()
```

Внутренне это вызывает функцию `state()` для создания нового объекта state и заменяет им текущее состояние.

В [Setup Stores](/core-concepts/index.md#setup-stores) вам нужно создать свой собственный метод `$reset()`:

```ts
export const useCounterStore = defineStore('counter', () => {
    const count = ref(0)

    function $reset() {
        count.value = 0
    }

    return { count, $reset }
})
```

### Использование с Options API

<VueSchoolLink
  href="https://vueschool.io/lessons/access-pinia-state-in-the-options-api"
  title="Получите доступ к состоянию Pinia через Options API"
/>

Для следующих примеров вы можете предположить, что было создано следующее хранилище:

```js
// Пример пути к файлу:
// ./src/stores/counter.js

import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
    state: () => ({
        count: 0,
    }),
})
```

Если вы не используете Composition API, и вы используете `computed`, `methods`, ..., вы можете использовать хелпер `mapState()` для отображения свойств состояния как вычисляемых свойств, доступных только для чтения:

```js
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  computed: {
    // дает доступ к this.count внутри компонента
    // то же самое, что и чтение из store.count
    ...mapState(useCounterStore, ['count'])
    // то же самое, что и выше, но регистрирует его как this.myOwnName
    ...mapState(useCounterStore, {
      myOwnName: 'count',
      // вы также можете написать функцию, которая получает доступ к хранилищу
      double: store => store.count * 2,
      // он может иметь доступ к `this`, но он не будет набран правильно...
      magicValue(store) {
        return store.someGetter + this.count + this.double
      },
    }),
  },
}
```

#### Изменяемое состояние

Если вы хотите иметь возможность записи в эти свойства состояния (например, если у вас есть форма), вы можете использовать `mapWritableState()` вместо этого. Обратите внимание, что вы не можете передать функцию, как в `mapState()`:

```js
import { mapWritableState } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  computed: {
    // предоставляет доступ к this.count внутри компонента и позволяет его установить
    // this.count++
    // то же самое, что и чтение из store.count
    ...mapWritableState(useCounterStore, ['count'])
    // то же, что и выше, но регистрирует его как this.myOwnName
    ...mapWritableState(useCounterStore, {
      myOwnName: 'count',
    }),
  },
}
```

:::tip
Вам не нужна `mapWritableState()` для коллекций, таких как массивы, если вы не заменяете весь массив на `cartItems = []`, `mapState()` все еще позволяет вам вызывать методы на ваших коллекциях.
:::

## Изменение состояния

<!-- TODO: отключите это с помощью `strictMode` -->.

Помимо прямого изменения хранилища с помощью `store.count++`, вы также можете вызвать метод `$patch`. Он позволяет вам применять несколько изменений одновременно с частичным объектом `state`:

```js
store.$patch({
    count: store.count + 1,
    age: 120,
    name: 'DIO',
})
```

Однако некоторые мутации действительно трудно или дорого применять с помощью этого синтаксиса: любая модификация коллекции (например: pushing, removing, splicing элемента из массива) требует создания новой коллекции. В связи с этим метод `$patch` также принимает функцию для группировки такого рода мутаций, которые трудно применить с помощью объекта patch:

```js
store.$patch((state) => {
    state.items.push({ name: 'shoes', quantity: 1 })
    state.hasChanged = true
})
```

<!-- TODO: отключите это с помощью `strictMode`, `{ noDirectPatch: true }` -->

Основное отличие здесь в том, что `$patch()` позволяет вам группировать несколько изменений в одну единственную запись в devtools. Обратите внимание **и прямые изменения `state`, и `$patch()` появляются в devtools** и могут быть перемещены во времени (пока не в Vue 3).

## Замена `state`

Вы **не можете точно заменить** состояние хранилища, так как это нарушит реактивность. Однако вы можете _заменить его_:

```js
// это не заменяет `$state`.
store.$state = { count: 24 }
// он внутренне вызывает `$patch()`:
store.$patch({ count: 24 })
```

Вы также можете **задать начальное состояние** всего приложения, изменив `state` экземпляра `pinia`. Это используется во время [SSR для гидратации](../ssr/#state-hydration).

```js
pinia.state.value = {}
```

## Подписка на состояние

Вы можете следить за состоянием и его изменениями с помощью метода `$subscribe()` хранилища, аналогично [subscribe method](https://vuex.vuejs.org/api/#subscribe) в Vuex. Преимущество использования `$subscribe()` перед обычным `watch()` заключается в том, что _подписки_ будут срабатывать только один раз после _патчей_ (например, при использовании версии функции, описанной выше).

```js
cartStore.$subscribe((mutation, state) => {
    // import { MutationType } from 'pinia'
    mutation.type // 'direct' | 'patch object' | 'patch function'
    // то же самое, что cartStore.$id
    mutation.storeId // 'cart'
    // доступно только при mutation.type === 'patch object'
    mutation.payload // объект патча, переданный в cartStore.$patch()

    // сохраняем все состояние в локальном хранилище при каждом его изменении
    localStorage.setItem('cart', JSON.stringify(state))
})
```

По умолчанию _подписка на состояние_ привязываются к компоненту, в который они добавлены (если хранилище находится внутри `setup()` компонента). Это означает, что они будут автоматически удалены при размонтировании компонента. Если вы хотите сохранить их и после размонтирования компонента, передайте `{ detached: true }` в качестве второго аргумента, чтобы _отсоединить_ подписку _состояния_ от текущего компонента:

```vue
<script setup>
const someStore = useSomeStore()

// эта подписка будет сохранена даже после размонтирования компонента
someStore.$subscribe(callback, { detached: true })
</script>
```

:::tip
Вы можете _наблюдать_ за всем состоянием экземпляра `pinia` с помощью одной команды `watch()`:

```js
watch(
    pinia.state,
    (state) => {
        // сохранять все состояния в локальном хранилище при каждом его изменении
        localStorage.setItem('piniaState', JSON.stringify(state))
    },
    { deep: true }
)
```

:::
