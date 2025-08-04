<template>
  <AppLayout>
    <div class="mb-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-4">
              <li>
                <router-link to="/products" class="text-gray-400 hover:text-gray-500">
                  Products
                </router-link>
              </li>
              <li>
                <div class="flex items-center">
                  <ChevronRightIcon class="flex-shrink-0 h-5 w-5 text-gray-400" />
                  <span class="ml-4 text-sm font-medium text-gray-500">{{ product?.name }}</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 class="mt-2 text-3xl font-bold text-gray-900">{{ product?.name }}</h1>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <SecondaryButton @click="editProduct" class="mr-3">
            Edit Product
          </SecondaryButton>
          <DangerButton @click="deleteProduct">
            Delete Product
          </DangerButton>
        </div>
      </div>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else class="bg-white shadow rounded-lg">
      <!-- Tabs -->
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8 px-6" aria-label="Tabs">
          <button
            @click="activeTab = 'details'"
            :class="[
              activeTab === 'details'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            Details
          </button>
          <button
            @click="activeTab = 'history'"
            :class="[
              activeTab === 'history'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
            ]"
          >
            History & Notes
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="px-6 py-6">
        <!-- Details Tab -->
        <div v-if="activeTab === 'details'" class="space-y-6">
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <dt class="text-sm font-medium text-gray-500">Name</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ product?.name }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Category</dt>
              <dd class="mt-1">
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {{ product?.category?.name || 'No Category' }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Price</dt>
              <dd class="mt-1 text-sm text-gray-900 font-semibold">
                ${{ product?.price ? parseFloat(product.price).toFixed(2) : '0.00' }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Stock</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ product?.stock || 0 }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Status</dt>
              <dd class="mt-1">
                <span :class="product?.is_available ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
                  {{ product?.is_available ? 'Available' : 'Unavailable' }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Created At</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ product?.created_at ? new Date(product.created_at).toLocaleString() : '-' }}
              </dd>
            </div>
          </div>

          <div v-if="product?.description">
            <dt class="text-sm font-medium text-gray-500">Description</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ product.description }}</dd>
          </div>

          <div v-if="product?.specifications">
            <dt class="text-sm font-medium text-gray-500">Specifications</dt>
            <dd class="mt-1">
              <div class="bg-gray-50 rounded-lg p-4">
                <pre class="text-sm text-gray-900 whitespace-pre-wrap">{{ JSON.stringify(product.specifications, null, 2) }}</pre>
              </div>
            </dd>
          </div>

          <div v-if="product?.attachment_path">
            <dt class="text-sm font-medium text-gray-500">Attachment</dt>
            <dd class="mt-1">
              <a
                :href="product.attachment_path"
                target="_blank"
                class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <DocumentIcon class="h-4 w-4 mr-2" />
                View PDF
              </a>
            </dd>
          </div>
        </div>

        <!-- History Tab -->
        <div v-else-if="activeTab === 'history'">
          <LoadingSpinner v-if="loadingAudits" />
          
          <div v-else-if="audits.length === 0" class="text-center py-8">
            <p class="text-gray-500">No history records found.</p>
          </div>

          <div v-else class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>User</th>
                  <th>Date</th>
                  <th>Changes</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="audit in audits" :key="audit.id">
                  <td>
                    <span :class="getActionClass(audit.event)" class="px-2 py-1 text-xs font-medium rounded-full">
                      {{ audit.event }}
                    </span>
                  </td>
                  <td>{{ audit.user_name || 'System' }}</td>
                  <td>{{ new Date(audit.created_at).toLocaleString() }}</td>
                  <td>
                    <div v-if="audit.old_values || audit.new_values" class="text-xs">
                      <div v-if="audit.old_values" class="text-red-600">
                        <strong>Old:</strong> {{ formatAuditValues(audit.old_values) }}
                      </div>
                      <div v-if="audit.new_values" class="text-green-600">
                        <strong>New:</strong> {{ formatAuditValues(audit.new_values) }}
                      </div>
                    </div>
                    <span v-else class="text-gray-500">-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <Modal
      :show="showEditModal"
      title="Edit Product"
      @close="closeEditModal"
      class="max-w-4xl"
    >
      <ProductForm
        v-model="editForm"
        :categories="categories"
        :errors="errors"
        @submit="submitEdit"
      />

      <template #footer>
        <PrimaryButton @click="submitEdit" :disabled="submitting" class="mr-3">
          {{ submitting ? 'Saving...' : 'Save Changes' }}
        </PrimaryButton>
        <SecondaryButton @click="closeEditModal">
          Cancel
        </SecondaryButton>
      </template>
    </Modal>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import Modal from '@/components/Modal.vue'
