<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline'
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
    await authStore.handleLogin(form.value) // Menggunakan handleLogin dari store
    router.push('/dashboard')
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
       // Menampilkan error umum jika backend mengirim pesan di root error
      if (error.response.data.message) {
        generalError.value = error.response.data.message;
      }
    } else {
      generalError.value = 'An error occurred. Please check your credentials or try again later.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <GuestLayout>
    <template #title>Sign in to your account</template>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <div>
        <label for="email" class="form-label">Email address</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="form-input"
          :class="{ 'border-red-500': errors.email }"
          placeholder="Enter your email"
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
          :class="{ 'border-red-500': errors.password }"
          placeholder="Enter your password"
        />
        <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password[0] }}</p>
      </div>

      <div v-if="generalError" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <ExclamationTriangleIcon class="h-5 w-5 text-red-400" />
          </div>
          <div class="ml-3">
            <p class="text-sm text-red-800">{{ generalError }}</p>
          </div>
        </div>
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

    <!-- Link ke Halaman Register -->
    <p class="mt-10 text-center text-sm text-gray-500">
      Not a member?
      {{ ' ' }}
      <router-link :to="{ name: 'register' }" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
        Create an account
      </router-link>
    </p>
  </GuestLayout>
</template>
