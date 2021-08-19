import { defineConfig, Plugin } from 'vite'
import _fs from 'fs'
import path from 'path'

const fs = _fs.promises

export default defineConfig({
  plugins: [copyPiniaPlugin()],
  define: {
    __DEV__: 'true',
    __BROWSER__: 'true',
  },
  optimizeDeps: {
    exclude: ['vue-demi', '@vueuse/shared', '@vueuse/core', 'pinia'],
  },
})

function copyPiniaPlugin(): Plugin {
  return {
    name: 'copy-pinia',
    async generateBundle() {
      const filePath = path.resolve(
        __dirname,
        '../pinia/dist/pinia.esm-bundler.js'
      )

      // throws if file doesn't exist
      await fs.access(filePath)

      this.emitFile({
        type: 'asset',
        fileName: 'pinia.esm-bundler.js',
        source: await fs.readFile(filePath, 'utf-8'),
      })
    },
  }
}
