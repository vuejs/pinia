# 不使用 `setup()` 的用法{#usage-without-setup}

即使你没有使用组合式 API，也可以使用 Pinia（如果你使用 Vue 2，你仍然需要安装`@vue/composition-api`插件）。虽然我们推荐你试着学习一下组合式 API，但对你和你的团队来说可能还不是时候，你可能正在迁移一个应用程序，或者有其他任何原因。有下面几个可用的函数：

- [mapStores](#giving-access-the-whole-store)
- [mapState](../core-concepts/state.md#options-api)
- [mapWritableState](../core-concepts/state.md#modifiable-state)
- ⚠️ [mapGetters](../core-concepts/getters.md#options-api) (只是为了迁移方便，请用 `mapState()` 代替)
- [mapActions](../core-concepts/actions.md#options-api)

## 给予整个 store 的访问权{#giving-access-to-the-whole-store}

如果你需要访问 store 里的几乎所有东西，映射 store 的每一个属性可能太麻烦。相反，你可以用 `mapStores()` 来获得对整个 store 的访问。

```js
import { mapStores } from 'pinia'

// 给出两个具有以下 id 的 store
const useUserStore = defineStore('user', {
  // ...
})
const useCartStore = defineStore('cart', {
  // ...
})

export default {
  computed: {
    // 注意，我们不是在传递一个数组，只是一个接一个的 store。
    // 每个 store 将以其 id+'Store' 的形式被访问。
    ...mapStores(useCartStore, useUserStore)
  },

  methods: {
    async buyStuff() {
      // 可以在任何地方使用他们！
      if (this.userStore.isAuthenticated()) {
        await this.cartStore.buy()
        this.$router.push('/purchased')
      }
    },
  },
}
```

默认情况下，Pinia 会在每个 store 的 `id` 后面加上 `"Store"` 的后缀。你可以通过调用 `setMapStoreSuffix()` 来定制这一行为：

```js
import { createPinia, setMapStoreSuffix } from 'pinia'

// 完全删除后缀：this.user, this.cart
setMapStoreSuffix('')
// this.user_store, this.cart_store (没关系，我不会批评你的)
setMapStoreSuffix('_store')
export const pinia = createPinia()
```

## TypeScript

默认情况下，所有 map helpers 都支持自动补全，你不需要做任何事情。如果你调用 `setMapStoreSuffix()` 修改 `"Store"` 的后缀，你还需要在 TS 文件或 `global.d.ts` 文件的某个地方添加它。最方便的地方是你调用 `setMapStoreSuffix()` 的地方：

```ts
import { createPinia, setMapStoreSuffix } from 'pinia'

setMapStoreSuffix('') // 完全删除后缀
export const pinia = createPinia()

declare module 'pinia' {
  export interface MapStoresCustomization {
    // 设置成和上面一样的值
    suffix: ''
  }
}
```

:::warning
如果你使用的是 TypeScript 声明文件（如 `global.d.ts`），请确保在文件顶部 `import 'pinia'`，以暴露所有现有类型。
:::
