export const useXYZStore = defineStore('xyz', () => {
  const foo = ref<string>('xyz')
  return {
    foo,
  }
})
