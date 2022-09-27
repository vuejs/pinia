---
title: 컴포저블 다루기
---

# 컴포저블 다루기 %{#dealing-with-composables}%

[컴포저블](https://vuejs.kr/guide/reusability/composables.html#composables)은 Vue 컴포지션 API를 활용하여 상태 저장 로직을 캡슐화하고 재사용하는 기능입니다.
직접 작성하든, [외부 라이브러리](https://vueuse.org/)를 사용하든, 둘 다 사용하든, 피니아 스토어에서 컴포저블의 기능을 완전히 사용할 수 있습니다.

## 옵션 스토어 %{#option-stores}%

옵션 스토어를 정의할 때,
`state` 속성 내부에서 컴포저블을 호출할 수 있습니다:

```ts
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: useLocalStorage('pinia/auth/login', 'bob'),
  }),
})
```

**쓰기 가능한(writable) 상태만 반환할 수 있음**(예: `ref()`)을 기억하세요.
다음은 사용할 수 있는 컴포저블의 몇 가지 예입니다:

- [useLocalStorage](https://vueuse.org/core/useLocalStorage/)
- [useAsyncState](https://vueuse.org/core/useAsyncState/)

다음은 옵션 스토어에서 사용할 수 없는 컴포저블의 몇 가지 예입니다(그러나 셋업 스토어에서는 사용할 수 있음):

- [useMediaControls](https://vueuse.org/core/useMediaControls/): 함수 노출
- [useMemoryInfo](https://vueuse.org/core/useMemory/): 읽기 전용 데이터 노출
- [useEyeDropper](https://vueuse.org/core/useEyeDropper/): 읽기 전용 데이터 및 함수 노출

## 셋업 스토어 %{#setup-stores}%

셋업 스토어를 정의할 때,
모든 속성이 상태, 작업 또는 게터로 식별되기 때문에,
거의 모든 컴포저블을 사용할 수 있습니다:

```ts
import { defineStore, skipHydrate } from 'pinia'
import { useMediaControls } from '@vueuse/core'

export const useVideoPlayer = defineStore('video', () => {
  // 이 엘리먼트를 직접 노출하지 않음.
  const videoElement = ref<HTMLVideoElement>()
  const src = ref('/data/video.mp4')
  const { playing, volume, currentTime, togglePictureInPicture } =
    useMediaControls(video, { src })

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

[SSR](/guide/ssr/index.md)을 처리할 때, 스토어 내에서 컴포저블을 사용하기 위해 몇 개의 추가적인 단계를 처리해야 합니다.

[옵션 스토어](#option-stores)에서 `hydrate()` 함수를 정의해야 합니다.
이 함수는 스토어가 생성될 때 사용 가능한 초기 상태가 있는 경우,
클라이언트(브라우저)에서 스토어가 인스턴스화될 때 호출됩니다.
이 함수를 정의해야 하는 이유는 이러한 시나리오에서는 `state()`가 호출되지 않기 때문입니다.

```ts
import { defineStore, skipHydrate } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: useLocalStorage('pinia/auth/login', 'bob'),
  }),

  hydrate(state, initialState) {
    // 이 경우 브라우저로부터 값을 읽고 싶기 때문에
    // 초기 상태를 완전히 무시할 수 있음.
    state.user = useLocalStorage('pinia/auth/login', 'bob')
  },
})
```

[셋업 스토어](#setup-stores)에서 초기 상태에서 선택해서는 안 되는 상태 속성에 대해 `skipHydrate()`라는 헬퍼를 사용해야 합니다.
옵션 스토어와 달리 셋업 스토어는 `state()` 호출을 건너뛸 수 없으므로,
하이드레이트할 수 없는 속성은 `skipHydrate()`로 표시해야 합니다.
이것은 쓰기 가능한 반응형 속성에만 적용됩니다:

```ts
import { defineStore, skipHydrate } from 'pinia'
import { useEyeDropper, useLocalStorage } from '@vueuse/core'

export const useColorStore = defineStore('colors', () => {
  const { isSupported, open, sRGBHex } = useEyeDropper()
  const lastColor = useLocalStorage('lastColor', sRGBHex)
  // ...
  return {
    lastColor: skipHydrate(lastColor), // Ref<string>
    open, // Function
    isSupported, // boolean (반응 안함)
  }
})
```