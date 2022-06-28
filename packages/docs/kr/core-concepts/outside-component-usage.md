# component 외부에서 저장소 사용하기

Pinia 스토어는 모든 호출에서 동일한 스토어 인스턴스를 공유하기 위해 `pinia` 인스턴스에 의존합니다. 대부분의 경우 이것은 `useStore()` 함수를 호출하는 것만으로도 작동합니다. 예를 들어 `setup()`에서는 다른 작업을 수행할 필요가 없습니다. 그러나 구성 요소 외부에서는 상황이 약간 다릅니다.
`useStore()`는 뒤에서 `app`에 제공한 `pinia` 인스턴스를 *주입*합니다. 즉, `pinia` 인스턴스를 자동으로 삽입할 수 없는 경우 `useStore()` 함수에 수동으로 제공해야 합니다.
작성하는 애플리케이션의 종류에 따라 다르게 해결할 수 있습니다.

## Single Page Applications

SSR(Server Side Rendering)을 수행하지 않는 경우 `app.use(pinia)`로 pinia 플러그인을 설치한 후 `useStore()`를 호출하면 다음과 같이 작동합니다:

```js
import { useUserStore } from '@/stores/user'
import { createApp } from 'vue'
import App from './App.vue'

// ❌  pinia가 생성되기 전에 호출되기 때문에 실패합니다.
const userStore = useUserStore()

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// ✅ pinia 인스턴스가 현재 활성화되어 있기 때문에 작동합니다.
const userStore = useUserStore()
```

이것이 항상 적용되도록 하는 가장 쉬운 방법은 `useStore()` 호출을 pinia가 설치된 후에 항상 실행될 함수 내부에 배치하여 *지연*시키는 것입니다.

Vue Router와 함께 navigation guard 내부에서 저장소를 사용하는 이 예제를 살펴보겠습니다:

```js
import { createRouter } from 'vue-router'
const router = createRouter({
  // ...
})

// ❌ import 순서에 따라 실패할 것입니다
const store = useStore()

router.beforeEach((to, from, next) => {
  // 우리는 여기 상점을 사용하고 싶었습니다
  if (store.isLoggedIn) next()
  else next('/login')
})

router.beforeEach((to) => {
  // ✅ 라우터가 탐색을 시작하기 때문에 작동합니다
  // 라우터가 설치되고 pinia도 설치됩니다
  const store = useStore()

  if (to.meta.requiresAuth && !store.isLoggedIn) return '/login'
})
```

## SSR Apps

서버 사이드 렌더링을 처리할 때 `pinia` 인스턴스를 `useStore()`에 전달해야 합니다. 이것은 pinia가 서로 다른 애플리케이션 인스턴스 간에 전역 상태를 공유하는 것을 방지합니다.

이것은 간단한 설명일 뿐이고 [SSR 가이드](/ssr/index.md)에 이에 대한 전체 섹션이 있습니다:
