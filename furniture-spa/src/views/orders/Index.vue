<template>
  <AppLayout>
    <div class="mb-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-3xl font-bold text-gray-900">Orders</h1>
          <p class="mt-2 text-sm text-gray-700">Track and manage customer orders</p>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="mb-6">
      <div class="max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search orders..."
          class="form-input"
        />
      </div>
    </div>

    <!-- Loading -->
    <LoadingSpinner v-if="loading" />

    <!-- Data Table -->
    <DataTable
      v-else
      :columns="columns"
      :data="filteredOrders"
      @view="viewOrder"
      :show-actions="false"
    >
      <template #cell-user="{ item }">
        <span class="font-medium">{{ item.user?.name || 'Unknown User' }}</span>
      </template>
      
      <template #cell-total_amount="{ value }">
        ${{ parseFloat(value).toFixed(2) }}
      </template>
      
      <template #cell-status="{ value }">
        <span :class="getStatusClass(value)" class="px-2 py-1 text-xs font-medium rounded-full">
          {{ value.charAt(0).toUpperCase() + value.slice(1) }}
        </span>
      </template>
      
      <template #cell-is_paid="{ value }">
        <span :class="value ? 'text-green-600' : 'text-red-600'">
          {{ value ? 'Paid' : 'Unpaid' }}
        </span>
      </template>

      <template #actions="{ item }">
        <SecondaryButton @click="viewOrder(item)" class="text-xs">
          View Details
        </SecondaryButton>
      </template>
    </DataTable>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import DataTable from '@/components/DataTable.vue'
import SecondaryButton from '@/components/SecondaryButton.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { orderService } from '@/services/orders'

const router = useRouter()

const orders = ref([])
const loading = ref(false)
const searchQuery = ref('')

const columns = [
  { key: 'id', label: 'Order ID' },
  { key: 'user', label: 'Customer' },
  { key: 'order_date', label: 'Order Date', type: 'datetime' },
  { key: 'total_amount', label: 'Total', type: 'currency' },
  { key: 'status', label: 'Status' },
  { key: 'is_paid', label: 'Payment', type: 'boolean' }
]

const filteredOrders = computed(() => {
  if (!searchQuery.value) return orders.value
  
  return orders.value.filter(order =>
    order.id.toString().includes(searchQuery.value) ||
    order.user?.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    order.status.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const fetchOrders = async () => {
  loading.value = true
  try {
    const response = await orderService.getAll()
    orders.value = response.data
  } catch (error) {
    console.error('Error fetching orders:', error)
  } finally {
    loading.value = false
  }
}

const viewOrder = (order) => {
  router.push(`/orders/${order.id}`)
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
  fetchOrders()
})
</script>