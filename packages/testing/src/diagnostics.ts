import { defineDiagnostics } from 'nostics'

/**
 * Catalog of user-facing `@pinia/testing` diagnostics. These are thrown, so no
 * reporter is attached: the diagnostic is raised by the caller and its message
 * surfaces through the thrown error (attaching a console reporter would print
 * the same message twice).
 */
export const diagnostics = /*#__PURE__*/ defineDiagnostics({
  codes: {
    PINIA_TESTING_C0001: {
      why: 'You must configure the "createSpy" option.',
      fix: 'Pass a createSpy function such as vi.fn or jest.fn to createTestingPinia().',
      docs: 'https://pinia.vuejs.org/cookbook/testing.html#Specifying-the-createSpy-function',
    },
    PINIA_TESTING_C0002: {
      why: 'Invalid "createSpy" option.',
      fix: 'Pass the function itself (e.g. vi.fn), not a called spy like vi.fn().',
      docs: 'https://pinia.vuejs.org/cookbook/testing.html#Specifying-the-createSpy-function',
    },
  },
})
