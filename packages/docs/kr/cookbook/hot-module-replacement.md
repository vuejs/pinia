# HMR (Hot Module Replacement)

Pinia는 핫 모듈 교체를 지원합니다. 따라서 페이지를 새로고침하지 않고 앱에서 직접 상점을 편집하고 상호작용할 수 있으므로 기존 상태를 유지한채로 상태, 액션 및 getter를 추가하거나 제거할 수 있습니다.

현재 [Vite](https://vitejs.dev/)만 공식적으로 지원되지만 `import.meta.hot` 사양을 구현하는 모든 번들러가 작동해야 합니다(예: [webpack](https://webpack.js.org/api/module-variables/#importmetawebpackhot)은 `import.meta.hot` 대신 `import.meta.webpackHot`를 사용하는 것 같습니다). 저장소 선언 옆에 이 코드 스니펫을 추가해야 합니다. `auth.js`, `cart.js`, `chat.js`의 세 가지 저장소가 있다고 가정해 보겠습니다. *store definition*를 생성한 후 이를 추가(및 조정)해야 합니다.

```js
// auth.js
import { defineStore, acceptHMRUpdate } from 'pinia'

const useAuth = defineStore('auth', {
  // options...
})

// 이 경우 올바른 저장소 정의인 `useAuth`를 전달해야 합니다.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuth, import.meta.hot))
}
```
