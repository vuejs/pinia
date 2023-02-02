# はじめに {#introduction}

<VueSchoolLink
  href="https://vueschool.io/lessons/introduction-to-pinia"
  title="Get started with Pinia"
/>

Pinia は、2019 年 11 月頃 [Composition API](https://github.com/vuejs/composition-api) を使って Vue 用の Store がどのようなものになるかを再設計する実験として [始まりました](https://github.com/vuejs/pinia/commit/06aeef54e2cad66696063c62829dac74e15fd19e)。それ以来、最初の原則は変わっていませんが、Pinia は Vue 2 と Vue 3 の両方で動作し、**composition API を使用する必要はありません**。API は _インストール_ と _SSR_ 以外はどちらも同じで、このドキュメントは Vue 3 を対象として、必要なときに **Vue 2** に関する注釈を入れているので、Vue 2 と Vue 3 のユーザーにも読んでもらえると思います。

## なぜ Pinia を使うべきなのか？ {#why-should-i-use-pinia}

Pinia は Vue のためのストアライブラリで、コンポーネントやページ間で状態を共有することができます。Composition API に慣れていると、単純な `export const state = reactive({})` ですでにグローバルなステートを共有できると思うかもしれません。これは単一ページのアプリケーションには当てはまりますが、サーバーサイドでレンダリングする場合、**アプリケーションは [セキュリティの脆弱性](https://ja.vuejs.org/guide/scaling-up/ssr.html#cross-request-state-pollution) にさらされます**。しかし、小さな単一ページのアプリケーションであっても、Pinia を使用することで多くのことを得ることができます。

- Devtools のサポート
  - アクション、ミューテーションを追跡するためのタイムライン
  - 使用されるコンポーネントにストアが表示される
  - タイムトラベルと容易なデバッグ
- Hot module replacement
  - ページを再読み込みすることなくストアを変更
  - 既存の状態を維持したまま開発可能
- プラグイン: プラグインによる Pinia の機能拡張
- 適切な TypeScript サポート、または JS ユーザーのための **オートコンプリート**
- サーバーサイドレンダリング対応

<VueMasteryLogoLink for="pinia-cheat-sheet">
</VueMasteryLogoLink>

## 基本的な例 {#basic-example}

Pinia の使い方を API で説明します（完全な説明は [Getting Started](./getting-started.md) を確認してください）。まず、ストアを作成します:

```js
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => {
    return { count: 0 }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    increment() {
      this.count++
    },
  },
})
```

そして、それをコンポーネントで _使用_ します:

```js
import { useCounterStore } from '@/stores/counter'

export default {
  setup() {
    const counter = useCounterStore()

    counter.count++
    // with autocompletion ✨
    counter.$patch({ count: counter.count + 1 })
    // or using an action instead
    counter.increment()
  },
}
```

より高度なユースケースのために、関数（コンポーネントの `setup()` と同様）を使って Store を定義することも可能です:

```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }

  return { count, increment }
})
```

もしまだ `setup()` や Composition API に慣れていない場合でも、心配する必要はありません。Pinia も [Vuex のようなマップヘルパー](https://vuex.vuejs.org/guide/state.html#the-mapstate-helper) をサポートしています。ストアの定義は同じですが、`mapStores()`、`mapState()`、または `mapActions()` を使用します:

```js {22,24,28}
const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})

const useUserStore = defineStore('user', {
  // ...
})

export default {
  computed: {
    // other computed properties
    // ...
    // gives access to this.counterStore and this.userStore
    ...mapStores(useCounterStore, useUserStore),
    // gives read access to this.count and this.double
    ...mapState(useCounterStore, ['count', 'double']),
  },
  methods: {
    // gives access to this.increment()
    ...mapActions(useCounterStore, ['increment']),
  },
}
```

各 _マップヘルパー_ の詳細については、コアコンセプトをご覧ください。

## なぜ _Pinia_ なのか {#why-pinia}

Pinia (発音は `/piːnjʌ/`、英語では "peenya") は、パッケージ名として有効な _piña_ (スペイン語で _パイナップル_) に最も近い単語です。パイナップルは、実は一つ一つの花が集まって、複数の果実を作っています。Store と同じで、ひとつひとつは個々に生まれますが、最後にはすべてつながっています。また、南米原産のおいしいトロピカルフルーツです。

## より現実的な例 {#a-more-realistic-example}

以下は **JavaScriptでも型を使用した** Pinia で使用する API のより完全な例です。人によっては、これ以上読まずに始めるには十分かもしれませんが、他のドキュメントをチェックしたり、この例を読み飛ばして _コアコンセプト_ のすべてを読んでから戻ってくることをお勧めします。

```js
import { defineStore } from 'pinia'

export const useTodos = defineStore('todos', {
  state: () => ({
    /** @type {{ text: string, id: number, isFinished: boolean }[]} */
    todos: [],
    /** @type {'all' | 'finished' | 'unfinished'} */
    filter: 'all',
    // type will be automatically inferred to number
    nextId: 0,
  }),
  getters: {
    finishedTodos(state) {
      // autocompletion! ✨
      return state.todos.filter((todo) => todo.isFinished)
    },
    unfinishedTodos(state) {
      return state.todos.filter((todo) => !todo.isFinished)
    },
    /**
     * @returns {{ text: string, id: number, isFinished: boolean }[]}
     */
    filteredTodos(state) {
      if (this.filter === 'finished') {
        // call other getters with autocompletion ✨
        return this.finishedTodos
      } else if (this.filter === 'unfinished') {
        return this.unfinishedTodos
      }
      return this.todos
    },
  },
  actions: {
    // any amount of arguments, return a promise or not
    addTodo(text) {
      // you can directly mutate the state
      this.todos.push({ text, id: this.nextId++, isFinished: false })
    },
  },
})
```

## Vuex との比較 {#comparison-with-vuex}

Pinia は Vuex の次のイテレーションがどのようなものかを探るために始まり、Vuex 5 のコアチームの議論から多くのアイデアを取り込みました。最終的に、Pinia は Vuex 5 で私たちが望んでいたことのほとんどをすでに実装していることに気づき、代わりにこれを新しい推奨とすることにしました。

Vuex と比較して、Pinia は控えめでシンプルな API を提供し、Composition-API-style の API を提供し、そして最も重要なことは TypeScript で使用した場合に確実な型推論をサポートすることです。

### RFCs {#rfcs}

当初、Pinia は RFC のプロセスを経ていませんでした。私は、アプリケーションを開発した経験、他の人のコードを読んだ経験、Pinia を使うクライアントのために働いた経験、Discord で質問に答えた経験に基づいて、アイデアをテストしました。
これにより、様々なケースやアプリケーションのサイズに適応し、機能するソリューションを提供することができました。私は頻繁にパブリッシュを行い、ライブラリのコア API を同じにしながら進化させるようにしました。

Pinia がデフォルトの状態管理ソリューションとなった今、Vue エコシステムの他のコアライブラリと同じ RFC プロセスの対象となり、その API は安定した状態に入りました。

### Vuex 3.x/4.x との比較 {#comparison-with-vuex-3-x-4-x}

> Vuex 3.x は Vue 2 用の Vuex で、Vuex 4.x は Vue 3 用の Vuex です。

Pinia の API は、Vuex ≤4 と大きく異なっています:

- _mutations_ はもはや存在しません。それらはしばしば **非常に冗長** と認識されていました。当初、devtools の統合をもたらしましたが、それはもはや問題ではありません。
- TypeScript をサポートするために複雑なラッパーをカスタムで作成する必要はなく、すべてが型付けされ、API は TS 型推論を可能な限り活用できるように設計されています。
- もう魔法の文字列を注入する必要はなく、関数をインポートし、呼び出し、オートコンプリートを楽しむことができます！
- ストアをダイナミックに追加する必要はありません。デフォルトですべてダイナミックになっているので、気づくこともないでしょう。なお、手動でストアを使用して好きなときに登録することもできますが、自動で行われるため、気にする必要はありません。
- _モジュール_ の入れ子構造はもうやめましょう。ストアをインポートして別のストアの中で _使う_ ことで、暗黙のうちにストアを入れ子にすることはできますが、Pinia は設計上フラットな構造を提供し、ストア間のクロスコンポジションを可能にしています。 **ストアの循環依存関係を持つことさえできます**。
- _名前空間のあるモジュール_ はありません。ストアのフラットなアーキテクチャを考えると、ストアの「名前空間」はストアの定義方法に固有のものであり、すべてのストアは名前空間であると言えるかもしれません。

既存の Vuex ≤4 プロジェクトを Pinia 用に変換する詳細な手順については、[Vuex からの移行ガイド](./cookbook/migration-vuex.md) を参照してください。
