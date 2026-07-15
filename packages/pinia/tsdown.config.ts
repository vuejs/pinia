import { defineConfig, mergeConfig } from 'tsdown'
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
  entry: {
    pinia: './src/index.ts',
  },
  banner,
  define: {
    __DEV__,
    __TEST__,
    // __VUE_PROD_DEVTOOLS__ is replaced by the vite vue plugin
    __USE_DEVTOOLS__: `((${__DEV__} || __VUE_PROD_DEVTOOLS__) && !${__TEST__})`,
  },
  dts: false,
  fixedExtension: false,
})

const esm = mergeConfig(commonOptions, {
  platform: 'neutral',
  exports: true,
  dts: true,
})

const esmBrowser = mergeConfig(commonOptions, {
  outputOptions: {
    entryFileNames: '[name].esm-browser.js',
  },
  define: {
    __DEV__: 'true',
    __TEST__: 'false',
    __USE_DEVTOOLS__: 'true',
  },
})

const esmBrowserProd = mergeConfig(esmBrowser, {
  target: 'es2015',
  minify: true,
  outputOptions: {
    entryFileNames: '[name].esm-browser.prod.js',
  },
  define: {
    __DEV__: 'false',
    __USE_DEVTOOLS__: 'false',
  },
})

const iife = mergeConfig(commonOptions, {
  format: 'iife',
  deps: {
    alwaysBundle: ['nostics'],
    onlyBundle: ['nostics'],
  },
  outputOptions: {
    name: 'Pinia',
    globals: {
      vue: 'Vue',
      '@vue/devtools-api': 'VueDevToolsApi',
    },
  },
  define: {
    __DEV__: 'true',
    __TEST__: 'false',
    __USE_DEVTOOLS__: 'false',
  },
})

const iifeProd = mergeConfig(iife, {
  deps: {
    // nostics should be stripped in prod
    onlyBundle: [],
  },
  target: 'es2015',
  minify: true,
  outputOptions: {
    entryFileNames: '[name].iife.prod.js',
  },
  define: {
    __DEV__: 'false',
    __USE_DEVTOOLS__: 'false',
  },
})

export default defineConfig([
  //
  esm,
  esmBrowser,
  esmBrowserProd,
  iife,
  iifeProd,
])
