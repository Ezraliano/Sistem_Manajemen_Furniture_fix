import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials)
      user.value = response.user
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      user.value = null
    } catch (error) {
      // Even if logout fails on server, clear local state
      user.value = null
      throw error
    }
  }

  const fetchUser = async () => {
    try {
      const response = await authService.getUser()
      user.value = response.user
      return response
    } catch (error) {
      user.value = null
      throw error
    }
  }

  const isAdmin = computed(() => {
    return user.value?.role?.name === 'Administrator'
  })

  return {
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    fetchUser
  }
})