import { useNuxtApp } from '#imports'
import { defineStore } from 'pinia'

export const usePinia = () => useNuxtApp().$pinia

export const definePiniaStore = defineStore
