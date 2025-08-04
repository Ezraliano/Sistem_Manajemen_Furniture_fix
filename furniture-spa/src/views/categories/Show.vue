<template>
  <AppLayout>
    <div class="mb-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-4">
              <li>
                <router-link to="/categories" class="text-gray-400 hover:text-gray-500">
                  Categories
                </router-link>
              </li>
              <li>
                <div class="flex items-center">
                  <ChevronRightIcon class="flex-shrink-0 h-5 w-5 text-gray-400" />
                  <span class="ml-4 text-sm font-medium text-gray-500">{{ category?.name }}</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 class="mt-2 text-3xl font-bold text-gray-900">{{ category?.name }}</h1>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <SecondaryButton @click="editCategory" class="mr-3">
            Edit Category
          </SecondaryButton>
          <DangerButton @click="deleteCategory">
            Delete Category
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
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500">Name</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ category?.name }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Status</dt>
              <dd class="mt-1">
                <span :class="category?.is_active ? 'text-green-600' : 'text-red-600'" class="text-sm font-medium">
                  {{ category?.is_active ? 'Active' : 'Inactive' }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Created At</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ category?.created_at ? new Date(category.created_at).toLocaleString() : '-' }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Updated At</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ category?.updated_at ? new Date(category.updated_at).toLocaleString() : '-' }}
              </dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-sm font-medium text-gray-500">Description</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ category?.description || 'No description provided' }}</dd>
            </div>
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
      title="Edit Category"
      @close="closeEditModal"
    >
      <form @submit.prevent="submitEdit" class="space-y-4">
        <div>
          <label for="name" class="form-label">Name</label>
          <input
            id="name"
            v-model="editForm.name"
            type="text"
            required
            class="form-input"
            :class="{ 'border-red-300': errors.name }"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name[0] }}</p>
        </div>

        <div>
          <label for="description" class="form-label">Description</label>
          <textarea
            id="description"
            v-model="editForm.description"
            rows="3"
            class="form-input"
            :class="{ 'border-red-300': errors.description }"
          ></textarea>
          <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description[0] }}</p>
        </div>

        <div class="flex items-center">
          <input
            id="is_active"
            v-model="editForm.is_active"
            type="checkbox"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label for="is_active" class="ml-2 block text-sm text-gray-900">
            Active
          </label>
        </div>
      </form>

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
import PrimaryButton from '@/components/PrimaryButton.vue'
import SecondaryButton from '@/components/SecondaryButton.vue'
import DangerButton from '@/components/DangerButton.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
import { categoryService } from '@/services/categories'

const route = useRoute()
const router = useRouter()

const category = ref(null)
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
  is_active: true
})

const fetchCategory = async () => {
  loading.value = true
  try {
    const response = await categoryService.getById(route.params.id)
    category.value = response.data
  } catch (error) {
    console.error('Error fetching category:', error)
    router.push('/categories')
  } finally {
    loading.value = false
  }
}

const fetchAudits = async () => {
  if (activeTab.value !== 'history') return
  
  loadingAudits.value = true
  try {
    const response = await categoryService.getAudits(route.params.id)
    audits.value = response.data
  } catch (error) {
    console.error('Error fetching audits:', error)
  } finally {
    loadingAudits.value = false
  }
}

const editCategory = () => {
  editForm.value = {
    name: category.value.name,
    description: category.value.description || '',
    is_active: category.value.is_active
  }
  showEditModal.value = true
}

const submitEdit = async () => {
  submitting.value = true
  errors.value = {}

  try {
    await categoryService.update(route.params.id, editForm.value)
    closeEditModal()
    await fetchCategory()
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
    } else {
      console.error('Error updating category:', error)
      alert('Error updating category. Please try again.')
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
    is_active: true
  }
  errors.value = {}
}

const deleteCategory = async () => {
  if (confirm(`Are you sure you want to delete the category "${category.value.name}"?`)) {
    try {
      await categoryService.delete(route.params.id)
      router.push('/categories')
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Error deleting category. Please try again.')
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
  fetchCategory()
})

watch(activeTab, handleTabChange)
</script>