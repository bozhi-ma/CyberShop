/*
 * 应用入口文件
 * 初始化Vue应用、全局配置、挂载根组件
 */

import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import router from './router'
import { initAccessibility } from './utils/accessibility'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(ElementPlus)
app.use(pinia)
app.use(router)

// 初始化无障碍访问功能
initAccessibility()

app.mount('#app')
