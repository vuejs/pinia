/**
 * @fileoverview Tests for prefer-use-store-naming rule
 */

import { RuleTester } from '@typescript-eslint/rule-tester'
import { preferUseStoreNaming } from '../prefer-use-store-naming'

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
})

ruleTester.run('prefer-use-store-naming', preferUseStoreNaming, {
  valid: [
    // Correct naming convention
    {
      code: `
        export const useUserStore = defineStore('user', () => {
          const name = ref('John')
          return { name }
        })
      `,
    },
    // Correct naming with compound name
    {
      code: `
        export const useShoppingCartStore = defineStore('shopping-cart', () => {
          const items = ref([])
          return { items }
        })
      `,
    },
    // Non-store variable (should be ignored)
    {
      code: `
        const myVariable = someFunction()
      `,
    },
  ],
  invalid: [
    // Missing 'use' prefix
    {
      code: `export const dataStore = defineStore('data', () => {})`,
      errors: [
        {
          messageId: 'invalidNaming',
        },
      ],
      output: `export const useDataStore = defineStore('data', () => {})`,
    },
    // Missing 'Store' suffix
    {
      code: `
        export const useUser = defineStore('user', () => {
          const name = ref('John')
          return { name }
        })
      `,
      errors: [
        {
          messageId: 'invalidNaming',
        },
      ],
      output: `
        export const useUserStore = defineStore('user', () => {
          const name = ref('John')
          return { name }
        })
      `,
    },
    // Completely wrong naming
    {
      code: `
        export const myStore = defineStore('user', () => {
          const name = ref('John')
          return { name }
        })
      `,
      errors: [
        {
          messageId: 'invalidNaming',
        },
      ],
      output: `
        export const useUserStore = defineStore('user', () => {
          const name = ref('John')
          return { name }
        })
      `,
    },
    // Kebab-case store ID
    {
      code: `
        export const myStore = defineStore('shopping-cart', () => {
          const items = ref([])
          return { items }
        })
      `,
      errors: [
        {
          messageId: 'invalidNaming',
        },
      ],
      output: `
        export const useShoppingCartStore = defineStore('shopping-cart', () => {
          const items = ref([])
          return { items }
        })
      `,
    },
  ],
})

// Test with custom options
ruleTester.run(
  'prefer-use-store-naming with custom options',
  preferUseStoreNaming,
  {
    valid: [
      {
        code: `
        export const createUserRepository = defineStore('user', () => {
          const name = ref('John')
          return { name }
        })
      `,
        options: [{ prefix: 'create', suffix: 'Repository' }],
      },
    ],
    invalid: [
      {
        code: `
        export const useUserStore = defineStore('user', () => {
          const name = ref('John')
          return { name }
        })
      `,
        options: [{ prefix: 'create', suffix: 'Repository' }],
        errors: [
          {
            messageId: 'invalidNaming',
          },
        ],
        output: `
        export const createUserRepository = defineStore('user', () => {
          const name = ref('John')
          return { name }
        })
      `,
      },
    ],
  }
)
