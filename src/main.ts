import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/index'
import { createPinia } from 'pinia'

import WebsocketManagerPlugin from '@/components/websocketManager/websocketManagerPlugin' // Added

import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

import '@/index.css'

import PopoutMessagePlugin from 'akira-c-popout-message-box'
import { install as PopoutCard } from 'akira-c-popout-card'

// https://cn.vitejs.dev/guide/features.html#glob-import
// 這樣做可以import json格式檔案
// import field from './test.json'
// console.log(field)
const pinia = createPinia()
createApp(App).use(pinia).use(router).use(PopoutMessagePlugin).use(WebsocketManagerPlugin).use(PopoutCard).mount('#app')