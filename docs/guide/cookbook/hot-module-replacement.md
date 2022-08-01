# 핫 모듈 교체 (HMR) %{#hmr-hot-module-replacement}%

피니아는 핫 모듈 교체(HMR: Hot Module Replacement)를 지원하므로,
페이지를 다시 로드하지 않고도 스토어를 편집하고 앱에서 직접 상호작용할 수 있습니다.
따라서 기존 상태를 유지하면서 상태, 액션, 게터를 추가하거나 제거할 수도 있습니다.

현재 [Vite](https://vitejs.dev/)만 공식적으로 지원되지만,
`import.meta.hot` 사양을 구현하는 모든 번들러가 작동해야 합니다.
(예: [webpack](https://webpack.js.org/api/module-variables/#importmetawebpackhot)은 `import.meta.hot` 대신 `import.meta.webpackHot`를 사용하는 것 같습니다.)
스토어 선언과 함께 이 코드 스니펫을 추가해야 합니다.
`auth.js`, `cart.js`, `chat.js` 세 개의 스토어가 있다고 가정해 보겠습니다.
스토어 정의를 생성한 후 이를 추가(및 조정)해야 합니다:

```js
// auth.js
import { defineStore, acceptHMRUpdate } from 'pinia'

const useAuth = defineStore('auth', {
  // 옵션들...
})

// 이 경우 올바른 스토어 정의인 `useAuth`를 전달해야 함.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot))
}
```