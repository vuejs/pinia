const { createTypeDocApp } = require('./typedoc-markdown.cjs')
const path = require('path')

createTypeDocApp({
  name: 'API Documentation',
  tsconfig: path.resolve(__dirname, './typedoc.tsconfig.json'),
  // entryPointStrategy: 'packages',
  githubPages: false,
  disableSources: true,
  plugin: ['typedoc-plugin-markdown'],
  entryPoints: [
    path.resolve(__dirname, '../pinia/src/index.ts'),
    path.resolve(__dirname, '../testing/src/index.ts'),
    path.resolve(__dirname, '../nuxt/src/module.ts'),
  ],
}).build()
