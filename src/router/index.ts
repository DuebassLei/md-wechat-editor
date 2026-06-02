import { createRouter, createWebHistory } from 'vue-router'
import StudioView from '@/views/StudioView.vue'
import ProductIntroView from '@/views/ProductIntroView.vue'

const base = import.meta.env.BASE_URL

export const router = createRouter({
  history: createWebHistory(base),
  routes: [
    { path: '/', name: 'studio', component: StudioView },
    { path: '/about', name: 'about', component: ProductIntroView },
  ],
})
