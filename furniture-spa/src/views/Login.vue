<template>
  <GuestLayout>
    <form @submit.prevent="handleLogin" class="space-y-6">
      <div>
        <label for="email" class="form-label">Email address</label>
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

      <div>
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

      <div v-if="generalError" class="rounded-md bg-red-50 p-4">
        <p class="text-sm text-red-800">{{ generalError }}</p>
      </div>

      <div>
        <PrimaryButton
          type="submit"
          :disabled="loading"
          class="w-full justify-center"
        >
          <LoadingSpinner v-if="loading" size="sm" container-class="" class="mr-2" />
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </PrimaryButton>
      </div>
    </form>
  </GuestLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import GuestLayout from '@/layouts/GuestLayout.vue'
import PrimaryButton from '@/components/PrimaryButton.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const errors = ref({})
const generalError = ref('')

const handleLogin = async () => {
  loading.value = true
  errors.value = {}
  generalError.value = ''

  try {
    await authStore.login(form.value)
    router.push('/dashboard')
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
    } else if (error.response?.status === 401) {
      generalError.value = 'Invalid credentials. Please try again.'
    } else {
      generalError.value = 'An error occurred. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>