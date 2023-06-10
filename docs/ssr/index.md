---
title: 서버 사이드 렌더링
---

# 서버 사이드 렌더링 (SSR) %{#server-side-rendering-ssr}%

:::tip
**Nuxt.js**를 사용하는 경우, 이 섹션 대신 [**Nuxt.js**](nuxt.md)를 읽어야 합니다.
:::

피니아로 스토어를 만드는 것은 `setup` 함수, `getters`, `actions`의 상단에서 `useStore()` 함수를 호출하는 한 SSR에서 즉시 사용할 수 있습니다:

```vue
<script setup>
// 이것은 피니아가 `setup()`
// 내부에서 실행 중인 앱이라는 것을 알고 있으므로 작동함.
const main = useMainStore()
</script>
```

## `setup()` 외부에서 스토어 사용 %{#using-the-store-outside-of-setup}%

다른 곳에서 스토어를 사용해야 하는 경우,
[앱에 전달된](../getting-started.md#installation) `pinia` 인스턴스를 `useStore()` 함수 호출에 전달해야 합니다:

```js
const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

router.beforeEach((to) => {
  // ✅ 이렇게 하면 현재 실행 중인 앱의 저장소가 사용됨.
  const main = useMainStore(pinia)

  if (to.meta.requiresAuth && !main.isLoggedIn) return '/login'
})
```

피니아는 앱에 `$pinia`로 추가되므로, 편리하게 `serverPrefetch()`와 같은 함수에서 사용할 수 있습니다:

```js
export default {
  serverPrefetch() {
    const store = useStore(this.$pinia)
  },
}
```

`onServerPrefetch()`를 사용할 때 특별한 작업을 수행할 필요가 없습니다:

```vue
<script setup>
const store = useStore()
onServerPrefetch(async () => {
  // ✅ 작동함
  await store.fetchData()
})
</script>
```

## 상태 하이드레이션 %{#state-hydration}%

초기 상태를 하이드레이션하려면,
피니아가 나중에 rootState를 선택할 수 있도록,
rootState가 HTML의 어딘가에 포함되어 있는지 확인해야 합니다.
SSR에 사용하는 항목에 따라 **보안상의 이유로 상태를 이스케이프해야 합니다**.
Nuxt.js에서 사용하는 [@nuxt/devalue](https://github.com/nuxt-contrib/devalue)를 사용하는 것이 좋습니다:

```js
import devalue from '@nuxt/devalue'
import { createPinia } from 'pinia'
// retrieve the rootState server side
const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)

// after rendering the page, the root state is built and can be read directly
// on `pinia.state.value`.

// serialize, escape (VERY important if the content of the state can be changed
// by the user, which is almost always the case), and place it somewhere on
// the page, for example, as a global variable.
devalue(pinia.state.value)
```

SSR에 사용하는 항목에 따라 HTML에서 직렬화될 _initial state(초기 상태)_ 변수를 설정합니다.
또한 XSS 공격으로부터 보호하기 위해 [다른 대안](https://github.com/nuxt-contrib/devalue#see-also)으로 `@nuxt/devalue`를 사용할 수 있습니다.
`JSON.stringify()`/`JSON.parse()`로 상태를 직렬화하고 구문 분석할 수 있다면 **성능을 많이 향상시킬 수 있습니다**.

Nuxt를 사용하지 않는 경우, 상태의 직렬화 및 하이드레이션(hydration)을 직접 처리해야 합니다.
아래는 그 몇 가지 예 입니다:

- [Vitesse template](https://github.com/antfu/vitesse/blob/main/src/modules/pinia.ts)
- [vite-plugin-ssr](https://vite-plugin-ssr.com/pinia)

이 전략을 환경에 맞게 조정하십시오.
클라이언트 측에서 **`useStore()` 함수를 호출하기 전에 pinia의 상태를 하이드레이션해야 합니다.**
예를 들어, 클라이언트 측에서 `window.__pinia`를 통해 전역적으로 액세스할 수 있도록 상태를 `<script>` 태그로 직렬화하면 다음과 같이 작성할 수 있습니다:

```ts
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// `isClient`는 환경에 따라 다릅니다. Nuxt에서는 `process.client`입니다.
if (isClient) {
  pinia.state.value = JSON.parse(window.__pinia)
}
```
