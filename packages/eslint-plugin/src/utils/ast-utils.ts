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
    ((node.callee.type === 'Identifier' &&
      node.callee.name === 'defineStore') ||
      (node.callee.type === 'MemberExpression' &&
        !node.callee.computed &&
        node.callee.property.type === 'Identifier' &&
        node.callee.property.name === 'defineStore'))
  )
}

/**
 * Extracts store ID from defineStore call arguments
 */
export function getStoreId(node: TSESTree.CallExpression): string | null {
  if (!isDefineStoreCall(node)) return null

  const firstArg = node.arguments[0]
  if (firstArg?.type === 'Literal' && typeof firstArg.value === 'string') {
    return firstArg.value
  }

  if (firstArg?.type === 'ObjectExpression') {
    for (const prop of firstArg.properties) {
      if (
        prop.type === 'Property' &&
        !prop.computed &&
        prop.key.type === 'Identifier' &&
        prop.key.name === 'id' &&
        prop.value.type === 'Literal' &&
        typeof prop.value.value === 'string'
      ) {
        return prop.value.value
      }
    }
  }

  return null
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
        extractIdentifiersFromPattern(declarator.id, variables)
      }
    } else if (statement.type === 'FunctionDeclaration' && statement.id) {
      functions.push(statement.id.name)
    }
  }

  return { variables, functions }
}

/**
 * Extracts identifier names from patterns (handles destructuring)
 */
function extractIdentifiersFromPattern(
  pattern: TSESTree.BindingName,
  identifiers: string[]
): void {
  switch (pattern.type) {
    case 'Identifier':
      identifiers.push(pattern.name)
      break
    case 'ObjectPattern':
      for (const prop of pattern.properties) {
        if (prop.type === 'Property') {
          extractIdentifiersFromPattern(prop.value, identifiers)
        } else if (prop.type === 'RestElement') {
          extractIdentifiersFromPattern(prop.argument, identifiers)
        }
      }
      break
    case 'ArrayPattern':
      for (const element of pattern.elements) {
        if (element) {
          extractIdentifiersFromPattern(element, identifiers)
        }
      }
      break
    case 'RestElement':
      extractIdentifiersFromPattern(pattern.argument, identifiers)
      break
    case 'AssignmentPattern':
      extractIdentifiersFromPattern(pattern.left, identifiers)
      break
  }
}

/**
 * Extracts properties from a return statement object (keys only)
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
 * Extracts identifiers being returned from a return statement object
 * This handles aliasing: return { total: count } returns ['count']
 */
export function extractReturnIdentifiers(
  returnStatement: TSESTree.ReturnStatement
): string[] {
  if (
    !returnStatement.argument ||
    returnStatement.argument.type !== 'ObjectExpression'
  ) {
    return []
  }

  const identifiers: string[] = []

  for (const prop of returnStatement.argument.properties) {
    if (prop.type === 'Property') {
      if (prop.shorthand && prop.key.type === 'Identifier') {
        // Shorthand property: { count } -> count
        identifiers.push(prop.key.name)
      } else if (prop.value.type === 'Identifier') {
        // Aliased property: { total: count } -> count
        identifiers.push(prop.value.name)
      }
    }
    // Skip spread elements as we can't determine what's being spread
  }

  return identifiers
}

/**
 * Checks if a return statement has spread elements
 */
export function hasSpreadInReturn(
  returnStatement: TSESTree.ReturnStatement
): boolean {
  if (
    !returnStatement.argument ||
    returnStatement.argument.type !== 'ObjectExpression'
  ) {
    return false
  }

  return returnStatement.argument.properties.some(
    (prop) => prop.type === 'SpreadElement'
  )
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
