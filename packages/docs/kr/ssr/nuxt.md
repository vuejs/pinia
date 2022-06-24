# Nuxt.js

Nuxt는 *서버 사이드 렌더링*과 관련하여 많은 것을 처리하므로 [Nuxt.js](https://nuxtjs.org/)와 함께 Pinia를 사용하는 것이 더 쉽습니다 . 예를 들어 직렬화나 XSS 공격에 대해 걱정할 필요가 없습니다 .

## 설치

[`@nuxtjs/composition-api`](https://composition-api.nuxtjs.org/)를 `pinia`와 함께 설치해야 합니다.

```bash
yarn add pinia @pinia/nuxt @nuxtjs/composition-api
# or with npm
npm install pinia @pinia/nuxt @nuxtjs/composition-api
```

모든 것을 처리할 수 있는 *모듈*을 제공하므로 `nuxt.config.js` 파일의 `buildModules`에 추가하기만 하면 됩니다:

```js
// nuxt.config.js
export default {
  // ... other options
  buildModules: [
    // Nuxt 2 only:
    // https://composition-api.nuxtjs.org/getting-started/setup#quick-start
    '@nuxtjs/composition-api/module',
    '@pinia/nuxt',
  ],
}
```

그게 전부입니다. 평소와 같이 저장소를 사용하세요!

## 저장소를 `setup()` 밖에서 사용하는 법

저장소를 `setup()` 외부에서 사용하려 한다면, `pinia`를 `useStore()`에 전달하는 것을 잊지 마세요. 우리는 [context](https://nuxtjs.org/docs/2.x/internals-glossary/context)에 추가하여 `asyncData()` 및 `fetch()`에서 액세스할 수 있도록 했습니다:

```js
import { useStore } from '~/stores/myStore'

export default {
  asyncData({ $pinia }) {
    const store = useStore($pinia)
  },
}
```

## 저장소에서 Nuxt context 사용하기

`$nuxt`를 사용하여 어느 저장소에서나 [context](https://nuxtjs.org/docs/2.x/internals-glossary/context)를 사용할 수도 있습니다:

```js
import { useUserStore } from '~/stores/userStore'

defineStore('cart', {
  actions: {
    purchase() {
      const user = useUserStore()
      if (!user.isAuthenticated()) {
        this.$nuxt.redirect('/login')
      }
    },
  },
})
```

## Vuex와 함께 Pinia 사용하기

**Pinia와 Vuex를 모두 사용하지 않는 것**이 좋지만 둘 다 사용해야 하는 경우, pinia에게 비활성화하지 않도록 알려야 합니다:

```js
// nuxt.config.js
export default {
  buildModules: [
    '@nuxtjs/composition-api/module',
    ['@pinia/nuxt', { disableVuex: false }],
  ],
  // ... other options
}
```

## TypeScript

TypeScript를 사용하거나 `jsconfig.json`이 있는 경우 `context.pinia`에 대한 유형도 추가해야 합니다:

```json
{
  "types": [
    // ...
    "@pinia/nuxt"
  ]
}
```

이렇게만 하면 자동 완성 기능도 보장됩니다 😉.
