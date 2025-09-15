/**
 * @fileoverview AST utilities for Pinia ESLint plugin
 */

import type { TSESTree } from '@typescript-eslint/utils'

/**
 * Checks if a node is a call expression to `defineStore`
 */
export function isDefineStoreCall(
  node: TSESTree.Node
): node is TSESTree.CallExpression {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'Identifier' &&
    node.callee.name === 'defineStore'
  )
}

/**
 * Checks if a call expression is a setup store (has a function as second argument)
 */
export function isSetupStore(node: TSESTree.CallExpression): boolean {
  return (
    node.arguments.length >= 2 &&
    (node.arguments[1].type === 'FunctionExpression' ||
      node.arguments[1].type === 'ArrowFunctionExpression')
  )
}

/**
 * Gets the setup function from a defineStore call
 */
export function getSetupFunction(
  node: TSESTree.CallExpression
): TSESTree.FunctionExpression | TSESTree.ArrowFunctionExpression | null {
  if (!isSetupStore(node)) {
    return null
  }

  const setupArg = node.arguments[1]
  if (
    setupArg.type === 'FunctionExpression' ||
    setupArg.type === 'ArrowFunctionExpression'
  ) {
    return setupArg
  }

  return null
}

/**
 * Extracts variable and function declarations from a function body
 */
export function extractDeclarations(body: TSESTree.BlockStatement): {
  variables: string[]
  functions: string[]
} {
  const variables: string[] = []
  const functions: string[] = []

  for (const statement of body.body) {
    if (statement.type === 'VariableDeclaration') {
      for (const declarator of statement.declarations) {
        if (declarator.id.type === 'Identifier') {
          variables.push(declarator.id.name)
        }
      }
    } else if (statement.type === 'FunctionDeclaration' && statement.id) {
      functions.push(statement.id.name)
    }
  }

  return { variables, functions }
}

/**
 * Extracts properties from a return statement object
 */
export function extractReturnProperties(
  returnStatement: TSESTree.ReturnStatement
): string[] {
  if (
    !returnStatement.argument ||
    returnStatement.argument.type !== 'ObjectExpression'
  ) {
    return []
  }

  const properties: string[] = []

  for (const prop of returnStatement.argument.properties) {
    if (prop.type === 'Property' && prop.key.type === 'Identifier') {
      properties.push(prop.key.name)
    } else if (prop.type === 'SpreadElement') {
      // Handle spread elements - we can't easily determine what's being spread
      // so we'll be more lenient in this case
    }
  }

  return properties
}

/**
 * Finds the return statement in a function body
 */
export function findReturnStatement(
  body: TSESTree.BlockStatement
): TSESTree.ReturnStatement | null {
  for (const statement of body.body) {
    if (statement.type === 'ReturnStatement') {
      return statement
    }
  }
  return null
}
