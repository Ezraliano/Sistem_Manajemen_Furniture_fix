import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  // Initialize user from localStorage
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role?.name === 'admin')

  /**
   * Get current user data from server
   */
  async function getUser() {
    try {
      const userData = await authService.getUser()
      user.value = userData
      // Persist to localStorage immediately
      localStorage.setItem('user', JSON.stringify(userData))
      return userData
    } catch (error) {
      // Clear state if request fails
      user.value = null
      localStorage.removeItem('user')
      throw error
    }
  }

  /**
   * Handle user login
   */
  async function handleLogin(credentials) {
    try {
      const response = await authService.login(credentials)
      // Handle new response format with user and token
      const userData = response.user || response
      user.value = userData
      // Persist to localStorage immediately after successful login
      localStorage.setItem('user', JSON.stringify(userData))
      // Store token if provided
      if (response.token) {
        localStorage.setItem('auth_token', response.token)
      }
      return userData
    } catch (error) {
      // Clear state on login failure
      user.value = null
      localStorage.removeItem('user')
      localStorage.removeItem('auth_token')
      throw error
    }
  }

  /**
   * Handle user registration
   */
  async function handleRegister(credentials) {
    try {
      const response = await authService.register(credentials)
      // Handle new response format with user and token
      const userData = response.user || response
      user.value = userData
      // Persist to localStorage immediately after successful registration
      localStorage.setItem('user', JSON.stringify(userData))
      // Store token if provided
      if (response.token) {
        localStorage.setItem('auth_token', response.token)
      }
      return userData
    } catch (error) {
      // Clear state on registration failure
      user.value = null
      localStorage.removeItem('user')
      localStorage.removeItem('auth_token')
      throw error
    }
  }

  /**
   * Handle user logout
   */
  async function handleLogout() {
    try {
      await authService.logout()
    } finally {
      // Always clear state regardless of API response
      user.value = null
      localStorage.removeItem('user')
      localStorage.removeItem('auth_token')
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