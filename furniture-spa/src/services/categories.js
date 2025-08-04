import api from './api'

export const categoryService = {
  async getAll() {
    const response = await api.get('/categories')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/categories/${id}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/categories', data)
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/categories/${id}`, data)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/categories/${id}`)
    return response.data
  },

  async getAudits(id) {
    const response = await api.get(`/categories/${id}/audits`)
    return response.data
  }
}