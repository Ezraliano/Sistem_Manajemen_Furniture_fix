import api from './api'

export const orderService = {
  async getAll() {
    const response = await api.get('/orders')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  async create(data) {
    const response = await api.post('/orders', data)
    return response.data
  },

  async update(id, data) {
    const response = await api.put(`/orders/${id}`, data)
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/orders/${id}`)
    return response.data
  },

  async getAudits(id) {
    const response = await api.get(`/orders/${id}/audits`)
    return response.data
  }
}