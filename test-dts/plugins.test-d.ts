import {
  expectType,
  createPinia,
  Store,
  Pinia,
  StateTree,
  DefineStoreOptions,
} from './'

const pinia = createPinia()

pinia.use(({ store, options, pinia }) => {
  expectType<Store>(store)
  expectType<Pinia>(pinia)
  expectType<
    DefineStoreOptions<
      string,
      StateTree,
      Record<string, any>,
      Record<string, any>
    >
  >(options)
})
