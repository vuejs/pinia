/**
 * @fileoverview Rule to detect circular dependencies between stores
 * @author Eduardo San Martin Morote
 */

import {
  ESLintUtils,
  type TSESTree,
  type TSESLint,
} from '@typescript-eslint/utils'
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
    },
    schema: [],
    messages: {
      circularDependency:
        'Potential circular dependency detected: store "{{currentStore}}" uses "{{usedStore}}"',
      setupCircularDependency:
        'Avoid using other stores directly in setup function body. Use them in actions instead.',
    },
  },
  defaultOptions: [],
  create(context) {
    const storeUsages = new Map<string, string[]>() // currentStore -> [usedStores]
    const usageGraph = new Map<string, Map<string, TSESTree.Node[]>>() // currentStore -> usedStore -> nodes
    const storeStack: string[] = []

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
            const currentStoreName = parent.id.name
            storeStack.push(currentStoreName)

            // Initialize usage tracking for this store
            if (!storeUsages.has(currentStoreName)) {
              storeUsages.set(currentStoreName, [])
            }
            if (!usageGraph.has(currentStoreName)) {
              usageGraph.set(currentStoreName, new Map())
            }

            // Check for store usage in setup function
            if (isSetupStore(node)) {
              const setupFunction = getSetupFunction(node)
              if (setupFunction) {
                checkSetupFunctionForStoreUsage(setupFunction, context)
              }
            }
          }
        }

        // Track store usage calls
        const currentStoreName = storeStack[storeStack.length - 1]
        if (isStoreUsage(node) && currentStoreName) {
          const usedStoreName = getStoreNameFromUsage(node)
          if (usedStoreName && usedStoreName !== currentStoreName) {
            const usages = storeUsages.get(currentStoreName) || []
            if (!usages.includes(usedStoreName)) {
              usages.push(usedStoreName)
              storeUsages.set(currentStoreName, usages)
            }
            // record node for later reporting
            const edges = usageGraph.get(currentStoreName)!
            const nodes = edges.get(usedStoreName) ?? []
            nodes.push(node)
            edges.set(usedStoreName, nodes)

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

      'CallExpression:exit'(node: TSESTree.CallExpression) {
        if (isDefineStoreCall(node)) {
          storeStack.pop()
        }
      },

      'Program:exit'() {
        // Check for indirect circular dependencies
        checkIndirectCircularDependencies(usageGraph, context)
      },
    }
  },
})

/**
 * Checks setup function for direct store usage in the function body
 */
function checkSetupFunctionForStoreUsage(
  setupFunction: TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression,
  context: TSESLint.RuleContext<
    'circularDependency' | 'setupCircularDependency',
    []
  >
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
  usageGraph: Map<string, Map<string, TSESTree.Node[]>>,
  context: TSESLint.RuleContext<
    'circularDependency' | 'setupCircularDependency',
    []
  >
) {
  const visited = new Set<string>()
  const inPath = new Set<string>()
  const path: string[] = []
  const reported = new Set<string>() // "A->B"

  const dfs = (store: string) => {
    visited.add(store)
    inPath.add(store)
    path.push(store)
    const deps = usageGraph.get(store) ?? new Map()
    for (const [dep] of deps) {
      if (inPath.has(dep)) {
        // report the edge(s) participating in the cycle at least once
        const from = store
        const to = dep
        const key = `${from}->${to}`
        if (!reported.has(key)) {
          reported.add(key)
          const node = usageGraph.get(from)?.get(to)?.[0]
          if (node) {
            context.report({
              node,
              messageId: 'circularDependency',
              data: { currentStore: from, usedStore: to },
            })
          }
        }
      } else if (!visited.has(dep)) {
        dfs(dep)
      }
    }
    path.pop()
    inPath.delete(store)
  }

  for (const store of usageGraph.keys()) {
    if (!visited.has(store)) dfs(store)
  }
}
