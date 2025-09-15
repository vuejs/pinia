/**
 * @fileoverview Tests for require-setup-store-properties-export rule
 */

import { RuleTester } from '@typescript-eslint/rule-tester'
import { requireSetupStorePropertiesExport } from '../require-setup-store-properties-export'

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
})

ruleTester.run(
  'require-setup-store-properties-export',
  requireSetupStorePropertiesExport,
  {
    valid: [
      // All properties exported
      {
        code: `
        export const useStore = defineStore('store', () => {
          const count = ref(0)
          const name = ref('test')
          
          function increment() {
            count.value++
          }
          
          return { count, name, increment }
        })
      `,
      },
      // No properties defined
      {
        code: `
        export const useStore = defineStore('store', () => {
          return {}
        })
      `,
      },
      // Option store (not setup store)
      {
        code: `
        export const useStore = defineStore('store', {
          state: () => ({ count: 0 }),
          actions: {
            increment() {
              this.count++
            }
          }
        })
      `,
      },
      // Setup store with computed
      {
        code: `
        export const useStore = defineStore('store', () => {
          const count = ref(0)
          const double = computed(() => count.value * 2)
          
          return { count, double }
        })
      `,
      },
    ],
    invalid: [
      // Missing single export
      {
        code: `
        export const useStore = defineStore('store', () => {
          const count = ref(0)
          const name = ref('test')
          
          return { count }
        })
      `,
        errors: [
          {
            messageId: 'missingExport',
            data: { name: 'name' },
          },
        ],
        output: `
        export const useStore = defineStore('store', () => {
          const count = ref(0)
          const name = ref('test')
          
          return { count, name }
        })
      `,
      },
      // Missing multiple exports
      {
        code: `
        export const useStore = defineStore('store', () => {
          const count = ref(0)
          const name = ref('test')
          
          function increment() {
            count.value++
          }
          
          return { count }
        })
      `,
        errors: [
          {
            messageId: 'missingExports',
            data: { names: 'name, increment' },
          },
        ],
        output: `
        export const useStore = defineStore('store', () => {
          const count = ref(0)
          const name = ref('test')
          
          function increment() {
            count.value++
          }
          
          return { count, name, increment }
        })
      `,
      },
      // No return statement
      {
        code: `
        export const useStore = defineStore('store', () => {
          const count = ref(0)
          const name = ref('test')
        })
      `,
        errors: [
          {
            messageId: 'missingExports',
            data: { names: 'count, name' },
          },
        ],
      },
      // Empty return object with defined properties
      {
        code: `
        export const useStore = defineStore('store', () => {
          const count = ref(0)
          
          return {}
        })
      `,
        errors: [
          {
            messageId: 'missingExport',
            data: { name: 'count' },
          },
        ],
        output: `
        export const useStore = defineStore('store', () => {
          const count = ref(0)
          
          return { count }
        })
      `,
      },
    ],
  }
)
