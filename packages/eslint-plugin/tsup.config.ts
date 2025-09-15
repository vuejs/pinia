import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['eslint'],
  target: 'node14',
  splitting: false,
  sourcemap: true,
})
