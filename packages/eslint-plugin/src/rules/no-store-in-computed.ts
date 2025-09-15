/**
 * @fileoverview Rule to prevent store instantiation in computed properties
 * @author Eduardo San Martin Morote
 */

import { ESLintUtils, type TSESTree } from '@typescript-eslint/utils'
import { isStoreUsage } from '../utils/store-utils'

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://pinia.vuejs.org/cookbook/eslint-plugin.html#${name}`
)

/**
 * Rule to prevent store instantiation inside computed properties.
 *
 * Stores should be instantiated at the top level of components or composables,
 * not inside computed properties, as this can cause reactivity issues.
 */
export const noStoreInComputed = createRule({
  name: 'no-store-in-computed',
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow store instantiation in computed properties',
      recommended: 'error',
    },
    schema: [],
    messages: {
      noStoreInComputed:
        'Avoid instantiating stores inside computed properties. Move store instantiation to the top level.',
    },
  },
  defaultOptions: [],
  create(context) {
    let insideComputed = false

    return {
      CallExpression(node: TSESTree.CallExpression) {
        // Track when we enter a computed() call
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'computed' &&
          node.arguments.length > 0
        ) {
          insideComputed = true

          // Check the computed function for store usage
          const computedFn = node.arguments[0]
          if (
            computedFn.type === 'FunctionExpression' ||
            computedFn.type === 'ArrowFunctionExpression'
          ) {
            checkFunctionForStoreUsage(computedFn, context)
          }

          insideComputed = false
        }

        // Check for store usage inside computed
        if (insideComputed && isStoreUsage(node)) {
          context.report({
            node,
            messageId: 'noStoreInComputed',
          })
        }
      },
    }
  },
})

/**
 * Recursively checks a function for store usage
 */
function checkFunctionForStoreUsage(
  fn: TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression,
  context: any
) {
  const visited = new Set<TSESTree.Node>()

  function visitNode(node: TSESTree.Node) {
    if (visited.has(node)) {
      return
    }
    visited.add(node)

    if (node.type === 'CallExpression' && isStoreUsage(node)) {
      context.report({
        node,
        messageId: 'noStoreInComputed',
      })
    }

    // Recursively visit child nodes
    for (const key in node) {
      const child = (node as any)[key]
      if (child && typeof child === 'object' && child !== node.parent) {
        if (Array.isArray(child)) {
          child.forEach(visitNode)
        } else if (child.type) {
          visitNode(child)
        }
      }
    }
  }

  if (fn.body.type === 'BlockStatement') {
    fn.body.body.forEach(visitNode)
  } else {
    visitNode(fn.body)
  }
}
