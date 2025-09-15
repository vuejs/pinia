/**
 * @fileoverview Rule to detect circular dependencies between stores
 * @author Eduardo San Martin Morote
 */

import { ESLintUtils, type TSESTree } from '@typescript-eslint/utils'
import {
  isDefineStoreCall,
  isSetupStore,
  getSetupFunction,
} from '../utils/ast-utils'
import { isStoreUsage, getStoreNameFromUsage } from '../utils/store-utils'

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://pinia.vuejs.org/cookbook/eslint-plugin.html#${name}`
)

/**
 * Rule to detect potential circular dependencies between stores.
 *
 * Circular dependencies can cause issues in Pinia stores, especially when
 * stores try to access each other's state during initialization.
 */
export const noCircularStoreDependencies = createRule({
  name: 'no-circular-store-dependencies',
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow circular dependencies between stores',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      circularDependency:
        'Potential circular dependency detected: store "{{currentStore}}" uses "{{usedStore}}"',
      setupCircularDependency:
        'Avoid using other stores directly in setup function body. Use them in computed properties or actions instead.',
    },
  },
  defaultOptions: [],
  create(context) {
    const storeUsages = new Map<string, string[]>() // currentStore -> [usedStores]
    let currentStoreName: string | null = null

    return {
      CallExpression(node: TSESTree.CallExpression) {
        // Track defineStore calls to identify current store
        if (isDefineStoreCall(node)) {
          // Get store name from variable assignment
          const parent = node.parent
          if (
            parent?.type === 'VariableDeclarator' &&
            parent.id.type === 'Identifier'
          ) {
            currentStoreName = parent.id.name

            // Initialize usage tracking for this store
            if (!storeUsages.has(currentStoreName)) {
              storeUsages.set(currentStoreName, [])
            }

            // Check for store usage in setup function
            if (isSetupStore(node)) {
              const setupFunction = getSetupFunction(node)
              if (setupFunction) {
                checkSetupFunctionForStoreUsage(
                  setupFunction,
                  currentStoreName,
                  context
                )
              }
            }
          }
        }

        // Track store usage calls
        if (isStoreUsage(node) && currentStoreName) {
          const usedStoreName = getStoreNameFromUsage(node)
          if (usedStoreName && usedStoreName !== currentStoreName) {
            const usages = storeUsages.get(currentStoreName) || []
            if (!usages.includes(usedStoreName)) {
              usages.push(usedStoreName)
              storeUsages.set(currentStoreName, usages)
            }

            // Check for immediate circular dependency
            const usedStoreUsages = storeUsages.get(usedStoreName) || []
            if (usedStoreUsages.includes(currentStoreName)) {
              context.report({
                node,
                messageId: 'circularDependency',
                data: {
                  currentStore: currentStoreName,
                  usedStore: usedStoreName,
                },
              })
            }
          }
        }
      },

      'Program:exit'() {
        // Check for indirect circular dependencies
        checkIndirectCircularDependencies(storeUsages, context)
      },
    }
  },
})

/**
 * Checks setup function for direct store usage in the function body
 */
function checkSetupFunctionForStoreUsage(
  setupFunction: TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression,
  currentStoreName: string,
  context: any
) {
  if (setupFunction.body.type !== 'BlockStatement') {
    return
  }

  // Look for store usage calls in the top level of setup function
  for (const statement of setupFunction.body.body) {
    if (statement.type === 'VariableDeclaration') {
      for (const declarator of statement.declarations) {
        if (
          declarator.init?.type === 'CallExpression' &&
          isStoreUsage(declarator.init)
        ) {
          context.report({
            node: declarator.init,
            messageId: 'setupCircularDependency',
          })
        }
      }
    } else if (
      statement.type === 'ExpressionStatement' &&
      statement.expression.type === 'CallExpression' &&
      isStoreUsage(statement.expression)
    ) {
      context.report({
        node: statement.expression,
        messageId: 'setupCircularDependency',
      })
    }
  }
}

/**
 * Checks for indirect circular dependencies (A -> B -> C -> A)
 */
function checkIndirectCircularDependencies(
  storeUsages: Map<string, string[]>,
  context: any
) {
  const visited = new Set<string>()
  const recursionStack = new Set<string>()

  function hasCycle(store: string, path: string[] = []): boolean {
    if (recursionStack.has(store)) {
      // Found a cycle
      return true
    }

    if (visited.has(store)) {
      return false
    }

    visited.add(store)
    recursionStack.add(store)

    const dependencies = storeUsages.get(store) || []
    for (const dependency of dependencies) {
      if (hasCycle(dependency, [...path, store])) {
        return true
      }
    }

    recursionStack.delete(store)
    return false
  }

  // Check each store for cycles
  for (const store of storeUsages.keys()) {
    if (!visited.has(store)) {
      hasCycle(store)
    }
  }
}
