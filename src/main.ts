import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { ensureModuleRegistry } from './modules'
import { initAppTheme } from './composables/useAppTheme'
import { initColorScheme } from './composables/useColorScheme'
import { warmImageStoreCache } from './engine/image-pipeline'
import './assets/main.css'

initAppTheme()
initColorScheme()
ensureModuleRegistry()
void warmImageStoreCache()

createApp(App).use(router).mount('#app')
