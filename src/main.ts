import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/index'
import { createPinia } from 'pinia'
import PopoutMessagePlugin from '@/plugins/PopoutMessagePlugin' // Added

import 'bootstrap/dist/css/bootstrap.min.css'
import '@fortawesome/fontawesome-free/css/all.min.css'

import '@/index.css'

// https://cn.vitejs.dev/guide/features.html#glob-import
// 這樣做可以import json格式檔案
// import field from './test.json'
// console.log(field)

createApp(App).use(createPinia()).use(router).use(PopoutMessagePlugin).mount('#app')
