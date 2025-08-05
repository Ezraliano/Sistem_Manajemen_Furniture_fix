<template>
  <div class="flex h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside class="w-64 bg-gray-800 h-full">
      <!-- Logo/Header -->
      <div class="flex items-center justify-center h-16 bg-gray-900">
        <h1 class="text-white text-xl font-bold">Admin Furniture</h1>
      </div>
      
      <!-- Navigation -->
      <nav class="mt-8 px-4">
        <div class="space-y-2">
          <router-link
            to="/dashboard"
            class="sidebar-link"
          >
            <HomeIcon class="mr-3 h-5 w-5" />
            Dashboard
          </router-link>
          
          <router-link
            to="/roles"
            class="sidebar-link"
          >
            <UserGroupIcon class="mr-3 h-5 w-5" />
            Peran
          </router-link>
          
          <router-link
            v-if="authStore.isAdmin"
            to="/users"
            class="sidebar-link"
          >
            <UsersIcon class="mr-3 h-5 w-5" />
            Pengguna
          </router-link>
          
          <router-link
            to="/categories"
            class="sidebar-link"
          >
            <TagIcon class="mr-3 h-5 w-5" />
            Kategori
          </router-link>
          
          <router-link
            to="/products"
            class="sidebar-link"
          >
            <CubeIcon class="mr-3 h-5 w-5" />
            Produk
          </router-link>
          
          <router-link
            to="/orders"
            class="sidebar-link"
          >
            <ShoppingCartIcon class="mr-3 h-5 w-5" />
            Pesanan
          </router-link>
        </div>
      </nav>
      
      <!-- User info and logout -->
      <div class="absolute bottom-0 left-0 right-0 w-64 p-4 bg-gray-900">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <div class="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
              <span class="text-white text-sm font-medium">
                {{ authStore.user?.name?.charAt(0).toUpperCase() }}
              </span>
            </div>
          </div>
          <div class="ml-3 flex-1">
            <p class="text-sm font-medium text-white">{{ authStore.user?.name }}</p>
            <p class="text-xs text-gray-300">{{ authStore.user?.role?.name }}</p>
          </div>
          <button
            @click="handleLogout"
            class="ml-3 text-gray-300 hover:text-white transition-colors duration-200"
            title="Keluar"
          >
            <ArrowRightOnRectangleIcon class="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-y-auto">
      <div class="p-8">
        <router-view />
      </div>
    </main>
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
    await authStore.handleLogout()
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    // Force redirect even if logout fails
    router.push('/login')
  }
}
</script>