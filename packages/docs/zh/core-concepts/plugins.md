# Plugins

由于有了底层 API 的支持，Pinia store 现在完全可以被扩展。以下是你可以做的事情的清单：

- 为 store 添加新的属性
- 定义 store 时增加新的选项
- 为 store 增加新的方法
- 包装现有的方法
- 改变或甚至取消 action
- 实现副作用，如[本地存储](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- **仅**应用插件于特定 store

插件是通过 `pinia.use()` 添加到 pinia 实例的。最简单的例子是通过返回一个对象将一个静态属性添加到所有 store。

```js
import { createPinia } from 'pinia'

// 在安装此插件后创建的每个 store 中都会添加一个名为 `secret` 的属性。
// 插件可以保存在不同的文件中
function SecretPiniaPlugin() {
  return { secret: 'the cake is a lie' }
}

const pinia = createPinia()
// 将该插件交给 Pinia
pinia.use(SecretPiniaPlugin)

// 在另一个文件中
const store = useStore()
store.secret // 'the cake is a lie'
```

这对添加全局对象很有用，如路由器、modal 或 toast 管理器。

## 简介{#introduction}

Pinia 插件是一个函数，可以选择性地返回要添加到 store 的属性。它接收一个可选参数，即 _context_。

```js
export function myPiniaPlugin(context) {
  context.pinia // 用 `createPinia()` 创建的 pinia。 
  context.app // 用 `createApp()` 创建的当前应用程序（仅 Vue 3）。
  context.store // 该插件想扩展的 store
  context.options // 定义传给 `defineStore()` 的 store 的可选对象。
  // ...
}
```

然后用 `pinia.use()` 将这个函数传给 `pinia`：

```js
pinia.use(myPiniaPlugin)
```

插件只会应用于**在 `pinia` 传递给应用程序后**创建的 store，否则它们不会生效。

## 扩展 Store{#augmenting-a-store}

你可以直接通过在一个插件中返回包含特定属性的对象来为每个 store 都添加上特定属性：

```js
pinia.use(() => ({ hello: 'world' }))
```

你也可以直接在 `store` 上设置该属性，但**可以的话，请使用返回对象的方法，这样它们就能被 devtools 自动追踪到**：

```js
pinia.use(({ store }) => {
  store.hello = 'world'
})
```

任何由插件返回的属性都会被 devtools 自动追踪，所以如果你想在 devtools 中调试 `hello` 属性，为了使 devtools 能追踪到 `hello`，请确保**在 dev 模式下**将其添加到 `store._customProperties` 中：

```js
// 上文示例
pinia.use(({ store }) => {
  store.hello = 'world'
  // 确保你的构建工具能处理这个问题，webpack 和 vite 在默认情况下应该能处理。
  if (process.env.NODE_ENV === 'development') {
    // 添加你在 store 中设置的任何键
    store._customProperties.add('hello')
  }
})
```

请注意，每个 store 都被 [`reactive`](https://v3.vuejs.org/api/basic-reactivity.html#reactive)包装过，所以可以自动解除它所包含的任何 Ref(`ref()`、`computed()`...) 的包装。

```js
const sharedRef = ref('shared')
pinia.use(({ store }) => {
  // 每个 store 都有其独立的 `hello` 属性
  store.hello = ref('secret')
  // 它会被自动解包
  store.hello // 'secret'

  // 所有的 store 都在共享 `shared` 属性的值
  store.shared = sharedRef
  store.shared // 'shared'
})
```

这就是为什么你可以在没有 `.value` 的情况下访问所有的计算属性，以及为什么它们是响应式的。

### 添加新的state {#adding-new-state}

如果你想给 store 添加新的 state 属性，或者要在 hydration 过程中使用的属性，**你必须在两个地方都添加它**。

- 在 `store` 上，所以你可以用 `store.myState` 访问它。
- 在 `store.$state` 上，所以它可以在 devtools 中使用，并且，**在 SSR 期间被序列化**。

注意，这允许你共享一个 `ref` 或 `computed` 属性。

```js
const globalSecret = ref('secret')
pinia.use(({ store }) => {
  // `secret` 是由所有 store 共享的
  store.$state.secret = globalSecret
  store.secret = globalSecret
  // i它会被自动解包
  store.secret // 'secret'

  const hasError = ref(false)
  store.$state.hasError = hasError
  // 这个必须永远设置
  store.hasError = toRef(store.$state, 'hasError')

  // 在这种情况下，最好不要返回 `hasError`
  // 因为它将被显示在 devtools 的 `state` 部分
  // 如果我们返回它，devtools 将显示两次。
})
```

请注意，在一个插件中 state 变化或添加（包括调用 `store.$patch()`）发生在 store 被激活之前，**不会触发任何订阅**。

:::warning
如果你使用的是**Vue 2**，Pinia 与 Vue 一样受制于[相同的响应式警告](https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats)。在创建新的 state 属性如 `secret` 和 `hasError` 时，你需要使用 `@vue/composition-api` 的 `set`。

```js
import { set } from '@vue/composition-api'
pinia.use(({ store }) => {
  if (!store.$state.hasOwnProperty('hello')) {
    const secretRef = ref('secret')
    // 如果这些数据是要在 SSR 过程中使用的
    // 你应该将其设置在`$state'属性上
    // 这样它就会被序列化并在 hydration 过程中被拾取
    set(store.$state, 'secret', secretRef)
    // 直接在 store 里设置，这样你就可以访问它了。
    // 两种方式都可以：`store.$state.secret` / `store.secret`。
    set(store, 'secret', secretRef)
    store.secret // 'secret'
  }
})
```

:::

## 添加新的外部属性{#adding-new-external-properties}

当添加外部属性、来自其他库的类实例或简单的非响应式的东西时，你应该在把对象传给 pinia 之前用 `markRaw()` 来包装它。下面是一个在每个 store 添加路由器的例子：

```js
import { markRaw } from 'vue'
// 根据你的路由器的位置来调整这个
import { router } from './router'

