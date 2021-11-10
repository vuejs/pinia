import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  emitCJS: false,
  cjsBridge: true,
  entries: ['src/module', { input: 'src/runtime/', outDir: 'dist/runtime' }],
  externals: ['pinia', '@nuxt/kit-edge', '@nuxt/types'],
})
