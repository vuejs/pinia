/// <reference types="vitest" />
import { defineConfig } from 'vite'
export default defineConfig({
  define: {
    __DEV__: true,
    __TEST__: true,
    __BROWSER__: true,
  },
  test: {
    coverage: {
      reporter: ['html', 'lcov', 'text'],
      include: ['packages/pinia/src/**/*.ts', 'packages/testing/src/**/*.ts'],
      exclude: [
        '**/src/index.ts',
        '**/*.d.ts',
        '**/src/devtools',
        '**/src/hmr.ts',
        '**/src/deprecated.ts',
        '**/src/vue2-plugin.ts',
      ],
    },
    environment: 'happy-dom',
    globals: true, // Specifically to make createTestingPinia happy
  },
})
