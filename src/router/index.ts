import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomePage from '@/pages/HomePage/HomePage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
