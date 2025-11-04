import { skipHydrate } from 'pinia'

export const useWithSkipHydrateStore = defineStore('with-skip-hydrate', () => {
  const skipped = skipHydrate(
    ref({
      text: 'I should not be serialized or hydrated',
    })
  )
  return { skipped }
})
