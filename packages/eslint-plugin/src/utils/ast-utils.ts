/**
 * @fileoverview AST utilities for Pinia ESLint plugin
 */

import type { TSESTree } from '@typescript-eslint/utils'

/**
 * Checks if a node is a call expression to `defineStore`
 * Handles optional chaining and chain expressions (e.g., pinia?.defineStore(...))
 */
export function isDefineStoreCall(
  node: TSESTree.Node
): node is TSESTree.CallExpression {
  if (node.type !== 'CallExpression') {
    return false
  }

  return isDefineStoreCallee(node.callee)
}

/**
 * Helper function to check if a callee is a defineStore call
 * Handles various patterns including optional chaining
 */
function isDefineStoreCallee(
  callee: TSESTree.CallExpression['callee']
): boolean {
  // Direct call: defineStore(...)
  if (callee.type === 'Identifier' && callee.name === 'defineStore') {
    return true
  }

  // Member expression: pinia.defineStore(...)
  if (
    callee.type === 'MemberExpression' &&
    !callee.computed &&
    callee.property.type === 'Identifier' &&
    callee.property.name === 'defineStore'
  ) {
    return true
  }

  // Chain expression (optional chaining): pinia?.defineStore(...)
  if (callee.type === 'ChainExpression') {
    return isDefineStoreCallee(callee.expression)
  }

  return false
}

/**
 * Extracts store ID from defineStore call arguments
 * Handles template literals without interpolations
 */
export function getStoreId(node: TSESTree.CallExpression): string | null {
  if (!isDefineStoreCall(node)) return null

  const firstArg = node.arguments[0]

  // Handle string literals
  if (firstArg?.type === 'Literal' && typeof firstArg.value === 'string') {
    return firstArg.value
  }

  // Handle template literals without interpolations
  if (
    firstArg?.type === 'TemplateLiteral' &&
    firstArg.expressions.length === 0
  ) {
    // Template literal with no interpolations is just a string
    return firstArg.quasis[0]?.value.cooked || null
  }

  // Handle object expression with id property
  if (firstArg?.type === 'ObjectExpression') {
    for (const prop of firstArg.properties) {
      if (
        prop.type === 'Property' &&
        !prop.computed &&
        prop.key.type === 'Identifier' &&
        prop.key.name === 'id'
      ) {
        // Handle string literal value
        if (
          prop.value.type === 'Literal' &&
          typeof prop.value.value === 'string'
        ) {
          return prop.value.value
        }
        // Handle template literal value without interpolations
        if (
          prop.value.type === 'TemplateLiteral' &&
          prop.value.expressions.length === 0
        ) {
          return prop.value.quasis[0]?.value.cooked || null
        }
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
 * Captures loop-initializer declarations and de-duplicates outputs
 */
export function extractDeclarations(body: TSESTree.BlockStatement): {
  variables: string[]
  functions: string[]
} {
  const variableSet = new Set<string>()
  const functionSet = new Set<string>()

  function traverse(node: TSESTree.Node): void {
    switch (node.type) {
      case 'VariableDeclaration':
        for (const declarator of node.declarations) {
          extractIdentifiersFromPattern(declarator.id, variableSet)
        }
        break
      case 'FunctionDeclaration':
        if (node.id) {
          functionSet.add(node.id.name)
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
        // Handle loop initializer declarations (e.g., for (let i = 0; ...))
        if (node.init && node.init.type === 'VariableDeclaration') {
          for (const declarator of node.init.declarations) {
            extractIdentifiersFromPattern(declarator.id, variableSet)
          }
        }
        if (node.body) {
          traverse(node.body)
        }
        break
      case 'ForInStatement':
      case 'ForOfStatement':
        // Handle loop variable declarations (e.g., for (const item of items))
        if (node.left.type === 'VariableDeclaration') {
          for (const declarator of node.left.declarations) {
            extractIdentifiersFromPattern(declarator.id, variableSet)
          }
        }
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
          // Handle catch clause parameter (e.g., catch (error))
          if (node.handler.param) {
            extractIdentifiersFromPattern(node.handler.param, variableSet)
          }
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
  return {
    variables: Array.from(variableSet),
    functions: Array.from(functionSet),
  }
}

/**
 * Extracts identifier names from patterns (handles destructuring)
 */
function extractIdentifiersFromPattern(
  pattern: TSESTree.BindingName,
  identifiers: Set<string>
): void {
  switch (pattern.type) {
    case 'Identifier':
      identifiers.add(pattern.name)
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
 * Handles quoted keys, literal property keys, and MemberExpression returns
 */
export function extractReturnProperties(
  returnStatement: TSESTree.ReturnStatement
): string[] {
  if (!returnStatement.argument) {
    return []
  }

  // Handle object expression returns
  if (returnStatement.argument.type === 'ObjectExpression') {
    const properties: string[] = []

    for (const prop of returnStatement.argument.properties) {
      if (prop.type === 'Property') {
        // Handle identifier keys: { name: ... }
        if (prop.key.type === 'Identifier' && !prop.computed) {
          properties.push(prop.key.name)
        }
        // Handle string literal keys: { "name": ... } or { 'name': ... }
        else if (
          prop.key.type === 'Literal' &&
          typeof prop.key.value === 'string'
        ) {
          properties.push(prop.key.value)
        }
        // Handle template literal keys without interpolations: { `name`: ... }
        else if (
          prop.key.type === 'TemplateLiteral' &&
          prop.key.expressions.length === 0
        ) {
          const value = prop.key.quasis[0]?.value.cooked
          if (value) {
            properties.push(value)
          }
        }
        // Handle computed property keys with template literals: { [`name`]: ... }
        else if (
          prop.computed &&
          prop.key.type === 'TemplateLiteral' &&
          prop.key.expressions.length === 0
        ) {
          const value = prop.key.quasis[0]?.value.cooked
          if (value) {
            properties.push(value)
          }
        }
      } else if (prop.type === 'SpreadElement') {
        // Handle spread elements - we can't easily determine what's being spread
        // so we'll be more lenient in this case
      }
    }

    return properties
  }

  // Handle MemberExpression returns (e.g., return someObject.property)
  if (returnStatement.argument.type === 'MemberExpression') {
    // For MemberExpression, we can't determine the exact properties
    // but we can note that it's a dynamic return
    return []
  }

  return []
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
