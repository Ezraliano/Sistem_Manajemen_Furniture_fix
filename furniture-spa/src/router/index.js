import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue'),
      meta: { guest: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/roles',
      name: 'roles',
      component: () => import('@/views/roles/Index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/roles/:id',
      name: 'role-show',
      component: () => import('@/views/roles/Show.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/users/Index.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/users/:id',
      name: 'user-show',
      component: () => import('@/views/users/Show.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@/views/categories/Index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/categories/:id',
      name: 'category-show',
      component: () => import('@/views/categories/Show.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/products',
      name: 'products',
      component: () => import('@/views/products/Index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/products/:id',
      name: 'product-show',
      component: () => import('@/views/products/Show.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/orders',
      name: 'orders',
      component: () => import('@/views/orders/Index.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/orders/:id',
      name: 'order-show',
      component: () => import('@/views/orders/Show.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Try to fetch user if not already authenticated
  if (!authStore.isAuthenticated) {
    try {
      await authStore.fetchUser()
    } catch (error) {
      // User is not authenticated
    }
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  // Check if route requires admin role
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/dashboard')
    return
  }

  // Redirect authenticated users away from guest pages
  if (to.meta.guest && authStore.isAuthenticated) {
    next('/dashboard')
    return
  }

  next()
})

export default router