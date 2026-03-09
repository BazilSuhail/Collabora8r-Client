import api from './client'

export const signup = (data) => api.post('/auth/signup', data)
export const signin = (email, password) => api.post('/auth/signin', { email, password })
export const sendCode = (email, purpose) => api.post('/auth/send-code', { email, purpose })
export const signupCode = (data) => api.post('/auth/signup-code', data)
export const signinCode = (email, code) => api.post('/auth/signin-code', { email, code })
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email })
export const resetPassword = (email, code, newPassword) => api.post('/auth/reset-password', { email, code, newPassword })
export const checkEmail = (email) => api.post('/auth/check-email', { email })
