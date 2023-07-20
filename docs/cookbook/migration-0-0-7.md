# 0.0.7에서 마이그레이션하기 %{#migrating-from-0-0-7}%

`0.0.7` 이후의 버전인 `0.1.0` 및 `0.2.0`에서는 몇 가지 큰 변경 사항이 있었습니다. 이 가이드는 Vue 2 또는 Vue 3을 사용하는 경우 모두 마이그레이션하는 데 도움을 줍니다. 전체 변경 내역은 저장소에서 찾을 수 있습니다:

- [Vue 2용 Pinia <= 1](https://github.com/vuejs/pinia/blob/v1/CHANGELOG.md)
- [Vue 3용 Pinia >= 2](https://github.com/vuejs/pinia/blob/v2/packages/pinia/CHANGELOG.md)

마이그레이션에 관한 질문이나 문제가 있으면 도움을 요청하기 위해 [토론을 시작](https://github.com/vuejs/pinia/discussions/categories/q-a)할 수 있습니다.

## 더 이상 `store.state` 사용 안 함 %{#no-more-store-state}%

더 이상 `store.state`를 통해 스토어 상태에 접근하지 않습니다. 직접적으로 상태 속성에 접근할 수 있습니다.

다음과 같이 정의된 스토어가 있다고 가정해봅시다:

```js
const useStore({
  id: 'main',
  state: () => ({ count: 0 })
})
```

이제 다음과 같이 사용합니다:

```diff
 const store = useStore()

-store.state.count++
+store.count.++
```

필요한 경우에는 `$state`를 사용하여 전체 스토어 상태에 여전히 접근할 수 있습니다:

```diff
-store.state = newState
+store.$state = newState
```

## 스토어 속성 이름 변경 %{#rename-of-store-properties}%

모든 스토어 속성(`id`, `patch`, `reset` 등)은 이제 `$`로 접두사가 붙어 있어 동일한 이름으로 스토어에 정의된 속성과 충돌하지 않습니다. 팁: 스토어의 각 속성에 대해 F2 (또는 마우스 오른쪽 버튼 + Refactor)를 사용하여 전체 코드베이스를 리팩토링할 수 있습니다.

```diff
 const store = useStore()
-store.patch({ count: 0 })
+store.$patch({ count: 0 })

-store.reset()
+store.$reset()

-store.id
+store.$id
```

## Pinia 인스턴스 %{#the-pinia-instance}%

Pinia 인스턴스를 생성하고 설치해야 합니다:

Vue 2를 사용하는 경우 (Pinia <= 1):

```js
import Vue from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'

const pinia = createPinia()
Vue.use(PiniaVuePlugin)
new Vue({
  el: '#app',
  pinia,
  // ...
})
```

Vue 3을 사용하는 경우 (Pinia >= 2):

```js
import { createApp } from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
import App from './App.vue'

const pinia = createPinia()
createApp(App).use(pinia).mount('#app')
```

`pinia` 인스턴스는 상태를 보유하는 데 사용되며 **애플리케이션당 고유해야 합니다**. 자세한 내용은 SSR 섹션을 참조하세요.

## SSR 변경 사항 %{#ssr-changes}%

SSR 플러그인 `PiniaSsr`은 더 이상 필요하지 않으며 제거되었습니다.
Pinia 인스턴스의 도입으로 `getRootState()`는 더 이상 필요하지 않으며 `pinia.state.value`로 대체해야 합니다.

Vue 2를 사용하는 경우 (Pinia <= 1):

```diff
// entry-server.js
-import { getRootState, PiniaSsr } from 'pinia',
+import { createPinia, PiniaVuePlugin } from 'pinia',


-// setup 및 onServerPrefetch에서 올바른 컨텍스트를 자동으로 사용하기 위해 플러그인을 설치합니다.
-Vue.use(PiniaSsr);
+Vue.use(PiniaVuePlugin)

 export default context => {
+  const pinia = createPinia()
   const app = new Vue({
     // 다른 옵션들
+    pinia
   })

   context.rendered = () => {
     // 상태를 context에 전달
-    context.piniaState = getRootState(context.req)
+    context.piniaState = pinia.state.value
   };

-   return { app }
+   return { app, pinia }
 }
```

`setActiveReq()`와 `getActiveReq()`는 각각 `setActivePinia()`와 `getActivePinia()`로 대체되었습니다. `setActivePinia()`는 `createPinia()`로 생성된 `pinia` 인스턴스만 전달할 수 있습니다. **대부분의 경우 직접적으로 이러한 함수를 사용하지 않을 것입니다**.
