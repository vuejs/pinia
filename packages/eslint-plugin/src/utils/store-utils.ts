/**
 * @fileoverview Store-specific utilities for Pinia ESLint plugin
 */

import type { TSESTree } from '@typescript-eslint/utils'
import { isDefineStoreCall, isSetupStore, getSetupFunction } from './ast-utils'

/**
 * Information about a Pinia store definition
 */
export interface StoreInfo {
  /** The store ID (first argument to defineStore) */
  id: string | null
  /** Whether this is a setup store */
  isSetupStore: boolean
  /** The setup function if this is a setup store */
  setupFunction:
    | TSESTree.FunctionExpression
    | TSESTree.ArrowFunctionExpression
    | null
  /** The variable name the store is assigned to */
  variableName: string | null
}

/**
 * Analyzes a defineStore call and extracts store information
 */
export function analyzeStoreDefinition(
  node: TSESTree.CallExpression
): StoreInfo | null {
  if (!isDefineStoreCall(node)) {
    return null
  }

  // Extract store ID (first argument)
  let id: string | null = null
  if (
    node.arguments.length > 0 &&
    node.arguments[0].type === 'Literal' &&
    typeof node.arguments[0].value === 'string'
  ) {
    id = node.arguments[0].value
  }

  // Check if it's a setup store
  const setupStore = isSetupStore(node)
  const setupFunction = setupStore ? getSetupFunction(node) : null

  return {
    id,
    isSetupStore: setupStore,
    setupFunction,
    variableName: null, // Will be filled by the caller if needed
  }
}

/**
 * Checks if a node represents a store usage (calling a store function)
 */
export function isStoreUsage(node: TSESTree.CallExpression): boolean {
  // Look for patterns like useStore() or useMyStore()
  return (
    node.callee.type === 'Identifier' &&
    node.callee.name.startsWith('use') &&
    node.callee.name.endsWith('Store')
  )
}

/**
 * Extracts the store name from a store usage call
 */
export function getStoreNameFromUsage(
  node: TSESTree.CallExpression
): string | null {
  if (!isStoreUsage(node)) {
    return null
  }

  if (node.callee.type === 'Identifier') {
    return node.callee.name
  }

  return null
}

/**
 * Checks if a variable declaration is a store definition
 */
export function isStoreDefinition(node: TSESTree.VariableDeclarator): boolean {
  return (
    node.init !== null &&
    node.init.type === 'CallExpression' &&
    isDefineStoreCall(node.init)
  )
}
