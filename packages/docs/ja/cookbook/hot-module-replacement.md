# HMR (Hot Module Replacement) {#hmr-hot-module-replacement}

Pinia は Hot Module replacement サポートしているので、ページを再読み込みすることなく、アプリ内で直接ストアを編集して操作できます。既存のステートを維持し、ステート、アクション、ゲッターを追加、または削除することも可能です。

現時点では [Vite](https://ja.vitejs.dev/) のみが公式にサポートされていますが、`import.meta.hot` 仕様を実装したバンドラーであれば動作するはずです（例: [webpack](https://webpack.js.org/api/module-variables/#importmetawebpackhot) は `import.meta.hot` の代わりに `import.meta.webpackHot` を使っているようです）。
このコードスニペットは、任意のストアの宣言の次に追加する必要があります。例えば、`auth.js`、`cart.js`、`chat.js` の 3 つのストアがあるとすると、ストア定義の作成後にこれを追加（および適応）する必要があります:

```js
// auth.js
import { defineStore, acceptHMRUpdate } from 'pinia'

const useAuth = defineStore('auth', {
  // options...
})

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot))
}
```
