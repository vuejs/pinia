/**
 * @fileoverview Tests for no-store-in-computed rule
 */

import { RuleTester } from '@typescript-eslint/rule-tester'
import { noStoreInComputed } from '../no-store-in-computed'

const ruleTester = new RuleTester({
  languageOptions: {
    parser: require('@typescript-eslint/parser'),
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
  },
})

ruleTester.run('no-store-in-computed', noStoreInComputed, {
  valid: [
    // Store instantiated outside computed
    {
      code: `
        export default {
          setup() {
            const userStore = useUserStore()
            
            const userName = computed(() => userStore.name)
            
            return { userName }
          }
        }
      `,
    },
    // No store usage in computed
    {
      code: `
        export default {
          setup() {
            const count = ref(0)
            
            const double = computed(() => count.value * 2)
            
            return { double }
          }
        }
      `,
    },
    // Store usage in regular function
    {
      code: `
        export default {
          setup() {
            function handleClick() {
              const userStore = useUserStore()
              userStore.updateName('New Name')
            }
            
            return { handleClick }
          }
        }
      `,
    },
  ],
  invalid: [
    // Store instantiated inside computed
    {
      code: `
        export default {
          setup() {
            const userName = computed(() => {
              const userStore = useUserStore()
              return userStore.name
            })
            
            return { userName }
          }
        }
      `,
      errors: [
        {
          messageId: 'noStoreInComputed',
        },
      ],
    },
    // Multiple store usages in computed
    {
      code: `
        export default {
          setup() {
            const summary = computed(() => {
              const userStore = useUserStore()
              const cartStore = useCartStore()
              return \`\${userStore.name} has \${cartStore.items.length} items\`
            })
            
            return { summary }
          }
        }
      `,
      errors: [
        {
          messageId: 'noStoreInComputed',
        },
        {
          messageId: 'noStoreInComputed',
        },
      ],
    },
    // Store usage in arrow function computed
    {
      code: `
        export default {
          setup() {
            const userName = computed(() => useUserStore().name)
            
            return { userName }
          }
        }
      `,
      errors: [
        {
          messageId: 'noStoreInComputed',
        },
      ],
    },
  ],
})
