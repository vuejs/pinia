// @ts-check

/** @type {Partial<import('typedoc').TypeDocOptions>} */
const config = {
  name: 'Pinia',
  readme: 'none',
  excludeInternal: true,
  out: 'packages/docs/.vitepress/dist/api',
  entryPoints: [
    'packages/pinia/src/index.ts',
    'packages/testing/src/index.ts',
    'packages/nuxt/src/index.ts',
  ],
}

module.exports = config
