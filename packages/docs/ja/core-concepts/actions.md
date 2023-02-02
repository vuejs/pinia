# アクション {#actions}

<VueSchoolLink
  href="https://vueschool.io/lessons/synchronous-and-asynchronous-actions-in-pinia"
  title="Learn all about actions in Pinia"
/>

アクションは、コンポーネントにおける [methods](https://ja.vuejs.org/guide/essentials/reactivity-fundamentals.html#declaring-methods) に相当します。`defineStore()` の `actions` プロパティで定義することができ、**ビジネスロジックを定義するのに最適です**。

```js
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  actions: {
    // since we rely on `this`, we cannot use an arrow function
    increment() {
      this.count++
    },
    randomizeCounter() {
      this.count = Math.round(100 * Math.random())
    },
  },
})
```

[ゲッター](./getters.md) と同様に、アクションも `this` を通じて _ストアインスタンス全体_ にアクセスでき、**完全なタイピング（とオートコンプリート ✨）をサポートします**。**ゲッターとは異なり、 `アクション` は非同期であり**、アクションの中で任意の API コールや他のアクションを `待つ（await）` ことができます！以下は [Mande](https://github.com/posva/mande) を使った例です。`Promise` を取得できれば、使用するライブラリは問いません。ネイティブの`fetch` 関数（ブラウザのみ）を使用することもできます:

```js
import { mande } from 'mande'

const api = mande('/api/users')

export const useUsers = defineStore('users', {
  state: () => ({
    userData: null,
    // ...
  }),

  actions: {
    async registerUser(login, password) {
      try {
        this.userData = await api.post({ login, password })
        showTooltip(`Welcome back ${this.userData.name}!`)
      } catch (error) {
        showTooltip(error)
        // let the form component display the error
        return error
      }
    },
  },
})
```

また、好きな引数を設定し、好きなものを返すことも完全に自由です。アクションを呼び出すときは、すべて自動的に推論されます！

アクションはメソッドのように呼び出されます:

```js
export default defineComponent({
  setup() {
    const store = useCounterStore()
    // call the action as a method of the store
    store.randomizeCounter()

    return {}
  },
})
```

## 他のストアのアクションへのアクセス {#accessing-other-stores-actions}

他のストアを使用するには、_アクション_ の中で直接 _使用する_ ことができます:

```js
import { useAuthStore } from './auth-store'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    preferences: null,
    // ...
  }),
  actions: {
    async fetchUserPreferences() {
      const auth = useAuthStore()
      if (auth.isAuthenticated) {
        this.preferences = await fetchPreferences()
      } else {
        throw new Error('User must be authenticated')
      }
    },
  },
})
```

## `setup()` での使用方法 {#usage-with-setup}

ストアのメソッドとして、任意のアクションを直接呼び出すことができます:

```js
export default {
  setup() {
    const store = useCounterStore()

    store.randomizeCounter()
  },
}
```

## Options API での使用方法 {#usage-with-the-options-api}

<VueSchoolLink
  href="https://vueschool.io/lessons/access-pinia-actions-in-the-options-api"
  title="Access Pinia Getters via the Options API"
/>

以下の例では、以下のストアが作成されたと仮定しています:

```js
// Example File Path:
// ./src/stores/counter.js

import { defineStore } from 'pinia',

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment() {
      this.count++
    }
  }
})
```

### With `setup()` {#with-setup}

Composition API は万人向けではありませんが、`setup()` フックを使えば Options API で Pinia をより簡単に使えるようになります。余分なマップヘルパー関数は必要ありません！

```js
import { useCounterStore } from '../stores/counter'

export default {
  setup() {
    const counterStore = useCounterStore()

    return { counterStore }
  },
  methods: {
    incrementAndPrint() {
      this.counterStore.increment()
      console.log('New Count:', this.counterStore.count)
    },
  },
}
```

### Without `setup()` {#without-setup}

Composition API を一切使用しない場合は、`mapActions()` ヘルパーを使用して、アクションプロパティをコンポーネント内のメソッドとしてマッピングすることができます:

```js
import { mapActions } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  methods: {
    // gives access to this.increment() inside the component
    // same as calling from store.increment()
    ...mapActions(useCounterStore, ['increment'])
    // same as above but registers it as this.myOwnName()
    ...mapActions(useCounterStore, { myOwnName: 'increment' }),
  },
}
```

## アクションの購読（Subscribing） {#subscribing-to-actions}

`store.$onAction()` でアクションとその結果を観察することができます。これに渡されたコールバックは、アクション自体の前に実行されます。`after` ハンドルは、アクションの解決後に関数を実行できるようにします。同様に、`onError` では、アクションが throw または reject された場合に関数を実行することができます。これらは、[Vue のドキュメントにあるこのヒント](https://ja.vuejs.org/guide/best-practices/production-deployment.html#tracking-runtime-errors) と同様に、実行時にエラーを追跡するのに便利です。

以下は、アクションの実行前と resolve/reject 後のログを記録する例です。

```js
const unsubscribe = someStore.$onAction(
  ({
    name, // name of the action
    store, // store instance, same as `someStore`
    args, // array of parameters passed to the action
    after, // hook after the action returns or resolves
    onError, // hook if the action throws or rejects
  }) => {
    // a shared variable for this specific action call
    const startTime = Date.now()
    // this will trigger before an action on `store` is executed
    console.log(`Start "${name}" with params [${args.join(', ')}].`)

    // this will trigger if the action succeeds and after it has fully run.
    // it waits for any returned promised
    after((result) => {
      console.log(
        `Finished "${name}" after ${
          Date.now() - startTime
        }ms.\nResult: ${result}.`
      )
    })

    // this will trigger if the action throws or returns a promise that rejects
    onError((error) => {
      console.warn(
        `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
      )
    })
  }
)

// manually remove the listener
unsubscribe()
```

デフォルトでは、_アクションのサブスクリプション_ は、それらが追加されたコンポーネントにバインドされます（ストアがコンポーネントの `setup()` 内にある場合）。つまり、コンポーネントがアンマウントされると、自動的に削除されます。コンポーネントがアンマウントされた後もそれらを保持したい場合、第 2 引数として `true` を渡して、現在のコンポーネントから _アクションのサブスクリプション_ を _切り離し_ ます:

```js
export default {
  setup() {
    const someStore = useSomeStore()

    // this subscription will be kept even after the component is unmounted
    someStore.$onAction(callback, true)

    // ...
  },
}
```
