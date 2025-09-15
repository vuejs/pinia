# @pinia/eslint-plugin

ESLint plugin for Pinia best practices and common patterns.

## Installation

```bash
npm install --save-dev @pinia/eslint-plugin
```

## Usage

Add `@pinia/eslint-plugin` to your ESLint configuration:

### Flat Config (ESLint 9+)

```js
// eslint.config.js
import piniaPlugin from '@pinia/eslint-plugin'

export default [
  {
    plugins: {
      '@pinia': piniaPlugin,
    },
    rules: {
      '@pinia/require-setup-store-properties-export': 'error',
      '@pinia/no-circular-store-dependencies': 'warn',
      '@pinia/prefer-use-store-naming': 'warn',
      '@pinia/no-store-in-computed': 'error',
    },
  },
]
```

### Legacy Config

```js
// .eslintrc.js
module.exports = {
  plugins: ['@pinia'],
  rules: {
    '@pinia/require-setup-store-properties-export': 'error',
    '@pinia/no-circular-store-dependencies': 'warn',
    '@pinia/prefer-use-store-naming': 'warn',
    '@pinia/no-store-in-computed': 'error',
  },
}
```

### Recommended Configuration

You can use the recommended configuration which includes sensible defaults:

```js
// eslint.config.js
import piniaPlugin from '@pinia/eslint-plugin'

export default [
  piniaPlugin.configs.recommended,
]
```

## Rules

### `@pinia/require-setup-store-properties-export`

**Type:** Problem
**Fixable:** Yes
**Recommended:** Error

Ensures that all variables and functions defined in setup stores are properly exported.

According to Pinia documentation, all variables and functions defined in a setup store should be returned from the setup function to be accessible on the store instance.

**❌ Incorrect:**
```js
export const useStore = defineStore('store', () => {
  const count = ref(0)
  const name = ref('test')

  function increment() {
    count.value++
  }

  // Missing exports for name and increment
  return { count }
})
```

**✅ Correct:**
```js
export const useStore = defineStore('store', () => {
  const count = ref(0)
  const name = ref('test')

  function increment() {
    count.value++
  }

  return { count, name, increment }
})
```

### `@pinia/no-circular-store-dependencies`

**Type:** Problem
**Recommended:** Warning

Warns about potential circular dependencies between stores and prevents store instantiation in setup function bodies.

Circular dependencies can cause issues in Pinia stores, especially when stores try to access each other's state during initialization.

**❌ Incorrect:**
```js
export const useUserStore = defineStore('user', () => {
  // Don't instantiate stores in setup function body
  const cartStore = useCartStore()
  const name = ref('John')

  return { name }
})
```

**✅ Correct:**
```js
export const useUserStore = defineStore('user', () => {
  const name = ref('John')

  function updateProfile() {
    // Use stores in actions or computed properties
    const cartStore = useCartStore()
    cartStore.clear()
  }

  return { name, updateProfile }
})
```

### `@pinia/prefer-use-store-naming`

**Type:** Suggestion
**Fixable:** Yes
**Recommended:** Warning

Enforces consistent naming conventions for Pinia stores using the "useXxxStore" pattern.

**Options:**
- `prefix` (string): Prefix for store function names (default: 'use')
- `suffix` (string): Suffix for store function names (default: 'Store')

**❌ Incorrect:**
```js
export const userStore = defineStore('user', () => {
  const name = ref('John')
  return { name }
})
```

**✅ Correct:**
```js
export const useUserStore = defineStore('user', () => {
  const name = ref('John')
  return { name }
})
```

### `@pinia/no-store-in-computed`

**Type:** Problem
**Recommended:** Error

Prevents store instantiation inside computed properties, which can cause reactivity issues.

**❌ Incorrect:**
```js
export default {
  setup() {
    const userName = computed(() => {
      const userStore = useUserStore() // Don't instantiate here
      return userStore.name
    })

    return { userName }
  }
}
```

**✅ Correct:**
```js
export default {
  setup() {
    const userStore = useUserStore() // Instantiate at top level

    const userName = computed(() => userStore.name)

    return { userName }
  }
}
```

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our GitHub repository.

## License

MIT
