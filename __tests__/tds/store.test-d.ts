import { createStore } from '../../src'
import { expectType } from 'tsd'

expectType<{ a: 'on' | 'off' }>(
  createStore('name', { a: 'on' as 'on' | 'off' }).state
)
