import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('layer-settings', () => {
  const theme = ref('dark')

  return { theme }
})
