// src/main.ts
import { createApp } from 'vue'

//element-plus全部导入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import '@/assets/less/index.less'
import router from './router'

import { createPinia } from 'pinia'

import '@/api/mock.ts'
import api from '@/api/api.ts'//先引入再注册

import App from './App.vue'


const app = createApp(App)
const pinia = createPinia()

//主要作用是将自定义的 API 服务实例挂载到 Vue 应用的全局上下文中
// 1.app：通过 createApp() 创建的 Vue 应用实例
// 2.config.globalProperties：Vue 应用的全局属性配置对象
// 3.$api：自定义的全局属性名（$ 前缀是 Vue 生态的命名约定）
// 4.api：你的 API 服务实例（通常是 axios 封装对象）
app.config.globalProperties.$api = api;


for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(router)
app.use(ElementPlus)
app.use(pinia)
app.mount('#app')
