import { App } from 'vue'
import {
  expectType,
  createPinia,
  Store,
  Pinia,
  StateTree,
  DefineStoreOptionsInPlugin,
} from './'

const pinia = createPinia()

pinia.use(({ store, app, options, pinia }) => {
  expectType<Store>(store)
  expectType<Pinia>(pinia)
  expectType<App>(app)
  expectType<
    DefineStoreOptionsInPlugin<
      string,
      StateTree,
      Record<string, any>,
      Record<string, any>
    >
  >(options)
})
