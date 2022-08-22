---
title: Vuex ≤4에서 마이그레이션
---

# Vuex ≤4에서 마이그레이션 %{#migrating-from-vuex-≤4}%

Vuex와 피니아 스토어의 구조는 다르지만 많은 로직을 재사용할 수 있습니다.
이 가이드는 프로세스를 안내하고, 나타날 수 있는 몇 가지 일반적인 문제에 대해 다룹니다.

## 준비 %{#preparation}%

먼저 [시작하기 가이드](/guide/getting-started.md)에 따라 피니아를 설치합니다.

## 모듈을 스토어로 재구성 %{#restructuring-modules-to-stores}%

Vuex는 여러 모듈이 있는 단일 스토어의 개념을 가지고 있습니다.
이러한 모듈은 선택적으로 네임스페이스를 지정할 수 있으며 서로 내포될 수도 있습니다.

이 개념을 피니아와 함께 사용하도록 전환하는 가장 쉬운 방법은 이전에 사용했던 각 모듈이 스토어가 되는 것입니다.
각 스토어는 Vuex의 네임스페이스와 유사한 `id`가 필요합니다.
즉, 각 스토어는 설계에 따라 네임스페이스가 지정된다는 의미입니다.
중첩된 모듈은 각각 자체 스토어가 될 수도 있습니다.
서로 의존하는 스토어는 단순히 다른 스토어를 가져옵니다.

Vuex 모듈을 피니아 스토어로 재구성하는 방법은 전적으로 당신에게 달려 있지만, 여기에 한 가지 제안이 있습니다:

```bash
# Vuex 예제 (네임스페이스 모듈 가정)
src
└── store
    ├── index.ts           # Vuex를 초기화하고 모듈을 가져옴.
    └── modules
        ├── module1.js     # 네임스페이스: 'module1'
        └── nested
            ├── index.ts   # 네임스페이스: 'nested', module2 & module3 가져옴.
            ├── module2.js # 네임스페이스: 'nested/module2'
            └── module3.js # 네임스페이스: 'nested/module3'

# 피니아와 동일, 참고로 ID는 이전의 네임스페이스와 일치함.
src
└── stores
    ├── index.ts          # (선택 사항) 피니아 초기화, 스토어 가져오지 않음.
    ├── module1.js        # id: 'module1'
    ├── nested-module2.js # id: 'nestedModule2'
    ├── nested-module3.js # id: 'nestedModule3'
    └── nested.js         # id: 'nested'
```

이것은 스토어의 일반적인 구조를 생성하며, 이전 네임스페이스를 `id`로 동일하게 유지합니다.
스토어의 루트(Vuex의 `store/index.ts` 파일)에 상태/게터/액션/뮤테이션이 있는 경우,
모든 정보를 보유하는 `root`와 같은 다른 스토어를 만들고 싶을 수 있습니다.

피니아의 디렉토리는 일반적으로 `store` 대신 `stores`라고 합니다.
이는 Vuex의 단일 스토어와 다르게,
피니아는 여러 스토어을 사용한다는 점을 강조하기 위한 것입니다.

대규모 프로젝트의 경우,
한 번에 모든 것을 변환하지 않고 모듈별로 이 변환을 수행할 수 있습니다.
마이그레이션하는 동안 실제로 피니아와 Vuex를 함께 사용할 수 있으므로 이 접근 방식도 작동할 수 있으며,
피니아 디렉토리 이름을 `stores`로 지정하는 또 다른 이유입니다.

## 단일 모듈 변환 %{#converting-a-single-module}%

다음은 Vuex 모듈을 피니아 스토어로 변환하기 전과 후의 전체 예제입니다.
단계별 가이드는 아래를 참조하십시오.
예제는 옵션 스토어를 사용하는데 구조가 Vuex와 가장 유사하기 때문입니다:

