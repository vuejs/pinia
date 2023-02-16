---
title: 컴포넌트 외부에서 스토어 사용
---

# 컴포넌트 외부에서 스토어 사용 %{#using-a-store-outside-of-a-component}%

피니아 스토어는 모든 호출에서 동일한 스토어 인스턴스를 공유하기 위해 `pinia` 인스턴스에 의존합니다.
대부분의 경우 이것은 `useStore()` 함수를 호출하는 것만으로도 작동합니다.
예를 들어 `setup()`에서는 다른 작업을 수행할 필요가 없습니다.
그러나 컴포넌트 외부에서는 상황이 약간 다릅니다.
내부적으로 `useStore()`는 `app`에 제공한 `pinia` 인스턴스를 주입(inject)합니다.
따라서 `pinia` 인스턴스를 자동으로 삽입할 수 없는 경우, `useStore()` 함수에 수동으로 제공해야 합니다.
작성하는 앱의 종류에 따라 이 문제를 다르게 해결할 수 있습니다.

## 싱글 페이지 애플리케이션 (SPA) %{#single-page-applications}%

SSR을 수행하지 않는 경우,
`app.use(pinia)`로 피니아 플러그인을 설치한 후,
`useStore()`를 호출하면 다음과 같이 작동합니다:

```js
import { useUserStore } from '@/stores/user'
import { createApp } from 'vue'
import App from './App.vue'

// ❌  피니아가 생성되기 전에 호출되기 때문에 실패함.
const userStore = useUserStore()

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// ✅ 피니아 인스턴스가 현재 활성화되어 있기 때문에 작동함.
const userStore = useUserStore()
```

이것이 항상 적용되도록 하는 가장 쉬운 방법은 항상 `useStore()` 호출을 피니아가 설치된 후에 실행될 함수 내부에 배치하여 호출을 연기하는 것입니다.

Vue Router를 사용하여 네비게이션 가드 내부에서 스토어를 사용하는 예제를 살펴보겠습니다:

```js
import { createRouter } from 'vue-router'
const router = createRouter({
  // ...
})

// ❌ import 순서에 의해서 이것은 실패할 것임.
const store = useStore()

router.beforeEach((to, from, next) => {
  // 우리는 여기서 스토어를 사용하고 싶음.
  if (store.isLoggedIn) next()
  else next('/login')
})

router.beforeEach((to) => {
  // ✅ 이것은 라우터와 피니아가 설치된 후 이므로,
  // 탐색을 시작하면 작동할 것임.
  const store = useStore()

  if (to.meta.requiresAuth && !store.isLoggedIn) return '/login'
})
```

## SSR 앱 %{#ssr-apps}%

SSR을 처리할 때, `pinia` 인스턴스를 `useStore()`에 전달해야 합니다.
이것은 피니아가 서로 다른 앱 인스턴스 간에 전역 상태를 공유하는 것을 방지합니다.
이것은 간단한 설명일 뿐이며, 전체적인 내용은 아래를 참고합시다.

참고 - [가이드 - 서버 사이드 렌더링 (SSR)](/ssr/index.md)