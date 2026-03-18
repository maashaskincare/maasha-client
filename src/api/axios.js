import axios from 'axios'
import { API_BASE_URL } from '../constants'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('maasha_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('maasha_token')
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/admin')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
