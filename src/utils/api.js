import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || 'http://localhost:3001',
})

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  },
)

const api = async (method, path, data, options = {}) => {
  try {
    const config = { method, url: path, ...options }
    if (data && method !== 'get') config.data = data
    if (data && method === 'get') config.params = data

    const response = await client(config)

    return {
      data: response.data,
      status: response.status,
      headers: response.headers,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      status: err.response?.status || 0,
      error: err.response?.data || err.message || 'Request failed',
      headers: err.response?.headers || null,
    }
  }
}

export default api
