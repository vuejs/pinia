import '@nuxt/types'
import { Pinia } from '../dist/src'

declare module '@nuxt/types' {
  export interface Context {
    pinia: Pinia
  }
}
