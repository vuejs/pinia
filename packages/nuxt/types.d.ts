import '@nuxt/app'
import 'pinia'
import { Pinia } from 'pinia'

// declare module '@nuxt/app' {
//   export interface Context {
//     pinia: Pinia
//     $pinia: Pinia
//   }
// }

declare module 'pinia' {
  export interface PiniaCustomProperties {
    $nuxt: Context
  }
}
