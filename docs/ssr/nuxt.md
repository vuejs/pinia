# Nuxt.js

[Nuxt.js](https://nuxtjs.com/)와 피니아를 함께 사용하는 것은 Nuxt가 SSR과 관련하여 많은 것을 처리하기 때문에 더 쉽습니다.
예를 들어 **직렬화나 XSS 공격에 신경 쓸 필요가 없습니다**.
피니아는 Nuxt Bridge 및 Nuxt 3를 지원합니다.
Nuxt 2 지원은 [아래를 참조](#nuxt-2-without-bridge)합시다.

## 설치 %{#installation}%

```bash
yarn add pinia @pinia/nuxt
# or with npm
npm install pinia @pinia/nuxt
```

:::tip
npm을 사용하는 경우,
종속성 트리 오류를 해결할 수 없는 ERESOLVE 가 발생할 수 있습니다.
이 경우 `package.json`에 다음을 추가합니다:

```js
"overrides": { 
  "vue": "latest"
}
```

:::

모든 것을 처리할 수 있는 모듈을 제공하므로,
`nuxt.config.js` 파일의 `modules`에 추가하기만 하면 됩니다:

```js
// nuxt.config.js
export default defineNuxtConfig({
  // ... 다른 옵션들
  modules: [
    // ...
    '@pinia/nuxt',
  ],
})
```

이게 전부입니다, 평소처럼 스토어를 사용하세요!

## `setup()` 외부에서 스토어 사용 %{#using-the-store-outside-of-setup}%

`setup()` 외부에서 스토어를 사용하려면,
`pinia` 객체를 `useStore()`에 전달하는 것을 잊지 마십시오.
`asyncData()` 및 `fetch()`에서 접근할 수 있도록 [컨텍스트](https://nuxtjs.org/docs/2.x/internals-glossary/context)에 추가되어 있습니다.

```js
import { useStore } from '~/stores/myStore'

export default {
  asyncData({ $pinia }) {
    const store = useStore($pinia)
  },
}
```

`onServerPrefetch()`와 마찬가지로 `asyncData()` 내에서 저장 작업을 호출하려는 경우 특별한 작업을 수행할 필요가 없습니다:

```vue
<script setup>
const store = useStore()
const { data } = await useAsyncData('user', () => store.fetchUser())
</script>
```

## 오토 임포트 (import) %{#auto-imports}%

기본적으로 `@pinia/nuxt`는 싱글 오토 임포트 `usePinia()`를 노출합니다.
이것은 `getActivePinia()`와 유사하지만 Nuxt에서 더 잘 작동합니다.
오토 임포트를 추가하여 개발을 더 쉽게 할 수 있습니다:

```js
// nuxt.config.js
export default defineNuxtConfig({
  // ... 다른 옵션들
  modules: ['@pinia/nuxt'],
  pinia: {
    autoImports: [
      // `defineStore`를 자동으로 임포트함.
      'defineStore', // import { defineStore } from 'pinia'
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
})
```

## Nuxt 2 without bridge %{#nuxt-2-without-bridge}%

피니아는 `@pinia/nuxt` v0.2.1부터 Nuxt 2를 지원합니다.
`pinia`와 더불어 [`@nuxtjs/composition-api`](https://composition-api.nuxtjs.org/)도 설치해야 합니다:

```bash
yarn add pinia @pinia/nuxt@0.2.1 @nuxtjs/composition-api
# 또는 npm으로
npm install pinia @pinia/nuxt@0.2.1 @nuxtjs/composition-api
```

모든 것을 처리할 수 있는 모듈을 제공하므로, `nuxt.config.js` 파일의 `buildModules`에 추가하기만 하면 됩니다:

```js
// nuxt.config.js
export default {
  // ... 다른 옵션들
  buildModules: [
    // Nuxt 2 에서만:
    // https://composition-api.nuxtjs.org/getting-started/setup#quick-start
    '@nuxtjs/composition-api/module',
    '@pinia/nuxt',
  ],
}
```

## TypeScript

TypeScript와 함께 Nuxt2(`@pinia/nuxt` < 0.3.0)를 사용하거나 `jsconfig.json`이 있는 경우,
`context.pinia`에 대한 유형을 추가해야 합니다:

```json
{
  "types": [
    // ...
    "@pinia/nuxt"
  ]
}
```

이렇게 하면 자동 완성 기능이 보장됩니다 😉 .

### Vuex와 함께 피니아 사용 %{#using-pinia-alongside-vuex}%

**피니아와 Vuex를 함께 사용하지 않는 것이 좋지만** 둘 다 사용해야 하는 경우,
피니아가 Vuex를 비활성화하지 않도록 알려야 합니다:

```js
// nuxt.config.js
export default {
  buildModules: [
    '@nuxtjs/composition-api/module',
    ['@pinia/nuxt', { disableVuex: false }],
  ],
  // ... 다른 옵션들
}
```