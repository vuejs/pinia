module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
    // "posva"
  ],
  parserOptions: {
    ecmaVersion: 2018,
    // allows `import`
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
  },
  // "env": {
  //   "jest": true
  // }
}
