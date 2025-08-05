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
    await authStore.handleLogin(form.value)
    router.push('/dashboard')
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {}
      if (error.response.data.message) {
        generalError.value = error.response.data.message
      }
    } else {
      generalError.value = 'Terjadi kesalahan. Silakan periksa kredensial Anda atau coba lagi nanti.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <GuestLayout>
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900">Masuk ke Akun Anda</h2>
      <p class="mt-2 text-gray-600">Kelola sistem furniture Anda</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <div>
        <label for="email" class="form-label">Alamat Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          required
          class="form-input"
          :class="{ 'border-red-500': errors.email }"
          placeholder="Masukkan email Anda"
        />
        <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email[0] }}</p>
      </div>

      <div>
        <label for="password" class="form-label">Kata Sandi</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          required
          class="form-input"
          :class="{ 'border-red-500': errors.password }"
          placeholder="Masukkan kata sandi Anda"
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
          {{ loading ? 'Masuk...' : 'Masuk' }}
        </PrimaryButton>
      </div>
    </form>

    <!-- Demo Accounts Info -->
    <div class="mt-8 p-4 bg-blue-50 rounded-lg">
      <h3 class="text-sm font-medium text-blue-800 mb-2">Akun Demo:</h3>
      <div class="text-xs text-blue-700 space-y-1">
        <p><strong>Admin:</strong> admin@furniture.com / admin123</p>
        <p><strong>User:</strong> user@furniture.com / user123</p>
      </div>
    </div>

    <!-- Link ke Halaman Register -->
    <p class="mt-6 text-center text-sm text-gray-500">
      Belum punya akun?
      {{ ' ' }}
      <router-link :to="{ name: 'register' }" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
        Buat akun baru
      </router-link>
    </p>
  </GuestLayout>
</template>