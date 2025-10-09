/**
 * @fileoverview Tests for AST utilities
 */

import { describe, it, expect } from 'vitest'
import { parseForESLint } from '@typescript-eslint/parser'
import type { TSESTree } from '@typescript-eslint/utils'
import {
  isDefineStoreCall,
  getStoreId,
  extractTopLevelDeclarations,
  extractReturnProperties,
  extractReturnIdentifiers,
} from '../ast-utils'

function parseCode(code: string): TSESTree.Program {
  const result = parseForESLint(code, {
    ecmaVersion: 2020,
    sourceType: 'module',
  })
  return result.ast
}

function findCallExpression(ast: TSESTree.Program): TSESTree.CallExpression {
  let callExpression: TSESTree.CallExpression | null = null

  function traverse(node: any): void {
    if (node.type === 'CallExpression') {
      callExpression = node
      return
    }
    for (const key in node) {
      if (node[key] && typeof node[key] === 'object') {
        if (Array.isArray(node[key])) {
          node[key].forEach(traverse)
        } else {
          traverse(node[key])
        }
      }
    }
  }

  traverse(ast)
  return callExpression!
}

describe('isDefineStoreCall', () => {
  it('should detect direct defineStore calls', () => {
    const code = 'defineStore("test", () => {})'
    const ast = parseCode(code)
    const callExpr = findCallExpression(ast)
    expect(isDefineStoreCall(callExpr)).toBe(true)
  })

  it('should detect member expression defineStore calls', () => {
    const code = 'pinia.defineStore("test", () => {})'
    const ast = parseCode(code)
    const callExpr = findCallExpression(ast)
    expect(isDefineStoreCall(callExpr)).toBe(true)
  })

  it('should detect optional chaining defineStore calls', () => {
    const code = 'pinia?.defineStore("test", () => {})'
    const ast = parseCode(code)
    const callExpr = findCallExpression(ast)
    expect(isDefineStoreCall(callExpr)).toBe(true)
  })

  it('should not detect non-defineStore calls', () => {
    const code = 'someOtherFunction("test", () => {})'
    const ast = parseCode(code)
    const callExpr = findCallExpression(ast)
    expect(isDefineStoreCall(callExpr)).toBe(false)
  })
})

describe('getStoreId', () => {
  it('should extract string literal IDs', () => {
    const code = 'defineStore("user", () => {})'
    const ast = parseCode(code)
    const callExpr = findCallExpression(ast)
    expect(getStoreId(callExpr)).toBe('user')
  })

  it('should extract template literal IDs without interpolations', () => {
    const code = 'defineStore(`user`, () => {})'
    const ast = parseCode(code)
    const callExpr = findCallExpression(ast)
    expect(getStoreId(callExpr)).toBe('user')
  })

  it('should extract IDs from object expressions with string literals', () => {
    const code = 'defineStore({ id: "user" }, () => {})'
    const ast = parseCode(code)
    const callExpr = findCallExpression(ast)
    expect(getStoreId(callExpr)).toBe('user')
  })

  it('should extract IDs from object expressions with template literals', () => {
    const code = 'defineStore({ id: `user` }, () => {})'
    const ast = parseCode(code)
    const callExpr = findCallExpression(ast)
    expect(getStoreId(callExpr)).toBe('user')
  })

  it('should return null for template literals with interpolations', () => {
    const code = 'defineStore(`user-${suffix}`, () => {})'
    const ast = parseCode(code)
    const callExpr = findCallExpression(ast)
    expect(getStoreId(callExpr)).toBe(null)
  })
})

