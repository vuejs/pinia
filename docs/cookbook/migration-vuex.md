# Vuex ≤4에서 마이그레이션하기 %{#migrating-from-vuex-≤4}%

Vuex와 Pinia 스토어의 구조는 다르지만, 많은 로직을 재사용할 수 있습니다. 이 가이드는 프로세스를 돕고, 발생할 수 있는 일반적인 문제점을 지적하는 데 도움을 줍니다.

## 준비 작업 %{#preparation}%

먼저, [시작 가이드](../getting-started.md)를 따라 Pinia를 설치하세요.

## 모듈을 스토어로 재구조화하기 %{#restructuring-modules-to-stores}%

Vuex에는 여러 _모듈_을 가진 단일 스토어라는 개념이 있습니다. 이러한 모듈은 선택적으로 네임스페이스로 지정되며 서로 중첩될 수도 있습니다.

이러한 개념을 Pinia에서 사용하도록 전환하는 가장 간단한 방법은 이전에 사용한 각 모듈이 이제 _스토어_가 됩니다. 각 스토어에는 네임스페이스와 동일한 `id`가 필요합니다. 이는 각 스토어가 설계상으로 이름 공간화되기 때문에 동일한 개념입니다. 중첩된 모듈도 각각 고유한 스토어가 될 수 있습니다. 서로 의존하는 스토어는 단순히 다른 스토어를 가져올 수 있습니다.

Vuex 모듈을 Pinia 스토어로 어떻게 재구조화할지는 전적으로 여러분에게 달려 있지만, 다음은 하나의 제안입니다:

```bash
# Vuex 예제 (네임스페이스 모듈 가정)
src
└── store
    ├── index.js           # Vuex 초기화, 모듈 가져오기
    └── modules
        ├── module1.js     # 'module1' 네임스페이스
        └── nested
            ├── index.js   # 'nested' 네임스페이스, module2 및 module3 가져오기
            ├── module2.js # 'nested/module2' 네임스페이스
            └── module3.js # 'nested/module3' 네임스페이스

# Pinia 등가물, id와 이전 네임스페이스가 일치함을 유의하세요
src
└── stores
    ├── index.js          # (선택사항) Pinia 초기화, 스토어 가져오지 않음
    ├── module1.js        # 'module1' id
    ├── nested-module2.js # 'nestedModule2' id
    ├── nested-module3.js # 'nestedModule3' id
    └── nested.js         # 'nested' id
```

이렇게 하면 스토어에 대한 평면 구조가 만들어지지만, 이전과 동일한 네임스페이스를 가진 `id`를 유지합니다. 루트 스토어의 일부 상태/게터/액션/뮤테이션이 스토어의 `root`와 같은 이름을 가진 또 다른 스토어로 만드는 것이 좋습니다.

Pinia의 디렉토리는 일반적으로 `store` 대신 `stores`로 불립니다. 이는 Pinia가 Vuex의 단일 스토어 대신 여러 스토어를 사용한다는 점을 강조하기 위함입니다.

대규모 프로젝트의 경우 한 번에 모든 것을 변환하는 대신 모듈별로 변환을 수행하는 것이 좋습니다. 실제로 Pinia와 Vuex를 마이그레이션하는 동안 Pinia와 Vuex를 혼합할 수 있으므로 이 접근 방식도 작동하며 Pinia 디렉토리의 이름을 `stores`로 지정한 이유입니다.

## 단일 모듈 변환하기 %{#converting-a-single-module}%

다음은 Vuex 모듈을 Pinia 스토어로 변환하는 전과 후의 완전한 예입니다. 단계별 가이드는 아래에서 확인하세요. Pinia 예제는 구조가 가장 유사한 옵션 스토어를 사용합니다.

```ts
// Vuex의 'auth/user' 네임스페이스 모듈
import { Module } from 'vuex'
import { api } from '@/api'
import { RootState } from '@/types' // Vuex 유형 정의를 사용하는 경우

interface State {
  firstName: string
  lastName: string
  userId: number | null
}

const storeModule: Module<State, RootState> = {
  namespaced: true,
  state: {
    firstName: '',
    lastName: '',
    userId: null
  },
  getters: {
    firstName: (state) => state.firstName,
    fullName: (state) => `${state.firstName} ${state.lastName}`,
    loggedIn: (state) => state.userId !== null,
    // 다른 모듈에서 가져온 일부 상태와 결합합니다.
    fullUserDetails: (state, getters, rootState, rootGetters) => {
      return {
        ...state,
        fullName: getters.fullName,
        // `auth`라는 다른 모듈에서 상태를 읽어옵니다.
        ...rootState.auth.preferences,
        // `auth` 아래에 중첩된 `email`이라는 네임스페이스 모듈에서 게터를 읽어옵니다.
        ...rootGetters['auth/email'].details
      }
    }
  },
  actions: {
    async loadUser ({ state, commit }, id: number) {
      if (state.userId !== null) throw new Error('Already logged in')
      const res = await api.user.load(id)
      commit('updateUser', res)
    }
  },
  mutations: {
    updateUser (state, payload) {
      state.firstName = payload.firstName
      state.lastName = payload.lastName
      state.userId = payload.userId
    },
    clearUser (state) {
      state.firstName = ''
      state.lastName = ''
      state.userId = null
    }
  }
}

export default storeModule
```

