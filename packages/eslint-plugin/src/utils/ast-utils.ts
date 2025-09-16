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
 * Extracts variable and function declarations from a function body (recursive)
 */
export function extractDeclarations(body: TSESTree.BlockStatement): {
  variables: string[]
  functions: string[]
} {
  const variables: string[] = []
  const functions: string[] = []

  function traverse(node: TSESTree.Node): void {
    switch (node.type) {
      case 'VariableDeclaration':
        for (const declarator of node.declarations) {
          extractIdentifiersFromPattern(declarator.id, variables)
        }
        break
      case 'FunctionDeclaration':
        if (node.id) {
          functions.push(node.id.name)
        }
        break
      case 'BlockStatement':
        for (const statement of node.body) {
          traverse(statement)
        }
        break
      case 'IfStatement':
        traverse(node.consequent)
        if (node.alternate) {
          traverse(node.alternate)
        }
        break
      case 'ForStatement':
      case 'ForInStatement':
      case 'ForOfStatement':
        if (node.body) {
          traverse(node.body)
        }
        break
      case 'WhileStatement':
      case 'DoWhileStatement':
        traverse(node.body)
        break
      case 'SwitchStatement':
        for (const switchCase of node.cases) {
          for (const statement of switchCase.consequent) {
            traverse(statement)
          }
        }
        break
      case 'TryStatement':
        traverse(node.block)
        if (node.handler) {
          traverse(node.handler.body)
        }
        if (node.finalizer) {
          traverse(node.finalizer)
        }
        break
      case 'WithStatement':
        traverse(node.body)
        break
      // For other statement types, we don't need to traverse deeper
      // as they don't contain variable/function declarations
    }
  }

  traverse(body)
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
 * Finds all return statements in a function body (recursive)
 */
export function findAllReturnStatements(
  body: TSESTree.BlockStatement
): TSESTree.ReturnStatement[] {
  const returnStatements: TSESTree.ReturnStatement[] = []

  function traverse(node: TSESTree.Node): void {
    switch (node.type) {
      case 'ReturnStatement':
        returnStatements.push(node)
        break
      case 'BlockStatement':
        for (const statement of node.body) {
          traverse(statement)
        }
        break
      case 'IfStatement':
        traverse(node.consequent)
        if (node.alternate) {
          traverse(node.alternate)
        }
        break
      case 'ForStatement':
      case 'ForInStatement':
      case 'ForOfStatement':
        if (node.body) {
          traverse(node.body)
        }
        break
      case 'WhileStatement':
      case 'DoWhileStatement':
        traverse(node.body)
        break
      case 'SwitchStatement':
        for (const switchCase of node.cases) {
          for (const statement of switchCase.consequent) {
            traverse(statement)
          }
        }
        break
      case 'TryStatement':
        traverse(node.block)
        if (node.handler) {
          traverse(node.handler.body)
        }
        if (node.finalizer) {
          traverse(node.finalizer)
        }
        break
      case 'WithStatement':
        traverse(node.body)
        break
      // For function declarations/expressions, we don't traverse into them
      // as they have their own scope
      case 'FunctionDeclaration':
      case 'FunctionExpression':
      case 'ArrowFunctionExpression':
        break
      // For other statement types that can contain nested statements
      case 'ExpressionStatement':
      case 'VariableDeclaration':
      case 'ThrowStatement':
      case 'BreakStatement':
      case 'ContinueStatement':
      case 'EmptyStatement':
      case 'DebuggerStatement':
        // These don't contain nested statements
        break
    }
  }

  traverse(body)
  return returnStatements
}

/**
 * Finds the main return statement in a function body (typically the last object return)
 */
export function findReturnStatement(
  body: TSESTree.BlockStatement
): TSESTree.ReturnStatement | null {
  const allReturns = findAllReturnStatements(body)

  if (allReturns.length === 0) {
    return null
  }

  // Find the last return statement that returns an object expression
  for (let i = allReturns.length - 1; i >= 0; i--) {
    const returnStmt = allReturns[i]
    if (returnStmt.argument?.type === 'ObjectExpression') {
      return returnStmt
    }
  }

  // If no object return found, return the last return statement
  return allReturns[allReturns.length - 1]
}
