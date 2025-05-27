import axios from 'axios'
import { commonStore } from '@/stores/common'

export const api = axios.create({
  baseURL: '/api', 
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.log(error)
    
    if (error.response?.status === 403) {
      const store = commonStore() 
      store.clearToken()
    }

    return Promise.reject(error)
  }
)