```ts
// Pinia 스토어
import { defineStore } from 'pinia'
import { useAuthPreferencesStore } from './auth-preferences'
import { useAuthEmailStore } from './auth-email'
import vuexStore from '@/store' // 점진적 변환을 위해, fullUserDetails 참조

interface State {
  firstName: string
  lastName: string
  userId: number | null
}

export const useAuthUserStore = defineStore('authUser', {
  // 함수로 변환
  state: (): State => ({
    firstName: '',
    lastName: '',
    userId: null
  }),
  getters: {
    // firstName getter 제거, 더 이상 필요하지 않음
    fullName: (state) => `${state.firstName} ${state.lastName}`,
    loggedIn: (state) => state.userId !== null,
    // `this`를 사용하기 때문에 반환 유형을 정의해야 합니다.
    fullUserDetails (state): FullUserDetails {
      // 다른 스토어 가져오기
      const authPreferencesStore = useAuthPreferencesStore()
      const authEmailStore = useAuthEmailStore()
      return {
        ...state,
        // 다른 getter 함수들은 이제 `this`를 통해 접근할 수 있습니다.
        fullName: this.fullName,
        ...authPreferencesStore.$state,
        ...authEmailStore.details
      }

      // 만약 다른 모듈들이 여전히 Vuex에 있다면 대안이 있습니다.
      // return {
      //   ...state,
      //   fullName: this.fullName,
      //   ...vuexStore.state.auth.preferences,
      //   ...vuexStore.getters['auth/email'].details
      // }
    }
  },
  actions: {
    // 첫 번째 인수로 컨텍스트를 사용하는 대신 `this`를 사용하세요.
    async loadUser (id: number) {
      if (this.userId !== null) throw new Error('Already logged in')
      const res = await api.user.load(id)
      this.updateUser(res)
    },
    // 변이(mutations)는 이제 액션(actions)으로 변할 수 있으며, 첫 번째 인수로 `state` 대신 `this`를 사용하세요.
    updateUser (payload) {
      this.firstName = payload.firstName
      this.lastName = payload.lastName
      this.userId = payload.userId
    },
    // `$reset`을 사용하여 쉽게 상태(state)를 재설정할 수 있습니다.
    clearUser () {
      this.$reset()
    }
  }
})
```

위 내용을 단계별로 살펴봅시다:

