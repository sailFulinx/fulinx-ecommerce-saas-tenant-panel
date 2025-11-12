import { createPinia } from 'pinia'
import { createApp } from 'vue'

import { setupI18n } from '@/utils/i18n'
import App from './App.vue'
import { initPermission } from './permission'
import router from './router'

import './assets/css/main.css'
import 'animate.css'
// import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'virtual:uno.css'

const app = createApp(App)
app.use(createPinia())

const setupAll = async () => {
  setupI18n(app)

  app.use(router)
  app.mount('#app')

  // 初始化权限
  await initPermission()
  // 初始化系统语言
  await useLanguageStore().initLanguageList()
  // 初始化偏好设置
  usePreferenceStore().getPreferences()
}

setupAll()
