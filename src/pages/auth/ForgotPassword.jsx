import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import useAuthStore from '../../stores/authStore'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { forgotPassword } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset code')
    } finally { setLoading(false) }
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fcfaf8] dark:bg-[#000000] p-4 transition-colors duration-300">
        <div className="fixed top-0 right-0 w-96 h-96 bg-orange-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="fixed bottom-0 left-0 w-96 h-96 bg-orange-600/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md relative">
          <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-xl border border-gray-200 dark:border-[#1a1a1a] p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Signal Sent</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">Reset code dispatched to <strong className="text-gray-900 dark:text-white">{email}</strong></p>
            <Link to="/reset-password" className="inline-block px-8 py-3.5 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold hover:from-orange-500 hover:to-orange-600 shadow-md transition-all">Reset Password</Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfaf8] dark:bg-[#000000] p-4 transition-colors duration-300">
      <div className="fixed top-0 right-0 w-96 h-96 bg-orange-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-orange-600/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md relative">
        <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-xl border border-gray-200 dark:border-[#1a1a1a] p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Forgot password?</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Enter your email and we'll send a reset code.</p>
          </div>
          {error && <p className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-bold mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-5 py-3.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white placeholder-gray-400 font-medium focus:ring-2 focus:ring-orange-500 outline-none transition" />
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold hover:from-orange-500 hover:to-orange-600 disabled:opacity-50 shadow-md transition-all">
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6 font-medium">
            Remember your password?{' '}
            <Link to="/login" className="text-orange-600 dark:text-orange-500 hover:underline font-bold">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword
