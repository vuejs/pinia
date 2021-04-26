module.exports = {
  testEnvironment: 'jsdom',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/index.ts',
    '\\.d\\.ts$',
    'src/devtools.ts',
    'src/deprecated.ts',
  ],
  testMatch: ['<rootDir>/__tests__/**/*.spec.ts'],
  transform: {
    '^.+\\.tsx?$': '@sucrase/jest-plugin',
  },
  globals: {
    __DEV__: true,
    __TEST__: true,
    __BROWSER__: true,
  },
}
