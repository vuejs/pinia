# Composables 다루기 %{#dealing-with-composables}%

[Composables](https://vuejs.org/guide/reusability/composables.html#composables)은 상태 로직을 캡슐화하고 재사용하기 위해 Vue Composition API를 활용하는 함수입니다. 직접 작성하거나 [외부 라이브러리](https://vueuse.org/)를 사용하든지 상관없이, Pinia 스토어에서 Composables의 강력한 기능을 완전히 활용할 수 있습니다.

## 옵션 스토어 %{#option-stores}%

옵션 스토어를 정의할 때는 `state` 속성 내에서 Composable을 호출할 수 있습니다:

```ts
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: useLocalStorage('pinia/auth/login', 'bob'),
  }),
})
```

**쓰기 가능한 상태(writable state)만 반환할 수 있다는 점**을 유의하세요 (예: `ref()`). 다음은 사용할 수 있는 몇 가지 Composable 예시입니다:

- [useLocalStorage](https://vueuse.org/core/useLocalStorage/)
- [useAsyncState](https://vueuse.org/core/useAsyncState/)

다음은 옵션 스토어에서 사용할 수 없지만, Setup 스토어는 사용할 수 있는 Composable 예시입니다:

- [useMediaControls](https://vueuse.org/core/useMediaControls/): 함수를 노출합니다.
- [useMemoryInfo](https://vueuse.org/core/useMemory/): 읽기 전용 데이터를 노출합니다.
- [useEyeDropper](https://vueuse.org/core/useEyeDropper/): 읽기 전용 데이터와 함수를 노출합니다.

## Setup 스토어 %{#setup-stores}%

반면에, Setup 스토어를 정의할 때는 각 속성이 상태(state), 액션(action), 또는 게터(getter)로 구분되므로 거의 모든 Composable을 사용할 수 있습니다:

```ts
import { defineStore, skipHydrate } from 'pinia'
import { useMediaControls } from '@vueuse/core'

export const useVideoPlayer = defineStore('video', () => {
  // 이 요소를 직접 노출하지 않습니다
  const videoElement = ref<HTMLVideoElement>()
  const src = ref('/data/video.mp4')
  const { playing, volume, currentTime, togglePictureInPicture } =
    useMediaControls(videoElement, { src })

  function loadVideo(element: HTMLVideoElement, src: string) {
    videoElement.value = element
    src.value = src
  }

  return {
    src,
    playing,
    volume,
    currentTime,

    loadVideo,
    togglePictureInPicture,
  }
})
```

## SSR

[Server Side Rendering](../ssr/index.md)을 다룰 때는 스토어 내에서 Composable을 사용하기 위해 몇 가지 추가 단계를 고려해야 합니다.

[옵션 스토어](#option-stores)에서는 `hydrate()` 함수를 정의해야 합니다. 이 함수는 스토어가 클라이언트(브라우저)에서 인스턴스화될 때 호출되며, 스토어가 생성될 때 초기 상태가 사용 가능한 경우에 호출됩니다. 이러한 시나리오에서는 `state()`가 호출되지 않기 때문에 이 함수를 정의해야 합니다.

```ts
import { defineStore, skipHydrate } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: useLocalStorage('pinia/auth/login', 'bob'),
  }),

  hydrate(state, initialState) {
    // 이 경우에는 초기 상태를 완전히 무시할 수 있으므로
    // 브라우저에서 값을 읽고자 합니다
    state.user = useLocalStorage('pinia/auth/login', 'bob')
  },
})
```

[Setup 스토어](#setup-stores)에서는 초기 상태에서 가져오지 않아야 하는 상태 속성에 `skipHydrate()` 도우미(helper)를 사용해야 합니다. 옵션 스토어와 달리 Setup 스토어는 단순히 `state()` 호출을 건너뛸 수 없기 때문에 초기 상태로부터 가져올 수 없는 속성을 `skipHydrate()`로 표시합니다. 이는 쓰기 가능한 반응형 속성에만 적용됩니다:

```ts
import { defineStore, skipHydrate } from 'pinia'
import { useEyeDropper, useLocalStorage } from '@vueuse/core'

export const useColorStore = defineStore('colors', () => {
  const { isSupported, open, sRGBHex } = useEyeDropper()
  const lastColor = useLocalStorage('lastColor', sRGBHex)
  // ...
  return {
    lastColor: skipHydrate(lastColor), // Ref<string>
    open, // 함수
    isSupported, // boolean (반응형 아님)
  }
})
```
