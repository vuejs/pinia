# Робота з композиційними функціями %{#dealing-with-composables}%

[Композиційні функції](https://vuejs.org/guide/reusability/composables.html#composables) - це функції, які використовують композиційний API Vue для інкапсуляції та повторного використання логіки стану. Незалежно від того, чи пишете ви власну, використовуєте [зовнішні бібліотеки](https://vueuse.org/), чи робите і те, і інше, ви можете повністю використовувати потужність композиційних функцій у своїх сховищах pinia.

## Опційні сховища %{#option-stores}%

Визначаючи опційне сховище, ви можете викликати композиційну функцію всередині властивості `state`:

```ts
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: useLocalStorage('pinia/auth/login', 'bob'),
  }),
})
```

Майте на увазі, що **ви можете повернути лише стан, доступний для запису** (наприклад, `ref()`). Ось кілька прикладів композиційних функцій, які можна використовувати:

- [useLocalStorage](https://vueuse.org/core/useLocalStorage/)
- [useAsyncState](https://vueuse.org/core/useAsyncState/)

Ось кілька прикладів композиційних функцій, які не можна використовувати в опційних сховищах (але можна використовувати з setup сховищами):

- [useMediaControls](https://vueuse.org/core/useMediaControls/): розкриває функції
- [useMemoryInfo](https://vueuse.org/core/useMemory/): розкриває дані лише для читання
- [useEyeDropper](https://vueuse.org/core/useEyeDropper/): відкриває дані та функції лише для читання

## Setup сховища %{#setup-stores}%

З іншого боку, при визначенні setup сховища ви можете використовувати майже будь-який композиційні функції, оскільки кожна властивість розпізнається як стан, дія чи гетер:

```ts
import { defineStore, skipHydrate } from 'pinia'
import { useMediaControls } from '@vueuse/core'

export const useVideoPlayer = defineStore('video', () => {
  // ми не розкриваємо цей елемент безпосередньо
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

## SSR %{#ssr}%

Коли ви маєте справу з [Рендерингом на стороні серверу](../ssr/index.md), вам потрібно подбати про деякі додаткові кроки, щоб використовувати композиційні функції у своїх сховищах.

У [Опційних сховищах](#option-stores), вам треба визначити функцію `hydrate()`. Ця функція викликається, коли екземпляр сховища створюється на клієнті (браузері), коли на момент створення сховища доступний початковий стан. Причина, чому нам потрібно визначити цю функцію, полягає в тому, що в такому сценарії `state()` не викликається.

```ts
import { defineStore, skipHydrate } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: useLocalStorage('pinia/auth/login', 'bob'),
  }),

  hydrate(state, initialState) {
    // у цьому випадку ми можемо повністю ігнорувати початковий стан, оскільки
    // ми хочемо прочитати значення з браузера
    state.user = useLocalStorage('pinia/auth/login', 'bob')
  },
})
```

У [Setup сховищах](#setup-stores), вам потрібно використовувати помічник під назвою `skipHydrate()` для будь-якої властивості стану, яку не слід отримувати з початкового стану. На відміну від сховищ параметрів, опційні сховища не можуть просто _пропустити виклик `state()`_, тому ми позначаємо властивості, які не можна гідратувати за допомогою `skipHydrate()`. Зверніть увагу, що це стосується лише реактивних властивостей, доступних для запису:

```ts
import { defineStore, skipHydrate } from 'pinia'
import { useEyeDropper, useLocalStorage } from '@vueuse/core'

export const useColorStore = defineStore('colors', () => {
  const { isSupported, open, sRGBHex } = useEyeDropper()
  const lastColor = useLocalStorage('lastColor', sRGBHex)
  // ...
  return {
    lastColor: skipHydrate(lastColor), // Ref<string>
    open, // function
    isSupported, // boolean (навіть не реактивне)
  }
})
```