```ts
// 'auth/user' 네임스페이스의 Vuex 모듈
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
    // 다른 모듈의 일부 상태와 결합
    fullUserDetails: (state, getters, rootState, rootGetters) => {
      return {
        ...state,
        fullName: getters.fullName,
        // `auth`라는 다른 모듈에서 상태를 읽음.
        ...rootState.auth.preferences,
        // `auth` 아래에 중첩된 `email` 네임스페이스 모듈에서 getter를 읽음.
        ...rootGetters['auth/email'].details
      }
    }
  },
  actions: {
    async loadUser ({ state, commit }, id: number) {
      if (state.userId !== null) throw new Error('이미 로그인 됨!')
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
// 피니아 스토어
import { defineStore } from 'pinia'
import { useAuthPreferencesStore } from './auth-preferences'
import { useAuthEmailStore } from './auth-email'
import vuexStore from '@/store' // 점진적인 전환은 fullUserDetails를 참고.

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
    // firstName 게터는 더 이상 필요하지 않아 제거됨.
    fullName: (state) => `${state.firstName} ${state.lastName}`,
    loggedIn: (state) => state.userId !== null,
    // `this`를 사용하기 때문에 반환 유형을 정의해야 함.
    fullUserDetails (state): FullUserDetails {
      // 다른 스토어에서 import
      const authPreferencesStore = useAuthPreferencesStore()
      const authEmailStore = useAuthEmailStore()
      return {
        ...state,
        // 이제 게터는 `this` 내에 있음.
        fullName: this.fullName,
        ...authPreferencesStore.$state,
        ...authEmailStore.details
      }

      // 다른 모듈이 여전히 Vuex에 있는 경우 대안.
      // return {
      //   ...state,
      //   fullName: this.fullName,
      //   ...vuexStore.state.auth.preferences,
      //   ...vuexStore.getters['auth/email'].details
      // }
    }
  },
  actions: {
    // 첫 번째 인자는 컨텍스트가 아니므로 대신 `this`를 사용.
    async loadUser (id: number) {
      if (this.userId !== null) throw new Error('이미 로그인 됨!')
      const res = await api.user.load(id)
      this.updateUser(res)
    },
    // 뮤테이션은 이제 액션이 되며,
    // 첫 번째 인자는 `state`가 아니므로 대신 `this`를 사용. 
    updateUser (payload) {
      this.firstName = payload.firstName
      this.lastName = payload.lastName
      this.userId = payload.userId
    },
    // `$reset`을 사용하여 쉽게 상태를 재설정.
    clearUser () {
      this.$reset()
    }
  }
})
```

위의 과정을 단계벌로 나누어 보겠습니다:

1. 스토어에 필요한 `id`를 추가. 이전의 사용한 네임스페이스와 동일하게 유지하는 것이 좋음.
   또한 `mapStores()`와 함께 사용하기 쉽도록 `id`가 camelCase에 있는지 확인하는 것이 좋음.
