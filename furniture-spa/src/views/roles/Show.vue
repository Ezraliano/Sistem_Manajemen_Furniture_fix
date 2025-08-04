<template>
  <AppLayout>
    <div class="mb-8">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <nav class="flex" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-4">
              <li>
                <router-link to="/roles" class="text-gray-400 hover:text-gray-500">
                  Roles
                </router-link>
              </li>
              <li>
                <div class="flex items-center">
                  <ChevronRightIcon class="flex-shrink-0 h-5 w-5 text-gray-400" />
                  <span class="ml-4 text-sm font-medium text-gray-500">{{ role?.name }}</span>
                </div>
              </li>
            </ol>
          </nav>
          <h1 class="mt-2 text-3xl font-bold text-gray-900">{{ role?.name }}</h1>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <SecondaryButton @click="editRole" class="mr-3">
            Edit Role
          </SecondaryButton>
          <DangerButton @click="deleteRole">
            Delete Role
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
              <dd class="mt-1 text-sm text-gray-900">{{ role?.name }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Created At</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ role?.created_at ? new Date(role.created_at).toLocaleString() : '-' }}
              </dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-sm font-medium text-gray-500">Description</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ role?.description || 'No description provided' }}</dd>
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
      title="Edit Role"
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import Modal from '@/components/Modal.vue'
import PrimaryButton from '@/components/PrimaryButton.vue'
import SecondaryButton from '@/components/SecondaryButton.vue'
import DangerButton from '@/components/DangerButton.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { ChevronRightIcon } from '@heroicons/vue/24/outline'
import { roleService } from '@/services/roles'

const route = useRoute()
const router = useRouter()

const role = ref(null)
const audits = ref([])
const loading = ref(false)
const loadingAudits = ref(false)
const activeTab = ref('details')
const showEditModal = ref(false)
const submitting = ref(false)
const errors = ref({})

const editForm = ref({
  name: '',
  description: ''
})

const fetchRole = async () => {
  loading.value = true
  try {
    const response = await roleService.getById(route.params.id)
    role.value = response.data
  } catch (error) {
    console.error('Error fetching role:', error)
    router.push('/roles')
  } finally {
    loading.value = false
  }
}

const fetchAudits = async () => {
  if (activeTab.value !== 'history') return
  
  loadingAudits.value = true
  try {
    const response = await roleService.getAudits(route.params.id)
    audits.value = response.data
  } catch (error) {
    console.error('Error fetching audits:', error)
  } finally {
    loadingAudits.value = false
  }
}

const editRole = () => {
  editForm.value = {
    name: role.value.name,
    description: role.value.description || ''
  }
  showEditModal.value = true
}

const submitEdit = async () => {
  submitting.value = true
  errors.value = {}

  try {
    await roleService.update(route.params.id, editForm.value)
    closeEditModal()
    await fetchRole()
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
    } else {
      console.error('Error updating role:', error)
      alert('Error updating role. Please try again.')
    }
  } finally {
    submitting.value = false
  }
}

const closeEditModal = () => {
  showEditModal.value = false
  editForm.value = {
    name: '',
    description: ''
  }
  errors.value = {}
}

const deleteRole = async () => {
  if (confirm(`Are you sure you want to delete the role "${role.value.name}"?`)) {
    try {
      await roleService.delete(route.params.id)
      router.push('/roles')
    } catch (error) {
      console.error('Error deleting role:', error)
      alert('Error deleting role. Please try again.')
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

// Watch for tab changes to load audits
const handleTabChange = () => {
  if (activeTab.value === 'history' && audits.value.length === 0) {
    fetchAudits()
  }
}

onMounted(() => {
  fetchRole()
})

// Watch activeTab
import { watch } from 'vue'
watch(activeTab, handleTabChange)
</script>