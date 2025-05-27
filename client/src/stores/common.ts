import { ref, computed } from 'Vue'
import { defineStore } from 'pinia'

import { login } from '@/api/login'

export const commonStore = defineStore('common', () => {
  const token = ref(localStorage.getItem('token'))
  const isLoggedIn = computed(() => {
    return !!token.value
  })

  const clearToken = () => {
    localStorage.removeItem('token')
    token.value = null
  }

  const handleLogin = async (username, password) => {
    try {
      const res = await login(username, password)
      if (res.token) {
        localStorage.setItem('token', res.token)
        token.value = res.token

        return true
      } else {
        return false
      }
    } catch (err) {
      alert('登入失敗，請檢查帳號或密碼')
      console.error(err)
      
      return false
    }
  }
  return { token, isLoggedIn, clearToken, handleLogin }
})
