# Работа с Composables

[Composables](https://vuejs.org/guide/reusability/composables.html#composables) - это функции, использующие Vue Composition API для инкапсуляции и повторного использования stateful логики. Независимо от того, будете ли вы писать свои собственные, использовать [внешние библиотеки](https://vueuse.org/) или делать и то, и другое, вы сможете полностью использовать возможности Composables в своих хранилищах состояний pinia.

## Хранилища опций

При определении хранилища опций вы можете вызвать композит внутри свойства `state`:

```ts
export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: useLocalStorage('pinia/auth/login', 'bob'),
    }),
})
```

Помните, что **вы можете возвращать только записываемое состояние** (например, `ref()`). Вот несколько примеров composables, которые вы можете использовать:

-   [useLocalStorage](https://vueuse.org/core/useLocalStorage/)
-   [useAsyncState](https://vueuse.org/core/useAsyncState/)

Вот некоторые примеры composables, которые нельзя использовать в опционных хранилищах (но можно использовать в хранилищах настроек):

-   [useMediaControls](https://vueuse.org/core/useMediaControls/): раскрывает функции
-   [useMemoryInfo](https://vueuse.org/core/useMemory/): раскрывает данные, доступные только для чтения
-   [useEyeDropper](https://vueuse.org/core/useEyeDropper/): раскрывает данные и функции, доступные только для чтения

## Хранилища настроек

С другой стороны, при определении хранилища настроек вы можете использовать практически любой composable, так как каждое свойство разграничивается на состояние, действие или геттер:

```ts
import { defineStore, skipHydrate } from 'pinia'
import { useMediaControls } from '@vueuse/core'

export const useVideoPlayer = defineStore('video', () => {
    // мы не будем выставлять этот элемент напрямую
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

При работе с [Server Side Rendering](../ssr/index.md) вам необходимо выполнить несколько дополнительных шагов, чтобы использовать composables в своих хранилищах.

В [Option Stores](#option-stores) необходимо определить функцию `hydrate()`. Эта функция вызывается при инстанцировании хранилища на клиенте (браузере), когда имеется начальное состояние, доступное на момент создания хранилища. Причина, по которой нам нужно определить эту функцию, заключается в том, что в таком сценарии функция `state()` не вызывается.

```ts
import { defineStore, skipHydrate } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: useLocalStorage('pinia/auth/login', 'bob'),
    }),

    hydrate(state, initialState) {
        // в этом случае мы можем полностью игнорировать начальное состояние, поскольку мы
        // хотим прочитать значение из браузера
        state.user = useLocalStorage('pinia/auth/login', 'bob')
    },
})
```

В [Setup Stores](#setup-stores) необходимо использовать хелпер `skipHydrate()` для любого свойства состояния, которое не должно быть подхвачено из начального состояния. В отличие от хранилищ опций, хранилища настроек не могут просто _пропустить вызов `state()`_, поэтому мы помечаем свойства, которые не могут быть гидратированы, с помощью `skipHydrate()`. Обратите внимание, что это относится только к записываемым реактивным свойствам:

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