1. 스토어에 필요한 `id`를 추가하고, 이전의 네임스페이스와 동일하게 유지하는 것이 좋습니다. 또한 `id`가 _camelCase_로 지정되도록 하는 것이 권장됩니다. 이는 `mapStores()`에서 사용하기 쉽게 만들기 때문입니다.
2. `state`를 함수로 변환하십시오(이미 함수로 되어 있지 않은 경우).
3. `getters`를 변환하십시오.
   1. 동일한 이름(예: `firstName: (state) => state.firstName`)으로 상태를 반환하는 게터는 더 이상 필요하지 않으므로 제거합니다. 상태는 스토어 인스턴스에서 직접 액세스할 수 있습니다.
   2. 다른 게터에 액세스해야 하는 경우 두 번째 인수 대신 `this`를 사용해야 합니다. `this`를 사용하려면 화살표 함수 대신 일반 함수를 사용해야 함에 주의하세요. 또한, TS의 한계로 인해 반환 유형을 지정해야 합니다. 자세한 내용은 [여기](../core-concepts/getters.md#accessing-other-getters)를 참조하세요.
   3. `rootState` 또는 `rootGetters` 인수를 사용하는 경우 직접 다른 스토어를 가져오거나, Vuex에 여전히 존재하는 경우 Vuex에서 직접 액세스하면 됩니다.
4. `actions`를 변환하십시오.
   1. 각 액션의 첫 번째 `context` 인수를 제거하십시오. 모든 것은 이제 `this`에서 액세스할 수 있어야 합니다.
   2. 다른 스토어를 사용하는 경우 직접 가져오거나, 만약 Vuex에 여전히 존재한다면 Vuex에서 직접 액세스하면 됩니다.
5. `mutations`를 변환하십시오.
   1. 뮤테이션은 더 이상 존재하지 않습니다. 대신 이를 `actions`로 변환하거나 컴포넌트 내에서 스토어에 직접 할당(예: `userStore.firstName = 'First'`)할 수 있습니다.
   2. 액션으로 변환하는 경우 첫 번째 `state` 인수를 제거하고, 할당문을 `this`로 변경하십시오.
   3. 상태를 초기 상태로 다시 설정하는 것은 `$reset` 메서드를 사용하여 내장된 기능입니다. 이 기능은 옵션 스토어에만 존재합니다.

대부분의 코드가 재사용될 수 있다는 것을 알 수 있습니다. 타입 안전성은 놓치지 않을 경우에도 변경해야 할 사항을 식별하는 데 도움을 줄 것입니다.

## 컴포넌트 내에서 사용하기 %{#usage-inside-components}%

이제 Vuex 모듈을 Pinia 스토어로 변환했으므로 해당 모듈을 사용하는 컴포넌트나 다른 파일도 업데이트해야 합니다.

이전에 Vuex에서 사용한 `map` 헬퍼를 사용했다면 [setup()을 사용하지 않는 사용법 가이드](./options-api.md)를 살펴보는 것이 좋습니다. 대부분의 헬퍼는 재사용할 수 있습니다.

`useStore`를 사용했다면, 이제 새로운 스토어를 직접 가져오고 해당 스토어의 상태에 액세스하면 됩니다. 예를 들면 다음과 같습니다.

```ts
// Vuex
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
  setup () {
    const store = useStore()

    const firstName = computed(() => store.state.auth.user.firstName)
    const fullName = computed(() => store.getters['auth/user/fullName'])

    return {
      firstName,
      fullName
    }
  }
})
```

```ts
// Pinia
import { defineComponent, computed } from 'vue'
import { useAuthUserStore } from '@/stores/auth-user'

export default defineComponent({
  setup () {
    const authUserStore = useAuthUserStore()

    const firstName = computed(() => authUserStore.firstName)
    const fullName = computed(() => authUserStore.fullName)

    return {
      // 컴포넌트에서 스토어 전체에 접근하려면 반환할 수도 있습니다.
      authUserStore,
      firstName,
      fullName
    }
  }
})
```

## 컴포넌트 외부에서 사용하기 %{#usage-outside-components}%

컴포넌트 외부에서 사용하는 경우 함수 외부에서 스토어를 사용하지 않도록 주의해야 합니다. Vue Router의 내비게이션 가드에서 스토어를 사용하는 예를 살펴보겠습니다.

```ts
// Vuex
import vuexStore from '@/store'

router.beforeEach((to, from, next) => {
  if (vuexStore.getters['auth/user/loggedIn']) next()
  else next('/login')
})
```

```ts
// Pinia
import { useAuthUserStore } from '@/stores/auth-user'

router.beforeEach((to, from, next) => {
  // 함수 내에서 사용해야 합니다!
  const authUserStore = useAuthUserStore()
  if (authUserStore.loggedIn) next()
  else next('/login')
})
```

자세한 내용은 [여기](../core-concepts/outside-component-usage.md)를 참조하세요.

## 고급 Vuex 사용법 %{#advanced-vuex-usage}%

Vuex 스토어에서 Pinia로 마이그레이션하는 경우 더 고급 기능을 사용하는 경우 다음 가이드를 참조하세요. 이러한 내용 중 일부는 [이 비교 요약](../introduction.md#comparison-with-vuex-3-x-4-x)에서 이미 다루었습니다.

### 동적 모듈 %{#dynamic-modules}%

Pinia에서는 동적으로 모듈을 등록할 필요가 없습니다. 스토어는 동적으로 동작하며 사용되어야만 "등록"됩니다. 스토어가 사용되지 않는다면 "등록"되지 않습니다.

### 핫 모듈 교체(HMR) %{#hot-module-replacement}%

HMR도 지원되지만 대체 방법이 필요합니다. [HMR 가이드](./hot-module-replacement.md)를 참조하세요.

### 플러그인 %{#plugins}%

공개 Vuex 플러그인을 사용하는 경우 해당 플러그인의 Pinia 대안이 있는지 확인하십시오. 그렇지 않은 경우 플러그인을 직접 작성하거나 플러그인이 여전히 필요한지 평가해야 할 것입니다.

자체 플러그인을 작성한 경우 Pinia와 함께 작동하도록 업데이트할 수 있을 것입니다. [플러그인 가이드](../core-concepts/plugins.md)를 참조하세요.
