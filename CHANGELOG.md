# [2.0.0-beta.1](https://github.com/posva/pinia/compare/v2.0.0-alpha.19...v2.0.0-beta.1) (2021-06-03)

### Bug Fixes

- **types:** fix extension for TS 4.3 ([aff5c1e](https://github.com/posva/pinia/commit/aff5c1e6fb5c559d3cae103a3049046ee97ce3c0))

### Features

- remove deprecated APIs ([239aec5](https://github.com/posva/pinia/commit/239aec50f270bc9025b1c28490dbdfbc720ab9d5))
- **devtools:** add root state ([a75be78](https://github.com/posva/pinia/commit/a75be78e0d189d324c5f30ececb27cd1a61e7e77))
- **devtools:** import/export global state ([b969f2a](https://github.com/posva/pinia/commit/b969f2a9884d0794733aea1162e0c154b34dee26))
- **devtools:** load/save state ([9b503d6](https://github.com/posva/pinia/commit/9b503d6c81f45864eba299a20cfd2ec957c6884b))

# [2.0.0-alpha.19](https://github.com/posva/pinia/compare/v2.0.0-alpha.18...v2.0.0-alpha.19) (2021-05-20)

### Bug Fixes

- **devtools:** use older js ([e35da3b](https://github.com/posva/pinia/commit/e35da3be7a753ab5e4b1692395cf86cf0c314ba9))

# [2.0.0-alpha.18](https://github.com/posva/pinia/compare/v2.0.0-alpha.17...v2.0.0-alpha.18) (2021-05-17)

### Bug Fixes

- **types:** correct subtype Store ([48523da](https://github.com/posva/pinia/commit/48523da371ac291689b7a62b9ec433894a595827)), closes [#500](https://github.com/posva/pinia/issues/500)
- **types:** export types ([befc132](https://github.com/posva/pinia/commit/befc132bace0b6fdc063d25db20549faa51e50b7))

# [2.0.0-alpha.17](https://github.com/posva/pinia/compare/v2.0.0-alpha.16...v2.0.0-alpha.17) (2021-05-17)

### Bug Fixes

- **types:** forbid non existent keys on store ([e747cba](https://github.com/posva/pinia/commit/e747cba7d90ebd9ef29a379d441744aecc31db80))
- **types:** patch should unwrap refs ([b82eafc](https://github.com/posva/pinia/commit/b82eafc9e11ae820d5185359526d19dbbff0fa75))
- **types:** unwrap refs passed to state ([b2d3ac9](https://github.com/posva/pinia/commit/b2d3ac994f0d1778d82fd0e5b14915fee4c5cb2b)), closes [#491](https://github.com/posva/pinia/issues/491)

### Features

- **devtools:** add more data to actions ([e8f4b0e](https://github.com/posva/pinia/commit/e8f4b0e95192ec7d10d380776e7e9e703fe31261))
- **devtools:** allow editing state ([0bbbd69](https://github.com/posva/pinia/commit/0bbbd69db467d168770571ec0452630ff6409741))
- **devtools:** allow editing stores from components ([b808fbc](https://github.com/posva/pinia/commit/b808fbcac9915d11f5979e1781ce125327a0e6ab))
- **devtools:** display only relevant stores ([58f0af6](https://github.com/posva/pinia/commit/58f0af617b6516f69024cecb95ef8e0dd665104f))
- **devtools:** group action and their changes ([ecd993a](https://github.com/posva/pinia/commit/ecd993abfcec2e95d63fe5ccfd64080d5c89cc0b))
- **types:** allow defining custom state properties ([17fcbca](https://github.com/posva/pinia/commit/17fcbcafd30eec3af609bcc4549eee08968ea1a2))
- **types:** infer args and returned value for onAction ([f3b3bcf](https://github.com/posva/pinia/commit/f3b3bcf52a8ba86bc0927f98f53045842905c216))
- subscribe to actions with `$onAction` ([c9ce6ea](https://github.com/posva/pinia/commit/c9ce6ea55f225351bb95a47890f791134b233aad)), closes [#240](https://github.com/posva/pinia/issues/240)

### Performance Improvements

- **devtools:** avoid multiple subscriptions ([ea62f1d](https://github.com/posva/pinia/commit/ea62f1db8d82224ea0226fa5ec90da410ff31bda))

### BREAKING CHANGES

- The `type` property of the first parameter of `store.$subscribe()` has slightly changed. **In most scenarios this shouldn't affect you** as the possible values for `type` were including emojis (a bad decision...) and they are now using an enum without emojis. Emojis are used only in devtools to give a mental hint regarding the nature and origin of different events in the timeline.

- In `store.$subscribe()`'s first argument, the `storeName` property has been deprecated in favor of `storeId`.

# [2.0.0-alpha.16](https://github.com/posva/pinia/compare/v2.0.0-alpha.14...v2.0.0-alpha.16) (2021-05-04)

### Bug Fixes

- **devtools:** add all stores ([2a8515c](https://github.com/posva/pinia/commit/2a8515cef57dce9cb9d0d8f7a8a52bbc1d3b6082)), closes [#472](https://github.com/posva/pinia/issues/472)

### Features

- **devtools:** display getters in components ([810b969](https://github.com/posva/pinia/commit/810b9697fe639070c21a76119d7d7001b6db069e))

# [2.0.0-alpha.15](https://github.com/posva/pinia/compare/v2.0.0-alpha.14...v2.0.0-alpha.15) (2021-05-04)

### Bug Fixes

- **devtools:** fix devtools attach ([017795a](https://github.com/posva/pinia/commit/017795aac3e654d6c67f99437851dcfe589d20b0))

# [2.0.0-alpha.14](https://github.com/posva/pinia/compare/v2.0.0-alpha.13...v2.0.0-alpha.14) (2021-05-03)

### Features

- **devtools:** work with stores added before app.use ([#444](https://github.com/posva/pinia/issues/444)) ([21f917f](https://github.com/posva/pinia/commit/21f917f057522b7e2ff70fa8517c5941c644a577))
- **devtools:** add getters to devtools ([c4bf761](https://github.com/posva/pinia/commit/c4bf761e95b79a0831061e490ba1d69802bc9d95))
- mark getters as readonly ([fcbeb95](https://github.com/posva/pinia/commit/fcbeb95cdd7f2b7d58731392d707183b311863ff))
- **plugins:** allow chaining ([3a49d34](https://github.com/posva/pinia/commit/3a49d34f5d30c1d346243df0d043a0709b2a4861))
- **mapHelpers:** warn on array mapStores ([d385bd9](https://github.com/posva/pinia/commit/d385bd98b136be15b6aa3ac6c2c8ca9261af4635))
- pass options to context in plugins ([c8ad19f](https://github.com/posva/pinia/commit/c8ad19f6a959751d456aca93cd670d6b18064d50))
- **types:** expose PiniaPluginContext ([94d12e7](https://github.com/posva/pinia/commit/94d12e7f127125c8aa915262471e07aae9d881bf))
- add plugin api wip ([50bc807](https://github.com/posva/pinia/commit/50bc807dce932c5cbe02612505535f05dfe6325a))
- **plugins:** allow void return ([5ef7140](https://github.com/posva/pinia/commit/5ef71407764384bef13a4f46fd001beade387d24))
- **plugins:** pass a context object to plugins instead of app ([bcb4ec3](https://github.com/posva/pinia/commit/bcb4ec3422635dd57f655e58f72a9a7a1c7dba0d))
- add plugin api wip ([b5c928d](https://github.com/posva/pinia/commit/b5c928da20efc532de84d8b8498d56f306a40e03))

### Performance Improvements

- **store:** reuse store instances when possible ([14f5a5f](https://github.com/posva/pinia/commit/14f5a5fd21677e7e5673443c35eeadbe2bdd8f05))

### BREAKING CHANGES

- **store:** getters now receive the state as their first argument and it's properly typed so you can write getters with arrow functions:

  ```js
  defineStore({
    state: () => ({ n: 0 }),
    getters: {
      double: (state) => state.n * 2,
    },
  })
  ```

  To access other getters, you must still use the syntax that uses `this` **but it is now necessary to explicitly type the getter return type**. The same limitation exists in Vue for computed properties and it's a known limitation in TypeScript:

  ```ts
  defineStore({
    state: () => ({ n: 0 }),
    getters: {
      double: (state) => state.n * 2,
      // the `: number` is necessary when accessing `this` inside of
      // a getter
      doublePlusOne(state): number {
        return this.double + 1
      },
    },
  })
  ```

  For more information, refer to [the updated documentation for getters](https://pinia.esm.dev/core-concepts/getters.html).

- **plugins:** To improve the plugin api capabilities, `pinia.use()`
  now receives a context object instead of just `app`:

  ```js
  // replace
  pinia.use((app) => {})
  // with
  pinia.use(({ app }) => {})
  ```

  Check the new documentation for [Plugins](https://pinia.esm.dev/core-concepts/plugins.html)!

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
  directly call `this.myState` to read state and other getters. **Update 2021-04-02**: `getters` receive the state again as the first parameter
