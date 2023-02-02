# コンポーザブルへの対応 {#dealing-with-composables}

[コンポーザブル](https://ja.vuejs.org/guide/reusability/composables.html#composables) は、Vue Composition APIを利用して、ステートフルなロジックをカプセル化して再利用するための関数です。自分で書くか、[外部ライブラリ](https://vueuse.org/) を使用するか、またはその両方を行うかにかかわらず、pinia ストアで Composables の力を十分に活用することができます。

## Option ストア {#option-stores}

Option ストアを定義する場合、`state` プロパティの内部でコンポーザブルを呼び出すことができます:

```ts
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: useLocalStorage('pinia/auth/login', 'bob'),
  }),
})
```

**書き込み可能なステートしか返せない**（例: `ref()`）ことに留意してください。以下に、使用できるコンポーザブルの例を示します:

- [useLocalStorage](https://vueuse.org/core/useLocalStorage/)
- [useAsyncState](https://vueuse.org/core/useAsyncState/)

ここでは、Option ストアで使用できない（Setup ストアでは使用できる）コンポーザブルの例を紹介します:

- [useMediaControls](https://vueuse.org/core/useMediaControls/): exposes functions
- [useMemoryInfo](https://vueuse.org/core/useMemory/): exposes readonly data
- [useEyeDropper](https://vueuse.org/core/useEyeDropper/): exposes readonly data and functions

## Setup ストア {#setup-stores}

一方、Setup ストアの定義では、すべてのプロパティがステート、アクション、ゲッターに区別されるため、ほぼすべてのコンポーザブルを使用することができます:

```ts
import { defineStore, skipHydrate } from 'pinia'
import { useMediaControls } from '@vueuse/core'

export const useVideoPlayer = defineStore('video', () => {
  // we won't expose this element directly
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

## SSR {#ssr}

[Server Side Rendering](../ssr/index.md) を扱う場合、ストア内でコンポーザブルを使用するために、いくつかの追加手順を行う必要があります。

[Option ストア](#option-stores) では、`hydrate()` 関数を定義する必要があります。この関数は、ストアがクライアント（ブラウザ）上でインスタンス化されるとき、ストアが作成された時点で利用可能な初期状態がある場合に呼び出されます。この関数を定義する必要があるのは、このようなシナリオでは `state()` が呼び出されないからです。

```ts
import { defineStore, skipHydrate } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: useLocalStorage('pinia/auth/login', 'bob'),
  }),

  hydrate(state, initialState) {
    // in this case we can completely ignore the initial state since we
    // want to read the value from the browser
    state.user = useLocalStorage('pinia/auth/login', 'bob')
  },
})
```

[Setup ストア](#setup-stores) では、初期状態からピックアップされるべきではないステートのプロパティに対して `skipHydrate()` という名前のヘルパーを使用する必要があります。Option ストアとは異なり、Setup ストアは単に _`state()` の呼び出しをスキップ_ することはできませんので、`skipHydrate()` でハイドレートできないプロパティをマークします。これは書き込み可能なリアクティブプロパティにのみ適用されることに注意してください:

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
    isSupported, // boolean (not even reactive)
  }
})
```
