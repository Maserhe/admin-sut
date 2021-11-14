import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-plus/dist/index.css'
import './assets/css/bootstrap.min.css'
import './global.css'
import axios from 'axios'
import locale from 'element-plus/lib/locale/lang/zh-cn'

import "./axios"
import "./permission"
import isEmpty from './utils'


import ElementPlus from 'element-plus'

const app = createApp(App)
app.config.globalProperties.$axios = axios

app.config.globalProperties.$isEmpty = isEmpty

app.use(ElementPlus, { locale })
app.use(store).use(router).mount('#app')
