import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-plus/dist/index.css'
import './assets/css/bootstrap.min.css'
import './global.css'
import 'default-passive-events'
import axios from 'axios'
import locale from 'element-plus/lib/locale/lang/zh-cn'

import "./axios"
import "./permission"
import isEmpty from './utils'


import ElementPlus from 'element-plus'

const app = createApp(App)
app.config.globalProperties.$axios = axios

app.config.globalProperties.$isEmpty = isEmpty
// app.config.globalProperties.$downLoad = "http://localhost:8080/downloadFile/"
// app.config.globalProperties.$updLoad = "http://localhost:8080/uploadFile"

app.config.globalProperties.$downLoad = "/downloadFile/"
app.config.globalProperties.$updLoad = "/uploadFile"

app.use(ElementPlus, { locale })
app.use(store).use(router).mount('#app')
