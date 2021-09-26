const { createTypeDocApp } = require('./typedoc-markdown')
const path = require('path')

createTypeDocApp({
  name: 'API Documentation',
  entryPoints: [
    path.resolve(__dirname, '../pinia/src/index.ts'),
    path.resolve(__dirname, '../testing/src/index.ts'),
    path.resolve(__dirname, '../nuxt/src/index.ts'),
  ],
  entryPointStrategy: 'packages',
}).build()
