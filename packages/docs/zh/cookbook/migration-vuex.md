# 从 Vuex ≤4 迁移 {#migrating-from-vuex-≤4}

虽然 Vuex 和 Pinia store 的结构不同，但很多逻辑都可以复用。本指南的作用是帮助你完成迁移，并指出一些可能出现的常见问题。

## 准备 {#preparation}

首先，按照[入门指南](../getting-started.md)安装 Pinia。

## 重构 store 的模块 {#restructuring-modules-to-stores}

Vuex 有一个概念，带有多个模块的单一 store。这些模块可以被命名，甚至可以互相嵌套。

将这个概念过渡到 Pinia 最简单的方法是，你以前使用的每个模块现在都是一个 _store_。每个 store 都需要一个 `id`，类似于 Vuex 中的命名空间。这意味着每个 store 都有命名空间的设计。嵌套模块也可以成为自己的 store。互相依赖的 store 可以直接导入其他 store。

你的 Vuex 模块如何重构为 Pinia store，完全取决于你，不过这里有一个示例：

```bash
# Vuex 示例（假设是命名模块）。
src
└── store
    ├── index.js           # 初始化 Vuex，导入模块
    └── modules
        ├── module1.js     # 命名模块 'module1'
        └── nested
            ├── index.js   # 命名模块 'nested'，导入 module2 与 module3
            ├── module2.js # 命名模块 'nested/module2'
            └── module3.js # 命名模块 'nested/module3'

# Pinia 示例，注意 ID 与之前的命名模块相匹配
src
└── stores
    ├── index.js          # （可选） 初始化 Pinia，不必导入 store
    ├── module1.js        # 'module1' id
    ├── nested-module2.js # 'nested/module2' id
    ├── nested-module3.js # 'nested/module3' id
    └── nested.js         # 'nested' id
```

这为 store 创建了一个扁平的结构，但也保留了和之前等价的 `id` 命名方式。如果你在根 store（在 Vuex 的 `store/index.js` 文件中）中有一些 state/getter/action/mutation，你可以创建一个名为 `root` 的 store，来保存它们。

Pinia 的目录一般被命名为 `stores` 而不是 `store`。这是为了强调 Pinia 可以使用多个 store，而不是 Vuex 的单一 store。

对于大型项目，你可能希望逐个模块进行转换，而不是一次性全部转换。其实在迁移过程中，你可以同时使用 Pinia 和 Vuex。这样也完全可以正常工作，这也是将 Pinia 目录命名为 `stores` 的另一个原因。

## 转换单个模块 {#converting-a-single-module}

下面有一个完整的例子，介绍了将 Vuex 模块转换为 Pinia store 的完整过程，请看下面的逐步指南。Pinia 的例子使用了一个 option store，因为其结构与 Vuex 最为相似。

```ts
// 'auth/user' 命名空间中的 Vuex 模块
import { Module } from 'vuex'
import { api } from '@/api'
import { RootState } from '@/types' // 如果需要使用 Vuex 的类型便需要引入

interface State {
  firstName: string
  lastName: string
  userId: number | null
}

const storeModule: Module<State, RootState> = {
  namespaced: true,
  state: {
    firstName: '',
    lastName: '',
    userId: null
  },
  getters: {
    firstName: (state) => state.firstName,
    fullName: (state) => `${state.firstName} ${state.lastName}`,
    loggedIn: (state) => state.userId !== null,
    // 与其他模块的一些状态相结合
    fullUserDetails: (state, getters, rootState, rootGetters) => {
      return {
        ...state,
        fullName: getters.fullName,
        // 读取另一个名为 `auth` 模块的 state
        ...rootState.auth.preferences,
        // 读取嵌套于 `auth` 模块的 `email` 模块的 getter
        ...rootGetters['auth/email'].details
      }
    }
  },
  actions: {
    async loadUser ({ state, commit }, id: number) {
      if (state.userId !== null) throw new Error('Already logged in')
      const res = await api.user.load(id)
      commit('updateUser', res)
    }
  },
  mutations: {
    updateUser (state, payload) {
      state.firstName = payload.firstName
      state.lastName = payload.lastName
      state.userId = payload.userId
    },
    clearUser (state) {
      state.firstName = ''
      state.lastName = ''
      state.userId = null
    }
  }
}

export default storeModule
```

```ts
// Pinia Store
import { defineStore } from 'pinia'
import { useAuthPreferencesStore } from './auth-preferences'
import { useAuthEmailStore } from './auth-email'
import vuexStore from '@/store' // 逐步转换，见 fullUserDetails

interface State {
  firstName: string
  lastName: string
  userId: number | null
}

export const useAuthUserStore = defineStore('auth/user', {
  // 转换为函数
  state: (): State => ({
    firstName: '',
    lastName: '',
    userId: null
  }),
  getters: {
    // 不在需要 firstName getter，移除
    fullName: (state) => `${state.firstName} ${state.lastName}`,
    loggedIn: (state) => state.userId !== null,
    // 由于使用了 `this`，必须定义一个返回类型
    fullUserDetails (state): FullUserDetails {
      // 导入其他 store
      const authPreferencesStore = useAuthPreferencesStore()
      const authEmailStore = useAuthEmailStore()
      return {
        ...state,
        // `this` 上的其他 getter
        fullName: this.fullName,
        ...authPreferencesStore.$state,
        ...authEmailStore.details
      }

      // 如果其他模块仍在 Vuex 中，可替代为
      // return {
      //   ...state,
      //   fullName: this.fullName,
      //   ...vuexStore.state.auth.preferences,
      //   ...vuexStore.getters['auth/email'].details
      // }
    }
  },
  actions: {
    //没有作为第一个参数的上下文，用 `this` 代替
    async loadUser (id: number) {
      if (this.userId !== null) throw new Error('Already logged in')
      const res = await api.user.load(id)
      this.updateUser(res)
    },
    // mutation 现在可以成为 action 了，不再用 `state` 作为第一个参数，而是用 `this`。
    updateUser (payload) {
      this.firstName = payload.firstName
      this.lastName = payload.lastName
      this.userId = payload.userId
    },
    // easily reset state using `$reset`
    clearUser () {
      this.$reset()
    }
  }
})
```

