/**
 * @fileoverview Type definitions for Pinia ESLint plugin
 */

import type { TSESTree } from '@typescript-eslint/utils'

/**
 * Configuration options for the prefer-use-store-naming rule
 */
export interface PreferUseStoreNamingOptions {
  /** Prefix for store function names (default: 'use') */
  prefix?: string
  /** Suffix for store function names (default: 'Store') */
  suffix?: string
}

/**
 * Information about a Pinia store definition
 */
export interface StoreDefinitionInfo {
  /** The store ID (first argument to defineStore) */
  id: string | null
  /** Whether this is a setup store (function as second argument) */
  isSetupStore: boolean
  /** The setup function if this is a setup store */
  setupFunction:
    | TSESTree.FunctionExpression
    | TSESTree.ArrowFunctionExpression
    | null
  /** The variable name the store is assigned to */
  variableName: string | null
  /** The AST node of the defineStore call */
  node: TSESTree.CallExpression
}

/**
 * Information about declared variables and functions in a setup store
 */
export interface SetupStoreDeclarations {
  /** Names of declared variables */
  variables: string[]
  /** Names of declared functions */
  functions: string[]
  /** All declared names combined */
  all: string[]
}

/**
 * Information about exported properties from a setup store
 */
export interface SetupStoreExports {
  /** Names of exported properties */
  properties: string[]
  /** The return statement node */
  returnStatement: TSESTree.ReturnStatement | null
  /** Whether the return object uses spread syntax */
  hasSpread: boolean
}

/**
 * Store dependency information for circular dependency detection
 */
export interface StoreDependency {
  /** Name of the store that has the dependency */
  storeName: string
  /** Names of stores this store depends on */
  dependencies: string[]
  /** AST nodes where dependencies are used */
  usageNodes: TSESTree.CallExpression[]
}

/**
 * Plugin configuration options
 */
export interface PluginConfig {
  /** Rules configuration */
  rules?: {
    'require-setup-store-properties-export'?: 'error' | 'warn' | 'off'
    'no-circular-store-dependencies'?: 'error' | 'warn' | 'off'
    'prefer-use-store-naming'?:
      | 'error'
      | 'warn'
      | 'off'
      | [string, PreferUseStoreNamingOptions]
    'no-store-in-computed'?: 'error' | 'warn' | 'off'
  }
}

/**
 * ESLint rule context with Pinia-specific utilities
 */
export interface PiniaRuleContext {
  /** Report an error or warning */
  report: (descriptor: any) => void
  /** Get the source code */
  getSourceCode: () => any
  /** Get rule options */
  options: any[]
}
