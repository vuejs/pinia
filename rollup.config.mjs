// @ts-check
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import ts from 'rollup-plugin-typescript2'
import replace from '@rollup/plugin-replace'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import pascalcase from 'pascalcase'
import terser from '@rollup/plugin-terser'
import chalk from 'chalk'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

if (!process.env.TARGET) {
  throw new Error('TARGET package must be specified via --environment flag.')
}

const packagesDir = resolve(__dirname, 'packages')
const packageDir = resolve(packagesDir, process.env.TARGET)

const pkg = JSON.parse(
  readFileSync(resolve(packageDir, `package.json`), 'utf-8')
)
const name = pkg.name

/**
 * Get a comma-separated list of author names from package.json fields.
 * @param {{contributors?: Array<any>, author?: any}} packageInfo
 */
function getAuthors(packageInfo) {
  const { contributors, author } = packageInfo

  const authors = new Set()
  if (contributors && Array.isArray(contributors)) {
    contributors.forEach((contributor) => {
      if (typeof contributor === 'string') {
        authors.add(contributor)
      } else if (contributor && contributor.name) {
        authors.add(contributor.name)
      }
    })
  }

  if (author) {
    if (typeof author === 'string') {
      authors.add(author)
    } else if (author && author.name) {
      authors.add(author.name)
    }
  }

  return Array.from(authors).join(', ')
}

const banner = `/*!
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${getAuthors(pkg)}
 * @license MIT
 */`

// ensure TS checks only once for each build
let hasTSChecked = false

// Provide safe fallbacks when package.json fields are missing
const moduleFile = pkg.module || `dist/${name}.mjs`
const cjsFile =
  pkg.module && pkg.module.replace
    ? pkg.module.replace('mjs', 'cjs')
    : `dist/${name}.cjs`
const unpkgFile = pkg.unpkg || `dist/${name}.iife.js`

/** @typedef {'mjs'|'cjs'|'global'|'browser'} BuildName */

/** @type {Record<BuildName, RollupOutput>} */
const outputConfigs = {
  // each file name has the format: `dist/${name}.${format}.js`
  // format being a key of this object
  mjs: {
    file: moduleFile,
    format: `es`,
  },
  cjs: {
    file: cjsFile,
    format: `cjs`,
  },
  global: {
    file: unpkgFile,
    format: `iife`,
  },
  browser: {
    file: 'dist/pinia.esm-browser.js',
    format: `es`,
  },
}

/**
 * Explicitly type the build keys for TypeScript checking under // @ts-check.
 * This cast is safe because outputConfigs keys are known.
 */
const packageBuilds = /** @type {Array<'mjs'|'cjs'|'global'|'browser'>} */ (
  Object.keys(outputConfigs)
)
const packageConfigs = packageBuilds.map((format) =>
  createConfig(format, outputConfigs[format])
)

// only add the production ready if we are bundling the options
packageBuilds.forEach((buildName) => {
  if (buildName === 'cjs') {
    packageConfigs.push(createProductionConfig(buildName))
  } else if (buildName === 'global') {
    packageConfigs.push(createMinifiedConfig(buildName))
  }
})

export default packageConfigs

/**
 * @typedef {Object} RollupOutput
 * @property {string} file
 * @property {string} format
 * @property {boolean} [sourcemap]
 * @property {string} [banner]
 * @property {boolean} [externalLiveBindings]
 * @property {Record<string,string>} [globals]
 * @property {string} [name]
 */

/**
 * Create a rollup config for a given build format.
 * @param {string} buildName
 * @param {RollupOutput} output
 * @param {Array<any>} [plugins]
 */
