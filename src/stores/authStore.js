import { create } from 'zustand'
import * as authApi from '../api/auth'
import * as profileApi from '../api/profile'

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email, password) => {
    const { data } = await authApi.signin(email, password)
    localStorage.setItem('token', data.token)
    set({ token: data.token, isAuthenticated: true })
    await get().loadUser()
  },

  loginWithCode: async (email, code) => {
    const { data } = await authApi.signinCode(email, code)
    localStorage.setItem('token', data.token)
    set({ token: data.token, isAuthenticated: true })
    await get().loadUser()
  },

  signup: async (userData) => {
    const { data } = await authApi.signup(userData)
    localStorage.setItem('token', data.token)
    set({ token: data.token, isAuthenticated: true })
    await get().loadUser()
  },

  signupWithCode: async (email, code, userData) => {
    const { data } = await authApi.signupCode({ ...userData, email, code })
    localStorage.setItem('token', data.token)
    set({ token: data.token, isAuthenticated: true })
    await get().loadUser()
  },

  sendCode: async (email, purpose) => {
    await authApi.sendCode(email, purpose)
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null, isAuthenticated: false })
  },

  loadUser: async () => {
    try {
      const { data } = await profileApi.getProfile()
      set({ user: data })
    } catch {
      get().logout()
    }
  },

  updateProfile: async (profileData) => {
    const { data } = await profileApi.updateProfile(profileData)
    set({ user: data })
  },

  forgotPassword: async (email) => {
    await authApi.forgotPassword(email)
  },

  resetPassword: async (email, code, newPassword) => {
    await authApi.resetPassword(email, code, newPassword)
  },
}))

export default useAuthStore
