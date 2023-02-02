# ゲッター {#getters}

<VueSchoolLink
  href="https://vueschool.io/lessons/getters-in-pinia"
  title="Learn all about getters in Pinia"
/>

ゲッターは、まさにストアのステートの [算出プロパティ](https://ja.vuejs.org/guide/essentials/computed.html) に相当するものです。`defineStore()` の `getters` プロパティで定義することができます。これらは、アロー関数の使用を **奨励する** ために、最初のパラメータとして `state` を受け取ります:

```js
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
})
```

ほとんどの場合、ゲッターはステートにのみ依存しますが、他のゲッターを使う必要がある場合もあります。このため、通常の関数を定義する場合、`this` を通じて _ストアインスタンス全体_ にアクセスすることができますが、 **戻り値の型を定義する必要があります（TypeScriptの場合）**。これは TypeScript の既知の制限によるもので、**アロー関数を用いて定義されたゲッターや、`this` を使わないゲッターには影響しません**:

```ts
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  getters: {
    // automatically infers the return type as a number
    doubleCount(state) {
      return state.count * 2
    },
    // the return type **must** be explicitly set
    doublePlusOne(): number {
      // autocompletion and typings for the whole store ✨
      return this.doubleCount + 1
    },
  },
})
```

そして、ストアインスタンス上で直接ゲッターにアクセスすることができます:

```vue
<template>
  <p>Double count is {{ store.doubleCount }}</p>
</template>

<script>
export default {
  setup() {
    const store = useCounterStore()

    return { store }
  },
}
</script>
```

## 他のゲッターへのアクセス {#accessing-other-getters}

算出プロパティと同様に、複数のゲッターを組み合わせることができます。他のゲッターには `this` を経由してアクセスします。TypeScript を使用していない場合でも、[JSDoc](https://jsdoc.app/tags-returns.html) を使用して IDE に型に関するヒントを与えることができます:

```js
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  getters: {
    // type is automatically inferred because we are not using `this`
    doubleCount: (state) => state.count * 2,
    // here we need to add the type ourselves (using JSDoc in JS). We can also
    // use this to document the getter
    /**
     * Returns the count value times two plus one.
     *
     * @returns {number}
     */
    doubleCountPlusOne() {
      // autocompletion ✨
      return this.doubleCount + 1
    },
  },
})
```

## ゲッターに引数を渡す {#passing-arguments-to-getters}

_ゲッター_ は裏側で _計算_ されるだけのプロパティなので、パラメータを渡すことはできません。しかし、_ゲッター_ から関数を返すことで、任意の引数を受け取ることができます:

```js
export const useStore = defineStore('main', {
  getters: {
    getUserById: (state) => {
      return (userId) => state.users.find((user) => user.id === userId)
    },
  },
})
```

コンポーネントで使用します:

```vue
<script>
export default {
  setup() {
    const store = useStore()

    return { getUserById: store.getUserById }
  },
}
</script>

<template>
  <p>User 2: {{ getUserById(2) }}</p>
</template>
```

この場合、**ゲッターはキャッシュされず**、単に呼び出される関数となることに注意してください。しかし、ゲッターの内部で結果をキャッシュすることは可能です。これは一般的ではありませんが、より高いパフォーマンスを発揮するはずです:

```js
export const useStore = defineStore('main', {
  getters: {
    getActiveUserById(state) {
      const activeUsers = state.users.filter((user) => user.active)
      return (userId) => activeUsers.find((user) => user.id === userId)
    },
  },
})
```

## 他のストアのゲッターへのアクセス {#accessing-other-stores-getters}

他のストアゲッターを使用するには、_ゲッター_ の内部で直接 _使用する_ ことができます:

```js
import { useOtherStore } from './other-store'

export const useStore = defineStore('main', {
  state: () => ({
    // ...
  }),
  getters: {
    otherGetter(state) {
      const otherStore = useOtherStore()
      return state.localData + otherStore.data
    },
  },
})
```

## `setup()` での使用方法 {#usage-with-setup}

ゲッターはストアのプロパティとして直接アクセスできます（ステートのプロパティと全く同じです）:

```js
export default {
  setup() {
    const store = useCounterStore()

    store.count = 3
    store.doubleCount // 6
  },
}
```

## Options API での使用方法 {#usage-with-the-options-api}

<VueSchoolLink
  href="https://vueschool.io/lessons/access-pinia-getters-in-the-options-api"
  title="Access Pinia Getters via the Options API"
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
  getters: {
    doubleCount(state) {
      return state.count * 2
    },
  },
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
  computed: {
    quadrupleCounter() {
      return this.counterStore.doubleCount * 2
    },
  },
}
```

### Without `setup()` {#without-setup}

ゲッターへのマッピングには、[前節のステート](./state.md#usage-with-the-options-api) で使用したのと同じ `mapState()` 関数を使用することができます:

```js
import { mapState } from 'pinia'
import { useCounterStore } from '../stores/counter'

export default {
  computed: {
    // gives access to this.doubleCount inside the component
    // same as reading from store.doubleCount
    ...mapState(useCounterStore, ['doubleCount']),
    // same as above but registers it as this.myOwnName
    ...mapState(useCounterStore, {
      myOwnName: 'doubleCount',
      // you can also write a function that gets access to the store
      double: (store) => store.doubleCount,
    }),
  },
}
```
