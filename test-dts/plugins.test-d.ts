import {
  expectType,
  createPinia,
  GenericStore,
  Pinia,
  StateTree,
  DefineStoreOptions,
} from './'

const pinia = createPinia()

pinia.use(({ store, options, pinia }) => {
  expectType<GenericStore>(store)
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
