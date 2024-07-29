export const useExampleStore = defineStore('example', () => {
  const example = ref<number>(3)
  return {
    example,
  }
})
