# 소개

<VueSchoolLink
  href="https://vueschool.io/lessons/introduction-to-pinia"
  title="Get started with Pinia"
/>

Pinia 는 2019년 11월 경에 [Composition API](https://github.com/vuejs/composition-api) 를 사용하여 Store for Vue가 어떻게 생겼는지 재설계하기 위한 실험으로 [시작](https://github.com/vuejs/pinia/commit/06aeef54e2cad66696063c62829dac74e15fd19e) 했습니다. 그 이후로, 초기 원칙은 여전히 동일하지만, Pinia는 Vue 2와 Vue 3 모두에서 작동하며 **컴포지션 API를 사용할 필요가 없습니다**. API는 *설치* 및 _SSR_ 을 제외하고 모두 동일합니다, 그리고 이 문서는 Vue 2 및 Vue 3 사용자가 읽을 수 있도록 필요할 때마다 **Vue 2에 대한 메모와 함께** Vue 3을 대상으로 합니다!

## 왜 내가 Pinia를 사용해야 하나요?

Pinia는 Vue의 상태 관리 라이브러리로 컴포넌트/페이지 간에 상태를 공유할 수 있습니다. Composition API에 익숙하다면 간단한 `export const state = react({})` 코드로 이미 전역 상태를 공유할 수 있다고 생각할 수 있습니다. 이것은 단일 페이지 응용 프로그램에 해당되지만 서버 측에서 렌더링되는 경우 **응용 프로그램을 [보안 취약성](https://vuejs.org/guide/scaling-up/ssr.html#cross-request-state-pollution)에 노출**시킵니다. 그러나 작은 단일 페이지 응용 프로그램에서도 Pinia를 사용하며 많은 것을 얻을 수 있습니다:

- 개발자 도구 지원
  - 액션, 변이를 추적하는 타임라인
  - Stores를 사용하는 곳에만 나타남
  - 시간 여행 및 더 쉬운 디버깅
- 핫 모듈 교체
  - 페이지를 새로고침하지 않고 상점 수정
  - 개발하는 동안 기존 상태 유지
- 플러그인: 플러그인으로 Pinia 기능 확장
- JS 사용자를 위한 적절한 TypeScript 지원 또는 **자동 완성**
- 서버 사이드 렌더링(SSR) 지원

## 기본 예시

이것이 API 측면에서 pinia를 사용하는 방법입니다 (전체 지침은 [시작하기](./getting-started.md) 를 확인하세요). 저장소를 만드는 것으로 시작됩니다:

```js
// stores/counter.js
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => {
    return { count: 0 }
  },
  // could also be defined as
  // state: () => ({ count: 0 })
  actions: {
    increment() {
      this.count++
    },
  },
})
```

그런 다음 컴포넌트에서 사용합니다:

```js
import { useCounterStore } from '@/stores/counter'

export default {
  setup() {
    const counter = useCounterStore()

    counter.count++
    // with autocompletion ✨
    counter.$patch({ count: counter.count + 1 })
    // or using an action instead
    counter.increment()
  },
}
```

또한 Store를 더 고급화된 사용을 위해 함수로 (컴포넌트의 `setup()`과 유사하게) 정의할 수도 있습니다:

```js
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() {
    count.value++
  }

  return { count, increment }
})
```

아직 Composition API의 `setup()`에 익숙하지 않더라도 걱정하지 마세요. Pinia는 [Vuex와 유사한 맵 도우미](https://vuex.vuejs.org/guide/state.html#the-mapstate-helper) 세트 또한 지원합니다. 같은 방법으로 `mapStores()`, `mapState()`, or `mapActions()`를 정의할 수 있습니다:

```js{22,24,28}
const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++
    },
  },
})

const useUserStore = defineStore('user', {
  // ...
})

export default {
  computed: {
    // other computed properties
    // ...
    // gives access to this.counterStore and this.userStore
    ...mapStores(useCounterStore, useUserStore),
    // gives read access to this.count and this.double
    ...mapState(useCounterStore, ['count', 'double']),
  },
  methods: {
    // gives access to this.increment()
    ...mapActions(useCounterStore, ['increment']),
  },
}
```

핵심 개념에서 각 *맵 도우미*에 대한 자세한 정보를 찾을 수 있습니다.

## 왜 _Pinia_ 인가

Pinia는 (발음은 `/piːnjʌ/`, 영어로 "peenya"와 유사함) _piña_ (*파인애플*의 스페인어)와 가장 가까운 이름이고 이것은 유효한 패키지 이름입니다.
파인애플은 실제로 여러 개의 과일을 만들기 위해 함께 결합된 개별 꽃의 그룹입니다. 상점과 마찬가지로 하나하나가 개별적으로 태어나지만 결국에는 모두 연결되어 있습니다. 남아메리카가 원산지인 맛있는 열대 과일이기도 합니다.

## 조금 더 현실적인 예시

다음은 **자바스크립트에서도 타입**이 있는 Pinia와 함께 사용할 API의 더 완전한 예입니다. 어떤 사람들에게는 이것이 더 이상 읽지 않고 시작하기에 충분할 수 있지만 여전히 나머지 문서를 확인하거나 이 예제를 건너뛰고 모든 *핵심 컨셉*에 대해 읽은 후에 다시 오는 것이 좋습니다.

```js
import { defineStore } from 'pinia'

export const useTodos = defineStore('todos', {
  state: () => ({
    /** @type {{ text: string, id: number, isFinished: boolean }[]} */
    todos: [],
    /** @type {'all' | 'finished' | 'unfinished'} */
    filter: 'all',
    // type will be automatically inferred to number
    nextId: 0,
  }),
  getters: {
    finishedTodos(state) {
      // autocompletion! ✨
      return state.todos.filter((todo) => todo.isFinished)
    },
    unfinishedTodos(state) {
      return state.todos.filter((todo) => !todo.isFinished)
    },
    /**
     * @returns {{ text: string, id: number, isFinished: boolean }[]}
     */
    filteredTodos(state) {
      if (this.filter === 'finished') {
        // call other getters with autocompletion ✨
        return this.finishedTodos
      } else if (this.filter === 'unfinished') {
        return this.unfinishedTodos
      }
      return this.todos
    },
  },
  actions: {
    // any amount of arguments, return a promise or not
    addTodo(text) {
      // you can directly mutate the state
      this.todos.push({ text, id: this.nextId++, isFinished: false })
    },
  },
})
```

## Vuex와 비교

Pinia는 Vuex 5에 대한 핵심 팀 토론의 많은 아이디어를 통합하여 Vuex의 다음 버전이 어떤 모습일지 탐구하는 것으로 시작했습니다. 마침내 우리는 Pinia가 우리가 Vuex 5에서 원했던 대부분을 이미 구현하고 있다는 것을 깨달았고, 새로운 권장 사항으로 만들기로 결정했습니다.

Vuex와 비교해서 Pinia는 더 적은 과정을 통한 간결한 API를 제공하고, Composition-API 스타일의 API들을 제공하며, 가장 중요한 것은, TypeScript와 함께 사용할 때 견고한 타입 추론을 지원합니다.

### RFCs

처음에 Pinia는 RFC를 거치지 않았습니다. 저는 응용 프로그램 개발, 다른 사람의 코드 읽기, Pinia를 사용하는 클라이언트를 위해 일하고 Discord에서 질문에 답변한 경험을 바탕으로 아이디어를 테스트했습니다. 이를 통해 다양한 사례와 애플리케이션 크기에 적합한 솔루션을 제공할 수 있었습니다. 나는 자주 배포하고 핵심 API를 동일하게 유지하면서 라이브러리를 발전시켰습니다.

이제 Pinia는 기본 상태 관리 솔루션이 되었으며 Vue 생태계의 다른 핵심 라이브러리와 동일한 RFC 프로세스를 거치며 해당 API는 안정적인 상태에 진입했습니다.

### Vuex 3.x/4.x와 비교

> Vuex 3.x는 Vue 2용이고 Vuex 4.x는 Vue 3용입니다.

Pinia API는 Vuex ≤4와 매우 다릅니다. 즉:

- *변의*는 더 이상 존재하지 않습니다. 이것은 **_매우 말이 많은 것으로_** 종종 인식되었습니다. 이것은 초기에 devtools의 통합을 가져왔지만 더 이상 문제가 되지 않습니다.
- TypeScript를 지원하기 위해 복잡한 사용자 정의 래퍼를 만들 필요가 없으며 모든 것이 유추되고 API는 TS 타입 인터페이스를 최대한 활용하는 방식으로 설계되었습니다.
- 더 이상 문자열로 사용하지 않습니다, 함수를 가져오고, 그것을 호출하고, 자동 완성을 즐기세요!
- 더 이상 동적으로 저장소를 추가할 필요가 없습니다, 기본적으로 모두 동적이며 당신은 눈치채지 못할 것입니다. 언제든지 수동으로 저장소를 사용하여 추가할 수 있고 자동으로 추가되기 때문에 걱정할 필요가 없습니다.
- 더 이상 *modules*의 중첩 구조가 없습니다. 여전히 저장소를 다른 저장소로 가져와 *사용*하여 암묵적으로 중첩시킬 수 있지만 Pinia는 설계에 의해 평면적인 구조를 제공하면서 여전히 저장소 간에 교차 구성을 가능하게 합니다. **상점의 순환 종속성을 가질 수도 있습니다**.
- _namespaced modules_ 이 없습니다. 저장소의 평면 구조를 감안할 때, "네임스페이스" 저장소는 정의된 방식에 내재되어 있으며 모든 저장소가 네임스페이스라고 말할 수 있습니다.

기존 Vuex 4 프로젝트를 Pinia로 변환하는 방법에 대한 자세한 지침은 [Vuex에서 마이그레이션 가이드](./cookbook/migration-vuex.md)를 참고하세요.
