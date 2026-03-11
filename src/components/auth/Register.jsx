import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useAuthStore from '../../stores/authStore'

const stepVariants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
}

const Register = () => {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: '',
    email: '',
    gender: '',
    phone: '',
    dob: '',
    password: '',
    confirmPassword: '',
  })
  const [useCode, setUseCode] = useState(false)
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { signup, signupWithCode, sendCode } = useAuthStore()
  const navigate = useNavigate()

  const update = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const nextStep = () => {
    setError('')
    if (step === 1 && (!form.name || !form.email)) {
      setError('Name and email are required')
      return
    }
    if (step === 2 && (!form.gender || !form.phone || !form.dob)) {
      setError('All fields are required')
      return
    }
    setStep((s) => s + 1)
  }

  const prevStep = () => {
    setError('')
    setStep((s) => s - 1)
  }

  const handleSendCode = async () => {
    setLoading(true)
    setError('')
    try {
      await sendCode(form.email, 'registration')
      setCodeSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send code')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSignup = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    try {
      await signup({
        name: form.name,
        email: form.email,
        gender: form.gender,
        phone: form.phone,
        dob: form.dob,
        password: form.password,
      })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCodeSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signupWithCode(form.email, code, {
        name: form.name,
        gender: form.gender,
        phone: form.phone,
        dob: form.dob,
      })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { title: 'Personal Info', subtitle: 'Tell us about yourself' },
    { title: 'Details', subtitle: 'A bit more information' },
    { title: useCode ? 'Verify Code' : 'Set Password', subtitle: useCode ? 'Check your email' : 'Choose a password' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-red-50 dark:from-bg-dark dark:via-bg-dark dark:to-primary-500/5 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-xl border border-gray-200 dark:border-border-dark p-8">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create account</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{steps[step - 1].subtitle}</p>
          </div>

          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    s <= step
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 dark:bg-surface-hover text-gray-500'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded transition-colors ${
                      s < step ? 'bg-primary' : 'bg-gray-200 dark:bg-surface-hover'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mb-4 text-center"
            >
              {error}
            </motion.p>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <input
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={update('name')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={update('email')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
                >
                  Continue
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <select
                  value={form.gender}
                  onChange={update('gender')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={form.phone}
                  onChange={update('phone')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />
                <input
                  type="date"
                  placeholder="Date of birth"
                  value={form.dob}
                  onChange={update('dob')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-border-dark text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-surface-hover transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex bg-gray-100 dark:bg-surface-hover rounded-lg p-1 mb-4">
                  <button
                    onClick={() => { setUseCode(false); setCodeSent(false); setError('') }}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                      !useCode
                        ? 'bg-white dark:bg-surface-dark text-primary-600 dark:text-primary-500 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    Password
                  </button>
                  <button
                    onClick={() => { setUseCode(true); setCodeSent(false); setError('') }}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                      useCode
                        ? 'bg-white dark:bg-surface-dark text-primary-600 dark:text-primary-500 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                  >
                    Email Code
                  </button>
                </div>

                {useCode ? (
                  <form onSubmit={handleCodeSignup} className="space-y-4">
                    {!codeSent ? (
                      <button
                        type="button"
                        onClick={handleSendCode}
                        disabled={loading}
                        className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover disabled:opacity-50 transition-colors"
                      >
                        {loading ? 'Sending...' : 'Send Verification Code'}
                      </button>
                    ) : (
                      <>
                        <input
                          type="text"
                          placeholder="6-digit code"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          required
                          maxLength={6}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-center text-xl tracking-widest"
                        />
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover disabled:opacity-50 transition-colors"
                        >
                          {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                      </>
                    )}
                  </form>
                ) : (
                  <form onSubmit={handlePasswordSignup} className="space-y-4">
                    <input
                      type="password"
                      placeholder="Password"
                      value={form.password}
                      onChange={update('password')}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    />
                    <input
                      type="password"
                      placeholder="Confirm password"
                      value={form.confirmPassword}
                      onChange={update('confirmPassword')}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-border-dark bg-white dark:bg-surface-dark text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 py-3 rounded-lg border border-gray-300 dark:border-border-dark text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-surface-hover transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary-hover disabled:opacity-50 transition-colors"
                      >
                        {loading ? 'Creating...' : 'Create Account'}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 dark:text-primary-500 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
