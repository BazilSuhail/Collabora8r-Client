import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:3001',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/signin'
    }
    return Promise.reject(err)
  },
)

export default api
