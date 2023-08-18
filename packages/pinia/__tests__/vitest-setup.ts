import { beforeEach } from 'vitest'
import { setActivePinia } from '../src'

beforeEach(() => {
  setActivePinia(undefined)
})
