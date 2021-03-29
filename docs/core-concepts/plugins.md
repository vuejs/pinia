# Plugins

Pinia stores can be fully extended thanks to a low level API. Here is a list of things you can do:

- Add new properties to stores
- Add new methods to stores
- Wrap existing methods
- Change or even cancel actions
- Implement side effects like local storage
- Apply **only** to specific stores

Plugins are added to pinia with `pinia.use()`. The simplest example is adding a property to all stores by returning an object:

```js
// add a property named `secret` to every store that is created after this plugin is installed
pinia.use(() => ({ secret: 'the cake is a lie' }))

// in another file
const store = useStore()
store.secret // 'the cake is a lie'
```

## TypeScript

When adding new properties to stores
