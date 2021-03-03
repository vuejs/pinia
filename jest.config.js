module.exports = {
  preset: 'ts-jest',
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '!<rootDir>/src/devtools.ts'],
  testMatch: ['<rootDir>/__tests__/**/*.spec.ts'],
  setupFilesAfterEnv: ['./__tests__/setup.ts'],
  globals: {
    __DEV__: true,
    __TEST__: true,
    __BROWSER__: true,
    'ts-jest': {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
  testURL: 'http://localhost/',
}
