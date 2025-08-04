<template>
  <AppLayout>
    <!-- Welcome Header -->
    <div class="mb-8 bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <span class="text-indigo-600 text-xl font-bold">
              {{ authStore.user?.name?.charAt(0).toUpperCase() }}
            </span>
          </div>
        </div>
        <div class="ml-4">
          <h1 class="text-3xl font-bold text-gray-900">Welcome back, {{ authStore.user?.name }}!</h1>
          <p class="mt-1 text-gray-600">Here's what's happening with your furniture business today.</p>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CubeIcon class="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div class="ml-4 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                <dd class="text-2xl font-bold text-gray-900">{{ stats.products || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TagIcon class="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div class="ml-4 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Categories</dt>
                <dd class="text-2xl font-bold text-gray-900">{{ stats.categories || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <ShoppingCartIcon class="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div class="ml-4 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Orders</dt>
                <dd class="text-2xl font-bold text-gray-900">{{ stats.orders || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200" v-if="authStore.isAdmin">
        <div class="p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <UsersIcon class="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div class="ml-4 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Users</dt>
                <dd class="text-2xl font-bold text-gray-900">{{ stats.users || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white shadow-sm rounded-lg border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-2 text-gray-600">Welcome back, {{ authStore.user?.name }}!</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <CubeIcon class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Products</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.products || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <TagIcon class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Categories</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.categories || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <ShoppingCartIcon class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Orders</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.orders || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white overflow-hidden shadow rounded-lg" v-if="authStore.isAdmin">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <UsersIcon class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Users</dt>
                <dd class="text-lg font-medium text-gray-900">{{ stats.users || 0 }}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <router-link
            to="/products"
            class="relative group bg-gray-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
          >
            <div>
              <span class="rounded-lg inline-flex p-3 bg-indigo-100 text-indigo-700">
                <CubeIcon class="h-6 w-6" />
              </span>
            </div>
            <div class="mt-4">
              <h3 class="text-lg font-medium text-gray-900">
                Manage Products
              </h3>
              <p class="mt-2 text-sm text-gray-500">
                Add, edit, and organize your furniture inventory.
              </p>
            </div>
          </router-link>

          <router-link
            to="/categories"
            class="relative group bg-gray-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-md transition-all duration-200"
          >
            <div>
              <span class="rounded-lg inline-flex p-3 bg-green-100 text-green-700">
                <TagIcon class="h-6 w-6" />
              </span>
            </div>
            <div class="mt-4">
              <h3 class="text-lg font-medium text-gray-900">
                Manage Categories
              </h3>
              <p class="mt-2 text-sm text-gray-500">
                Organize products into categories.
              </p>
            </div>
          </router-link>

          <router-link
            to="/orders"
            class="relative group bg-gray-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-200 hover:border-yellow-300 hover:shadow-md transition-all duration-200"
          >
            <div>
              <span class="rounded-lg inline-flex p-3 bg-yellow-100 text-yellow-700">
                <ShoppingCartIcon class="h-6 w-6" />
              </span>
            </div>
            <div class="mt-4">
              <h3 class="text-lg font-medium text-gray-900">
                View Orders
              </h3>
              <p class="mt-2 text-sm text-gray-500">
                Process and track customer orders.
              </p>
            </div>
          </router-link>

          <router-link
            v-if="authStore.isAdmin"
            to="/users"
            class="relative group bg-gray-50 p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-200"
          >
            <div>
              <span class="rounded-lg inline-flex p-3 bg-purple-100 text-purple-700">
                <UsersIcon class="h-6 w-6" />
              </span>
            </div>
            <div class="mt-4">
              <h3 class="text-lg font-medium text-gray-900">
                Manage Users
              </h3>
              <p class="mt-2 text-sm text-gray-500">
                Control user access and permissions.
              </p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppLayout from '@/layouts/AppLayout.vue'
import { CubeIcon, TagIcon, ShoppingCartIcon, UsersIcon } from '@heroicons/vue/24/outline'

const authStore = useAuthStore()
const stats = ref({
  products: 0,
  categories: 0,
  orders: 0,
  users: 0
})

onMounted(async () => {
  // In a real app, you would fetch these stats from the API
  // For now, we'll just show placeholder values
  stats.value = {
    products: 150,
    categories: 12,
    orders: 45,
    users: 8
  }
})
</script>