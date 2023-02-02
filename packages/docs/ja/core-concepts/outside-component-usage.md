# コンポーネント外部でストアを使用する {#using-a-store-outside-of-a-component}

Pinia ストアは、すべての呼び出しで同じストアインスタンスを共有するために、`pinia` インスタンスに依存しています。ほとんどの場合、`useStore()` 関数を呼び出すだけで、すぐに動作するようになります。例えば、`setup()` では、他に何もする必要はありません。しかし、コンポーネントの外では少し事情が異なります。
裏側では、`useStore()` が `app` に与えた `pinia` インスタンスを _注入_ しています。つまり、`pinia` インスタンスを自動的に注入できない場合は、手動で `useStore()` 関数に提供する必要があります。
作成しているアプリケーションの種類に応じて、これを別の方法で解決できます。

## シングルページアプリケーション {#single-page-applications}

SSR（Server Side Rendering）を行っていない場合、`app.use(pinia)` を使用して pinia プラグインをインストールした後の `useStore()` の呼び出しは機能します:

```js
import { useUserStore } from '@/stores/user'
import { createApp } from 'vue'
import App from './App.vue'

// ❌  fails because it's called before the pinia is created
const userStore = useUserStore()

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// ✅ works because the pinia instance is now active
const userStore = useUserStore()
```

これが常に適用されるようにする最も簡単な方法は、pinia のインストール後に常に実行される関数内に `useStore()` を配置して、呼び出しを _遅延_ させることです。

Vue Router でナビゲーションガード内のストアを使用する例を見てみましょう:

```js
import { createRouter } from 'vue-router'
const router = createRouter({
  // ...
})

// ❌ Depending on the order of imports this will fail
const store = useStore()

router.beforeEach((to, from, next) => {
  // we wanted to use the store here
  if (store.isLoggedIn) next()
  else next('/login')
})

router.beforeEach((to) => {
  // ✅ This will work because the router starts its navigation after
  // the router is installed and pinia will be installed too
  const store = useStore()

  if (to.meta.requiresAuth && !store.isLoggedIn) return '/login'
})
```

## SSR アプリ {#ssr-apps}

Server Side Rendering を扱う場合、`useStore()` に `pinia` インスタンスを渡す必要があります。これにより、pinia が異なるアプリケーションのインスタンス間でグローバルなステートを共有することを防ぎます。

[SSR ガイド](/ja/ssr/index.md) に専用のセクションがあるので、ここでは簡単に説明します:
