## [0.5.4](https://github.com/posva/pinia/compare/v0.5.3...v0.5.4) (2021-08-16)

### Bug Fixes

- **nuxt:** make `$nuxt` non enumerable ([df75778](https://github.com/posva/pinia/commit/df75778917ed1543a8be73d5bbfa32750f811ab2)), closes [#574](https://github.com/posva/pinia/issues/574)

### Features

- **nuxt:** resolve in mono repos ([4716b5e](https://github.com/posva/pinia/commit/4716b5ea0f335bd8a1d582c60e6ce7e49c6bca3e))

## [0.5.3](https://github.com/posva/pinia/compare/v0.5.2...v0.5.3) (2021-08-02)

### Bug Fixes

- markRaw on pinia ([208e6c0](https://github.com/posva/pinia/commit/208e6c00d2d6077b818a7f99f000b177a1f96107))
- **patch:** avoid merging reactive objects ([581bd08](https://github.com/posva/pinia/commit/581bd08d978050fc5b9e8c6b32147cf3798b33cb)), closes [#528](https://github.com/posva/pinia/issues/528)
- **types:** forbid non existent access in getters and actions ([29eee8a](https://github.com/posva/pinia/commit/29eee8a3eba5f426a05315dd05c1a7eaf69a6758))
- **types:** remove state properties from this ([7990adf](https://github.com/posva/pinia/commit/7990adfffa39d14a0d458e6d8a0f341e61441693))

## [0.5.2](https://github.com/posva/pinia/compare/v0.5.1...v0.5.2) (2021-06-03)

### Bug Fixes

- **types:** fix extension for TS 4.3 ([e46f4b8](https://github.com/posva/pinia/commit/e46f4b877687cab18377622dee2560e8fa295e39))

## [0.5.1](https://github.com/posva/pinia/compare/v0.5.0...v0.5.1) (2021-05-17)

### Bug Fixes

- **type:** export forgotten types ([b3909c7](https://github.com/posva/pinia/commit/b3909c739263ce3b1f57d4af6b9a398e7db67ef8))
- **types:** correct subtype Store ([65d4ab3](https://github.com/posva/pinia/commit/65d4ab325ea20311bdcb41bd2e16ab873ae8a2dc)), closes [#500](https://github.com/posva/pinia/issues/500)

# [0.5.0](https://github.com/posva/pinia/compare/v0.4.1...v0.5.0) (2021-05-17)

### Bug Fixes

- **types:** forbid non existent keys on store ([9513d1a](https://github.com/posva/pinia/commit/9513d1a2eeb2e03bb76bc295aec7bc70fdece3a6))
- **types:** patch should unwrap refs ([9668167](https://github.com/posva/pinia/commit/9668167fcdff2da2733fef92c941b1eedf13233a))
- **types:** unwrap refs passed to state ([c29b1e0](https://github.com/posva/pinia/commit/c29b1e082c8b76800089f9ded47e7c84a8471799)), closes [#491](https://github.com/posva/pinia/issues/491)

### Features

- **types:** allow defining custom state properties ([34cef9b](https://github.com/posva/pinia/commit/34cef9b9b223a9132e5a1745bc858a19d91af130))
- subscribe to actions with `$onAction` ([57d8503](https://github.com/posva/pinia/commit/57d8503d31df7b54438c5b79b987f99b15e72a79)), closes [#240](https://github.com/posva/pinia/issues/240)

### BREAKING CHANGES

- The `type` property of the first parameter of `store.$subscribe()` has slightly changed. **In most scenarios this shouldn't affect you** as the possible values for `type` were including emojis (a bad decision...) and they are now using an enum without emojis. Emojis are used only in devtools to give a mental hint regarding the nature and origin of different events in the timeline.

- In `store.$subscribe()`'s first argument, the `storeName` property has been deprecated in favor of `storeId` (This is not really a breaking change _yet_).

## [0.4.1](https://github.com/posva/pinia/compare/v0.4.0...v0.4.1) (2021-05-05)

### Bug Fixes

- **nuxt:** inject Vue before rendering ([309bf8f](https://github.com/posva/pinia/commit/309bf8f8033bab330f9073261fc45d126fb420db)), closes [#473](https://github.com/posva/pinia/issues/473)

# [0.4.0](https://github.com/posva/pinia/compare/v0.3.1...v0.4.0) (2021-05-03)

### Features

- **pinia:** allow chaining pinia.use ([d5e7a6e](https://github.com/posva/pinia/commit/d5e7a6ea30bc4e1b3e4aa734fa0154258c9003c7))
- **plugins:** pass a context object to plugins instead of app ([8176db4](https://github.com/posva/pinia/commit/8176db4e7edf3e2d77738437fbab73ffea0aee30))
- **plugins:** pass options to plugins ([4d750ad](https://github.com/posva/pinia/commit/4d750adc05a2753f4abfae112fbeb1f2bc212a23))
- **store:** pass state to getters as first argument ([9f3132b](https://github.com/posva/pinia/commit/9f3132bd7a59c47f3bd9005695c4f1224dbaea16))
- **types:** fail on async patch ([fe58fab](https://github.com/posva/pinia/commit/fe58fab1bdf95a4924672459aec88b1f4f87d0ba))

### Performance Improvements

- **store:** reuse stores from parent to children components ([fcfda41](https://github.com/posva/pinia/commit/fcfda419efb1e40d68f8c75a6f441da453b9207b))

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

  To access other getters, you must still use the syntax that uses `this` **but it is now necessary to explicitely type the getter return type**. The same limitation exists in Vue for computed properties and it's a known limitation in TypeScript:

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
  now receives a context object instead of just `pinia`:

  ```js
  // replace
  pinia.use((pinia) => {})
  // with
  pinia.use(({ pinia, store }) => {})
  ```

  Check the new documentation for [Plugins](https://pinia.esm.dev/core-concepts/plugins.html)!

## [0.3.1](https://github.com/posva/pinia/compare/v0.3.0...v0.3.1) (2021-04-10)

### Bug Fixes

- **store:** avoid multiple subscriptions call ([60df4d5](https://github.com/posva/pinia/commit/60df4d51e3c1ca7980c452d4d38eeac88b948acf)), closes [#429](https://github.com/posva/pinia/issues/429) [#430](https://github.com/posva/pinia/issues/430)
- **subscribe:** remove subscription when unmounted ([455ad95](https://github.com/posva/pinia/commit/455ad955ea4220d8434c327c6e54521a1ca93141))

# [0.3.0](https://github.com/posva/pinia/compare/v0.2.5...v0.3.0) (2021-04-09)

### Bug Fixes

- **types:** enable autocomplete in object ([5012611](https://github.com/posva/pinia/commit/50126119f6672a7c0a9efdd9c2e25eb5a6427dc0))

### Features

- mapWritableState ([6eb04da](https://github.com/posva/pinia/commit/6eb04dae5cff92fc90a27a804c6dc54a2e25635c))
- **mapState:** accept functions ([6e09db6](https://github.com/posva/pinia/commit/6e09db651c2674e35dfd9fb65c542a5bf147e7a6))
- **mapStores:** allow custom suffix ([633dbb1](https://github.com/posva/pinia/commit/633dbb1de8e2ad68ef799c4d530363692e7b967b))
- **types:** allow extending mapStores suffix ([90a0326](https://github.com/posva/pinia/commit/90a0326d0892cfda469fa524e32a6d01ebe1dd3d))
- add mapActions ([32c28e3](https://github.com/posva/pinia/commit/32c28e33fd636712faa830f91f675aebdb4f6093))
- add mapStores ([ac20f59](https://github.com/posva/pinia/commit/ac20f59adcd175981cbaac2aff9e08d57363adab))
- mapState with array ([41a7ad0](https://github.com/posva/pinia/commit/41a7ad0fbcedfbe33d340a476bc15545d92c2471))
- mapState with object ([a4eb4af](https://github.com/posva/pinia/commit/a4eb4af337d31f9d20e3c3bffc62a251b2ab644a))

## [0.2.5](https://github.com/posva/pinia/compare/v0.2.4...v0.2.5) (2021-04-01)

### Features

- allow passing a function to $patch ([3be1c81](https://github.com/posva/pinia/commit/3be1c81eabd726780ce6b5d1919a2f60d72b3e84))
- **types:** generic on PiniaCustomProperties ([9fedc04](https://github.com/posva/pinia/commit/9fedc045af8d1cdb57f805a9457557fc905df8d6))

## [0.2.4](https://github.com/posva/pinia/compare/v0.2.3...v0.2.4) (2021-03-31)

### Bug Fixes

- **nuxt:** automatically transpile pinia ([7c03691](https://github.com/posva/pinia/commit/7c0369194f6518ab5ea221f4a260f9b4506f222b))

## [0.2.3](https://github.com/posva/pinia/compare/v0.2.2...v0.2.3) (2021-03-31)

### Bug Fixes

- **types:** add PiniaCustomProperties to stores ([a12d96d](https://github.com/posva/pinia/commit/a12d96db6d981d4af023360018bd1c6a6658ff8e))
- **types:** pass custom properties to actions and getters ([6a5326f](https://github.com/posva/pinia/commit/6a5326f3acd6e1244401bf276964c348e6cb8721))

## [0.2.2](https://github.com/posva/pinia/compare/v0.2.1...v0.2.2) (2021-03-31)

This build exposes the `exports` option in `package.json`, please report any errors you find.

### Bug Fixes

- use inject in nuxt plugin ([d768a43](https://github.com/posva/pinia/commit/d768a438e99e0eb81893922c049a61b5ea077443))

## [0.2.1](https://github.com/posva/pinia/compare/v0.2.0...v0.2.1) (2021-03-23)

### Bug Fixes

- **devtools:** time travel and state display ([043ae2a](https://github.com/posva/pinia/commit/043ae2ac229b55087d962432b7501483403742e2)), closes [#394](https://github.com/posva/pinia/issues/394) [#19](https://github.com/posva/pinia/issues/19)

# [0.2.0](https://github.com/posva/pinia/compare/0.1.0...0.2.0) (2021-03-08)

### Bug Fixes

- only set state provider if a state exists ([#248](https://github.com/posva/pinia/issues/248)) ([3634847](https://github.com/posva/pinia/commit/363484735b5402b45d47ebd7dc2dfde4f00660d6))
- outlive components lifespan ([8516c48](https://github.com/posva/pinia/commit/8516c4828415c658a1b6b7587ce9277f7b6a02a9)), closes [#370](https://github.com/posva/pinia/issues/370)

### Continuous Integration

- add size check ([df59e90](https://github.com/posva/pinia/commit/df59e90422243d36f33cb7cb6c13fb3d30ca0cba))

### Features

- **nuxt:** add buildModule ([b1566f7](https://github.com/posva/pinia/commit/b1566f7586cbd8f444fff48da4b5a8dfb5cb0951))
- **nuxt:** expose nuxt context as $nuxt ([73c48be](https://github.com/posva/pinia/commit/73c48be04d2899ad92d0a2d8a2df210025ebd14a))
- add PiniaPlugin ([b3db04a](https://github.com/posva/pinia/commit/b3db04a807ffdc50e53b4ee7d5a2f2a818da881a))
- deprecate createStore in favor of defineStore ([76c3f95](https://github.com/posva/pinia/commit/76c3f9594615377dca5b5398b613e411360f6af3))

### BREAKING CHANGES

- files in dist folder are renamed to match official libs in the Vue ecosystem. Unless you were importing from `pinia/dist`, this won't affect you.
- It's now necessary to create a pinia instance and
  install it:

  ```js
  import { createPinia, PiniaPlugin } from 'pinia'

  const pinia = createPinia()
  Vue.use(PiniaPlugin)

  new Vue({
    el: '#app',
    pinia,
    // ...
  })
  ```

  The `pinia` instance can be passed to `useStore(pinia)` when called
  outside of a `setup()` function. Check the SSR section of the docs for
  more details.

- `setActiveReq()` and `getActiveReq()` have been
  replaced with `setActivePinia()` and `getActivePinia()` respectively.
  `setActivePinia()` can only be passed a `pinia` instance created with
  `createPinia()`.
- Since req as a parameter was replaced with `pinia`,
  `getRootState` is no longer necessary. Replace it with
  `pinia.state.value` to **read and write** the root state`.
- `PiniaSsr` is no longer necessary and has been removed.

# [0.1.0](https://github.com/posva/pinia/compare/0.0.7...0.1.0) (2020-09-22)

### Features

- access the state and getters through `this` ([#190](https://github.com/posva/pinia/issues/190)) ([7bb7733](https://github.com/posva/pinia/commit/7bb7733ff85c6a908c9090da2762186d7afefac5))

### BREAKING CHANGES

- there is no longer a `state` property on the store, you need to directly access it. `getters` no longer receive parameters, directly call `this.myState` to read state and other getters

## [0.0.7](https://github.com/posva/pinia/compare/0.0.6...0.0.7) (2020-07-13)

### Bug Fixes

- make pinia work with nuxt Composition API plugin ([#180](https://github.com/posva/pinia/issues/180)) ([f4e2583](https://github.com/posva/pinia/commit/f4e25832628b25036657be2719e14917d84e74bd)), closes [#179](https://github.com/posva/pinia/issues/179)

## [0.0.6](https://github.com/posva/pinia/compare/0.0.5...0.0.6) (2020-05-25)

### Bug Fixes

- avoid nuxtContext in spa mode ([#170](https://github.com/posva/pinia/issues/170)) ([a0d10f9](https://github.com/posva/pinia/commit/a0d10f93aa65f63fd2d2befa9291707a01ba7667))

### Features

- support raw Vue SSR ([#90](https://github.com/posva/pinia/issues/90)) ([91d7b38](https://github.com/posva/pinia/commit/91d7b380868f53a8ed2fc14ca7a5dbb4d81493f5))

## [0.0.5](https://github.com/posva/pinia/compare/0.0.4...0.0.5) (2020-01-20)

### Bug Fixes

- bind the actions to the store ([5e262da](https://github.com/posva/pinia/commit/5e262da851716bfcada9b7c5297e54c2dded33cf))

### Features

- add nuxt module ([4c0ef7a](https://github.com/posva/pinia/commit/4c0ef7aab23469644ff1e6f388dfcc579c154ba3))
- allow empty state option to make it easy to group stores ([810e0f0](https://github.com/posva/pinia/commit/810e0f0a1d4439438c68df711960d3b7453c0460))
- allow passing the req to useStore ([f250622](https://github.com/posva/pinia/commit/f25062236fc4105bca3165f8fffc3cf3239cf669))
- allow useStore to be called within a store ([fdf6b45](https://github.com/posva/pinia/commit/fdf6b45bff84e039d716ee5e24fc38cf652ad667))
- allow using getters in other getters ([859eeb3](https://github.com/posva/pinia/commit/859eeb3b348bed07faa8583c46d1747f9362f213))
- export types, support state hydration ([89996ed](https://github.com/posva/pinia/commit/89996ed89bb793475ef17e6eaf427518931a56b5))
- handle SSR state hydration ([2998d53](https://github.com/posva/pinia/commit/2998d53272856d64587d5e880f7dca41775356f0))
- state hydration ([db72247](https://github.com/posva/pinia/commit/db722474fceb5a9090136e2fdf4a706b3dd22d88))

## [0.0.4](https://github.com/posva/pinia/compare/0.0.3...0.0.4) (2020-01-09)

### Bug Fixes

- loose TS type for StateTree ([092f169](https://github.com/posva/pinia/commit/092f169b1d0fe42f75becc0749b54561d5029dd4)), closes [#47](https://github.com/posva/pinia/issues/47)

## [0.0.3](https://github.com/posva/pinia/compare/v0.0.1...0.0.3) (2019-12-31)

### Bug Fixes

- global vueCompositionApi name ([a23acef](https://github.com/posva/pinia/commit/a23acef17e692af4822278dc5811c2f52e174f1b))

## [0.0.1](https://github.com/posva/pinia/compare/06aeef54e2cad66696063c62829dac74e15fd19e...v0.0.1) (2019-11-26)

### Features

- add getters ([ad50755](https://github.com/posva/pinia/commit/ad5075589e9e52a3559f0800421faf0430fed674))
- add initial version ([06aeef5](https://github.com/posva/pinia/commit/06aeef54e2cad66696063c62829dac74e15fd19e))
- make getters optional ([18b5756](https://github.com/posva/pinia/commit/18b5756b97d4551acc18667468be60e524159bbf))
- make getters optional ([341fba8](https://github.com/posva/pinia/commit/341fba875d96b9db4053877fa23a37d59b4b57e6))
- use function to build state ([150e4e1](https://github.com/posva/pinia/commit/150e4e19371782dfda7e92a8bbf000c07341dc11))
