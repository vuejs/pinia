import { useNuxtApp } from '#app'
export * from 'pinia'

export const usePinia = () => useNuxtApp().$pinia