describe('extractTopLevelDeclarations', () => {
  it('should extract variable declarations and deduplicate (top-level only)', () => {
    const code = `
      function setup() {
        var name = ref('test')
        let count = 0
        var name = ref('duplicate') // This should be deduplicated
        return { name, count }
      }
    `
    const ast = parseCode(code)
    const func = ast.body[0] as TSESTree.FunctionDeclaration
    const result = extractTopLevelDeclarations(func.body!)

    expect(result.variables).toEqual(['name', 'count'])
  })

  it('should not include loop initializer declarations (top-level only)', () => {
    const code = `
      function setup() {
        for (let i = 0; i < 10; i++) {
          console.log(i)
        }
        for (const item of items) {
          console.log(item)
        }
        return {}
      }
    `
    const ast = parseCode(code)
    const func = ast.body[0] as TSESTree.FunctionDeclaration
    const result = extractTopLevelDeclarations(func.body!)

    expect(result.variables).not.toContain('i')
    expect(result.variables).not.toContain('item')
    expect(result.variables).toEqual([])
  })

  it('should not include catch clause parameters (top-level only)', () => {
    const code = `
      function setup() {
        try {
          doSomething()
        } catch (error) {
          console.log(error)
        }
        return {}
      }
    `
    const ast = parseCode(code)
    const func = ast.body[0] as TSESTree.FunctionDeclaration
    const result = extractTopLevelDeclarations(func.body!)

    expect(result.variables).not.toContain('error')
    expect(result.variables).toEqual([])
  })
})

describe('extractReturnProperties', () => {
  it('should extract identifier property keys', () => {
    const code = `
      function setup() {
        return { name, count, total }
      }
    `
    const ast = parseCode(code)
    const func = ast.body[0] as TSESTree.FunctionDeclaration
    const returnStmt = func.body!.body[0] as TSESTree.ReturnStatement
    const result = extractReturnProperties(returnStmt)

    expect(result).toEqual(['name', 'count', 'total'])
  })

  it('should extract quoted string property keys', () => {
    const code = `
      function setup() {
        return { "name": value, 'count': value2 }
      }
    `
    const ast = parseCode(code)
    const func = ast.body[0] as TSESTree.FunctionDeclaration
    const returnStmt = func.body!.body[0] as TSESTree.ReturnStatement
    const result = extractReturnProperties(returnStmt)
    expect(result).toEqual(['name', 'count'])
  })

  it('should extract computed string-literal property keys', () => {
    const code = `
      function setup() {
        return { ["name"]: value, ['count']: value2 }
      }
    `
    const ast = parseCode(code)
    const func = ast.body[0] as TSESTree.FunctionDeclaration
    const returnStmt = func.body!.body[0] as TSESTree.ReturnStatement
    const result = extractReturnProperties(returnStmt)
    expect(result).toEqual(['name', 'count'])
  })

  it('should extract template literal property keys without interpolations', () => {
    const code = `
      function setup() {
        return { [\`name\`]: value, [\`count\`]: value2 }
      }
    `
    const ast = parseCode(code)
    const func = ast.body[0] as TSESTree.FunctionDeclaration
    const returnStmt = func.body!.body[0] as TSESTree.ReturnStatement
    const result = extractReturnProperties(returnStmt)

    expect(result).toEqual(['name', 'count'])
  })

  it('should handle MemberExpression returns', () => {
    const code = `
      function setup() {
        return someObject.property
      }
    `
    const ast = parseCode(code)
    const func = ast.body[0] as TSESTree.FunctionDeclaration
    const returnStmt = func.body!.body[0] as TSESTree.ReturnStatement
    const result = extractReturnProperties(returnStmt)

    expect(result).toEqual([])
  })

  it('extractReturnIdentifiers should unwrap TS/JS wrappers to find identifiers', () => {
    const code = `
      function setup() {
        const count = 1
        const total = 2
        return { a: (count as number), b: ((total)), c: (count!) }
      }
    `
    const ast = parseCode(code)
    const func = ast.body[0] as TSESTree.FunctionDeclaration
    const returnStmt = func.body!.body[2] as TSESTree.ReturnStatement
    const result = extractReturnIdentifiers(returnStmt)
    expect(result).toEqual(['count', 'total', 'count'])
  })
})
