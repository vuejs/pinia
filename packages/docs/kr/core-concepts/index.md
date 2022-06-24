# Store 정의

<VueSchoolLink
  href="https://vueschool.io/lessons/define-your-first-pinia-store"
  title="Learn how to define and use stores in Pinia"
/>

핵심 개념에 대해 알아보기 전에 저장소가 `defineStore()`를 사용하여 정의되고 첫 번째 인수로 전달되는 **고유한** 이름이 필요하다는 것을 알아야 합니다:

```js
import { defineStore } from 'pinia'

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useStore = defineStore('main', {
  // other options...
})
```

*id*라고도 하는 *name*이 필요하며, Pinia에서 스토어를 devtools에 연결하는 데 사용됩니다. 반환된 함수의 이름을 *use...*으로 지정하는 것은 사용법을 관용적으로 만들기 위한 composable 전반에 걸친 규칙입니다.

## 저장소 사용하기

`setup()` 내부에서 `useStore()`가 호출될 때까지 스토어가 생성되지 않기 때문에 우리는 저장소를 *정의*하고 있습니다:

```js
import { useStore } from '@/stores/counter'

export default {
  setup() {
    const store = useStore()

    return {
      // you can return the whole store instance to use it in the template
      store,
    }
  },
}
```

원하는 만큼 상점을 정의할 수 있으며 pinia를 최대한 활용하려면 (자동으로 번들이 코드 분할을 허용하거나 Typescript 추론하는 등등...) **각 상점을 다른 파일에 정의**해야 합니다.

아직 `setup` 컴포넌트를 사용하지 않는 경우에도 [*map helpers*와 함께 Pinia를 사용할 수 있습니다](../cookbook/options-api.md).

상점이 인스턴스화되면 상점에서 직접 'state', 'getters' 및 'actions'에 정의된 모든 속성에 액세스할 수 있습니다. 다음 페이지에서 자세히 살펴보겠지만 자동 완성이 도움이 될 것입니다.

`store`는 `reactive`로 래핑된 객체입니다. 즉, getter 뒤에 `.value`를 쓸 필요가 없지만 `setup`의 `props`와 같이 **구조화할 수 없습니다**:

```js
export default defineComponent({
  setup() {
    const store = useStore()
    // ❌ This won't work because it breaks reactivity
    // it's the same as destructuring from `props`
    const { name, doubleCount } = store

    name // "eduardo"
    doubleCount // 2

    return {
      // will always be "eduardo"
      name,
      // will always be 2
      doubleCount,
      // this one will be reactive
      doubleValue: computed(() => store.doubleCount),
    }
  },
})
```

반응성을 유지하면서 저장소에서 속성을 추출하려면 `storeToRefs()`를 사용해야 합니다. 이것은 모든 반응 속성에 대한 참조를 생성합니다. 이것은 저장소의 상태만 사용하고 작업을 호출하지 않을 때 유용합니다. 저장소 자체에도 바인딩되므로 저장소에서 직접 작업을 구조화할 수 있습니다:

```js
import { storeToRefs } from 'pinia'

export default defineComponent({
  setup() {
    const store = useStore()
    // `name` and `doubleCount` are reactive refs
    // This will also create refs for properties added by plugins
    // but skip any action or non reactive (non ref/reactive) property
    const { name, doubleCount } = storeToRefs(store)
    // the increment action can be just extracted
    const { increment } = store

    return {
      name,
      doubleCount,
      increment,
    }
  },
})
```
