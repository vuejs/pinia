/**
 * @fileoverview Tests for no-circular-store-dependencies rule
 */

import { RuleTester } from '@typescript-eslint/rule-tester'
import { noCircularStoreDependencies } from '../no-circular-store-dependencies'

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
})

ruleTester.run('no-circular-store-dependencies', noCircularStoreDependencies, {
  valid: [
    // No store dependencies
    {
      code: `
        export const useUserStore = defineStore('user', () => {
          const name = ref('John')
          return { name }
        })
      `,
    },
    // Store using another store in action (allowed)
    {
      code: `
        export const useUserStore = defineStore('user', () => {
          const name = ref('John')
          
          function updateProfile() {
            const cartStore = useCartStore()
            cartStore.clear()
          }
          
          return { name, updateProfile }
        })
        
        export const useCartStore = defineStore('cart', () => {
          const items = ref([])
          
          function clear() {
            items.value = []
          }
          
          return { items, clear }
        })
      `,
    },
    // Store using another store in computed (allowed)
    {
      code: `
        export const useUserStore = defineStore('user', () => {
          const name = ref('John')
          
          const cartSummary = computed(() => {
            const cartStore = useCartStore()
            return cartStore.items.length
          })
          
          return { name, cartSummary }
        })
      `,
    },
  ],
  invalid: [
    // Direct store usage in setup function body
    {
      code: `
        export const useUserStore = defineStore('user', () => {
          const cartStore = useCartStore()
          const name = ref('John')
          
          return { name }
        })
      `,
      errors: [
        {
          messageId: 'setupCircularDependency',
        },
      ],
    },
    // Store usage in variable declaration
    {
      code: `
        export const useUserStore = defineStore('user', () => {
          const name = ref('John')
          const cart = useCartStore()
          
          return { name }
        })
      `,
      errors: [
        {
          messageId: 'setupCircularDependency',
        },
      ],
    },
    // Multiple store usages in setup
    {
      code: `
        export const useUserStore = defineStore('user', () => {
          const cartStore = useCartStore()
          const orderStore = useOrderStore()
          const name = ref('John')
          
          return { name }
        })
      `,
      errors: [
        {
          messageId: 'setupCircularDependency',
        },
        {
          messageId: 'setupCircularDependency',
        },
      ],
    },
  ],
})
