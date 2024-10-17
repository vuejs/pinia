import { ref } from 'vue'

export const useLayerStore = defineStore('layerStore', () => {
  console.log('I was defined within a stores directory in example-layer')
  const state = ref('store state')
  return {
    state,
  }
})
