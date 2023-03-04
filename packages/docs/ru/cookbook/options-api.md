# Использование без `setup()`

Pinia можно использовать, даже если вы не используете composition API (если вы используете Vue <2.7, вам все равно нужно установить плагин `@vue/composition-api`). Хотя мы рекомендуем вам попробовать и изучить Composition API, возможно, для вас и вашей команды еще не пришло время, возможно, вы находитесь в процессе миграции приложения или по любой другой причине. Существует несколько функций:

- [mapStores](#giving-access-to-the-whole-store)
- [mapState](../core-concepts/state.md#usage-with-the-options-api)
- [mapWritableState](../core-concepts/state.md#modifiable-state)
- ⚠️ [mapGetters](../core-concepts/getters.md#without-setup) (just for migration convenience, use `mapState()` instead)
- [mapActions](../core-concepts/actions.md#without-setup)

## Предоставление доступа ко всему хранилищу

Если вам нужно получить доступ практически ко всему из хранилища, может оказаться слишком сложным отображать каждое свойство хранилища... Вместо этого вы можете получить доступ ко всему хранилищу с помощью `mapStores()`:

```js
import { mapStores } from 'pinia'

// даны два хранилища со следующими идентификаторами
const useUserStore = defineStore('user', {
  // ...
})
const useCartStore = defineStore('cart', {
  // ...
})

export default {
  computed: {
    // обратите внимание, что мы не передаем массив, а просто одно хранилище за другим
    // каждое хранилище будет доступно как его id + 'Store'
    ...mapStores(useCartStore, useUserStore),
  },

  methods: {
    async buyStuff() {
      // используйте их везде!
      if (this.userStore.isAuthenticated()) {
        await this.cartStore.buy()
        this.$router.push('/purchased')
      }
    },
  },
}
```

По умолчанию Pinia добавляет суффикс `"Store"` к `id` каждому хранилищу. Вы можете настроить это поведение, вызвав функцию `setMapStoreSuffix()`:

```js
import { createPinia, setMapStoreSuffix } from 'pinia'

// полностью удаляем суффикс: this.user, this.cart
setMapStoreSuffix('')
// this.user_store, this.cart_store (все в порядке, я не буду вас осуждать)
setMapStoreSuffix('_store')
export const pinia = createPinia()
```

## TypeScript

По умолчанию все хелперы карт поддерживают autocompletion, и вам не нужно ничего делать. Если вы вызываете `setMapStoreSuffix()` для изменения суффикса `"Store"`, вам нужно будет также добавить его куда-нибудь в TS-файл или в ваш файл `global.d.ts`. Наиболее удобным местом будет то же место, где вы вызываете `setMapStoreSuffix()`:

```ts
import { createPinia, setMapStoreSuffix } from 'pinia'

setMapStoreSuffix('') // полностью удалить суффикс
export const pinia = createPinia()

declare module 'pinia' {
  export interface MapStoresCustomization {
    // установите то же значение, что и выше
    suffix: ''
  }
}
```

:::warning
Если вы используете файл декларации TypeScript (например, `global.d.ts`), убедитесь, что `import 'pinia'` находится в его верхней части, чтобы раскрыть все существующие типы.
:::
