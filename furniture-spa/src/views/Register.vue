<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import GuestLayout from '@/layouts/GuestLayout.vue'
import PrimaryButton from '@/components/PrimaryButton.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const authStore = useAuthStore()
const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
})

const errors = ref({})
const loading = ref(false)

const handleRegister = async () => {
  loading.value = true
  errors.value = {}
  
  try {
    await authStore.handleRegister(form.value)
    router.push({ name: 'dashboard' })
  } catch (error) {
    if (error.response && error.response.status === 422) {
      errors.value = error.response.data.errors
    } else {
      console.error('Registration failed:', error)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <GuestLayout>
    <div class="text-center mb-8">
      <h2 class="text-3xl font-bold text-gray-900">Buat Akun Baru</h2>
      <p class="mt-2 text-gray-600">Bergabung dengan sistem manajemen furniture</p>
    </div>

    <form class="space-y-6" @submit.prevent="handleRegister">
      <div>
        <label for="name" class="form-label">Nama Lengkap</label>
        <input
          id="name"
          v-model="form.name"
          name="name"
          type="text"
          autocomplete="name"
          required
          class="form-input"
          :class="{ 'border-red-500': errors.name }"
          placeholder="Masukkan nama lengkap Anda"
        />
        <div v-if="errors.name" class="text-sm text-red-600 mt-1">{{ errors.name[0] }}</div>
      </div>

      <div>
        <label for="email" class="form-label">Alamat Email</label>
        <input
          id="email"
          v-model="form.email"
          name="email"
          type="email"
          autocomplete="email"
          required
          class="form-input"
          :class="{ 'border-red-500': errors.email }"
          placeholder="Masukkan alamat email Anda"
        />
        <div v-if="errors.email" class="text-sm text-red-600 mt-1">{{ errors.email[0] }}</div>
      </div>

      <div>
        <label for="password" class="form-label">Kata Sandi</label>
        <input
          id="password"
          v-model="form.password"
          name="password"
          type="password"
          autocomplete="new-password"
          required
          class="form-input"
          :class="{ 'border-red-500': errors.password }"
          placeholder="Masukkan kata sandi"
        />
        <div v-if="errors.password" class="text-sm text-red-600 mt-1">{{ errors.password[0] }}</div>
      </div>

      <div>
        <label for="password_confirmation" class="form-label">Konfirmasi Kata Sandi</label>
        <input
          id="password_confirmation"
          v-model="form.password_confirmation"
          name="password_confirmation"
          type="password"
          autocomplete="new-password"
          required
          class="form-input"
          placeholder="Konfirmasi kata sandi Anda"
        />
      </div>

      <div>
        <PrimaryButton
          type="submit"
          :disabled="loading"
          class="w-full justify-center"
        >
          <LoadingSpinner v-if="loading" size="sm" container-class="" class="mr-2" />
          {{ loading ? 'Mendaftar...' : 'Daftar' }}
        </PrimaryButton>
      </div>
    </form>

    <p class="mt-6 text-center text-sm text-gray-500">
      Sudah punya akun?
      {{ ' ' }}
      <router-link :to="{ name: 'login' }" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
        Masuk di sini
      </router-link>
    </p>
  </GuestLayout>
</template>