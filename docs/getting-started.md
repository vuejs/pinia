# 시작하기 %{#getting-started}%


## 설치 %{#installation}%

선호하는 패키지 관리자로 `pinia`를 설치합니다:

```bash
yarn add pinia
# 또는 npm으로
npm install pinia
```

:::tip
앱이 Vue 2.6.x 이하 버전을 사용하는 경우, 컴포지션 API도 설치해야 합니다: `@vue/composition-api`.
Nuxt를 사용하는 경우, [이 지침](/ssr/nuxt.md)을 따라야 합니다.
:::

Vue CLI를 사용하는 경우, 이 [**비공식 플러그인**](https://github.com/wobsoriano/vue-cli-plugin-pinia)을 사용해 볼 수 있습니다.

피니아 인스턴스(루트 저장소)를 만들고, 앱에 플러그인으로 전달합니다:

```js {2,5-6,8}
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
```

Vue 2를 사용하는 경우,
플러그인을 설치하고 앱 루트에 생성된 `pinia`를 삽입해야 합니다:

```js {1,3-4,12}
import { createPinia, PiniaVuePlugin } from 'pinia'

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

new Vue({
  el: '#app',
  // 다른 옵션들...
  // ...
  // 동일한 `pinia` 인스턴스를
  // 동일한 페이지 내 여러 Vue 앱에서 사용될 수 있음
  pinia,
})
```

이것은 devtools를 지원합니다.
Vue 3에서는 vue-devtools가 아직 필요한 API를 노출하지 않기 때문에,
시간 추적 및 편집과 같은 일부 기능이 여전히 지원되지 않지만,
devtools에는 훨씬 더 많은 기능이 있고,
전체적으로 개발자 경험이 훨씬 우수합니다.
Vue 2에서 피니아는 Vuex용 기존 인터페이스를 사용합니다(따라서 Vuex와 함께 사용할 수 없음).

## 스토어란? %{#what-is-a-store}%

스토어는 컴포넌트 트리에 바인딩되지 않은 상태 및 처리해야 할 일의 로직을 가지는 독립적인 것입니다.
즉, **전역 상태를 호스팅**합니다.
항상 존재하고 모두가 읽고 쓸 수 있는 컴포넌트와 비슷합니다.
[state](/core-concepts/state.md), [getters](/core-concepts/getters.md), [actions](/core-concepts/actions.md)라는 **세 가지 개념**이 있으며,
이러한 개념은 컴포넌트의 `data`, `computed`, `methods`와 동일하다고 가정해도 무방합니다.

## 스토어를 사용해야 하는 경우 %{#when-should-i-use-a-store}%

저장소에는 앱 전체에서 접근할 수 있으므로,
여러 곳에서 사용되는 데이터가 포함되어야 합니다. 
예를들어, 탐색메뉴에 표시되는 사용자 정보나 매우 복잡한 다단계 양식(form) 페이지를 통해 보존해야 하는 데이터가 있습니다.

반면에 컴포넌트에서 호스팅할 수 있는 로컬 데이터를 스토어에 포함하는 것을 피해야 합니다.
예를들어, 페이지 내 로컬 앨리먼트의 가시성을 결정하는 상태 데이터가 있습니다.

모든 앱이 글로벌 상태에 대한 접근를 필요로 하는 것은 아니지만,
필요한 경우 피니아가 당신의 삶을 더 쉽게 만들어 줄 것입니다.
