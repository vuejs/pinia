export const useSomeStoreStore = defineStore('some-store', () => {
  console.log('I was defined within a nested store directory')
  return {}
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSomeStoreStore, import.meta.hot))
}
