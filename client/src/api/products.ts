// src/api/products.js
import { api } from './axios'

export async function getProducts() {
  const token = localStorage.getItem('token')

  const response = await api.get('/products', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return response.data.data
}
