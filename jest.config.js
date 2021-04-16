module.exports = {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/index.ts',
    '\\.d\\.ts$',
    'src/devtools.ts',
    'src/deprecated.ts',
  ],
  testMatch: ['<rootDir>/__tests__/**/*.spec.ts'],
  setupFilesAfterEnv: ['./__tests__/setup.ts'],
  transform: {
    '^.+\\.tsx?$': '@sucrase/jest-plugin',
  },
  globals: {
    __DEV__: true,
    __TEST__: true,
    __BROWSER__: true,
  },
}
