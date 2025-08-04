<template>
  <AppLayout>
    <div class="mb-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-3xl font-bold text-gray-900">Categories</h1>
          <p class="mt-2 text-sm text-gray-700">Organize your products into categories</p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <PrimaryButton @click="showCreateModal = true">
            Create New Category
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
          placeholder="Search categories..."
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
      :data="filteredCategories"
      @view="viewCategory"
      @edit="editCategory"
      @delete="deleteCategory"
    >
      <template #cell-is_active="{ value }">
        <span :class="value ? 'text-green-600' : 'text-red-600'">
          {{ value ? 'Active' : 'Inactive' }}
        </span>
      </template>
    </DataTable>

    <!-- Create/Edit Modal -->
    <Modal
      :show="showCreateModal || showEditModal"
      :title="editingCategory ? 'Edit Category' : 'Create New Category'"
      @close="closeModal"
    >
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label for="name" class="form-label">Name</label>
          <input
            id="name"
            v-model="form.name"
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
            v-model="form.description"
            rows="3"
            class="form-input"
            :class="{ 'border-red-300': errors.description }"
          ></textarea>
          <p v-if="errors.description" class="mt-1 text-sm text-red-600">{{ errors.description[0] }}</p>
        </div>

        <div class="flex items-center">
          <input
            id="is_active"
            v-model="form.is_active"
            type="checkbox"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label for="is_active" class="ml-2 block text-sm text-gray-900">
            Active
          </label>
        </div>
      </form>

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
import PrimaryButton from '@/components/PrimaryButton.vue'
import SecondaryButton from '@/components/SecondaryButton.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { categoryService } from '@/services/categories'

const router = useRouter()

const categories = ref([])
const loading = ref(false)
const searchQuery = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingCategory = ref(null)
const submitting = ref(false)
const errors = ref({})

const form = ref({
  name: '',
  description: '',
  is_active: true
})

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'is_active', label: 'Status', type: 'boolean' },
  { key: 'created_at', label: 'Created At', type: 'datetime' }
]

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categories.value
  
  return categories.value.filter(category =>
    category.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const fetchCategories = async () => {
  loading.value = true
  try {
    const response = await categoryService.getAll()
    categories.value = response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
  } finally {
    loading.value = false
  }
}

const viewCategory = (category) => {
  router.push(`/categories/${category.id}`)
}

const editCategory = (category) => {
  editingCategory.value = category
  form.value = {
    name: category.name,
    description: category.description || '',
    is_active: category.is_active
  }
  showEditModal.value = true
}

const deleteCategory = async (category) => {
  if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
    try {
      await categoryService.delete(category.id)
      await fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Error deleting category. Please try again.')
    }
  }
}

const submitForm = async () => {
  submitting.value = true
  errors.value = {}

  try {
    if (editingCategory.value) {
      await categoryService.update(editingCategory.value.id, form.value)
    } else {
      await categoryService.create(form.value)
    }
    
    closeModal()
    await fetchCategories()
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
    } else {
      console.error('Error saving category:', error)
      alert('Error saving category. Please try again.')
    }
  } finally {
    submitting.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingCategory.value = null
  form.value = {
    name: '',
    description: '',
    is_active: true
  }
  errors.value = {}
}

onMounted(() => {
  fetchCategories()
})
</script>