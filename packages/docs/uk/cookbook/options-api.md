# Usage without `setup()`

Pinia можна використовувати, навіть якщо ви не використовуєте композиційний API (якщо ви використовуєте Vue <2.7, вам все одно потрібно встановити плагін `@vue/composition-api`). Хоча ми рекомендуємо вам спробувати композиційний API і вивчити його, можливо, для вас і вашої команди ще не настав час, можливо, ви перебуваєте в процесі міграції застосунку або з будь-якої іншої причини. Ось кілька функцій:

- [mapStores](#giving-access-to-the-whole-store)
- [mapState](../core-concepts/state.md#usage-with-the-options-api)
- [mapWritableState](../core-concepts/state.md#modifiable-state)
- ⚠️ [mapGetters](../core-concepts/getters.md#without-setup) (лише для зручності міграції, замість цього використовуйте `mapState()`)
- [mapActions](../core-concepts/actions.md#without-setup)

## Надання доступу до всього сховища

Якщо вам потрібно отримати доступ майже до всього зі сховища, можливо, буде занадто складно зіставляти кожну властивість сховища... Натомість ви можете отримати доступ до всього сховища за допомогою `mapStores()`:

```js
import { mapStores } from 'pinia'

// надано два сховища з такими ідентифікаторами
const useUserStore = defineStore('user', {
  // ...
})
const useCartStore = defineStore('cart', {
  // ...
})

export default {
  computed: {
    // зауважте, що ми не передаємо масив, лише одне сховище за іншим
    // кожен сховище буде доступне як його id + 'Store'
    ...mapStores(useCartStore, useUserStore)
  },

  methods: {
    async buyStuff() {
      // використовуйте їх будь-де!
      if (this.userStore.isAuthenticated()) {
        await this.cartStore.buy()
        this.$router.push('/purchased')
      }
    },
  },
}
```

За замовчуванням Pinia додасть суфікс `"Store"` до `id` кожного сховища. Ви можете налаштувати цю поведінку, викликавши `setMapStoreSuffix()`:

```js
import { createPinia, setMapStoreSuffix } from 'pinia'

// повністю видалити суфікс: this.user, this.cart
setMapStoreSuffix('')
// this.user_store, this.cart_store (все гаразд, я не засуджую)
setMapStoreSuffix('_store')
export const pinia = createPinia()
```

## TypeScript

За замовчуванням усі помічники зіставлення підтримують автозаповнення, і вам не потрібно нічого робити. Якщо ви викликаєте `setMapStoreSuffix()`, щоб змінити суфікс `"Store"`, вам також потрібно буде додати його десь у файлі TS або файлі `global.d.ts`. Найзручнішим місцем буде те саме місце, де ви викликаєте `setMapStoreSuffix()`:

```ts
import { createPinia, setMapStoreSuffix } from 'pinia'

setMapStoreSuffix('') // повністю видалити суфікс
export const pinia = createPinia()

declare module 'pinia' {
  export interface MapStoresCustomization {
    // встановіть для нього те саме значення, що й вище
    suffix: ''
  }
}
```

:::warning
Якщо ви використовуєте файл декларації TypeScript (наприклад, `global.d.ts`), переконайтеся, що вказано `import 'pinia'` у його верхній частині, щоб всі існуючі типи були доступні.
:::
