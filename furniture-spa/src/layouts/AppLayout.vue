<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <div class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
      <div class="flex h-16 items-center justify-center border-b border-gray-200">
        <h1 class="text-xl font-bold text-gray-900">Furniture Management</h1>
      </div>
      
      <nav class="mt-8">
        <div class="space-y-1">
          <router-link
            to="/dashboard"
            class="sidebar-link"
            active-class="active"
          >
            <HomeIcon class="mr-3 h-5 w-5" />
            Dashboard
          </router-link>
          
          <router-link
            to="/roles"
            class="sidebar-link"
            active-class="active"
          >
            <UserGroupIcon class="mr-3 h-5 w-5" />
            Roles
          </router-link>
          
          <router-link
            v-if="authStore.isAdmin"
            to="/users"
            class="sidebar-link"
            active-class="active"
          >
            <UsersIcon class="mr-3 h-5 w-5" />
            Users
          </router-link>
          
          <router-link
            to="/categories"
            class="sidebar-link"
            active-class="active"
          >
            <TagIcon class="mr-3 h-5 w-5" />
            Categories
          </router-link>
          
          <router-link
            to="/products"
            class="sidebar-link"
            active-class="active"
          >
            <CubeIcon class="mr-3 h-5 w-5" />
            Products
          </router-link>
          
          <router-link
            to="/orders"
            class="sidebar-link"
            active-class="active"
          >
            <ShoppingCartIcon class="mr-3 h-5 w-5" />
            Orders
          </router-link>
        </div>
      </nav>
      
      <!-- User info and logout -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name }}</p>
            <p class="text-xs text-gray-500">{{ authStore.user?.role?.name }}</p>
          </div>
          <button
            @click="handleLogout"
            class="ml-3 text-gray-400 hover:text-gray-500"
            title="Logout"
          >
            <ArrowRightOnRectangleIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="pl-64">
      <main class="py-6">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import {
  HomeIcon,
  UserGroupIcon,
  UsersIcon,
  TagIcon,
  CubeIcon,
  ShoppingCartIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    // Force redirect even if logout fails
    router.push('/login')
  }
}
</script>