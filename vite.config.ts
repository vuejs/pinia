import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    __DEV__: 'true',
    __BROWSER__: 'true',
    __TEST__: 'false',
  },
  optimizeDeps: {
    exclude: ['vue-demi', '@vueuse/shared', '@vueuse/core'],
  },
})