function createConfig(buildName, output, plugins = []) {
  if (!output) {
    console.log(chalk.yellow(`invalid format: "${buildName}"`))
    process.exit(1)
  }

  output.sourcemap = !!process.env.SOURCE_MAP
  output.banner = banner
  output.externalLiveBindings = false
  output.globals = {
    vue: 'Vue',
  }

  const isProductionBuild = /\.prod\.[cm]?js$/.test(output.file)
  const isGlobalBuild = buildName === 'global'
  const isRawESMBuild = buildName === 'browser'
  const isNodeBuild = buildName === 'cjs'
  const isBundlerESMBuild = buildName === 'browser' || buildName === 'mjs'

  // --- CHANGE 1: Conditionally add devtoolsApi to globals ---
  // Conditionally add devtoolsApi as a global *only* for the
  // production IIFE build.
  if (isGlobalBuild && isProductionBuild) {
    output.globals['@vue/devtools-api'] = 'devtoolsApi'
  }
  // --- END OF CHANGE 1 ---

  if (isGlobalBuild) output.name = pascalcase(pkg.name)

  const shouldEmitDeclarations = !hasTSChecked

  const tsPlugin = ts({
    check: !hasTSChecked,
    tsconfig: resolve(__dirname, './tsconfig.json'),
    cacheRoot: resolve(__dirname, './node_modules/.rts2_cache'),
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: output.sourcemap,
        declaration: shouldEmitDeclarations,
        declarationMap: shouldEmitDeclarations,
      },
      exclude: ['*.spec.ts', 'packages/*/test-dts', 'packages/*/testing'],
    },
  })
  // we only need to check TS and generate declarations once for each build.
  // it also seems to run into weird issues when checking multiple times
  // during a single build.
  hasTSChecked = true

  // --- CHANGE 2: Conditionally make devtools-api external ---
  // Base external deps
  const external = ['vue']

  // Conditionally add devtools-api as external *only* if it's
  // NOT the dev global build.
  // For the dev global build (non-prod), we want to bundle it.
  if (!isGlobalBuild || isProductionBuild) {
    external.push('@vue/devtools-api')
  }
  // --- END OF CHANGE 2 ---

  const nodePlugins = [nodeResolve(), commonjs()]

  return {
    input: `src/index.ts`,
    // Global and Browser ESM builds inlines everything so that they can be
    // used alone.
    external,
    plugins: [
      tsPlugin,
      createReplacePlugin(
        isProductionBuild,
        isBundlerESMBuild,
        // isBrowserBuild?
        isRawESMBuild,
        isGlobalBuild,
        isNodeBuild
      ),
      ...nodePlugins,
      ...plugins,
    ],
    output,
    // onwarn: (msg, warn) => {
    //   if (!/Circular/.test(msg)) {
    //     warn(msg)
    //   }
    // },
  }
}

/**
 * Create the replace plugin with build-time replacements.
 * @param {boolean} isProduction
 * @param {boolean} isBundlerESMBuild
 * @param {boolean} isRawESMBuild
 * @param {boolean} isGlobalBuild
 * @param {boolean} isNodeBuild
 */
function createReplacePlugin(
  isProduction,
  isBundlerESMBuild,
  isRawESMBuild,
  isGlobalBuild,
  isNodeBuild
) {
  const __DEV__ =
    (isBundlerESMBuild && !isRawESMBuild) || (isNodeBuild && !isProduction)
      ? // preserve to be handled by bundlers
        `(process.env.NODE_ENV !== 'production')`
      : // hard coded dev/prod builds
        JSON.stringify(!isProduction)
  const __FEATURE_PROD_DEVTOOLS__ = isBundlerESMBuild
    ? `(typeof __VUE_PROD_DEVTOOLS__ !== 'undefined' && __VUE_PROD_DEVTOOLS__)`
    : 'false'

  const __TEST__ =
    (isBundlerESMBuild && !isRawESMBuild) || isNodeBuild
      ? `(process.env.NODE_ENV === 'test')`
      : 'false'

  const replacements = {
    __COMMIT__: `"${process.env.COMMIT}"`,
    __VERSION__: `"${pkg.version}"`,
    __USE_DEVTOOLS__: `((${__DEV__} || ${__FEATURE_PROD_DEVTOOLS__}) && !${__TEST__})`,
    __DEV__,
    // this is only used during tests
    __TEST__,
    __FEATURE_PROD_DEVTOOLS__,
    // If the build is expected to run directly in the browser (global / esm builds)
    __BROWSER__: JSON.stringify(isRawESMBuild),
    // is targeting bundlers?
    __BUNDLER__: JSON.stringify(isBundlerESMBuild),
    __GLOBAL__: JSON.stringify(isGlobalBuild),
    // is targeting Node (SSR)?
    __NODE_JS__: JSON.stringify(isNodeBuild),
  }
  // allow inline overrides like
  //__RUNTIME_COMPILE__=true yarn build
  // Cast replacements to a generic record to allow assignment from process.env
  const repls = /** @type {Record<string, any>} */ (replacements)
  Object.keys(repls).forEach((key) => {
    if (key in process.env) {
      repls[key] = process.env[key]
    }
  })

  return replace({
    preventAssignment: true,
    values: replacements,
  })
}

/**
 * @param {BuildName} format
 */
function createProductionConfig(format) {
  const extension = format === 'cjs' ? 'cjs' : 'js'
  const descriptor = format === 'cjs' ? '' : `.${format}`
  return createConfig(format, {
    file: `dist/${name}${descriptor}.prod.${extension}`,
    format: outputConfigs[format].format,
  })
}

/**
 * @param {BuildName} format
 */
function createMinifiedConfig(format) {
  return createConfig(
    format,
    {
      file: `dist/${name}.${format === 'global' ? 'iife' : format}.prod.js`,
      format: outputConfigs[format].format,
    },
    [
      terser({
        module: /^esm/.test(format),
        compress: {
          ecma: 2015,
          pure_getters: true,
        },
      }),
    ]
  )
}
