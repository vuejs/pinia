import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  rollup: {
    emitCJS: false,
    cjsBridge: true,
  },
  entries: ['src/module', 'src/templates/plugin'],
  externals: ['pinia', '@nuxt/kit-edge', '@nuxt/types'],
})
