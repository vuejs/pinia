<template>
  <button
    class="icon-button"
    @click="isDark = !isDark"
    :aria-label="label"
    :title="label"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="1.2em"
      height="1.2em"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 32 32"
      v-if="!isDark"
    >
      <path
        d="M13.502 5.414a15.075 15.075 0 0 0 11.594 18.194a11.113 11.113 0 0 1-7.975 3.39c-.138 0-.278.005-.418 0a11.094 11.094 0 0 1-3.2-21.584M14.98 3a1.002 1.002 0 0 0-.175.016a13.096 13.096 0 0 0 1.825 25.981c.164.006.328 0 .49 0a13.072 13.072 0 0 0 10.703-5.555a1.01 1.01 0 0 0-.783-1.565A13.08 13.08 0 0 1 15.89 4.38A1.015 1.015 0 0 0 14.98 3z"
        fill="currentColor"
      ></path>
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      width="1.2em"
      height="1.2em"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 32 32"
      v-else
    >
      <path
        d="M16 12.005a4 4 0 1 1-4 4a4.005 4.005 0 0 1 4-4m0-2a6 6 0 1 0 6 6a6 6 0 0 0-6-6z"
        fill="currentColor"
      ></path>
      <path
        d="M5.394 6.813l1.414-1.415l3.506 3.506L8.9 10.318z"
        fill="currentColor"
      ></path>
      <path d="M2 15.005h5v2H2z" fill="currentColor"></path>
      <path
        d="M5.394 25.197L8.9 21.691l1.414 1.415l-3.506 3.505z"
        fill="currentColor"
      ></path>
      <path d="M15 25.005h2v5h-2z" fill="currentColor"></path>
      <path
        d="M21.687 23.106l1.414-1.415l3.506 3.506l-1.414 1.414z"
        fill="currentColor"
      ></path>
      <path d="M25 15.005h5v2h-5z" fill="currentColor"></path>
      <path
        d="M21.687 8.904l3.506-3.506l1.414 1.415l-3.506 3.505z"
        fill="currentColor"
      ></path>
      <path d="M15 2.005h2v5h-2z" fill="currentColor"></path>
    </svg>
  </button>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'

const isBrowser = typeof window !== 'undefined'

const PREFERS_LIGHT = '(prefers-color-scheme: light)'

function isDarkMode() {
  if (!isBrowser) return true

  const storedTheme = localStorage.getItem(storageKey)
  if (storedTheme != null) return storedTheme !== 'light'

  return !window.matchMedia(PREFERS_LIGHT).matches
}

const storageKey = 'pinia-color-scheme'

const localIsDark = ref(isDarkMode())

const isDark = computed<boolean>({
  get() {
    return localIsDark.value
  },
  set(isDark) {
    localStorage.setItem(storageKey, isDark ? 'dark' : 'light')
    localIsDark.value = isDark
  },
})

const label = computed(() =>
  isDark.value ? 'Switch to light mode' : 'Switch to dark mode'
)

onMounted(() => {
  window.addEventListener('storage', () => {
    const storedScheme = localStorage.getItem(storageKey)
    localIsDark.value = storedScheme !== 'light'
  })

  const mediaQuery = window.matchMedia(PREFERS_LIGHT)

  if ('addEventListener' in mediaQuery) {
    mediaQuery.addEventListener('change', (event) => {
      localIsDark.value = !event.matches
    })
  }

  watchEffect(() => {
    const htmlElement = document.body.parentElement!
    if (isDark.value) {
      htmlElement.classList.remove('light')
    } else {
      htmlElement.classList.add('light')
    }
  })
})
</script>

<style scoped>
.icon-button {
  display: flex;
  font-size: 1.05rem;
  border: 0;
  outline: 0;
  background: 0 0;
  color: var(--c-text);
  opacity: 0.8;
  cursor: pointer;
}
</style>
