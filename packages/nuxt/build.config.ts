import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  emitCJS: false,
  cjsBridge: true,
  entries: ['src/module'],
  externals: ['pinia', '@nuxt/kit-edge', '@nuxt/types'],
})
