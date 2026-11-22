import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createTypeDocApp } from './typedoc-markdown.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

createTypeDocApp({
  textContentMappings: {
    'title.indexPage': 'API Reference',
    'title.memberPage': '{name}',
  },
  tsconfig: path.resolve(__dirname, './typedoc.tsconfig.json'),
  // entryPointStrategy: 'packages',
  categorizeByGroup: true,
  githubPages: false,
  readme: 'none',
  indexFormat: 'table',
  disableSources: true,
  plugin: ['typedoc-plugin-markdown', 'typedoc-vitepress-theme'],
  useCodeBlocks: true,
  entryPoints: [
    path.resolve(__dirname, '../pinia/src/index.ts').replaceAll('\\', '/'),
    path.resolve(__dirname, '../testing/src/index.ts').replaceAll('\\', '/'),
    path.resolve(__dirname, '../nuxt/src/module.ts').replaceAll('\\', '/'),
  ],
}).then((app) => app.build())
