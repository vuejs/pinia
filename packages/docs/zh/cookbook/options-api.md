# 不使用 `setup()` 的用法 %{#usage-without-setup}%

即使你没有使用组合式 API，也可以使用 Pinia(如果你使用 Vue 2，你仍然需要安装 `@vue/composition-api` 插件)。虽然我们推荐你试着学习一下组合式 API，但对你和你的团队来说目前可能还不是时候，你可能正在迁移一个应用，或者有其他原因。你可以试试下面几个函数：

- [mapStores](#giving-access-to-the-whole-store)
- [mapState](../core-concepts/state.md#usage-with-the-options-api)
- [mapWritableState](../core-concepts/state.md#modifiable-state)
- ⚠️ [mapGetters](../core-concepts/getters.md#without-setup) (只是为了迁移方便，请用 `mapState()` 代替)
- [mapActions](../core-concepts/actions.md#without-setup)

## 给予整个 store 的访问权 %{#giving-access-to-the-whole-store}%

如果你需要访问 store 里的大部分内容，映射 store 的每一个属性可能太麻烦。你可以试试用 `mapStores()` 来访问整个 store：

```js
import { mapStores } from 'pinia'

// 给出具有以下 id 的两个 store
const useUserStore = defineStore('user', {
  // ...
})
const useCartStore = defineStore('cart', {
  // ...
})

export default {
  computed: {
    // 注意，我们不是在传递一个数组，而是一个接一个的 store。
    // 可以 id+'Store' 的形式访问每个 store 。
    ...mapStores(useCartStore, useUserStore),
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

默认情况下，Pinia 会在每个 store 的 `id` 后面加上 `"Store"` 的后缀。你可以通过调用 `setMapStoreSuffix()` 来自定义：

```js
import { createPinia, setMapStoreSuffix } from 'pinia'

// 完全删除后缀：this.user, this.cart
setMapStoreSuffix('')
// this.user_store, this.cart_store (没关系，我不会批评你的)
setMapStoreSuffix('_store')
export const pinia = createPinia()
```

## TypeScript %{#typescript}%

默认情况下，所有映射辅助函数都支持自动补全，你不需要做任何事情。如果你调用 `setMapStoreSuffix()` 修改了 `"Store"` 的后缀，你还需要在 TS 文件或 `global.d.ts` 文件的某个地方添加它。最方便的地方就是你调用 `setMapStoreSuffix()` 的地方：

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
如果你使用的是 TypeScript 声明文件(如 `global.d.ts`)，请确保在文件顶部 `import 'pinia'`，以暴露所有现有类型。
:::
