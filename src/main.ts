
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import { dayjs } from 'element-plus'
import 'dayjs/locale/ru'
import { vMaska } from 'maska/vue'
import App from '@/App.vue'
import router from '@/router'
import '@/assets/styles/_element-variables.scss'
import 'styles/index.scss'

// Configure dayjs
dayjs.locale('ru')

// Create Vue app
const app = createApp(App)

// Use plugins
app.use(ElementPlus)
app.use(createPinia())
app.use(router)

// Directives
app.directive('maska', vMaska)

// Error handling
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err)
  console.error('Vue instance:', vm)
  console.error('Error info:', info)
}

// Performance monitoring
app.config.performance = true

// Mount app
app.mount('#app')
