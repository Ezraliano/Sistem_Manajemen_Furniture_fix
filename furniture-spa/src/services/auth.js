import api from './api'
import axios from 'axios'

export const authService = {
  async getCsrfCookie() {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
      withCredentials: true
    })
  },

  async login(credentials) {
    await this.getCsrfCookie()
    const response = await api.post('/login', credentials)
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