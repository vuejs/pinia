/**
 * @fileoverview Rule to enforce consistent store naming conventions
 * @author Eduardo San Martin Morote
 */

import { ESLintUtils, type TSESTree } from '@typescript-eslint/utils'
import { isDefineStoreCall, getStoreId } from '../utils/ast-utils'

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://pinia.vuejs.org/cookbook/eslint-plugin.html#${name}`
)

/**
 * Rule to enforce consistent naming conventions for Pinia stores.
 *
 * Encourages using the "useXxxStore" pattern for store functions,
 * which is a common convention in the Vue ecosystem.
 */
export const preferUseStoreNaming = createRule({
  name: 'prefer-use-store-naming',
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce consistent store naming conventions',
    },
    hasSuggestions: true,
    schema: [
      {
        type: 'object',
        properties: {
          prefix: {
            type: 'string',
            default: 'use',
          },
          suffix: {
            type: 'string',
            default: 'Store',
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalidNaming:
        'Store function should follow the naming pattern "{{expected}}"',
      renameTo: 'Rename to "{{name}}"',
    },
  },
  defaultOptions: [{ prefix: 'use', suffix: 'Store' }],
  create(context, [options = {}]) {
    const { prefix = 'use', suffix = 'Store' } = options

    return {
      VariableDeclarator(node: TSESTree.VariableDeclarator) {
        // Check if this is a store definition
        if (
          node.init?.type === 'CallExpression' &&
          isDefineStoreCall(node.init) &&
          node.id.type === 'Identifier'
        ) {
          const storeName = node.id.name

          // Check naming convention
          if (!storeName.startsWith(prefix) || !storeName.endsWith(suffix)) {
            // Extract the core name from store ID if available
            let suggestedName = storeName
            const storeId = getStoreId(node.init)
            if (storeId) {
              // Convert kebab-case or snake_case to PascalCase
              const coreName = storeId
                .split(/[-_]/)
                .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                .join('')
              suggestedName = `${prefix}${coreName}${suffix}`
            } else {
              // If no store ID, try to fix the current name
              let baseName = storeName
              if (storeName.startsWith(prefix)) {
                baseName = storeName.slice(prefix.length)
              }
              if (storeName.endsWith(suffix)) {
                baseName = baseName.slice(0, -suffix.length)
              }
              if (!baseName) {
                baseName = 'Store'
              }
              suggestedName = `${prefix}${baseName.charAt(0).toUpperCase() + baseName.slice(1)}${suffix}`
            }

            context.report({
              node: node.id,
              messageId: 'invalidNaming',
              data: {
                expected: suggestedName,
              },
              suggest: [
                {
                  messageId: 'renameTo',
                  data: { name: suggestedName },
                  fix(fixer) {
                    return fixer.replaceText(node.id, suggestedName)
                  },
                },
              ],
            })
          }
        }
      },
    }
  },
})
