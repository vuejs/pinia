---
title: setup 없이 사용하기
---

# `setup()` 없이 사용하기 %{#usage-without-setup}%

컴포지션 API를 사용하지 않는 경우에도 피니아를 사용할 수 있습니다(Vue 2를 사용하는 경우 여전히 `@vue/composition-api` 플러그인을 설치해야 함).
컴포지션 API를 시도하고 배우도록 권장하지만,
아직 당신과 당신의 팀에 시간이 없거나,
앱을 마이그레이션하는 중일 수도 있습니다.
몇 가지 함수가 있습니다:

- [mapStores](#giving-access-to-the-whole-store)
- [mapState](/core-concepts/state.md#usage-with-the-options-api)
- [mapWritableState](/core-concepts/state.md#modifiable-state)
- ⚠️ [mapGetters](/core-concepts/getters.md#without-setup) (마이그레이션 편의를 위해 `mapState()`를 대신 사용하십시오.)
- [mapActions](/core-concepts/actions.md#without-setup)

## 전체 스토어에 대한 접근 권한 부여 %{#giving-access-to-the-whole-store}%

거의 모든 것에 대한 접근을 스토어에서 해야 하는 경우,
스토어의 모든 단일 속성을 매핑하는 것은 너무 많을 수 있습니다.
대신 `mapStores()`를 사용하여 전체 스토어에 접근할 수 있습니다:

```js
import { mapStores } from 'pinia'

// 다음 ID를 가진 두 개의 스토어가 제공됨.
const useUserStore = defineStore('user', {
  // ...
})
const useCartStore = defineStore('cart', {
  // ...
})

export default {
  computed: {
    // 배열을 전달하지 않는다는 점에 유의.
    // 각 스토어는 id + 'Store'로 액세스할 수 있음.
    ...mapStores(useCartStore, useUserStore)
  },

  methods: {
    async buyStuff() {
      // 어디서나 사용 가능!
      if (this.userStore.isAuthenticated()) {
        await this.cartStore.buy()
        this.$router.push('/purchased')
      }
    },
  },
}
```

기본적으로 피니아는 각 스토어의 `id`에 `"Store"` 접미사를 추가합니다.
`setMapStoreSuffix()`를 호출하여 이 동작을 사용자 정의할 수 있습니다:

```js
import { createPinia, setMapStoreSuffix } from 'pinia'

// 접미사를 완전히 제거: this.user, this.cart
setMapStoreSuffix('')
// 커스텀 접미사 추가: this.user_store, this.cart_store
setMapStoreSuffix('_store')
export const pinia = createPinia()
```

## TypeScript

기본적으로 모든 맵 헬퍼는 자동 완성을 지원하므로 아무 것도 할 필요가 없습니다.
`setMapStoreSuffix()`를 호출하여 `"Store"` 접미사를 변경하는 경우,
TS 파일 또는 `global.d.ts` 파일의 어딘가에 추가해야 합니다.
가장 편리한 위치는 `setMapStoreSuffix()`를 호출한 동일한 위치입니다:

```ts
import { createPinia, setMapStoreSuffix } from 'pinia'

setMapStoreSuffix('') // 접미사를 완전히 제거
export const pinia = createPinia()

declare module 'pinia' {
  export interface MapStoresCustomization {
    // 위와 같은 값으로 설정
    suffix: ''
  }
}
```

:::warning
TypeScript 선언 파일(예: `global.d.ts`)을 사용하는 경우,
파일 상단에 `import 'pinia'`를 지정하여 모든 기존 유형을 노출해야 합니다.
:::