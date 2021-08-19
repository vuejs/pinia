import { useDark } from '@vueuse/core'

export const isDark = useDark({
  storageKey: 'pinia-color-scheme',
  valueLight: 'light',
})
