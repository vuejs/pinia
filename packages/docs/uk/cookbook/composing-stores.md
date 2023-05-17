# Компонування сховищ %{#composing-stores}%

Компонування сховищ означає наявність сховищ, які використовують один одного, і це підтримується в Pinia. Є одне правило, якого слід дотримуватися:

Якщо **два чи більше сховища використовують один одного**, вони не можуть створити нескінченний цикл через _гетери_ або _дії_. Вони не можуть **обидва** безпосередньо читати стан один одного у своїй функції setup:

```js
const useX = defineStore('x', () => {
  const y = useY()

  // ❌ Це неможливо, оскільки y також намагається прочитати x.name
  y.name

  function doSomething() {
    // ✅ Читання властивостей y в обчисленнях або діях
    const yName = y.name
    // ...
  }

  return {
    name: ref('I am X'),
  }
})

const useY = defineStore('y', () => {
  const x = useX()

  // ❌ Це неможливо, оскільки x також намагається прочитати y.name
  x.name

  function doSomething() {
    // ✅ Читання властивостей x в обчисленнях або діях
    const xName = x.name
    // ...
  }

  return {
    name: ref('I am Y'),
  }
})
```

## Вкладені сховища %{#nested-stores}%

Зауважте, що якщо одне сховище використовує інше сховище, ви можете безпосередньо імпортувати та викликати функцію `useStore()` у _діях_ та _гетерах_. Тоді ви зможете взаємодіяти зі сховищем так само, як із компонентом Vue. Перегляньте [Спільні гетери](#shared-getters) та [Спільні дії](#shared-actions).

Що стосується _setup сховищ, ви можете просто використовувати одне зі сховищ **у верхній частині** функції сховища:

```ts
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', () => {
  const user = useUserStore()

  const summary = computed(() => {
    return `Привіт, ${user.name}, ви маєте ${state.list.length} товарів у вашому кошику. Це коштує ${state.price}.`
  })

  function purchase() {
    return apiPurchase(user.id, this.list)
  }

  return { summary, purchase }
})
```

## Спільні гетери %{#shared-getters}%

Ви можете просто викликати `useOtherStore()` всередині _гетера_:

```js
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  getters: {
    summary(state) {
      const user = useUserStore()

      return `Привіт, ${user.name}, ви маєте ${state.list.length} товарів у вашому кошику. Це коштує ${state.price}.`
    },
  },
})
```

## Спільні дії %{#shared-actions}%

Те саме стосується _дій_:

```js
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  actions: {
    async orderCart() {
      const user = useUserStore()

      try {
        await apiOrderCart(user.token, this.items)
        // інша дія
        this.emptyCart()
      } catch (err) {
        displayError(err)
      }
    },
  },
})
```

Оскільки дії можуть бути асинхронними, переконайтеся, що **усі ваші виклики `useStore()` з'являються до будь-якого `await`**. Інакше це може призвести до використання неправильного екземпляра pinia _в застосунках SSR_:

```js{7-8,11-13}
import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useCartStore = defineStore('cart', {
  actions: {
    async orderCart() {
      // ✅ виклик у верхній частині дії до будь-якого `await`
      const user = useUserStore()

      try {
        await apiOrderCart(user.token, this.items)
        // ❌ викликано після оператора `await`
        const otherStore = useOtherStore()
        // інша дія
        this.emptyCart()
      } catch (err) {
        displayError(err)
      }
    },
  },
})
```
