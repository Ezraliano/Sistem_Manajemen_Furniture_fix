import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api' // Menggunakan instance api yang terpusat

export const useAuthStore = defineStore('auth', () => {
  // Mengambil user dari localStorage saat inisialisasi jika ada
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)

  const isAuthenticated = computed(() => !!user.value)
  
  // Pengecekan role admin yang lebih aman
  const isAdmin = computed(() => user.value?.role?.name === 'admin')

  /**
   * Mengambil data pengguna dari server dan menyimpannya di state dan localStorage.
   */
  async function getUser() {
    try {
      const response = await api.get('/user')
      user.value = response.data
      localStorage.setItem('user', JSON.stringify(response.data))
    } catch (error) {
      // Jika gagal (misal, session habis), bersihkan state
      user.value = null
      localStorage.removeItem('user')
      console.error('Failed to fetch user:', error)
      throw error // Lemparkan error agar bisa ditangkap di komponen
    }
  }

  /**
   * Menangani proses login.
   */
  async function handleLogin(credentials) {
    // Selalu dapatkan CSRF cookie sebelum login/register
    await api.get('/sanctum/csrf-cookie')
    await api.post('/login', credentials)
    // Setelah berhasil login, ambil data pengguna
    await getUser()
  }

  /**
   * Menangani proses registrasi.
   */
  async function handleRegister(credentials) {
    await api.get('/sanctum/csrf-cookie')
    await api.post('/register', credentials)
    // Setelah berhasil register, langsung ambil data pengguna (auto-login)
    await getUser()
  }

  /**
   * Menangani proses logout.
   */
  async function handleLogout() {
    try {
        await api.post('/logout')
    } finally {
        // Selalu bersihkan state lokal meskipun request logout gagal
        user.value = null
        localStorage.removeItem('user')
    }
  }

  return {
    user,
    isAuthenticated,
    isAdmin,
    getUser,
    handleLogin,
    handleRegister,
    handleLogout
  }
})
