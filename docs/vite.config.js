import { defineConfig } from 'vite'

console.log('loaded config')

export default defineConfig({
  define: {
    __DEV__: 'true',
    __BROWSER__: 'true',
  },
})