pinia.use(({ store }) => {
  store.router = markRaw(router)
})
```

## 在插件中调用 `$subscribe`{#calling-subscribe-inside-plugins}

你也可以在插件中使用 [store.$subscribe](./state.md#subscribing-to-the-state) 和 [store.$onAction](./actions.md#subscribing-to-actions) 。

```ts
pinia.use(({ store }) => {
  store.$subscribe(() => {
    // 响应 store 变化
  })
  store.$onAction(() => {
    // 响应 store actions
  })
})
```

## 添加新的选项{#adding-new-options}

在定义 store 时，可以创建新的选项，以便之后在插件中使用它们。例如，你可以创建一个 `debounce` 选项，允许你让任何 action 实现防抖。

```js
defineStore('search', {
  actions: {
    searchContacts() {
      // ...
    },
  },

  // 这将在之后被一个插件读取
  debounce: {
    // 让 action searchContacts 防抖 300ms
    searchContacts: 300,
  },
})
```

然后，该插件可以读取该选项来包装 action ，并替换原始 action：

```js
// 使用任意防抖库
import debounce from 'lodash/debounce'

pinia.use(({ options, store }) => {
  if (options.debounce) {
    // 我们正在用新的 action 来覆盖这些 action
    return Object.keys(options.debounce).reduce((debouncedActions, action) => {
      debouncedActions[action] = debounce(
        store[action],
        options.debounce[action]
      )
      return debouncedActions
    }, {})
  }
})
```

注意，在使用 setup 语法时，自定义选项作为第 3 个参数传递：

```js
defineStore(
  'search',
  () => {
    // ...
  },
  {
    // 这将在之后被一个插件读取
    debounce: {
      // 让 action searchContacts 防抖 300ms
      searchContacts: 300,
    },
  }
)
```

## TypeScript

上面显示的一切都可以通过类型支持来完成，所以你永远不需要使用 `any` 或 `@ts-ignore`。

### 类型插件{#typing-plugins}

一个 Pinia 插件可按如下方式实现类型检查：

```ts
import { PiniaPluginContext } from 'pinia'

