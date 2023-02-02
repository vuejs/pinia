## インストール {#installation}

<VueMasteryLogoLink for="pinia-cheat-sheet">
</VueMasteryLogoLink>

お好みのパッケージマネージャで `pinia` をインストールします:

```bash
yarn add pinia
# or with npm
npm install pinia
```

:::tip
Vue <2.7 を使用している場合、composition api: `@vue/composition-api` もインストールする必要があります。Nuxt を使用している場合、[こちらの手順](./ssr/nuxt.md) に従ってください。
:::

Vue CLI を使用している場合、代わりにこちらの [**非公式プラグイン**](https://github.com/wobsoriano/vue-cli-plugin-pinia) を試してみてください。

pinia インスタンス（ルートストア）を作成し、プラグインとしてアプリに渡します:

```js {2,5-6,8}
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

Vue 2 を使用している場合、プラグインをインストールし、作成した `pinia` をアプリのルートにインジェクトする必要があります:

```js {1,3-4,12}
import { createPinia, PiniaVuePlugin } from 'pinia'

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

new Vue({
  el: '#app',
  // other options...
  // ...
  // note the same `pinia` instance can be used across multiple Vue apps on
  // the same page
  pinia,
})
```

これにより devtools のサポートも追加されます。Vue 3 では、vue-devtools が必要な API をまだ公開していないため、タイムトラベルや編集などの一部の機能はまだサポートされていませんが、devtools ははるかに多くの機能を持ち、全体としての開発者体験ははるかに優れています。Vue 2 では、Pinia は Vuex の既存のインターフェースを使用します（したがって Vuex と一緒に使用することはできません）。

## Store とは？ {#what-is-a-store}

ストア（Pinia など）は、コンポーネントツリーにバインドされていない、状態とビジネスロジックを保持するエンティティです。つまり、**グローバルな状態を保持** します。ストアは常に存在し、誰もが読み書きできるコンポーネントのようなものです。[state](./core-concepts/state.md)、[getters](./core-concepts/getters.md) そして [actions](./core-concepts/actions.md) という **3つの概念** を持ち、これらの概念は、コンポーネントにおける `data`、`computed` そして `methods` に相当すると考えてよいでしょう。

## どのような場合に Store を使用するか {#when-should-i-use-a-store}

ストアには、アプリケーション全体を通してアクセスできるデータを格納する必要があります。これには、例えばナビゲーションバーに表示されるユーザー情報のように多くの場所で使用されるデータや、非常に複雑なマルチステップフォームのようにページを通して保存する必要があるデータも含まれます。

一方、代わりにコンポーネントで保持される可能性のあるローカルデータをストアに含めることは避ける必要があります。例: ページに固有な要素の可視性。

すべてのアプリケーションがグローバルな状態へのアクセスを必要とするわけではありませんが、もし必要であれば、Pinia はあなたの生活をより快適なものにしてくれることでしょう。
