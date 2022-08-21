import { useNuxtApp } from '#imports'
export * from 'pinia'

export const usePinia = () => useNuxtApp().$pinia
