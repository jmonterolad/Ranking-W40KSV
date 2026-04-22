import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RankingHubView from '../views/RankingHubView.vue'
import RankingView from '../views/RankingView.vue'
import CalendarioView from '../views/CalendarioView.vue'
import AdminDashboardView from '../views/AdminDashboardView.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/ranking',
      name: 'ranking-hub',
      component: RankingHubView
    },
    {
      path: '/ranking/:id',
      name: 'ranking-detail',
      component: RankingView
    },
    {
      path: '/calendario',
      name: 'calendario',
      component: CalendarioView
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminDashboardView,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.user) {
    next('/')
  } else {
    next()
  }
})

export default router