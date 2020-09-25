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
