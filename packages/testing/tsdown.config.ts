import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  skipNodeModulesBundle: true,
  dts: true,
  exports: true,
})
