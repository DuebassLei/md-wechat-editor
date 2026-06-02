import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { ensureModuleRegistry } from './modules'
import './assets/main.css'

ensureModuleRegistry()

createApp(App).use(router).mount('#app')
