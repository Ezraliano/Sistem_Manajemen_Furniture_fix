<template>
  <AppLayout>
    <div class="mb-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-3xl font-bold text-gray-900">Roles</h1>
          <p class="mt-2 text-sm text-gray-700">Manage user roles and permissions</p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <PrimaryButton @click="showCreateModal = true">
            Create New Role
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
          placeholder="Search roles..."
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
      :data="filteredRoles"
      @view="viewRole"
      @edit="editRole"
      @delete="deleteRole"
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
      :title="editingRole ? 'Edit Role' : 'Create New Role'"
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
import { roleService } from '@/services/roles'

const router = useRouter()

const roles = ref([])
const loading = ref(false)
const searchQuery = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingRole = ref(null)
const submitting = ref(false)
const errors = ref({})

const form = ref({
  name: '',
  description: ''
})

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'description', label: 'Description' },
  { key: 'created_at', label: 'Created At', type: 'datetime' }
]

const filteredRoles = computed(() => {
  if (!searchQuery.value) return roles.value
  
  return roles.value.filter(role =>
    role.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const fetchRoles = async () => {
  loading.value = true
  try {
    const response = await roleService.getAll()
    roles.value = response.data
  } catch (error) {
    console.error('Error fetching roles:', error)
  } finally {
    loading.value = false
  }
}

const viewRole = (role) => {
  router.push(`/roles/${role.id}`)
}

const editRole = (role) => {
  editingRole.value = role
  form.value = {
    name: role.name,
    description: role.description || ''
  }
  showEditModal.value = true
}

const deleteRole = async (role) => {
  if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
    try {
      await roleService.delete(role.id)
      await fetchRoles()
    } catch (error) {
      console.error('Error deleting role:', error)
      alert('Error deleting role. Please try again.')
    }
  }
}

const submitForm = async () => {
  submitting.value = true
  errors.value = {}

  try {
    if (editingRole.value) {
      await roleService.update(editingRole.value.id, form.value)
    } else {
      await roleService.create(form.value)
    }
    
    closeModal()
    await fetchRoles()
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
    } else {
      console.error('Error saving role:', error)
      alert('Error saving role. Please try again.')
    }
  } finally {
    submitting.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingRole.value = null
  form.value = {
    name: '',
    description: ''
  }
  errors.value = {}
}

onMounted(() => {
  fetchRoles()
})
</script>