import api from './api'

export const productService = {
  async getAll() {
    const response = await api.get('/products')
    return response.data
  },

  async getById(id) {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  async create(data) {
    const formData = new FormData()
    
    // Append all fields to FormData
    Object.keys(data).forEach(key => {
      if (key === 'specifications' && typeof data[key] === 'object') {
        formData.append(key, JSON.stringify(data[key]))
      } else {
        formData.append(key, data[key])
      }
    })

    const response = await api.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  async update(id, data) {
    const formData = new FormData()
    
    // Append all fields to FormData
    Object.keys(data).forEach(key => {
      if (key === 'specifications' && typeof data[key] === 'object') {
        formData.append(key, JSON.stringify(data[key]))
      } else {
        formData.append(key, data[key])
      }
    })

    const response = await api.post(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  async delete(id) {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },

  async getAudits(id) {
    const response = await api.get(`/products/${id}/audits`)
    return response.data
  }
}