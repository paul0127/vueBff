// src/api/auth.js
import { api } from './axios'

export async function login(username, password) {
  const res = await api.post('/login', { username, password })
  localStorage.setItem('token', res.data.token)
  return res.data
}
