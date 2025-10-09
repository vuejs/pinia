/**
 * @fileoverview ESLint plugin for Pinia best practices
 * @author Eduardo San Martin Morote
 */

import { requireSetupStorePropertiesExport } from './rules/require-setup-store-properties-export'
import { noCircularStoreDependencies } from './rules/no-circular-store-dependencies'
import { preferUseStoreNaming } from './rules/prefer-use-store-naming'
import { noStoreInComputed } from './rules/no-store-in-computed'
import packageJson from '../package.json'

/**
 * ESLint plugin for Pinia best practices and common patterns.
 *
 * This plugin provides rules to enforce best practices when using Pinia stores,
 * including proper export patterns for setup stores, avoiding circular dependencies,
 * and following naming conventions.
 */
const plugin = {
  meta: {
    name: '@pinia/eslint-plugin',
    version: packageJson.version,
  },
  rules: {
    'require-setup-store-properties-export': requireSetupStorePropertiesExport,
    'no-circular-store-dependencies': noCircularStoreDependencies,
    'prefer-use-store-naming': preferUseStoreNaming,
    'no-store-in-computed': noStoreInComputed,
  },
}

// Flat config export
;(plugin as any).configs = {
  recommended: [
    {
      plugins: { '@pinia': plugin as any },
      rules: {
        '@pinia/require-setup-store-properties-export': 'error',
        '@pinia/no-circular-store-dependencies': 'warn',
        '@pinia/prefer-use-store-naming': 'warn',
        '@pinia/no-store-in-computed': 'error',
      },
    },
  ],
}

export default plugin
