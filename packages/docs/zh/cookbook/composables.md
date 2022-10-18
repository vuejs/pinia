# 处理组合式函数 {#dealing-with-composables}

[组合式函数](https://vuejs.org/guide/reusability/composables.html#composables)是利用 Vue 组合式 API 来封装和复用有状态逻辑的函数。无论你是自己写，还是使用[外部库](https://vueuse.org/)，或者两者兼而有之，你都可以在 pinia store 中充分发挥组合式函数的力量。

## Option Stores {#option-stores}

当定义一个 option store 时，你可以在 `state` 属性中调用组合式函数：

```ts
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: useLocalStorage('pinia/auth/login', 'bob'),
  }),
})
```

请记住，**你只能返回可写的状态**（例如，一个 `ref()`）。下面是一些可用的组合式函数的示例：

- [useLocalStorage](https://vueuse.org/core/useLocalStorage/)
- [useAsyncState](https://vueuse.org/core/useAsyncState/)

下面是一些不可在 option store 中使用的组合式函数（但可在 setup store 中使用）：

- [useMediaControls](https://vueuse.org/core/useMediaControls/): exposes functions
- [useMemoryInfo](https://vueuse.org/core/useMemory/): exposes readonly data
- [useEyeDropper](https://vueuse.org/core/useEyeDropper/): exposes readonly data and functions

## Setup Stores {#setup-stores}

另外，当定义一个 setup store 时，你几乎可以使用任何组合式函数，因为每一个属性都会被辨别为 state 、action 或者 getter：

```ts
import { defineStore, skipHydrate } from 'pinia'
import { useMediaControls } from '@vueuse/core'

export const useVideoPlayer = defineStore('video', () => {
  // 我们不会直接暴露这个元素
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

## 服务端渲染 {#ssr}

当处理[服务端渲染](../ssr/index.md)时，你有一些需要额外注意的内容，以便在 store 中使用组合式函数。

在 [Option Store](#option-stores) 中，你需要定义一个 `hydrate()` 函数。当 store 在客户端（浏览器）上被实例化的过程中，创建 store 时有一个可用的初始状态时，这个函数就会被调用。我们需要定义这个函数的原因是，在这种情况下，`state()` 是不会被调用的。

```ts
import { defineStore, skipHydrate } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: useLocalStorage('pinia/auth/login', 'bob'),
  }),

  hydrate(state, initialState) {
    // 在这种情况下，我们可以完全忽略初始状态
    // 因为我们想从浏览器中读取数值。
    state.user = useLocalStorage('pinia/auth/login', 'bob')
  },
})
```

在 [Setup Store](#setup-stores) 中，对于任何不应该从初始状态中接收的 state 属性 你都需要使用一个名为 `skipHydrate()` 的辅助函数。与 option store 不同，setup store 不能直接**跳过调用 `state()`**，所以我们用 `skipHydrate()` 标记那些不能被 hydrated 的属性。请注意，这只适用于可写的响应式属性：

```ts
import { defineStore, skipHydrate } from 'pinia'
import { useEyeDropper, useLocalStorage } from '@vueuse/core'

const useColorStore = defineStore('colors', () => {
  const { isSupported, open, sRGBHex } = useEyeDropper()
  const lastColor = useLocalStorage('lastColor', sRGBHex)
  // ...
  return {
    lastColor: skipHydrate(pickedColor), // Ref<string>
    open, // Function
    isSupported, // boolean (非响应式)
  }
})
```
