// @ts-check

/** @type {Partial<import('typedoc').TypeDocOptions>} */
const config = {
  name: 'Pinia',
  excludeInternal: true,
  out: 'docs-api',
  entryPoints: [
    'packages/pinia/src/index.ts',
    'packages/testing/src/index.ts',
    'packages/nuxt/src/index.ts',
  ],
}

module.exports = config
