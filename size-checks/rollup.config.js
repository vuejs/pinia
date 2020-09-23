import path from 'path'
import ts from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

/** @type {import('rollup').RollupOptions} */
const config = {
  external: ['vue'],
  output: {
    file: path.resolve(__dirname, './dist/small.js'),
    format: 'es',
  },
  input: path.resolve(__dirname, './small.js'),
  plugins: [
    replace({
      __DEV__: false,
      // this is only used during tests
      __TEST__: false,
      // If the build is expected to run directly in the browser (global / esm builds)
      __BROWSER__: true,
      // is targeting bundlers?
      __BUNDLER__: false,
      __GLOBAL__: false,
      // is targeting Node (SSR)?
      __NODE_JS__: false,
      __VUE_PROD_DEVTOOLS__: false,
    }),
    ts({
      check: false,
      tsconfig: path.resolve(__dirname, '../tsconfig.json'),
      cacheRoot: path.resolve(__dirname, '../node_modules/.rts2_cache'),
      tsconfigOverride: {
        compilerOptions: {
          sourceMap: false,
          declaration: false,
          declarationMap: false,
        },
        exclude: ['__tests__', 'test-dts'],
      },
    }),
    resolve(),
    commonjs(),
    terser({
      format: {
        comments: false,
      },
      module: true,
      compress: {
        ecma: 2015,
        pure_getters: true,
      },
    }),
  ],
}

export default config
