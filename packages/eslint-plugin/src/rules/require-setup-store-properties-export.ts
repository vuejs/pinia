/**
 * @fileoverview Rule to require all setup store properties to be exported
 * @author Eduardo San Martin Morote
 */

import { ESLintUtils, type TSESTree } from '@typescript-eslint/utils'
import {
  isDefineStoreCall,
  isSetupStore,
  getSetupFunction,
  extractTopLevelDeclarations,
  extractReturnIdentifiers,
  findReturnStatement,
  hasSpreadInReturn,
} from '../utils/ast-utils'

const createRule = ESLintUtils.RuleCreator(
  (name) => `https://pinia.vuejs.org/cookbook/eslint-plugin.html#${name}`
)

/**
 * Rule to ensure all variables and functions in setup stores are properly exported.
 *
 * According to Pinia documentation, all variables and functions defined in a setup store
 * should be returned from the setup function to be accessible on the store instance.
 */
export const requireSetupStorePropertiesExport = createRule({
  name: 'require-setup-store-properties-export',
  meta: {
    type: 'problem',
    docs: {
      description: 'require all setup store properties to be exported',
    },
    fixable: 'code',
    schema: [],
    messages: {
      missingExport:
        'Property "{{name}}" is defined but not exported from setup store',
      missingExports:
        'Properties {{names}} are defined but not exported from setup store',
    },
  },
  defaultOptions: [],
  create(context) {
    return {
      CallExpression(node: TSESTree.CallExpression) {
        // Only check defineStore calls
        if (!isDefineStoreCall(node) || !isSetupStore(node)) {
          return
        }

        const setupFunction = getSetupFunction(node)
        if (!setupFunction || setupFunction.body.type !== 'BlockStatement') {
          return
        }

        // Extract all declared variables and functions (top-level only)
        const { variables, functions } = extractTopLevelDeclarations(
          setupFunction.body
        )
        const allDeclared = [...variables, ...functions]

        // Find the return statement
        const returnStatement = findReturnStatement(setupFunction.body)
        if (!returnStatement) {
          // If there's no return statement, all declared items are missing
          if (allDeclared.length > 0) {
            context.report({
              node: setupFunction,
              messageId:
                allDeclared.length === 1 ? 'missingExport' : 'missingExports',
              data: {
                name: allDeclared[0],
                names: allDeclared.join(', '),
              },
            })
          }
          return
        }

        // Extract exported identifiers
        const exportedIdentifiers = extractReturnIdentifiers(returnStatement)

        // Be lenient when spreads are present to avoid false positives
        if (hasSpreadInReturn(returnStatement)) {
          return
        }

        // Find missing exports
        const missingExports = allDeclared.filter(
          (name) => !exportedIdentifiers.includes(name)
        )

        if (missingExports.length > 0) {
          context.report({
            node: returnStatement,
            messageId:
              missingExports.length === 1 ? 'missingExport' : 'missingExports',
            data: {
              name: missingExports[0],
              names: missingExports.join(', '),
            },
            fix(fixer) {
              // Auto-fix: add missing properties to return object
              if (
                !returnStatement.argument ||
                returnStatement.argument.type !== 'ObjectExpression'
              ) {
                return null
              }

              const objectExpression = returnStatement.argument
              const existingProperties = objectExpression.properties

              // Create new properties for missing exports
              const newProperties = missingExports.map((name) => `${name}`)

              if (existingProperties.length === 0) {
                // Empty object, add all properties
                return fixer.replaceText(
                  objectExpression,
                  `{ ${newProperties.join(', ')} }`
                )
              } else {
                // Add to existing properties
                const lastProperty =
                  existingProperties[existingProperties.length - 1]
                return fixer.insertTextAfter(
                  lastProperty,
                  `, ${newProperties.join(', ')}`
                )
              }
            },
          })
        }
      },
    }
  },
})
