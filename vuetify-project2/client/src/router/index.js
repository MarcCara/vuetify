
// Composables
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('@/pages/LoginScreen.vue'),
    },
    {
        path: '/votacions',
        component: () => import('@/pages/VotacionsScreen.vue'),
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router
