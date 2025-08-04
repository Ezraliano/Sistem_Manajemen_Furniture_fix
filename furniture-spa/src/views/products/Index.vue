<template>
  <AppLayout>
    <div class="mb-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-3xl font-bold text-gray-900">Products</h1>
          <p class="mt-2 text-sm text-gray-700">Manage your furniture inventory</p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <PrimaryButton @click="showCreateModal = true">
            Create New Product
          </PrimaryButton>
        </div>
      </div>
    </div>

    <!-- Search -->
    <div class="mb-6">
      <div class="max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
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
      :data="filteredProducts"
      @view="viewProduct"
      @edit="editProduct"
      @delete="deleteProduct"
    >
      <template #cell-category="{ item }">
        <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
          {{ item.category?.name || 'No Category' }}
        </span>
      </template>
      
      <template #cell-price="{ value }">
        ${{ parseFloat(value).toFixed(2) }}
      </template>
      
      <template #cell-is_available="{ value }">
        <span :class="value ? 'text-green-600' : 'text-red-600'">
          {{ value ? 'Available' : 'Unavailable' }}
        </span>
      </template>
    </DataTable>

    <!-- Create/Edit Modal -->
    <Modal
      :show="showCreateModal || showEditModal"
      :title="editingProduct ? 'Edit Product' : 'Create New Product'"
      @close="closeModal"
      class="max-w-4xl"
    >
      <ProductForm
        v-model="form"
        :categories="categories"
        :errors="errors"
        @submit="submitForm"
      />

      <template #footer>
        <PrimaryButton @click="submitForm" :disabled="submitting" class="mr-3">
          {{ submitting ? 'Saving...' : 'Save' }}
        </PrimaryButton>
        <SecondaryButton @click="closeModal">
          Cancel
        </SecondaryButton>
      </template>
    </Modal>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import DataTable from '@/components/DataTable.vue'
import Modal from '@/components/Modal.vue'
import ProductForm from '@/components/ProductForm.vue'
import PrimaryButton from '@/components/PrimaryButton.vue'
import SecondaryButton from '@/components/SecondaryButton.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { productService } from '@/services/products'
import { categoryService } from '@/services/categories'

const router = useRouter()

const products = ref([])
const categories = ref([])
const loading = ref(false)
const searchQuery = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingProduct = ref(null)
const submitting = ref(false)
const errors = ref({})

const form = ref({
  name: '',
  description: '',
  price: '',
  stock: '',
  category_id: '',
  is_available: true,
  specifications: null,
  attachment: null
})

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price', type: 'currency' },
  { key: 'stock', label: 'Stock' },
  { key: 'is_available', label: 'Status', type: 'boolean' }
]

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value
  
  return products.value.filter(product =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    product.category?.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const fetchProducts = async () => {
  loading.value = true
  try {
    const response = await productService.getAll()
    products.value = response.data
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const response = await categoryService.getAll()
    categories.value = response.data.filter(category => category.is_active)
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const viewProduct = (product) => {
  router.push(`/products/${product.id}`)
}

const editProduct = (product) => {
  editingProduct.value = product
  form.value = {
    name: product.name,
    description: product.description || '',
    price: product.price,
    stock: product.stock,
    category_id: product.category_id,
    is_available: product.is_available,
    specifications: product.specifications,
    attachment: null
  }
  showEditModal.value = true
}

const deleteProduct = async (product) => {
  if (confirm(`Are you sure you want to delete the product "${product.name}"?`)) {
    try {
      await productService.delete(product.id)
      await fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product. Please try again.')
    }
  }
}

const submitForm = async () => {
  submitting.value = true
  errors.value = {}

  try {
    if (editingProduct.value) {
      await productService.update(editingProduct.value.id, form.value)
    } else {
      await productService.create(form.value)
    }
    
    closeModal()
    await fetchProducts()
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
    } else {
      console.error('Error saving product:', error)
      alert('Error saving product. Please try again.')
    }
  } finally {
    submitting.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingProduct.value = null
  form.value = {
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    is_available: true,
    specifications: null,
    attachment: null
  }
  errors.value = {}
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})
</script>