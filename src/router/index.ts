import { createRouter, createWebHistory } from 'vue-router'
import StudioView from '@/views/StudioView.vue'

const base = import.meta.env.BASE_URL

export const router = createRouter({
  history: createWebHistory(base),
  routes: [
    { path: '/', name: 'studio', component: StudioView },
    { path: '/about', redirect: '/' },
  ],
})
