import { createConsoleReporter, defineDiagnostics } from 'nostics'

/**
 * Catalog of user-facing Pinia diagnostics. Each handle builds a diagnostic
 * and runs the reporters. All call sites are dev-only (`__DEV__` guarded or
 * HMR), so production builds drop the calls and tree-shake this catalog.
 */
export const diagnostics = /*#__PURE__*/ defineDiagnostics({
  reporters: [/*#__PURE__*/ createConsoleReporter()],
  codes: {
    PINIA_R1001: {
      why: 'Directly pass all stores to "mapStores()" without putting them in an array. This will fail in production.',
      fix: 'Replace mapStores([useAuthStore, useCartStore]) with mapStores(useAuthStore, useCartStore).',
      docs: 'https://pinia.vuejs.org/cookbook/options-api.html#Giving-access-to-the-whole-store',
    },
    PINIA_R1002: {
      why: (p: { name: string; id: string }) =>
        `A getter cannot have the same name as another state property. Found "${p.name}" in store "${p.id}".`,
      fix: 'Rename either the getter or the state property.',
      docs: 'https://pinia.vuejs.org/core-concepts/getters.html#Accessing-other-getters',
    },
    PINIA_R1003: {
      why: (p: { id: string }) =>
        `The "state" must be a plain object. Found in store "${p.id}".`,
      fix: 'Return a plain object, e.g. avoid state: () => new MyClass().',
      docs: 'https://pinia.vuejs.org/core-concepts/state.html#State',
    },
    PINIA_R1004: {
      why: 'Pinia instance not found in context. This falls back to the global activePinia, which exposes you to cross-request pollution on the server.',
      fix: '"useStore()" is a composable and follows the same rules: call it at the top of setup() (or another composable), or pass the pinia instance explicitly when used outside of a component.',
      docs: 'https://pinia.vuejs.org/ssr/#Using-the-store-outside-of-setup-',
    },
    PINIA_R1005: {
      why: (p: { from: string; to: string }) =>
        `The store id changed from "${p.from}" to "${p.to}", forcing a reload.`,
      docs: 'https://pinia.vuejs.org/cookbook/hot-module-replacement.html#HMR-Hot-Module-Replacement-',
    },
  },
})
