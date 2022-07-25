module.exports = {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  collectCoverageFrom: [
    'packages/pinia/src/**/*.ts',
    'packages/testing/src/**/*.ts',
    '!packages/testing/**/*.spec.ts',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/index.ts',
    '\\.d\\.ts$',
    'src/devtools',
    'src/hmr',
    'src/deprecated.ts',
    'src/vue2-plugin.ts',
  ],
  testMatch: [
    '<rootDir>/packages/pinia/__tests__/**/*.spec.ts',
    '<rootDir>/packages/testing/**/*.spec.ts',
  ],
  transform: {
    '^.+\\.tsx?$': '@sucrase/jest-plugin',
  },
  moduleNameMapper: {
    '^@pinia/(.*?)$': '<rootDir>/packages/$1/src',
    '^pinia$': '<rootDir>/packages/pinia/src',
  },
  rootDir: __dirname,
  globals: {
    __DEV__: true,
    __TEST__: true,
    __BROWSER__: true,
  },
  // https://github.com/vuejs/test-utils/issues/1525#issuecomment-1134620421
  testEnvironmentOptions: {
    customExportConditions: ['node', 'node-addons'],
  },
}
