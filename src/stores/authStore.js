import { create } from 'zustand'
import api from '../utils/api'
import useSocketStore from './socketStore'

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email, password) => {
    const { data, error } = await api('POST', '/auth/signin', { email, password })
    if (error) throw error
    localStorage.setItem('token', data.token)
    set({ token: data.token, isAuthenticated: true })
    await get().loadUser()
  },

  loginWithCode: async (email, code) => {
    const { data, error } = await api('POST', '/auth/signin-code', { email, code })
    if (error) throw error
    localStorage.setItem('token', data.token)
    set({ token: data.token, isAuthenticated: true })
    await get().loadUser()
  },

  signup: async (userData) => {
    const { data, error } = await api('POST', '/auth/signup', userData)
    if (error) throw error
    localStorage.setItem('token', data.token)
    set({ token: data.token, isAuthenticated: true })
    await get().loadUser()
  },

  signupWithCode: async (email, code, userData) => {
    const { data, error } = await api('POST', '/auth/signup-code', { ...userData, email, code })
    if (error) throw error
    localStorage.setItem('token', data.token)
    set({ token: data.token, isAuthenticated: true })
    await get().loadUser()
  },

  sendCode: async (email, purpose) => {
    const { error } = await api('POST', '/auth/send-code', { email, purpose })
    if (error) throw error
  },

  logout: () => {
    useSocketStore.getState().disconnect()
    localStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false })
  },

  loadUser: async () => {
    try {
      const { data, error } = await api('GET', '/profile/')
      if (error) throw error
      set({ user: data })
      const { connect } = useSocketStore.getState()
      if (data._id) connect(data._id)
    } catch {
      get().logout()
    }
  },

  updateProfile: async (profileData) => {
    const { data, error } = await api('PUT', '/profile/', profileData)
    if (error) throw error
    set({ user: data })
  },

  forgotPassword: async (email) => {
    const { error } = await api('POST', '/auth/forgot-password', { email })
    if (error) throw error
  },

  resetPassword: async (email, code, newPassword) => {
    const { error } = await api('POST', '/auth/reset-password', { email, code, newPassword })
    if (error) throw error
  },
}))

export default useAuthStore
