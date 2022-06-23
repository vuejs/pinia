# 서버 사이드 렌더링 (SSR)

:::tip
**Nuxt.js**를 사용하는 경우에는 [**이 지침**](./nuxt.md)을 읽어야 합니다.
:::

Pinia로 저장소를 만드는 것은 `setup` 함수 또는 `getters`, `actions`의 상단에서 `useStore()` 함수를 호출하는 한 SSR에서 즉시 사용할 수 있습니다:

```js
export default defineComponent({
  setup() {
    // this works because pinia knows what application is running inside of
    // `setup()`
    const main = useMainStore()
    return { main }
  },
})
```

## 저장소를 `setup()` 밖에서 사용하는 법

저장소를 다른 어딘가에서 사용하고 싶다면, `useStore()` 함수로 [앱에 전달된](#install-the-plugin) `pinia` 인스턴스를 전달해야 합니다:

```js
const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)

router.beforeEach((to) => {
  // ✅ This will work make sure the correct store is used for the
  // current running app
  const main = useMainStore(pinia)

  if (to.meta.requiresAuth && !main.isLoggedIn) return '/login'
})
```

Pinia는 앱에 `$pinia`로 편리하게 추가되어 `serverPrefetch()`와 같은 기능을 사용할 수 있습니다:

```js
export default {
  serverPrefetch() {
    const store = useStore(this.$pinia)
  },
}
```

## 상태 직렬화

처음 상태를 직렬화하려면, Pinia가 나중에 사용할 수 있도록 rootState가 HTML의 어딘가에 포함되어 있는지 확인해야 합니다. 무엇을 위해 SSR을 사용하는지에 따라 **보안상의 이유로 상태를 내보내야합니다**. 우리는 Nuxt.js애서 사용되는 [@nuxt/devalue](https://github.com/nuxt-contrib/devalue)를 사용하기를 추천합니다:

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

SSR에 사용하는 항목에 따라 HTML에서 직렬화될 _초기 상태_ 변수를 설정합니다. 또한 XSS 공격으로부터 스스로 보호해야 합니다. 예를 들어, [vite-ssr](https://github.com/frandiox/vite-ssr)을 사용하면 [`transformState` 옵션](https://github.com/frandiox/vite-ssr#state-serialization) 및 `@nuxt/devalue`를 사용할 수 있습니다:

```js
import devalue from '@nuxt/devalue'

export default viteSSR(
  App,
  {
    routes,
    transformState(state) {
      return import.meta.env.SSR ? devalue(state) : state
    },
  },
  ({ initialState }) => {
    // ...
    if (import.meta.env.SSR) {
      // this will be stringified and set to window.__INITIAL_STATE__
      initialState.pinia = pinia.state.value
    } else {
      // on the client side, we restore the state
      pinia.state.value = initialState.pinia
    }
  }
)
```

필요에 따라 `@nuxt/devalue`에 [다른 대안](https://github.com/nuxt-contrib/devalue#see-also)을 사용할 수 있습니다. `JSON.stringify()`/`JSON.parse()`로 상태를 직렬화하고 구문 분석할 수 있다면 **성능을 크게 향상시킬 수 있습니다**

이 설계를 환경에 맞게 조정하세요. 클라이언트 측에서 `useStore()` 함수를 호출하기 전에 pinia의 상태를 직렬화해야 합니다. 예를 들어 상태를 `<script>` 태그로 직렬화하여 `window.__pinia`를 통해 클라이언트 측에서 전역적으로 액세스할 수 있도록 하면 다음과 같이 작성할 수 있습니다:

```js
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

// must be set by the user
if (isClient) {
  pinia.state.value = JSON.parse(window.__pinia)
}
```
