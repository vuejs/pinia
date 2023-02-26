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

# 피니아

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

피니아는 Vue 2와 Vue 3 모두에서 작동합니다.

피니아(pinia)는 스페인어 _pineapple_의 영어 발음과 가장 유사한 _piña_입니다.
파인애플은 실제로 각각의 꽃들이 하나의 그룹으로 된 과일입니다.
꽃은 각각 피어나지만, 결국 모두 합쳐지는 모습이 마치 스토어 같습니다.
남아메리카가 원산지인 맛있는 열대 과일이기도 합니다.

## 👉 [StackBlitz에서 Vue 3 데모](https://stackblitz.com/github/piniajs/example-vue-3-vite)

## 👉 [StackBlitz에서 Nuxt 3 데모](https://stackblitz.com/github/piniajs/example-nuxt-3)

## FAQ

프로젝트 및 가능한 질문에 대한 몇 가지 참고 사항:

**Q**: 피니아는 Vuex의 차세대 라이브러리입니까?

**A**: [맞습니다!](https://vuejs.kr/guide/scaling-up/state-management.html#pinia)

**Q**: 동적 모듈은 어떻습니까?

**A**: 동적 모듈은 유형이 안전하지 않지만, 어디에서나 가져올 수 있는 [다른 저장소를 만들 수 있습니다](https://pinia.vuejs.kr/cookbook/composing-stores.html).

## 설치

```bash
# 또는 npm이나 yarn으로
npm install pinia
```

Vue <2.7을 사용하는 경우 최신 `@vue/composition-api`를 설치해야 합니다:

```bash
npm install pinia @vue/composition-api
```

## 사용법

### 플러그인 설치

피니아(루트 스토어)를 만들고 앱에 전달합니다:

```js
// Vue 3
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

```js
// Vue 2
import { createPinia, PiniaVuePlugin } from 'pinia'

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

new Vue({
  el: '#app',
  // 다른 옵션들...
  // ...
  // 동일한 'pinia' 인스턴스는 동일한 페이지의 여러 Vue 앱에서 사용할 수 있음.
  pinia,
})
```

### 스토어 저장소 만들기

원하는 만큼 스토어를 만들 수 있으며, 각각 다른 파일로 존재해야 합니다:

```ts
import { defineStore } from 'pinia'

// main은 스토어 이름.
// 앱 전체에서 고유하며, devtools에 표시됨.
export const useMainStore = defineStore('main', {
  // 새로운 상태를 반환하는 함수
  state: () => ({
    counter: 0,
    name: 'Eduardo',
  }),
  // getters (선택적)
  getters: {
    // getter는 상태를 첫 번째 파라미터로 받음.
    doubleCounter: (state) => state.counter * 2,
    // 다른 getter 내부에서 getter 사용.
    doubleCounterPlusOne(): number {
      return this.doubleCounter + 1
    },
  },
  // actions (선택적)
  actions: {
    reset() {
      // `this`는 스토어 인스턴스
      this.counter = 0
    },
  },
})
```

`defineStore`는 저장소에 접근하기 위해 호출해야 하는 함수를 반환합니다:

```ts
import { useMainStore } from '@/stores/main'
import { storeToRefs } from 'pinia'

export default defineComponent({
  setup() {
    const main = useMainStore()

    // 특정 스토어 속성 추출
    const { counter, doubleCounter } = storeToRefs(main)

    return {
      // 템플릿에서 스토어 전체에 접근 가능
      main,
      // 특정 상태와 getter에만 접근 권한 부여
      counter,
      doubleCounter,
    }
  },
})
```

마지막 확인일 2023-02-27 01:14