<template>
  <AppLayout>
    <div class="mb-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-4">
              <li>
                <router-link to="/users" class="text-gray-400 hover:text-gray-500">
                  Users
                </router-link>
              </li>
              <li>
                <div class="flex items-center">
                  <ChevronRightIcon class="flex-shrink-0 h-5 w-5 text-gray-400" />
                  <span class="ml-4 text-sm font-medium text-gray-500">{{ user?.name }}</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 class="mt-2 text-3xl font-bold text-gray-900">{{ user?.name }}</h1>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <SecondaryButton @click="editUser" class="mr-3">
            Edit User
          </SecondaryButton>
          <DangerButton @click="deleteUser">
            Delete User
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
              <dd class="mt-1 text-sm text-gray-900">{{ user?.name }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Email</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ user?.email }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Role</dt>
              <dd class="mt-1">
                <span class="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                  {{ user?.role?.name || 'No Role' }}
                </span>
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Created At</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ user?.created_at ? new Date(user.created_at).toLocaleString() : '-' }}
              </dd>
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
      title="Edit User"
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
          <label for="email" class="form-label">Email</label>
          <input
            id="email"
            v-model="editForm.email"
            type="email"
            required
            class="form-input"
            :class="{ 'border-red-300': errors.email }"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email[0] }}</p>
        </div>

        <div>
          <label for="role_id" class="form-label">Role</label>
          <select
            id="role_id"
            v-model="editForm.role_id"
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
import { userService } from '@/services/users'
import { roleService } from '@/services/roles'

const route = useRoute()
const router = useRouter()

const user = ref(null)
const roles = ref([])
const audits = ref([])
const loading = ref(false)
const loadingAudits = ref(false)
const activeTab = ref('details')
const showEditModal = ref(false)
const submitting = ref(false)
const errors = ref({})

const editForm = ref({
  name: '',
  email: '',
  role_id: ''
})

const fetchUser = async () => {
  loading.value = true
  try {
    const response = await userService.getById(route.params.id)
    user.value = response.data
  } catch (error) {
    console.error('Error fetching user:', error)
    router.push('/users')
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

const fetchAudits = async () => {
  if (activeTab.value !== 'history') return
  
  loadingAudits.value = true
  try {
    const response = await userService.getAudits(route.params.id)
    audits.value = response.data
  } catch (error) {
    console.error('Error fetching audits:', error)
  } finally {
    loadingAudits.value = false
  }
}

const editUser = () => {
  editForm.value = {
    name: user.value.name,
    email: user.value.email,
    role_id: user.value.role_id
  }
  showEditModal.value = true
}

const submitEdit = async () => {
  submitting.value = true
  errors.value = {}

  try {
    await userService.update(route.params.id, editForm.value)
    closeEditModal()
    await fetchUser()
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
    } else {
      console.error('Error updating user:', error)
      alert('Error updating user. Please try again.')
    }
  } finally {
    submitting.value = false
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editForm.value = {
    name: '',
    email: '',
    role_id: ''
  }
  errors.value = {}
}

const deleteUser = async () => {
  if (confirm(`Are you sure you want to delete the user "${user.value.name}"?`)) {
    try {
      await userService.delete(route.params.id)
      router.push('/users')
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Error deleting user. Please try again.')
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
  fetchUser()
  fetchRoles()
})

watch(activeTab, handleTabChange)
</script>