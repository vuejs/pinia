import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import alias from '@rollup/plugin-alias'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

/** @type {import('rollup').RollupOptions[]} */
const config = ['pinia'].map(createConfig)

export default config

/**
 *
 * @param {string} file
 * @returns {import('rollup').RollupOptions}
 */
function createConfig(file) {
  return {
    external: [
      'vue',
      // this is left to test things
      // '@vue/devtools-api'
    ],
    output: {
      file: resolve(__dirname, `./dist/${file}.js`),
      format: 'esm',
    },
    input: resolve(__dirname, `./src/${file}.js`),
    plugins: [
      alias({
        entries: {
          pinia: resolve(__dirname, '../pinia/dist/pinia.mjs'),
        },
      }),
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
        tsconfig: resolve(__dirname, '../../tsconfig.json'),
        cacheRoot: resolve(__dirname, '../../node_modules/.rts2_cache'),
        tsconfigOverride: {
          compilerOptions: {
            sourceMap: false,
            declaration: false,
            declarationMap: false,
          },
          exclude: ['__tests__', 'test-dts'],
        },
      }),
      nodeResolve(),
      commonjs(),
      terser({
        format: {
          comments: false,
        },
        module: true,
        compress: {
          ecma: 2019,
          pure_getters: true,
        },
      }),
    ],
  }
}
