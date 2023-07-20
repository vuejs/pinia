# 핫 모듈 교체 (HMR) %{#hmr-hot-module-replacement}%

Pinia는 핫 모듈 리플레이스먼트(Hot Module Replacement)를 지원하여 페이지를 다시로드하지 않고 스토어를 편집하고 직접 상호작용할 수 있게 해줍니다. 이를 통해 기존 상태를 유지하고 상태, 액션, 게터를 추가하거나 제거할 수 있습니다.

현재로서는 [Vite](https://vitejs.dev/)만 공식적으로 지원하지만, `import.meta.hot` 스펙을 구현하는 모든 번들러(e.g. [webpack](https://webpack.js.org/api/module-variables/#importmetawebpackhot)은 `import.meta.hot` 대신 `import.meta.webpackHot`을 사용하는 것으로 보입니다)을 사용할 수 있습니다.
스토어 정의 다음에 이 코드 스니펫을 추가해야 합니다. `auth.js`, `cart.js`, `chat.js`라는 세 개의 스토어가 있다고 가정해보겠습니다. _스토어 정의_ 생성 후에 다음 코드를 추가하면 됩니다(적용 방식에 맞게 수정 필요):

```js
// auth.js
import { defineStore, acceptHMRUpdate } from 'pinia'

const useAuth = defineStore('auth', {
  // 옵션...
})

// 적절한 스토어 정의를 전달해야 합니다. 이 경우에는 `useAuth`를 사용합니다.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot))
}
```
