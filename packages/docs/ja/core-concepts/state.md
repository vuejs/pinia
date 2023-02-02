# ステート {#state}

<VueSchoolLink
  href="https://vueschool.io/lessons/access-state-from-a-pinia-store"
  title="Learn all about state in Pinia"
/>

ステートは、ほとんどの場合、ストアの中心的な部分です。多くの場合、アプリを表すステートを定義することから始めます。Pinia では、ステートは初期状態を返す関数として定義されます。これにより、Pinia はサーバーサイドとクライアントサイドの両方で動作することができます。

```js
import { defineStore } from 'pinia'

export const useStore = defineStore('storeId', {
  // arrow function recommended for full type inference
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      count: 0,
      name: 'Eduardo',
      isAdmin: true,
      items: [],
      hasChanged: true,
    }
  },
})
```

:::tip
Vue 2 を使用している場合、`state` で作成したデータは Vue インスタンスの `data` と同じルールに従います。つまり、ステートオブジェクトはプレーンでなければならず、プロパティを **新規に追加** する場合は `Vue.set()` を呼び出す必要があります。**See also: [Vue#data](https://jp.vuejs.org/v2/api/#data)**。
:::

## TypeScript {#typescript}

状態を TS と互換性を持たせるために多くのことを行う必要はありません: [`strict`](https://www.typescriptlang.org/ja/tsconfig#strict)、または少なくとも [`noImplicitThis`](https://www.typescriptlang.org/ja/tsconfig#noImplicitThis) が有効になっていることを確認してください。Pinia はステートの型を自動的に推測します！ただし、多少のキャスティングを行う必要がある場合がいくつかあります:

```ts
export const useUserStore = defineStore('user', {
  state: () => {
    return {
      // for initially empty lists
      userList: [] as UserInfo[],
      // for data that is not yet loaded
      user: null as UserInfo | null,
    }
  },
})

interface UserInfo {
  name: string
  age: number
}
```

必要に応じて、インターフェースでステートを定義し、`state()` の戻り値の型にできます:

```ts
interface State {
  userList: UserInfo[]
  user: UserInfo | null
}

export const useUserStore = defineStore('user', {
  state: (): State => {
    return {
      userList: [],
      user: null,
    }
  },
})

interface UserInfo {
  name: string
  age: number
}
```

## ステートへのアクセス {#accessing-the-state}

デフォルトでは、`store` インスタンスを通じてアクセスすることで、ステートに直接読み書きすることができます:

```js
const store = useStore()

store.count++
```

**`state()` で定義していない場合**、新しいステートプロパティを追加できないことに注意してください。初期状態が含まれている必要があります。例: `state()` で `secondCount` が定義されていない場合、`store.secondCount = 2` は実行できません。

## ステートのリセット {#resetting-the-state}

ストアの `$reset()` メソッドを呼び出すことで、ステートを初期値に _リセット_ できます:

```js
const store = useStore()

store.$reset()
```

### Options API での使用方法 {#usage-with-the-options-api}

<VueSchoolLink
  href="https://vueschool.io/lessons/access-pinia-state-in-the-options-api"
  title="Access Pinia State via the Options API"
/>

以下の例では、以下のストアが作成されたと仮定しています:

```js
// Example File Path:
// ./src/stores/counter.js

import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
})
```

Composition API を使用せず、`computed`、`methods`、 ...、 を使用している場合、 `mapState()` ヘルパーを使用し、ステートのプロパティを読み取り専用の computed プロパティとしてマッピングすることができます:

```js
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  computed: {
    // gives access to this.count inside the component
    // same as reading from store.count
    ...mapState(useCounterStore, ['count'])
    // same as above but registers it as this.myOwnName
    ...mapState(useCounterStore, {
      myOwnName: 'count',
      // you can also write a function that gets access to the store
      double: store => store.count * 2,
      // it can have access to `this` but it won't be typed correctly...
      magicValue(store) {
        return store.someGetter + this.count + this.double
      },
    }),
  },
}
```

#### 変更可能なステート {#modifiable-state}

これらのステートのプロパティに書き込みを行いたい場合（例えばフォームを使用している場合）は、代わりに `mapWritableState()` を使用します。`mapState()` のように関数を渡すことはできないことに注意しましょう:

```js
import { mapWritableState } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  computed: {
    // gives access to this.count inside the component and allows setting it
    // this.count++
    // same as reading from store.count
    ...mapWritableState(useCounterStore, ['count'])
    // same as above but registers it as this.myOwnName
    ...mapWritableState(useCounterStore, {
      myOwnName: 'count',
    }),
  },
}
```

:::tip
配列全体を `cartItems = []` に置き換えない限り、配列のようなコレクションに `mapWritableState()` は必要ありません。`mapState()` を使用すると、コレクションでメソッドを呼び出すことができます。
:::

## ステートの変異（Mutating） {#mutating-the-state}

<!-- TODO: disable this with `strictMode` -->

`store.count++` でストアを直接変異させる以外に、`$patch` メソッドを呼び出すこともできます。これによって、部分的な `state` オブジェクトで複数の変更を同時に適用することができます:

```js
store.$patch({
  count: store.count + 1,
  age: 120,
  name: 'DIO',
})
```

ただし、一部の変異は、この構文で適用するのが非常に困難、またはコストがかかります: コレクションの変更（配列からの要素のプッシュ、削除、スプライシングなど）では、新しいコレクションを作成する必要があります。このため、`$patch` メソッドは、パッチオブジェクトで適用するのが難しいこの種の変異をグループ化する関数も受け入れます:

```js
store.$patch((state) => {
  state.items.push({ name: 'shoes', quantity: 1 })
  state.hasChanged = true
})
```

<!-- TODO: disable this with `strictMode`, `{ noDirectPatch: true }` -->

ここでの主な違いは、`$patch()` によって、複数の変更をまとめて devtools の 1 つのエントリにすることができることです。**`state` への直接の変更と `$patch()` の両方が devtools に表示され**、タイムトラベルができることに注意してください（Vue 3 ではまだありません）。

## ステートのリプレイス {#replacing-the-state}

リアクティビティが損なわれるため、ストアの状態を **正しく置き換えることはできません**。しかし、_パッチする_ ことはできます:

```js
// this doesn't actually replace `$state`
store.$state = { count: 24 }
// it internally calls `$patch()`:
store.$patch({ count: 24 })
```

また、`pinia` インスタンスの `state` を変更することで、アプリケーション全体の **初期状態を設定** することができます。これは [SSR 時のハイドレーション](../ssr/#state-hydration) に使用されます。

```js
pinia.state.value = {}
```

## ステートの購読（Subscribing） {#subscribing-to-the-state}

Vuex の [subscribe メソッド](https://vuex.vuejs.org/ja/api/#subscribe) と同様に、ストアの `$subscribe()` メソッドを通じて、ステートとその変更を監視することができます。通常の `watch()` よりも `$subscribe()` を使う利点は、_サブスクリプション_ が _パッチ_ の後に一度だけ起動することです（例: 上記の関数版を使用した場合）。

```js
cartStore.$subscribe((mutation, state) => {
  // import { MutationType } from 'pinia'
  mutation.type // 'direct' | 'patch object' | 'patch function'
  // same as cartStore.$id
  mutation.storeId // 'cart'
  // only available with mutation.type === 'patch object'
  mutation.payload // patch object passed to cartStore.$patch()

  // persist the whole state to the local storage whenever it changes
  localStorage.setItem('cart', JSON.stringify(state))
})
```

デフォルトでは、_ステートのサブスクリプション_ は、それらが追加されたコンポーネントにバインドされます（ストアがコンポーネントの `setup()` 内にある場合）。つまり、コンポーネントがアンマウントされると、自動的に削除されます。コンポーネントがアンマウントされた後もそれらを保持したい場合、第 2 引数として `{ detached: true }` を渡して、現在のコンポーネントから _ステートのサブスクリプション_ を _切り離し_ ます:

```js
export default {
  setup() {
    const someStore = useSomeStore()

    // this subscription will be kept even after the component is unmounted
    someStore.$subscribe(callback, { detached: true })

    // ...
  },
}
```

:::tip
`pinia` インスタンスで、ステート全体を監視することができます:

```js
watch(
  pinia.state,
  (state) => {
    // persist the whole state to the local storage whenever it changes
    localStorage.setItem('piniaState', JSON.stringify(state))
  },
  { deep: true }
)
```

:::
