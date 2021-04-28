import { expectType, createPinia, GenericStore } from '.'

const pinia = createPinia()

pinia.use(({ store }) => {
  expectType<GenericStore>(store)
})
