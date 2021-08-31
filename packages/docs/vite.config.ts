import { defineConfig, Plugin } from 'vite'
import _fs from 'fs'
import path from 'path'
// import TypeDocPlugin from './vite-typedoc-plugin'

const fs = _fs.promises

export default defineConfig({
  clearScreen: false,
  plugins: [
    ...(process.env.NETLIFY ? [] : [copyPiniaPlugin()]),
    // FIXME: fix vitepress bug of running plugins twice
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
