import { getActivePinia } from 'pinia'

export function useRouter() {
  return getActivePinia()?._a.config.globalProperties.$router!
}

export function useRoute() {
  return getActivePinia()?._a.config.globalProperties.$route!
}
