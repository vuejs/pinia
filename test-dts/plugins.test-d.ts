import { App } from 'vue'
import {
  expectType,
  createPinia,
  GenericStore,
  Store,
  Pinia,
  StateTree,
  DefineStoreOptions,
} from '.'

const pinia = createPinia()

pinia.use(({ store, app, options, pinia }) => {
  expectType<GenericStore>(store)
  expectType<Store>(store)
  expectType<Pinia>(pinia)
  expectType<App>(app)
  expectType<
    DefineStoreOptions<
      string,
      StateTree,
      Record<string, any>,
      Record<string, any>,
      boolean
    >
  >(options)
})
