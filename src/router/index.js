import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '/src/pages/HomePage/HomePage.vue'

let history = createWebHistory()
let routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  }
]

export default createRouter({ history, routes })