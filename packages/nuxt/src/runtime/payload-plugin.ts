import {
  definePayloadPlugin,
  definePayloadReducer,
  definePayloadReviver,
} from '#imports'
import { shouldHydrate } from 'pinia'

/**
 * Removes properties marked with `skipHydrate()` to avoid sending unused data to the client.
 */
const payloadPlugin = definePayloadPlugin(() => {
  definePayloadReducer(
    'skipHydrate',
    (data: unknown) => !shouldHydrate(data) && undefined
  )
  definePayloadReviver('skipHydrate', (data: undefined) => data)
})

export default payloadPlugin
