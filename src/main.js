import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './index.css'

// https://cn.vitejs.dev/guide/features.html#glob-import
// 這樣做可以import json格式檔案
// import field from './test.json'
// console.log(field)

createApp(App).use(store).use(router).mount('#app')