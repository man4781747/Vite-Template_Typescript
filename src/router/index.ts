import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

// import TimetablePage from '@/pages/TimetablePage/TimetablePage.vue'
import TimetableDetailPage from '@/pages/TimetableDetailPage/TimetableDetailPage.vue'

// import PlaylistPage from '@/pages/PlaylistPage/PlaylistPage.vue'
import PlaylistDetailPage from '@/pages/PlaylistDetailPage/PlaylistDetailPage.vue'

import ImageDetailPage from '@/pages/ImageDetailPage/ImageDetailPage.vue'

import SnapshotDetailPage from '@/pages/SnapshotDetailPage/SnapshotDetailPage.vue'

import DeviceDetailPage from '@/pages/DeviceDetailPage/DeviceDetailPage.vue'


import SitePage from '@/pages/SitePage/SitePage.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/Device/:id',
    name: 'DeviceDetailPage',
    component: DeviceDetailPage,
  },
  {
    path: '/Snapshot/:id',
    name: 'SnapshotDetailPage',
    component: SnapshotDetailPage,
  },
  {
    path: '/Timetable/:id',
    name: 'TimetableDetailPage',
    component: TimetableDetailPage,
  },
  {
    path: '/Image/:id',
    name: 'ImageDetailPage',
    component: ImageDetailPage,
  },
  {
    path: '/Playlist/:id',
    name: 'PlaylistDetailPage',
    component: PlaylistDetailPage,
  },
  {
    path: '/',
    name: 'SitePage',
    component: SitePage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router