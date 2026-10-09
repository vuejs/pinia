import type { VitePlugin } from '@nuxt/schema'

export function autoRegisterHMRPlugin(rootDir: string) {
  return {
    name: 'pinia:auto-hmr-registration',

    transform(code, id) {
      if (id.startsWith('\x00')) return
      if (!id.startsWith(rootDir)) return
      if (!code.includes('defineStore') || code.includes('acceptHMRUpdate')) {
        return
      }

      const ast = this.parse(code)

      // walk top-level nodes
      for (const n of ast.body) {
        if (
          n.type === 'VariableDeclaration' ||
          n.type === 'ExportNamedDeclaration'
        ) {
          // find export or variable declaration that uses `defineStore`
          const declarations =
            n.type === 'VariableDeclaration'
              ? n.declarations
              : n.declaration?.type === 'VariableDeclaration'
                ? n.declaration?.declarations
                : undefined

          const storeDeclaration = declarations?.find(
            (x) =>
              x.init?.type === 'CallExpression' &&
              x.init.callee.type === 'Identifier' &&
              x.init.callee.name === 'defineStore'
          )

          // retrieve the variable name
          const storeName =
            storeDeclaration?.id.type === 'Identifier' &&
            storeDeclaration.id.name
          if (storeName) {
            // append HMR code
            return {
              code: [
                `import { acceptHMRUpdate } from 'pinia'`,
                code,
                'if (import.meta.hot) {',
                `  import.meta.hot.accept(acceptHMRUpdate(${storeName}, import.meta.hot))`,
                '}',
              ].join('\n'),
            }
          }
        }
      }
    },
  } satisfies VitePlugin
}
