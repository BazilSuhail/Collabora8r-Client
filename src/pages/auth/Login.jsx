import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../../stores/authStore'

const Login = () => {
  const [mode, setMode] = useState('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login, loginWithCode, sendCode } = useAuthStore()
  const navigate = useNavigate()

  const handlePasswordLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Authorization failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSendCode = async () => {
    setLoading(true)
    setError('')
    try {
      await sendCode(email, 'login')
      setCodeSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send code')
    } finally {
      setLoading(false)
    }
  }

  const handleCodeLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await loginWithCode(email, code)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfaf8] dark:bg-[#000000] p-4 transition-colors duration-300">
      <div className="fixed top-0 right-0 w-96 h-96 bg-orange-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-96 h-96 bg-orange-600/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md relative">
        <div className="bg-white dark:bg-[#0a0a0a] rounded-2xl shadow-xl border border-gray-200 dark:border-[#1a1a1a] p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <img src="/collabor8r.svg" alt="C" className="w-7 h-7 brightness-0 invert" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Authorization</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Sign in to access Command Center</p>
          </div>

          <div className="flex bg-gray-100 dark:bg-[#151515] rounded-xl p-1 mb-6">
            {['password', 'code'].map((m) => (
              <button key={m} onClick={() => { setMode(m); setCodeSent(false); setError('') }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                  mode === m
                    ? 'bg-white dark:bg-[#0a0a0a] text-orange-600 dark:text-orange-400 shadow-sm border border-gray-200 dark:border-[#1a1a1a]'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                {m === 'password' ? 'Password' : 'Secure Code'}
              </button>
            ))}
          </div>

          {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-bold mb-4 text-center"
            >
              {error}
            </motion.p>
          )}

          <AnimatePresence mode="wait">
            {mode === 'password' ? (
              <motion.form key="password" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                onSubmit={handlePasswordLogin} className="space-y-4"
              >
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white placeholder-gray-400 font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition" />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white placeholder-gray-400 font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition" />
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold hover:from-orange-500 hover:to-orange-600 disabled:opacity-50 transition-all shadow-md">
                  {loading ? 'Authenticating...' : 'Sign In'}
                </button>
                <Link to="/forgot-password" className="block text-center text-sm font-bold text-orange-600 dark:text-orange-500 hover:underline">
                  Forgot password?
                </Link>
              </motion.form>
            ) : (
              <motion.form key="code" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                onSubmit={codeSent ? handleCodeLogin : (e) => { e.preventDefault(); handleSendCode() }} className="space-y-4"
              >
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white placeholder-gray-400 font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition" />
                {codeSent && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    <input type="text" placeholder="6-digit code" value={code} onChange={(e) => setCode(e.target.value)} required maxLength={6}
                      className="w-full px-5 py-3.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white placeholder-gray-400 font-medium focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition text-center text-2xl tracking-[12px]" />
                  </motion.div>
                )}
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold hover:from-orange-500 hover:to-orange-600 disabled:opacity-50 transition-all shadow-md">
                  {loading ? 'Processing...' : codeSent ? 'Verify & Sign In' : 'Send Code'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6 font-medium">
            No access credentials?{' '}
            <Link to="/register" className="text-orange-600 dark:text-orange-500 hover:underline font-bold">Sign up</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