export function myPiniaPlugin(context: PiniaPluginContext) {
  // ...
}
```

### 为新的 store 属性添加类型{#typing-new-store-properties}

当在 store 中添加新的属性时，你也应该扩展 `PiniaCustomProperties` 接口。

```ts
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomProperties {
    // 通过使用一个 setter，我们可以允许字符串和引用。
    set hello(value: string | Ref<string>)
    get hello(): string

    // 你也可以定义更简单的值
    simpleNumber: number
  }
}
```

然后，它就可以被安全地写入和读取了：

```ts
pinia.use(({ store }) => {
  store.hello = 'Hola'
  store.hello = ref('Hola')

  store.simpleNumber = Math.random()
  // @ts-expect-error: we haven't typed this correctly
  store.simpleNumber = ref(Math.random())
})
```

`PiniaCustomProperties` 是一个通用类型，允许你引用 store 的属性。思考下面这个例子，我们把初始选项复制成 `$options`（这只对选项 store 有效）。

```ts
pinia.use(({ options }) => ({ $options: options }))
```

我们可以通过使用 `PiniaCustomProperties` 的4种通用类型来为此进行类型检查。

```ts
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomProperties<Id, S, G, A> {
    $options: {
      id: Id
      state?: () => S
      getters?: G
      actions?: A
    }
  }
}
```

:::tip
当在泛型中扩展类型时，它们的名字必须**与源代码中完全一样**。`Id` 不能被命名为 `id` 或 `I` ，`S` 不能被命名为 `State`。下面是每个字母代表的含义：

- S: State
- G: Getters
- A: Actions
- SS: Setup Store/Store

:::

### 为新的 state 添加类型{#typing-new-state}

当添加新的 state 属性（包括 `store` 和 `store.$state` ）时，你需要将类型添加到 `PiniaCustomStateProperties` 中。与 `PiniaCustomProperties` 不同的是，它只接收 `State` 泛型：

```ts
import 'pinia'

declare module 'pinia' {
  export interface PiniaCustomStateProperties<S> {
    hello: string
  }
}
```

### 为新的创建选项添加类型{#typing-new-creation-options}

当为 `defineStore()` 创建新选项时，你应该扩展 `DefineStoreOptionsBase`。与 `PiniaCustomProperties` 不同的是，它只暴露了两个泛型：State 和 Store 类型，允许你限制可以定义的内容。例如，你可以使用 action 的名称：

```ts
import 'pinia'

declare module 'pinia' {
  export interface DefineStoreOptionsBase<S, Store> {
    // allow defining a number of ms for any of the actions
    debounce?: Partial<Record<keyof StoreActions<Store>, number>>
  }
}
```

:::tip
还有一个 `StoreGetters` 类型可以从一个 store 类型中提取 _getters_。你也可以且**只可以**分别通过扩展 `DefineStoreOptions` 和 `DefineSetupStoreOptions` 类型来扩展 _setup stores_ 或_option stores_ 的选项。
:::

## Nuxt.js

当[在 Nuxt 中使用 pinia](../ssr/nuxt.md)时，你必须先创建一个 [Nuxt 插件](https://nuxtjs.org/docs/2.x/directory-structure/plugins)。这样才能使你能够访问 `pinia` 实例：

```ts
// plugins/myPiniaPlugin.js
import { PiniaPluginContext } from 'pinia'
import { Plugin } from '@nuxt/types'

function MyPiniaPlugin({ store }: PiniaPluginContext) {
  store.$subscribe((mutation) => {
    // 响应 store 变更
    console.log(`[🍍 ${mutation.storeId}]: ${mutation.type}.`)
  })

  // 请注意，如果你使用的是TS，则必须添加类型。
  return { creationTime: new Date() }
}

const myPlugin: Plugin = ({ $pinia }) => {
  $pinia.use(MyPiniaPlugin)
}

export default myPlugin
```

注意上面的例子是使用 TypeScript。如果你使用的是 `.js` 文件，你必须删除类型注释 `PiniaPluginContext` 和 `Plugin` 以及它们的导入。