让我们把上述内容分解成几个步骤：

1. 为 store 添加一个必要的 `id`，你可以让它与之前的命名保持相同。
2. 如果 `state` 不是一个函数的话 将它转换为一个函数。
3. 转换 `getters`
    1. 删除任何返回同名 state 的 getters（例如： `firstName: (state) => state.firstName`)，这些都不是必需的，因为你可以直接从 store 实例中访问任何状态。
    2. 如果你需要访问其他的 getter，可通过 `this` 访问它们，而不是第二个参数。记住，如果你使用 `this`，那么你必须使用一个普通函数，而不是一个箭头函数。还要注意的是，由于 TS 的限制，你需要指定一个返回类型，更多细节请阅读[这篇文档](../core-concepts/getters.md#accessing-other-getters)
    3. 如果使用 `rootState` 或 `rootGetters` 参数，可以直接导入其他 store 来替代它们，或者如果它们仍然存在于 Vuex ，则直接从 Vuex 中访问它们。
4. 转换 `actions`
    1. 从每个 action 中删除第一个 `context` 参数。所有的东西都应该从 `this` 中访问。
    2. 如果使用其他 store，要么直接导入，要么与 getters 一样，在 Vuex 上访问。
5. 转换 `mutations`
    1. Mutation 已经弃用了。它们可以被转换为 `action`，或者你可以在你的组件中直接赋值给 store（例如，`userStore.firstName = 'First'`)
    2. 如果转换为 action，删除第一个 `state` 参数，用 `this` 代替任何赋值操作中的 `state`。
    3. 一个常见的 mutation 是将 state 重置为初始 state。这就是 store 的 `$reset` 方法的内置功能。注意，这个功能只存在于 option stores。

正如你所看到的，你的大部分代码都可以被重复使用。如果有什么遗漏，类型安全也应该帮助你确定需要修改的地方。

## 组件内的使用 {#usage-inside-components}

现在你的 Vuex 模块已经被转换为 Pinia store，但其他使用该模块的组件或文件也需要更新。

如果你以前使用的是 Vuex 的 `map` helpers，可以看看[不使用 setup() 的用法指南](./options-api.md)，因为这些 helpers 大多都是可以复用。

如果你以前使用的是 `useStore`，那么就直接导入新 store 并访问其上的 state。比如说：

```ts
// Vuex
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup () {
    const store = useStore()

    const firstName = computed(() => store.state.auth.user.firstName)
    const fullName = computed(() => store.getters['auth/user/fullName'])

    return {
      firstName,
      fullName
    }
  }
})
```

```ts
// Pinia
import { defineComponent, computed } from 'vue'
import { useAuthUserStore } from '@/stores/auth-user'

export default defineComponent({
  setup () {
    const authUserStore = useAuthUserStore()

    const firstName = computed(() => authUserStore.firstName)
    const fullName = computed(() => authUserStore.fullName)

    return {
      // 你也可以在你的组件中通过返回 store 来访问整个 store
      authUserStore,
      firstName,
      fullName
    }
  }
})
```

## 组件外的使用 {#usage-outside-components}

只要你注意**不在函数外使用 store**，只更新组件外的用法应该很简单。下面是一个在 Vue Router 导航卫士中使用 store 的例子：

```ts
// Vuex
import vuexStore from '@/store'

router.beforeEach((to, from, next) => {
  if (vuexStore.getters['auth/user/loggedIn']) next()
  else next('/login')
})
```

```ts
// Pinia
import { useAuthUserStore } from '@/stores/auth-user'

router.beforeEach((to, from, next) => {
  // 必须再函数内部使用
  const authUserStore = useAuthUserStore()
  if (authUserStore.loggedIn) next()
  else next('/login')
})
```

更多细节可在[这里](../core-concepts/outside-component-usage.md)找到。

## Vuex 高级用法 {#advanced-vuex-usage}

如果你的 Vuex store 使用了它所提供的一些更高级的功能，也有一些关于如何在 Pinia 中实现同样效果的指导。其中一些要点已经包含在这个[对比总结]（../introduction.md#comparison-with-vuex-3-x-4-x）里了。

### 动态模块 {#dynamic-modules}

在 Pinia 中不需要动态注册模块。store 设计之初就是动态的，只有在需要时才会被注册。如果一个 store 从未被使用过，它就永远不会被 “注册”。

### 热更新 {#hot-module-replacement}

支持 HMR，但需要一些修改，见[HMR 指南](./hot-module-replacement.md)。

### 插件 {#plugins}

如果你使用的是一个公共的 Vuex 插件，那么请检查是否有一个 Pinia 版的替代品。如果没有，你就需要自己写一个，或者评估一下是否还有必要使用这个插件。

如果你已经写了一个自己的插件，那么你完全可以更新它来适配 pinia，参考[插件指南](../core-concepts/plugins.md)。
