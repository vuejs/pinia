# Композиция хранилищ

Составление хранилищ - это наличие хранилищ, которые используют друг друга, и это поддерживается в Pinia. Есть одно правило, которому нужно следовать:

Если **два или более хранилища используют друг друга**, они не могут создавать бесконечный цикл через _getters_ или _actions_. Они не могут **оба** напрямую считывать состояние друг друга в своей функции установки:

```js
const useX = defineStore('x', () => {
  const y = useY()

  // ❌ Это невозможно, потому что y также пытается прочитать x.name
  y.name

  function doSomething() {
    // ✅ Чтение свойств y в computed или в экшенах
    const yName = y.name
    // ...
  }

  return {
    name: ref('I am X'),
  }
})

const useY = defineStore('y', () => {
  const x = useX()

  // ❌ Это невозможно, потому что x также пытается прочитать y.name
  x.name

  function doSomething() {
    // ✅ Прочитать свойства x в вычислениях или действиях
    const xName = x.name
    // ...
  }

  return {
    name: ref('I am Y'),
  }
})
```

## Вложенные хранилища состояний

Обратите внимание, что если одно хранилище использует другое хранилище, вы можете напрямую импортировать и вызвать функцию `useStore()` в _actions_ и _getters_. Тогда вы сможете взаимодействовать с хранилищем так же, как и с компонентом Vue. Смотрите Общие геттеры и Общие экшены.

Когда дело доходит до _установки хранилищ_, вы можете просто использовать один из хранилищ **в верхней части** функции хранилища:

```ts
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', () => {
  const user = useUserStore()

  const summary = computed(() => {
    return `Здравствуйте ${user.name}, у вас в корзине ${state.list.length} товаров. Их стоимость составляет ${state.price}.`
  })

  function purchase() {
    return apiPurchase(user.id, this.list)
  }

  return { summary, purchase }
})
```

## Общие геттеры

Вы можете просто вызвать `useOtherStore()` внутри _геттера_:

```js
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  getters: {
    summary(state) {
      const user = useUserStore()

      return `Здравствуйте ${user.name}, у вас в корзине ${state.list.length} товаров. Их стоимость составляет ${state.price}.`
    },
  },
})
```

## Общие экшены

То же самое относится и к _экшенам_:

```js
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  actions: {
    async orderCart() {
      const user = useUserStore()

      try {
        await apiOrderCart(user.token, this.items)
        // другой экшен
        this.emptyCart()
      } catch (err) {
        displayError(err)
      }
    },
  },
})
```

Поскольку экшены могут быть асинхронными, убедитесь, что **все ваши вызовы `useStore()` появляются перед любым `await`**. В противном случае это может привести к использованию неправильного экземпляра pinia _в приложениях SSR_:

```js{7-8,11-13}
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  actions: {
    async orderCart() {
      // ✅ вызов в верхней части экшена перед любым `await`.
      const user = useUserStore()

      try {
        await apiOrderCart(user.token, this.items)
        // ❌ вызывается после оператора `await`.
        const otherStore = useOtherStore()
        // другое действие
        this.emptyCart()
      } catch (err) {
        displayError(err)
      }
    },
  },
})
```