import ProductForm from '@/components/ProductForm.vue'
import PrimaryButton from '@/components/PrimaryButton.vue'
import SecondaryButton from '@/components/SecondaryButton.vue'
import DangerButton from '@/components/DangerButton.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { ChevronRightIcon, DocumentIcon } from '@heroicons/vue/24/outline'
import { productService } from '@/services/products'
import { categoryService } from '@/services/categories'

const route = useRoute()
const router = useRouter()

const product = ref(null)
const categories = ref([])
const audits = ref([])
const loading = ref(false)
const loadingAudits = ref(false)
const activeTab = ref('details')
const showEditModal = ref(false)
const submitting = ref(false)
const errors = ref({})

const editForm = ref({
  name: '',
  description: '',
  price: '',
  stock: '',
  category_id: '',
  is_available: true,
  specifications: null,
  attachment: null
})

const fetchProduct = async () => {
  loading.value = true
  try {
    const response = await productService.getById(route.params.id)
    product.value = response.data
  } catch (error) {
    console.error('Error fetching product:', error)
    router.push('/products')
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

const fetchAudits = async () => {
  if (activeTab.value !== 'history') return
  
  loadingAudits.value = true
  try {
    const response = await productService.getAudits(route.params.id)
    audits.value = response.data
  } catch (error) {
    console.error('Error fetching audits:', error)
  } finally {
    loadingAudits.value = false
  }
}

const editProduct = () => {
  editForm.value = {
    name: product.value.name,
    description: product.value.description || '',
    price: product.value.price,
    stock: product.value.stock,
    category_id: product.value.category_id,
    is_available: product.value.is_available,
    specifications: product.value.specifications,
    attachment: null
  }
  showEditModal.value = true
}

const submitEdit = async () => {
  submitting.value = true
  errors.value = {}

  try {
    await productService.update(route.params.id, editForm.value)
    closeEditModal()
    await fetchProduct()
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
    } else {
      console.error('Error updating product:', error)
      alert('Error updating product. Please try again.')
    }
  } finally {
    submitting.value = false
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editForm.value = {
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

const deleteProduct = async () => {
  if (confirm(`Are you sure you want to delete the product "${product.value.name}"?`)) {
    try {
      await productService.delete(route.params.id)
      router.push('/products')
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product. Please try again.')
    }
  }
}

const getActionClass = (action) => {
  const classes = {
    created: 'bg-green-100 text-green-800',
    updated: 'bg-blue-100 text-blue-800',
    deleted: 'bg-red-100 text-red-800'
  }
  return classes[action] || 'bg-gray-100 text-gray-800'
}

const formatAuditValues = (values) => {
  if (typeof values === 'string') {
    try {
      values = JSON.parse(values)
    } catch (e) {
      return values
    }
  }
  
  return Object.entries(values)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ')
}

const handleTabChange = () => {
  if (activeTab.value === 'history' && audits.value.length === 0) {
    fetchAudits()
  }
}

onMounted(() => {
  fetchProduct()
  fetchCategories()
})

watch(activeTab, handleTabChange)
</script>