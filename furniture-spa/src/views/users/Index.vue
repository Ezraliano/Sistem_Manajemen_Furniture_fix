<template>
  <AppLayout>
    <div class="mb-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h1 class="text-3xl font-bold text-gray-900">Users</h1>
          <p class="mt-2 text-sm text-gray-700">Manage system users and their roles</p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <PrimaryButton @click="showCreateModal = true">
            Create New User
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
          placeholder="Search users..."
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
      :data="filteredUsers"
      @view="viewUser"
      @edit="editUser"
      @delete="deleteUser"
    >
      <template #cell-role="{ item }">
        <span class="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
          {{ item.role?.name || 'No Role' }}
        </span>
      </template>
    </DataTable>

    <!-- Create/Edit Modal -->
    <Modal
      :show="showCreateModal || showEditModal"
      :title="editingUser ? 'Edit User' : 'Create New User'"
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
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="form-input"
            :class="{ 'border-red-300': errors.email }"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email[0] }}</p>
        </div>

        <div v-if="!editingUser">
          <label for="password" class="form-label">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="form-input"
            :class="{ 'border-red-300': errors.password }"
          />
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password[0] }}</p>
        </div>

        <div>
          <label for="role_id" class="form-label">Role</label>
          <select
            id="role_id"
            v-model="form.role_id"
            required
            class="form-input"
            :class="{ 'border-red-300': errors.role_id }"
          >
            <option value="">Select a role</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
          <p v-if="errors.role_id" class="mt-1 text-sm text-red-600">{{ errors.role_id[0] }}</p>
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
import { userService } from '@/services/users'
import { roleService } from '@/services/roles'

const router = useRouter()

const users = ref([])
const roles = ref([])
const loading = ref(false)
const searchQuery = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingUser = ref(null)
const submitting = ref(false)
const errors = ref({})

const form = ref({
  name: '',
  email: '',
  password: '',
  role_id: ''
})

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'created_at', label: 'Created At', type: 'datetime' }
]

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  
  return users.value.filter(user =>
    user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    user.role?.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await userService.getAll()
    users.value = response.data
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    loading.value = false
  }
}

const fetchRoles = async () => {
  try {
    const response = await roleService.getAll()
    roles.value = response.data
  } catch (error) {
    console.error('Error fetching roles:', error)
  }
}

const viewUser = (user) => {
  router.push(`/users/${user.id}`)
}

const editUser = (user) => {
  editingUser.value = user
  form.value = {
    name: user.name,
    email: user.email,
    password: '',
    role_id: user.role_id
  }
  showEditModal.value = true
}

const deleteUser = async (user) => {
  if (confirm(`Are you sure you want to delete the user "${user.name}"?`)) {
    try {
      await userService.delete(user.id)
      await fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error deleting user. Please try again.')
    }
  }
}

const submitForm = async () => {
  submitting.value = true
  errors.value = {}

  try {
    const formData = { ...form.value }
    if (editingUser.value && !formData.password) {
      delete formData.password
    }

    if (editingUser.value) {
      await userService.update(editingUser.value.id, formData)
    } else {
      await userService.create(formData)
    }
    
    closeModal()
    await fetchUsers()
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
    } else {
      console.error('Error saving user:', error)
      alert('Error saving user. Please try again.')
    }
  } finally {
    submitting.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingUser.value = null
  form.value = {
    name: '',
    email: '',
    password: '',
    role_id: ''
  }
  errors.value = {}
}

onMounted(() => {
  fetchUsers()
  fetchRoles()
})
</script>