2. `state`가 함수가 아닌 경우, 함수로 변환.
3. `getters` 변환.
   1. 동일한 이름으로 상태를 반환하는 모든 게터 제거(예: `firstName: (state) => state.firstName`).
      스토어 인스턴스에서 직접 상태에 접근할 수 있으므로 필요하지 않음.
   2. 다른 게터에 접근해야 하는 경우, 두 번째 인자를 사용하는 대신 `this`로 접근.
      `this`를 사용하는 경우, 화살표 함수 대신 일반 함수를 사용해야 함.
      또한 TS 제한사항으로 반환 유형을 지정해야 함.
      자세한 내용은 [여기](/guide/core-concepts/getters.md#accessing-other-getters)를 참고.
   3. `rootState` 또는 `rootGetters` 인자를 사용하는 경우,
      다른 스토어를 직접 가져와서 대체하거나,
      여전히 Vuex에 있는 상태일 경우에는 Vuex에 직접 접근.
4. `actions` 변환.
   1. 각 액션에서 첫 번째 `context` 인자를 제거.
      대신 `this`에서 모든 것에 접근할 수 있어야 함.
   2. 다른 스토어를 사용하는 경우,
      직접 가져오거나 Vuex에서 접근할 수 있음.
5. `mutations` 변환.
   1. 뮤테이션은 더 이상 존재하지 않으며, 대신 `actions`로 변환될 수 있음.
      또는 컴포넌트 내에서 스토어에 직접 할당할 수 있음(예: `userStore.firstName = 'First'`)
   2. 액션으로 변환하는 경우, 첫 번째 `state` 인자를 제거하고 `this`로 대체.
   3. 일반적인 뮤테이션의 상태 초기 상태로 재설정하는 것은,
      스토어의 내장 함수 `$reset` 메소드로 대체됨.
      이 함수는 옵션 스토어에만 존재함.

보시다시피 대부분의 코드를 재사용할 수 있습니다.
유형 검사는 누락된 것이 있는 경우, 변경해야 할 사항을 식별하는 데 도움이 됩니다.

## 컴포넌트 내부에서 사용하기 %{#usage-inside-components}%

이제 Vuex 모듈이 피니아 스토어로 변환되었으므로,
해당 모듈을 사용하는 컴포넌트 또는 기타 파일도 업데이트해야 합니다.

이전에 Vuex의 `map` 헬퍼를 사용했다면,
대부분의 헬퍼를 재사용할 수 있으므로 [setup() 없이 사용하기 가이드](options-api.md)를 살펴보는 것이 좋습니다.

`useStore`를 사용하는 경우,
대신에 새 스토어를 직접 가져와 해당 스토어에 있는 상태에 접근해야 합니다.
예를 들어:

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
// 피니아
import { defineComponent, computed } from 'vue'
import { useAuthUserStore } from '@/stores/auth-user'

export default defineComponent({
  setup () {
    const authUserStore = useAuthUserStore()

    const firstName = computed(() => authUserStore.firstName)
    const fullName = computed(() => authUserStore.fullName)

    return {
      // 반환하면 컴포넌트가 스토어에 전체적으로 접근할 수 있음.
      authUserStore,
      firstName,
      fullName
    }
  }
})
```

## 컴포넌트 외부에서 사용하기 %{#usage-outside-components}%

컴포넌트 외부에서 사용하는 부분을 마이그레이션하는 것은,
단순히 함수 외부에서 스토어를 사용하지 않도록 주의하는 것입니다.
다음은 Vue 라우터 네비게이션 가드에서 스토어를 사용하는 예제입니다:

```ts
// Vuex
import vuexStore from '@/store'

router.beforeEach((to, from, next) => {
  if (vuexStore.getters['auth/user/loggedIn']) next()
  else next('/login')
})
```

```ts
// 피니아
import { useAuthUserStore } from '@/stores/auth-user'

router.beforeEach((to, from, next) => {
  // 함수 내에서 사용해야 함!
  const authUserStore = useAuthUserStore()
  if (authUserStore.loggedIn) next()
  else next('/login')
})
```

참고: [가이드 - 컴포넌트 외부의 스토어](/guide/core-concepts/outside-component-usage.md)

## 고급 Vuex 사용 %{#advanced-vuex-usage}%

Vuex 스토어에서 제공하는 고급 기능 중 일부를 사용하는 경우,
피니아에서 동일한 작업을 수행하는 방법에 대한 몇 가지 지침이 있습니다.
이러한 요점 중 일부는 [여기](/guide/introduction.md#comparison-with-vuex-3-x-4-x)에서 이미 다뤘습니다.

### 동적 모듈 %{#dynamic-modules}%

피니아에서 모듈을 동적으로 등록할 필요가 없습니다.
스토어는 설계상 동적이며 필요할 때만 등록됩니다.
스토어를 사용하지 않으면 "등록(registered)"되지 않습니다.

### 핫 모듈 교체 (HMR) %{#hot-module-replacement}%

HMR도 지원되지만 변경이 필요합니다.

참고: [가이드 - 핫 모듈 교체](hot-module-replacement.md)

### Plugins (플러그인) %{#plugins}%

퍼블릭 Vuex 플러그인을 사용하는 경우, 피니아를 선택할 수 있는지 확인하십시오.
그렇지 않은 경우, 플러그인을 직접 작성하거나 플러그인이 여전히 필요한지 고민해봐야 합니다.

자체적으로 플러그인을 작성했다면,
피니아와 함께 작동하도록 업데이트할 수 있습니다.

참고: [가이드 - Plugins (플러그인)](/guide/core-concepts/plugins.md)