import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from '../../src'

createApp(App).use(createPinia()).mount('#app')
