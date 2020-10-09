# [2.0.0-alpha.5](https://github.com/posva/pinia/compare/v2.0.0-alpha.4...v2.0.0-alpha.5) (2020-10-09)

### Code Refactoring

- prefix store properties with \$ ([#254](https://github.com/posva/pinia/issues/254)) ([751f286](https://github.com/posva/pinia/commit/751f2867b97f210488eb82bad1ec05af6ab6e72c))

### BREAKING CHANGES

- all store properties (`id`, `state`, `patch`, `subscribe`, and `reset`) are now prefixed with `$` to allow properties defined with the same type and avoid types breaking. Tip: you can refactor your whole codebase with F2 (or right-click + Refactor) on each of the store's properties

# [2.0.0-alpha.4](https://github.com/posva/pinia/compare/v2.0.0-alpha.3...v2.0.0-alpha.4) (2020-09-29)

### Bug Fixes

- detach stores creation from currentInstance ([dc31736](https://github.com/posva/pinia/commit/dc317360ebebc208ca31d819953c573f6a7ac3cc))

# [2.0.0-alpha.3](https://github.com/posva/pinia/compare/v2.0.0-alpha.2...v2.0.0-alpha.3) (2020-09-28)

### Code Refactoring

- rename createStore to defineStore ([a9ad160](https://github.com/posva/pinia/commit/a9ad160bb38d6bfae3a52c66ae28793937af05d6))

### Features

- deprecation message createStore ([3054251](https://github.com/posva/pinia/commit/30542514389e4b903e7726039b98324afdafcc24))
- **ssr:** support ssr ([59709e0](https://github.com/posva/pinia/commit/59709e0851db66d337054e3aab0db987fab20f9d))

### BREAKING CHANGES

- renamed `createStore` to `defineStore`. `createStore`
  will be marked as deprecated during the alpha releases and then be
  dropped.

# [2.0.0-alpha.2](https://github.com/posva/pinia/compare/v2.0.0-alpha.1...v2.0.0-alpha.2) (2020-09-25)

### Features

- add devtools support ([849cb3f](https://github.com/posva/pinia/commit/849cb3f30559e312bf00625a42a7b697c68d9941))

# [2.0.0-alpha.1](https://github.com/posva/pinia/compare/0.1.0-alpha.1...2.0.0-alpha.1) (2020-09-22)

### Features

- access the state and getters through `this` ([#190](https://github.com/posva/pinia/issues/190)) ([6df18ef](https://github.com/posva/pinia/commit/6df18ef49472b0348b09cb84801c9c69ae79b3d9))
- merge all properties under this ([d5eaac1](https://github.com/posva/pinia/commit/d5eaac106c50be8febc25083839e7cb635ccfda7))

### BREAKING CHANGES

- `state` properties no longer need to be accessed through `store.state`
- `getters` no longer receive parameters, access the store instance via `this`:
  directly call `this.myState` to read state and other getters.
