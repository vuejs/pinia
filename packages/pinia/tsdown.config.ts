import { defineConfig } from 'tsdown'
import pkg from './package.json' with { type: 'json' }

const banner = `
/*!
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} Eduardo San Martin Morote
 * @license MIT
 */
`.trim()

const __DEV__ = `(process.env.NODE_ENV !== 'production')`
const __TEST__ = `(process.env.NODE_ENV === 'test')`

const commonOptions = defineConfig({
  banner,
  format: ['esm'],
  entry: {
    pinia: './src/index.ts',
  },
  define: {
    __DEV__,
    __TEST__,
    // __VUE_PROD_DEVTOOLS__ is replaced by the vite vue plugin
    __USE_DEVTOOLS__: `((${__DEV__} || __VUE_PROD_DEVTOOLS__) && !${__TEST__})`,
  },
  dts: false,
})

const esm = defineConfig({
  ...commonOptions,
  platform: 'neutral',
  dts: true,
  outputOptions: {
    entryFileNames: ({ name }) => `${name}.mjs`.replace('.d.mjs', '.d.ts'),
  },
})

const esmBrowser = defineConfig({
  ...commonOptions,
  outputOptions: {
    entryFileNames: '[name].esm-browser.js',
  },
  define: {
    ...commonOptions.define,
    __DEV__: 'true',
    __TEST__: 'false',
    __USE_DEVTOOLS__: 'true',
  },
})

const esmBrowserProd = defineConfig({
  ...esmBrowser,
  target: 'es2015',
  minify: true,
  outputOptions: {
    entryFileNames: '[name].esm-browser.prod.js',
  },
  define: {
    ...esmBrowser.define,
    __DEV__: 'false',
    __USE_DEVTOOLS__: 'false',
  },
})

const cjs = defineConfig({
  ...commonOptions,
  format: 'cjs',
  outputOptions: {
    entryFileNames: '[name].cjs',
  },
  define: {
    ...commonOptions.define,
    __USE_DEVTOOLS__: 'false',
  },
})

const cjsProd = defineConfig({
  ...cjs,
  outputOptions: {
    entryFileNames: '[name].prod.cjs',
  },
  define: {
    ...cjs.define,
    __DEV__: 'false',
    __TEST__: 'false',
  },
})

const iife = defineConfig({
  ...commonOptions,
  format: 'iife',
  outputOptions: {
    name: 'Pinia',
    globals: {
      vue: 'Vue',
      '@vue/devtools-api': 'VueDevToolsApi',
    },
  },
  define: {
    ...commonOptions.define,
    __DEV__: 'true',
    __TEST__: 'false',
    __USE_DEVTOOLS__: 'true',
  },
})

const iifeProd = defineConfig({
  ...iife,
  target: 'es2015',
  minify: true,
  outputOptions: {
    ...iife.outputOptions,
    entryFileNames: '[name].iife.prod.js',
  },
  define: {
    ...iife.define,
    __DEV__: 'false',
    __USE_DEVTOOLS__: 'false',
  },
})

export default [esm, esmBrowser, esmBrowserProd, cjs, cjsProd, iife, iifeProd]
