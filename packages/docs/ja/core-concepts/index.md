# ストアの定義 {#defining-a-store}

<VueSchoolLink
  href="https://vueschool.io/lessons/define-your-first-pinia-store"
  title="Learn how to define and use stores in Pinia"
/>

コアコンセプトに入る前に、ストアは `defineStore()` で定義され、最初の引数として渡される **一意** の名称が必要であることを知る必要があります:

```js
import { defineStore } from 'pinia'

// You can name the return value of `defineStore()` anything you want, 
// but it's best to use the name of the store and surround it with `use` 
// and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const useAlertsStore = defineStore('alerts', {
  // other options...
})
```

_id_ とも呼ばれるこの _名前_ は必要であり、ストアを devtools に接続するために Pinia によって使用されます。返された関数の名前を _use..._ にすることは、その使用方法を慣用的にするためのコンポーザブル全体の規則です。

`defineStore()` は第 2 引数に 2 つの異なる値 (Setup 関数、または Options オブジェクト) を受け入れます。

## Option ストア {#option-stores}

Vue の Options API と同様に、`state`、`action` そして `getters` プロパティを持つ Options オブジェクトを渡すこともできます。

```js {2-10}
export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0, name: 'Eduardo' }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})
```

`state` はストアの `data`、`getters` はストアの `computed` プロパティ、`actions` は `methods` と考えることができます。

Option ストアは、使い始めるのが直感的でシンプルに感じられる必要があります。

## Setup ストア {#setup-stores}

また、ストアを定義するための別の構文もあります。Vue Composition API の [setup 関数](https://ja.vuejs.org/api/composition-api-setup.html) と同様に、リアクティブなプロパティとメソッドを定義し、公開したいプロパティとメソッドを含むオブジェクトを返す関数を渡すことができます。

```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const name = ref('Eduardo')
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, name, doubleCount, increment }
})
```

_Setup ストア_ では:

- `ref()` が `state` のプロパティとなります
- `computed()` が `getters` となります
- `function()` が `actions` となります

Setup ストアは、ストアの中にウォッチャーを作ったり、[コンポーザブル](https://ja.vuejs.org/guide/reusability/composables.html#composables) を自由に使うことができるので、[Option ストア](#option-stores) に比べて柔軟性があります。しかし、[SSR](../cookbook/composables.md) を使う場合は、コンポーザブルの使い方がより複雑になることに注意してください。

## どちらの構文を選択する？ {#what-syntax-should-i-pick}

Vue の [Composition API と Options API](https://ja.vuejs.org/guide/introduction.html#which-to-choose) と同様に、最も使いやすいと感じるものを選んでください。よくわからない場合、最初に [Option ストア](#option-stores) を試してください。

## ストアの利用 {#using-the-store}

私達はストアを _定義_ しました。というのは `setup()` の内部で `use...Store()` が呼び出されるまでストアは作成されないからです:

```js
import { useCounterStore } from '@/stores/counter'

export default {
  setup() {
    const store = useCounterStore()

    return {
      // you can return the whole store instance to use it in the template
      store,
    }
  },
}
```

:::tip
まだ `setup` コンポーネントを使用していない場合でも、 [_マップヘルパー_ を使用して Pinia を使用することができます](../cookbook/options-api.md)。
:::

必要な数のストアを定義できますが、Pinia の機能を最大限に活用するには、 **それぞれのストアを別のファイルで定義する必要があります** （バンドラーのコード分割を自動的に許可したり、TypeScript の推論を提供するなど）。

ストアをインスタンス化すると、`state`、`getters` そして `actions` で定義されたあらゆるプロパティにストア上で直接アクセスできるようになります。これらについては、次のページで詳しく見ていきますが、オートコンプリートが役に立ちます。

`store` は `reactive` でラップされたオブジェクトであることに注意してください。つまり、getters の後に `.value` を記述する必要はありませんが、 `setup` の `props` のように、**それを分解することはできません**:

```js
export default defineComponent({
  setup() {
    const store = useCounterStore()
    // ❌ This won't work because it breaks reactivity
    // it's the same as destructuring from `props`
    const { name, doubleCount } = store

    name // "Eduardo"
    doubleCount // 0

    setTimeout(() => {
      store.increment()
    }, 1000)

    return {
      // will always be "Eduardo"
      name,
      // will always be 0
      doubleCount,
      // will also always be 0
      doubleNumber: store.doubleCount,

      // ✅ this one will be reactive
      doubleValue: computed(() => store.doubleCount),
    }
  },
})
```

リアクティビティ（反応性）を維持したままストアからプロパティを抽出するには、`storeToRefs()` を使用する必要があります。これは、すべてのリアクティブプロパティに対して refs を作成します。これは、ストアの状態のみを使用し、アクションを呼び出さない場合に便利です。アクションはストア自体にバインドされているので、ストアから直接アクションを分解できることに注意しましょう:

```js
import { storeToRefs } from 'pinia'

export default defineComponent({
  setup() {
    const store = useCounterStore()
    // `name` and `doubleCount` are reactive refs
    // This will also create refs for properties added by plugins
    // but skip any action or non reactive (non ref/reactive) property
    const { name, doubleCount } = storeToRefs(store)
    // the increment action can just be extracted
    const { increment } = store

    return {
      name,
      doubleCount,
      increment,
    }
  },
})
```
