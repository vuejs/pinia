# [2.0.0-alpha.13](https://github.com/posva/pinia/compare/v2.0.0-alpha.12...v2.0.0-alpha.13) (2021-04-10)

### Bug Fixes

- **subscribe:** remove subscription when unmounted ([10e1c30](https://github.com/posva/pinia/commit/10e1c3069a23f3a9c0d1e32cbc1fbb074709173e))

### Features

- **types:** fail on async patch ([c254a8a](https://github.com/posva/pinia/commit/c254a8abc73d7e2589acbffe432a33f985c1003d))

# [2.0.0-alpha.12](https://github.com/posva/pinia/compare/v2.0.0-alpha.11...v2.0.0-alpha.12) (2021-04-09)

### Bug Fixes

- **store:** avoid multiple subscriptions call ([71404cb](https://github.com/posva/pinia/commit/71404cb3ef6466c74b72c5fdb1075740a788a309)), closes [#429](https://github.com/posva/pinia/issues/429) [#430](https://github.com/posva/pinia/issues/430)

# [2.0.0-alpha.11](https://github.com/posva/pinia/compare/v2.0.0-alpha.10...v2.0.0-alpha.11) (2021-04-09)

### Bug Fixes

- **types:** enable autocomplete in object ([b299ff0](https://github.com/posva/pinia/commit/b299ff070101dc9d17ceb24bd43d697033695167))

### Features

- mapWritableState ([3218bdb](https://github.com/posva/pinia/commit/3218bdbb916049bebf1416cef1c103ecda66274b))
- **mapState:** accept functions ([e2f2b92](https://github.com/posva/pinia/commit/e2f2b92f41f1908bfa6614655e625cbfcae5a716))
- **mapStores:** allow custom suffix ([c957fb9](https://github.com/posva/pinia/commit/c957fb97f1b1ffdb927f40dfa0abd0304a8eb998))
- **types:** allow extending mapStores suffix ([f14c7b9](https://github.com/posva/pinia/commit/f14c7b996dd8232370033c671566c4cafdf535bc))
- add mapActions ([b5d27fb](https://github.com/posva/pinia/commit/b5d27fbd34b006ae7aec01c091d4e246c3fa73fc))
- add mapStores ([d3d9327](https://github.com/posva/pinia/commit/d3d9327918081feaffe63b7debf4e5dbbcf55890))
- mapState with array ([0e05811](https://github.com/posva/pinia/commit/0e058113668f8c9a81d09e7175d89ea921142c31))
- mapState with object ([06805db](https://github.com/posva/pinia/commit/06805db9b4526cc0741016e0632cd6fb353a9728))
- **types:** expose DefineStoreOptions ([c727070](https://github.com/posva/pinia/commit/c72707070a5096df62a4bab269ce9087e2d9c102))

# [2.0.0-alpha.10](https://github.com/posva/pinia/compare/v2.0.0-alpha.9...v2.0.0-alpha.10) (2021-04-01)

### Features

- **patch:** allow passing a function ([8d545e4](https://github.com/posva/pinia/commit/8d545e427c6415df00254eb9638116e96e64d3b5))
- **types:** generics on PiniaCustomProperties ([36129cf](https://github.com/posva/pinia/commit/36129cf415abb8efccda859cd6b787594fe46f00))

# [2.0.0-alpha.9](https://github.com/posva/pinia/compare/v2.0.0-alpha.8...v2.0.0-alpha.9) (2021-03-31)

### Bug Fixes

- **types:** pass custom properties to stores ([d26df6e](https://github.com/posva/pinia/commit/d26df6e1133fc8dff58312df36ff2af6f129a560))

# [2.0.0-alpha.8](https://github.com/posva/pinia/compare/v2.0.0-alpha.7...v2.0.0-alpha.8) (2021-03-29)

### Bug Fixes

- use assign instead of spread ([b2bb5ba](https://github.com/posva/pinia/commit/b2bb5ba4faf52c41479a7d77490b85016b853229))
- **cjs:** ensure dev checks on cjs build ([a255735](https://github.com/posva/pinia/commit/a255735211b796120d5f76470ea18759f1eb5d97))

### Features

- **devtools:** logo and titles ([0963fd0](https://github.com/posva/pinia/commit/0963fd0b647b0e5414782f78167c770cbab24a83))

# [2.0.0-alpha.7](https://github.com/posva/pinia/compare/v2.0.0-alpha.6...v2.0.0-alpha.7) (2021-01-21)

### Bug Fixes

- resilient _VUE_DEVTOOLS_TOAST_ ([#334](https://github.com/posva/pinia/issues/334)) ([c0cacd2](https://github.com/posva/pinia/commit/c0cacd2631d76d9d6de2b16d4106ad7decb51217))

### Features

- enable calling `useStore()` in client ([c949b80](https://github.com/posva/pinia/commit/c949b80391cae322f024b8cc369be351d5d6a693))
- store plugins ([f027bf5](https://github.com/posva/pinia/commit/f027bf587b37c7fc30eba4da5f90d52d99e6536d))

# [2.0.0-alpha.6](https://github.com/posva/pinia/compare/v2.0.0-alpha.5...v2.0.0-alpha.6) (2020-12-31)

### Bug Fixes

- correct lifespan of stores ([483335c](https://github.com/posva/pinia/commit/483335c6660d593cf33468c1ab8c95da82cc392a)), closes [#255](https://github.com/posva/pinia/issues/255)

### Features

- **types:** export used types ([dc56fba](https://github.com/posva/pinia/commit/dc56fbafa21d8efa2a4b61ffb464f1befa25e34c)), closes [#315](https://github.com/posva/pinia/issues/315)

### BREAKING CHANGES

- `setActiveReq()` has been renamed to
  `setActivePinia()`. And now receives the application's pinia as the
  first parameter instead of an arbitrary object (like a Node http
  request). **This affects particularly users doing SSR** but also
  enables them to write universal code.

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
