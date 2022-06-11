import { resolve } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias:[
      {
        find: /^@pinia\/(.*?)$/,
        replacement: resolve(__dirname, 'packages/$1/src'),
      },
      {
        find: /^pinia$/,
        replacement: resolve(__dirname, 'packages/pinia/src'),
      },
    ],
  },
  define: {
    __DEV__: true,
    __TEST__: true,
    __BROWSER__: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    reporters: 'dot',
    coverage: {
      reportsDirectory: 'coverage',
      reporter: ['text', 'lcov', 'html'],
      include: [
        'packages/pinia/src/**/*.ts',
        'packages/testing/src/**/*.ts',
        '!packages/testing/**/*.spec.ts',
      ],
      exclude: [
        '/node_modules/',
        'src/index.ts',
        '\\.d\\.ts$',
        'src/devtools',
        'src/hmr',
        'src/deprecated.ts',
        'src/vue2-plugin.ts',
      ],
    },
    include: [
      'packages/pinia/__tests__/**/*.spec.ts',
      'packages/testing/**/*.spec.ts',
    ],
  },
})
