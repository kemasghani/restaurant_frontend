import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'bahan',
      component: () => import('../views/BahanView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/bahan-masuk',
      name: 'bahan-masuk',
      component: () => import('../views/BahanMasukView.vue'),
    },
    {
      path: '/order',
      name: 'order',
      component: () => import('../views/OrderView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/kategori',
      name: 'kategori',
      component: () => import('../views/KategoriView.vue'),
    },
    {
      path: '/satuan',
      name: 'satuan',
      component: () => import('../views/SatuanView.vue'),
    },
    {
      path: '/bahan-keluar',
      name: 'bahan-keluar',
      component: () => import('../views/BahanKeluarView.vue'),
    },
    {
      path: '/user-management',
      name: 'user-management',
      component: () => import('../views/UserManagement.vue'),
    }
  ],
})

// Middleware: cek token sebelum masuk ke route
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const publicPages = ['/login']
  const authRequired = !publicPages.includes(to.path)
  const isLoggedIn = authStore.isAuthenticated()

  if (authRequired && !isLoggedIn) {
    return next('/login')
  }

  next()
})

export default router
