<template>
  <AppLayout>
    <div class="mb-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-4">
              <li>
                <router-link to="/orders" class="text-gray-400 hover:text-gray-500">
                  Orders
                </router-link>
              </li>
              <li>
                <div class="flex items-center">
                  <ChevronRightIcon class="flex-shrink-0 h-5 w-5 text-gray-400" />
                  <span class="ml-4 text-sm font-medium text-gray-500">Order #{{ order?.id }}</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 class="mt-2 text-3xl font-bold text-gray-900">Order #{{ order?.id }}</h1>
        </div>
      </div>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else class="space-y-6">
      <!-- Order Summary -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Order Summary</h3>
        </div>
        <div class="px-6 py-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt class="text-sm font-medium text-gray-500">Customer</dt>
              <dd class="mt-1 text-sm text-gray-900 font-medium">{{ order?.user?.name || 'Unknown User' }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Order Date</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ order?.order_date ? new Date(order.order_date).toLocaleString() : '-' }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Status</dt>
              <dd class="mt-1">
                <span :class="getStatusClass(order?.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                  {{ order?.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : '-' }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Payment Status</dt>
              <dd class="mt-1">
                <span :class="order?.is_paid ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
                  {{ order?.is_paid ? 'Paid' : 'Unpaid' }}
                </span>
              </dd>
            </div>
          </div>
          
          <div class="mt-6">
            <dt class="text-sm font-medium text-gray-500">Total Amount</dt>
            <dd class="mt-1 text-2xl font-bold text-gray-900">
              ${{ order?.total_amount ? parseFloat(order.total_amount).toFixed(2) : '0.00' }}
            </dd>
          </div>
        </div>
      </div>

      <!-- Shipping Details -->
      <div v-if="order?.shipping_details" class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Shipping Details</h3>
        </div>
        <div class="px-6 py-6">
          <div class="bg-gray-50 rounded-lg p-4">
            <pre class="text-sm text-gray-900 whitespace-pre-wrap">{{ JSON.stringify(order.shipping_details, null, 2) }}</pre>
          </div>
        </div>
      </div>

      <!-- Order Items -->
      <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Order Items</h3>
        </div>
        <div class="px-6 py-6">
          <div v-if="order?.items && order.items.length > 0" class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in order.items" :key="item.id">
                  <td>
                    <div class="font-medium text-gray-900">{{ item.product?.name || 'Unknown Product' }}</div>
                    <div v-if="item.product?.description" class="text-sm text-gray-500 truncate max-w-xs">
                      {{ item.product.description }}
                    </div>
                  </td>
                  <td>
                    <span v-if="item.product?.category" class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {{ item.product.category.name }}
                    </span>
                    <span v-else class="text-gray-500">-</span>
                  </td>
                  <td>{{ item.quantity }}</td>
                  <td>${{ parseFloat(item.price).toFixed(2) }}</td>
                  <td class="font-medium">${{ (parseFloat(item.price) * item.quantity).toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center py-8">
            <p class="text-gray-500">No items found for this order.</p>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
import { orderService } from '@/services/orders'

const route = useRoute()
const router = useRouter()

const order = ref(null)
const loading = ref(false)

const fetchOrder = async () => {
  loading.value = true
  try {
    const response = await orderService.getById(route.params.id)
    order.value = response.data
  } catch (error) {
    console.error('Error fetching order:', error)
    router.push('/orders')
  } finally {
    loading.value = false
  }
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

onMounted(() => {
  fetchOrder()
})
</script>