import { defineConfig, Plugin } from 'vite'
import _fs from 'fs'
import path from 'path'
// import TypeDocPlugin from './vite-typedoc-plugin'

const fs = _fs.promises

export default defineConfig({
  clearScreen: false,
  plugins: [
    // TODO: actual plugin that works well
    // TypeDocPlugin({
    //   name: 'Pinia',
    //   entryPoints: [
    //     path.resolve(__dirname, '../pinia/src/index.ts'),
    //     path.resolve(__dirname, '../testing/src/index.ts'),
    //     path.resolve(__dirname, '../nuxt/src/index.ts'),
    //   ],
    // }),
  ],
  define: {
    __DEV__: 'true',
    __BROWSER__: 'true',
  },
  optimizeDeps: {
    exclude: ['vue-demi', '@vueuse/shared', '@vueuse/core', 'pinia'],
  },
})
