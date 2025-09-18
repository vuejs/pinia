/**
 * @fileoverview Rule to prevent store instantiation in computed properties
 * @author Eduardo San Martin Morote
 */

import {
  ESLintUtils,
  type TSESTree,
  type TSESLint,
} from '@typescript-eslint/utils'
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
    },
    schema: [],
    messages: {
      noStoreInComputed:
        'Avoid instantiating stores inside computed properties. Move store instantiation to the top level.',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node: TSESTree.CallExpression) {
        if (!isComputedCall(node) || node.arguments.length === 0) return
        const arg = node.arguments[0]
        const getter =
          arg.type === 'FunctionExpression' ||
          arg.type === 'ArrowFunctionExpression'
            ? arg
            : extractGetterFromObjectArg(arg)
        if (getter) {
          checkFunctionForStoreUsage(getter, context)
        }
      },
    }
  },
})

// Support: computed(), vue.computed(), imported alias still named 'computed'
function isComputedCall(node: TSESTree.CallExpression): boolean {
  const callee = node.callee
  return (
    (callee.type === 'Identifier' && callee.name === 'computed') ||
    (callee.type === 'MemberExpression' &&
      !callee.computed &&
      callee.property.type === 'Identifier' &&
      callee.property.name === 'computed')
  )
}

function extractGetterFromObjectArg(
  arg: TSESTree.Node
): TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression | null {
  if (arg.type !== 'ObjectExpression') return null
  for (const prop of arg.properties) {
    if (
      prop.type === 'Property' &&
      !prop.computed &&
      prop.key.type === 'Identifier' &&
      prop.key.name === 'get'
    ) {
      const v = prop.value
      if (
        v.type === 'FunctionExpression' ||
        v.type === 'ArrowFunctionExpression'
      )
        return v
    }
  }
  return null
}

/**
 * Recursively checks a function for store usage
 */
function checkFunctionForStoreUsage(
  fn: TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression,
  context: TSESLint.RuleContext<'noStoreInComputed', []>
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
