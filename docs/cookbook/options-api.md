# `setup()` 없이 사용하기 %{#usage-without-setup}%

Pinia는 구성 API를 사용하지 않아도 사용할 수 있습니다. (Vue 버전이 2.7보다 낮은 경우 `@vue/composition-api` 플러그인을 설치해야 합니다.) 구성 API를 시도해보고 학습하는 것을 권장하지만, 아직 그 시간이 되지 않을 수도 있습니다. 애플리케이션을 이관하는 과정이나 다른 이유로 인해 그럴 수 있습니다. 다음과 같은 몇 가지 함수가 있습니다:

- [mapStores](#giving-access-to-the-whole-store)
- [mapState](../core-concepts/state.md#usage-with-the-options-api)
- [mapWritableState](../core-concepts/state.md#modifiable-state)
- ⚠️ [mapGetters](../core-concepts/getters.md#without-setup) (마이그레이션 편의를 위한 것으로 `mapState()`를 대신 사용하세요)
- [mapActions](../core-concepts/actions.md#without-setup)

## 전체 스토어에 접근하기 %{#giving-access-to-the-whole-store}%

스토어의 거의 모든 속성에 접근해야 하는 경우, 스토어의 모든 속성을 매핑하는 것은 너무 많을 수 있습니다. 대신 `mapStores()`를 사용하여 전체 스토어에 접근할 수 있습니다:

```js
import { mapStores } from 'pinia'

// 다음과 같은 ID를 가진 두 개의 스토어가 있다고 가정합니다.
const useUserStore = defineStore('user', {
  // ...
})
const useCartStore = defineStore('cart', {
  // ...
})

export default {
  computed: {
    // 배열을 전달하지 않고, 스토어를 하나씩 전달합니다.
    // 각 스토어는 ID 뒤에 'Store'를 붙여서 액세스할 수 있습니다.
    ...mapStores(useCartStore, useUserStore)
  },

  methods: {
    async buyStuff() {
      // 어디서든 사용할 수 있습니다!
      if (this.userStore.isAuthenticated()) {
        await this.cartStore.buy()
        this.$router.push('/purchased')
      }
    },
  },
}
```

기본적으로 Pinia는 각 스토어의 `id`에 `"Store"` 접미사를 추가합니다. `setMapStoreSuffix()`를 호출하여 이 동작을 사용자 정의할 수 있습니다:

```js
import { createPinia, setMapStoreSuffix } from 'pinia'

// 접미사를 완전히 제거합니다: this.user, this.cart
setMapStoreSuffix('')
// this.user_store, this.cart_store (괜찮습니다, 저는 비판하지 않을 거예요)
setMapStoreSuffix('_store')
export const pinia = createPinia()
```

## TypeScript %{#typescript}%

기본적으로 모든 맵 도우미는 자동 완성을 지원하며, 아무 작업도 필요하지 않습니다. `"Store"` 접미사를 변경하기 위해 `setMapStoreSuffix()`를 호출한 경우, TS 파일이나 `global.d.ts` 파일 어딘가에 해당 접미사를 추가해야 합니다. 가장 편리한 위치는 `setMapStoreSuffix()`를 호출하는 곳과 동일한 위치일 것입니다:

```ts
import { createPinia, setMapStoreSuffix } from 'pinia'

setMapStoreSuffix('') // 접미사를 완전히 제거합니다.
export const pinia = createPinia()

declare module 'pinia' {
  export interface MapStoresCustomization {
    // 위와 동일한 값으로 설정하세요.
    suffix: ''
  }
}
```

:::warning
TypeScript 선언 파일 (`global.d.ts`와 같은)을 사용하는 경우, 기존 타입을 모두 공개하기 위해 최상단에 `import 'pinia'`를 추가해야 합니다.
:::
