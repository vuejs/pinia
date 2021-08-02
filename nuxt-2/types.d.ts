import '@nuxt/types'
import 'pinia'
import { Pinia } from 'pinia'
import { Context } from '@nuxt/types'

declare module '@nuxt/types' {
  export interface Context {
    pinia: Pinia
    $pinia: Pinia
  }
}

declare module 'pinia' {
  export interface PiniaCustomProperties {
    $nuxt: Context
  }
}
