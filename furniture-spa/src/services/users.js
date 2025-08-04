import api from './api'

export const userService = {
  async getAll() {
    const response = await api.get('/users')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/users/${id}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/users', data)
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/users/${id}`, data)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },

  async getAudits(id) {
    const response = await api.get(`/users/${id}/audits`)
    return response.data
  }
}