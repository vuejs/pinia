## 설치

선호하는 패키지 관리자를 통해 `pinia`를 설치하세요:

```bash
yarn add pinia
# or with npm
npm install pinia
```

:::tip
만약 당신의 앱이 Vue2를 사용 중이라면, composition api: `@vue/composition-api` 또한 다운받을 필요가 있습니다. 만약 당신의 앱이 Nuxt를 사용 중이라면, 이것을 따르세요 [these instructions](/ssr/nuxt.md).
:::

Vue CLI를 사용하는 경우 이 [**비공식 플러그인**](https://github.com/wobsoriano/vue-cli-plugin-pinia)을 대신 사용해 볼 수 있습니다.

pinia 인스턴스(최상위 저장소)를 만들고 앱에 플러그인으로 전달합니다:

```js {2,5-6,8}
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

만약 앱이 Vue 2를 사용 중이라면, 플러그인을 설치한 후 최상위 앱에 생성된 `pinia`를 삽입해야 합니다:

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

이것은 또한 devtools 지원을 도와줍니다. Vue 3에서는 vue-devtools가 아직 필요한 API를 노출하지 않기 때문에 시간 여행 디버깅 및 편집과 같은 일부 기능이 여전히 지원되지 않지만 devtools에는 훨씬 더 많은 기능이 있고 전체적으로 개발자 경험이 훨씬 우수합니다. Vue 2에서 Pinia는 Vuex용 기존 인터페이스를 사용합니다(따라서 함께 사용할 수 없음).

## Store가 무엇인가요?

Store(Pinia와 같은)는 컴포넌트 트리에 바인딩되지 않은 상태 및 비즈니스 논리를 보유하는 엔터티입니다. 즉, **전역 상태를 호스트합니다**. 항상 존재하고 모든 사람이 읽고 쓸 수 있는 구성 요소와 비슷합니다. [state](./core-concepts/state.md), [getters](./core-concepts/getters.md) 그리고 [actions](./core-concepts/actions.md)의 **세 가지 개념**이 있으며 이러한 개념이 컴포넌트의  `data`, `computed` 및 `methods`와 동일하다고 가정하는 것이 안전합니다.

## 언제 Store를 사용해야 하나요?

Store에는 애플리케이션 전체에서 액세스할 수 있는 데이터가 포함되어야 합니다. 여기에는 여러 곳에서 사용되는 데이터가 포함됩니다, 예) 탐색 모음에 표시되는 사용자 정보와 페이지를 통해 보존해야 하는 데이터, 예) 매우 복잡한 다단계 형식.

반면에 구성 요소에서 호스팅될 수 있는 로컬 데이터를 스토어에 포함하는 것을 피해야 합니다, e.g. 페이지에 로컬 요소의 가시성.

모든 애플리케이션이 전역 상태에 대한 액세스를 필요로 하는 것은 아니지만 필요한 경우 Pinia가 당신의 삶을 더 쉽게 만들어 줄 것입니다.
