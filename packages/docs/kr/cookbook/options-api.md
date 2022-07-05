# `setup()` 없이 사용

Composition API(Vue 2를 사용하는 경우에도 `@vue/composition-api` 플러그인을 설치해야 합니다.)를 사용하지 않아도 피니아를 사용할 수 있습니다. Composition API를 시도하고 배우도록 권장하지만 아직 귀하와 귀하의 팀을 위한 시간이 아닐 수도 있고 애플리케이션을 마이그레이션하는 중일 수도 있습니다. 몇 가지 기능이 있습니다.

- [mapStores](#giving-access-to-the-whole-store)
- [mapState](../core-concepts/state.md#options-api)
- [mapWritableState](../core-concepts/state.md#modifiable-state)
- ⚠️ [mapGetters](../core-concepts/getters.md#options-api) (마이그레이션 편의를 위해 대신 `mapState()`를 사용하십시오.)
- [mapActions](../core-concepts/actions.md#options-api)

## 전체 저장소에 대한 액세스 권한 부여

상점에서 거의 모든 것에 액세스해야 하는 경우 상점의 모든 단일 속성을 매핑하는 것은 너무 많을 수 있습니다. 대신 `mapStores()`를 사용하여 전체 상점에 액세스할 수 있습니다:

```js
import { mapStores } from 'pinia'

// 다음 ID를 가진 두 개의 상점이 제공됨
const useUserStore = defineStore('user', {
  // ...
})
const useCartStore = defineStore('cart', {
  // ...
})

export default {
  computed: {
    // 배열을 전달하지 않는다는 점에 유의하십시오
    // 각 상점은 id + 'Store'로 액세스할 수 있습니다
    ...mapStores(useCartStore, useUserStore)
  },

  methods: {
    async buyStuff() {
      // use them anywhere!
      if (this.userStore.isAuthenticated()) {
        await this.cartStore.buy()
        this.$router.push('/purchased')
      }
    },
  },
}
```

기본적으로 Pinia는 각 상점의 `id`에 `"Store"` 접미사를 추가합니다. `setMapStoreSuffix()`를 호출하여 이 동작을 사용자 정의할 수 있습니다:

```js
import { createPinia, setMapStoreSuffix } from 'pinia'

// 접미사를 완전히 제거하십시오: this.user, this.cart
setMapStoreSuffix('')
// this.user_store, this.cart_store
setMapStoreSuffix('_store')
export const pinia = createPinia()
```

## TypeScript

기본적으로 모든 맵 도우미는 자동 완성을 지원하므로 아무 것도 할 필요가 없습니다. `setMapStoreSuffix()`를 호출하여 `"Store"` 접미사를 변경하는 경우 TS 파일 또는 `global.d.ts` 파일의 어딘가에 추가해야 합니다. 가장 편리한 위치는 `setMapStoreSuffix()`를 호출한 동일한 위치입니다:

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
TypeScript 선언 파일(예: `global.d.ts`)을 사용하는 경우 `import 'pinia'`를 파일 상단에 지정하여 모든 기존 유형을 노출해야 합니다.
:::
