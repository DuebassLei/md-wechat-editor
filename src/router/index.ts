import { createRouter, createWebHistory } from 'vue-router'
import HandwritingStudioView from '@/views/HandwritingStudioView.vue'
import CardStudioView from '@/views/CardStudioView.vue'
import CoverStudioView from '@/views/CoverStudioView.vue'
import StudioView from '@/views/StudioView.vue'
import ProductIntroView from '@/views/ProductIntroView.vue'

const base = import.meta.env.BASE_URL

export const router = createRouter({
  history: createWebHistory(base),
  routes: [
    { path: '/', name: 'studio', component: StudioView },
    { path: '/handwriting', name: 'handwriting', component: HandwritingStudioView },
    { path: '/cards', name: 'cards', component: CardStudioView },
    { path: '/cover', name: 'cover', component: CoverStudioView },
    { path: '/about', name: 'about', component: ProductIntroView },
  ],
})
