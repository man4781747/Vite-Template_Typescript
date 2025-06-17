import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/index'
import PopoutMessagePlugin from '@/components/popoutMessageBox/PopoutMessagePlugin' // Added
import { createPinia } from 'pinia'

import WebsocketManagerPlugin from '@/components/websocketManager/websocketManagerPlugin' // Added



import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

import '@/index.css'

// https://cn.vitejs.dev/guide/features.html#glob-import
// 這樣做可以import json格式檔案
// import field from './test.json'
// console.log(field)
const pinia = createPinia()
createApp(App).use(pinia).use(router).use(PopoutMessagePlugin).use(WebsocketManagerPlugin).mount('#app')