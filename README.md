<p align="center">
  <a href="https://pinia.vuejs.kr" target="_blank" rel="noopener noreferrer">
    <img width="180" src="https://pinia.vuejs.org/logo.svg" alt="Pinia logo">
  </a>
</p>
<br/>
<p align="center">
  <a href="https://npmjs.com/package/pinia"><img src="https://badgen.net/npm/v/pinia" alt="npm package"></a>
  <a href="https://github.com/vuejs/pinia/actions/workflows/test.yml?query=branch%3Av2"><img src="https://github.com/vuejs/pinia/workflows/test/badge.svg?branch=v2" alt="build status"></a>
  <a href="https://codecov.io/github/vuejs/pinia"><img src="https://badgen.net/codecov/c/github/vuejs/pinia/v2" alt="code coverage"></a>
</p>
<br/>

# Pinia

> 여기는 Vue 상태관리 라이브러리 Pinia 웹 페이지 한글화를 위해 포크한 저장소 입니다.

> 최신 Vitepress를 사용하여 웹 페이지를 생성하므로,
공식 사이트와 시각적으로 달라보일 수 있으나,
내용은 동일하게 유지됩니다.

---

웹 페이지 바로가기: [한글화 문서](https://pinia.vuejs.kr/)

## 브랜치 구조

- `main-korean`: 최신 한글화 문서 브랜치 입니다. 모든 번역 작업은 최종적으로 이곳으로 병합됩니다.
- `v2`: Fetch upstream으로 `vuejs/pinia`의 최신 원본 문서를 주기적으로 추적합니다.
- 그외: 포크된 `vuejs/pinia`의 브랜치들 입니다.

---

> 직관적이고 유형이 안전하고 유연한 Vue용 Store

- 💡 직관적
- 🔑 유형 보호
- ⚙️Devtools 지원
- 🔌 확장가능
- 🏗 모듈식 디자인
- 📦 매우 가벼움

Pinia works both for Vue 2.x and Vue 3.x. It requires Vue 2 with the latest `@vue/composition-api` or Vue `^3.2.0-0`.

Pinia is the most similar English pronunciation of the word _pineapple_ in Spanish: _piña_. A pineapple is in reality a group of individual flowers that join together to create a multiple fruit. Similar to stores, each one is born individually, but they are all connected at the end. It's also a delicious tropical fruit indigenous to South America.

## 👉 [Demo with Vue 3 on StackBlitz](https://stackblitz.com/github/piniajs/example-vue-3-vite)

## 👉 [Demo with Nuxt 3 on StackBlitz](https://stackblitz.com/github/piniajs/example-nuxt-3)

## FAQ

A few notes about the project and possible questions:

**Q**: _Is Pinia the successor of Vuex?_

**A**: [Yes](https://vuejs.org/guide/scaling-up/state-management.html#pinia)

**Q**: _What about dynamic modules?_

**A**: Dynamic modules are not type safe, so instead [we allow creating different stores](https://pinia.vuejs.org/cookbook/composing-stores.html) that can be imported anywhere

## Installation

```bash
yarn add pinia
# or with npm
npm install pinia
```

If you are using Vue 2, make sure to install latest `@vue/composition-api`:

```bash
npm install pinia @vue/composition-api
```

## Usage

### Install the plugin

Create a pinia (the root store) and pass it to app:

```js
import { createPinia } from 'pinia'

app.use(createPinia())
```

### Create a Store

You can create as many stores as you want, and they should each exist in different files:

```ts
import { defineStore } from 'pinia'

// main is the name of the store. It is unique across your application
// and will appear in devtools
export const useMainStore = defineStore('main', {
  // a function that returns a fresh state
  state: () => ({
    counter: 0,
    name: 'Eduardo',
  }),
  // optional getters
  getters: {
    // getters receive the state as first parameter
    doubleCount: (state) => state.counter * 2,
    // use getters in other getters
    doubleCountPlusOne(): number {
      return this.doubleCount + 1
    },
  },
  // optional actions
  actions: {
    reset() {
      // `this` is the store instance
      this.counter = 0
    },
  },
})
```

`defineStore` returns a function that has to be called to get access to the store:

```ts
import { useMainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'

export default defineComponent({
  setup() {
    const main = useMainStore()

    // extract specific store properties
    const { counter, doubleCount } = storeToRefs(main)

    return {
      // gives access to the whole store in the template
      main,
      // gives access only to specific state or getter
      counter,
      doubleCount,
    }
  },
})
```
