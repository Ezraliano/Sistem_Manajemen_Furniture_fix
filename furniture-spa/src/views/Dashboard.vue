<template>
  <AppLayout>
    <div class="mb-8">
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
            class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div>
              <span class="rounded-lg inline-flex p-3 bg-indigo-50 text-indigo-700 ring-4 ring-white">
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
            class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div>
              <span class="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
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
            class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div>
              <span class="rounded-lg inline-flex p-3 bg-yellow-50 text-yellow-700 ring-4 ring-white">
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
            class="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div>
              <span class="rounded-lg inline-flex p-3 bg-purple-50 text-purple-700 ring-4 ring-white">
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