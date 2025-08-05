import api from './api'

export const authService = {
  async getCsrfCookie() {
    await api.get('/sanctum/csrf-cookie')
  },

  async login(credentials) {
    await this.getCsrfCookie()
    const response = await api.post('/login', credentials)
    return response.data
  },

  async register(credentials) {
    await this.getCsrfCookie()
    const response = await api.post('/register', credentials)
    return response.data
  },

  async logout() {
    const response = await api.post('/logout')
    return response.data
  },

  async getUser() {
    const response = await api.get('/user')
    return response.data
  }
}