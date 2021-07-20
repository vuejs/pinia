import path from 'path'
import ts from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'

/** @type {import('rollup').RollupOptions[]} */
const config = ['option-store', 'setup-store'].map(createConfig)

export default config

/**
 *
 * @param {string} file
 * @returns {import('rollup').RollupOptions}
 */
function createConfig(file) {
  return {
    external: ['vue'],
    output: {
      file: path.resolve(__dirname, `./dist/${file}.js`),
      format: 'es',
    },
    input: path.resolve(__dirname, `./${file}.js`),
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          __DEV__: 'false',
          'process.env.NODE_ENV': JSON.stringify('production'),
          // this is only used during tests
          __TEST__: 'false',
          // If the build is expected to run directly in the browser (global / esm builds)
          __BROWSER__: 'true',
          // is targeting bundlers?
          __BUNDLER__: 'false',
          __GLOBAL__: 'false',
          // is targeting Node (SSR)?
          __NODE_JS__: 'false',
          __VUE_PROD_DEVTOOLS__: 'false',
        },
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
}
