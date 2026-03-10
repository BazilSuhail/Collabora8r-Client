import { useEffect } from 'react'
import useAuthStore from '../stores/authStore'

const useAuth = () => {
  const { user, token, isAuthenticated, login, loginWithCode, signup, signupWithCode, sendCode, logout, loadUser, updateProfile, forgotPassword, resetPassword } = useAuthStore()

  useEffect(() => {
    if (token && !user) {
      loadUser()
    }
  }, [token])

  return {
    user,
    token,
    isAuthenticated,
    login,
    loginWithCode,
    signup,
    signupWithCode,
    sendCode,
    logout,
    loadUser,
    updateProfile,
    forgotPassword,
    resetPassword,
  }
}

export default useAuth
