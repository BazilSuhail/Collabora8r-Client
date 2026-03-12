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
  const [form, setForm] = useState({ name: '', email: '', gender: '', phone: '', dob: '', password: '', confirmPassword: '' })
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
    if (step === 1 && (!form.name || !form.email)) { setError('Name and email are required'); return }
    if (step === 2 && (!form.gender || !form.phone || !form.dob)) { setError('All fields are required'); return }
    setStep((s) => s + 1)
  }

  const prevStep = () => { setError(''); setStep((s) => s - 1) }

  const handleSendCode = async () => {
    setLoading(true)
    setError('')
    try {
      await sendCode(form.email, 'registration')
      setCodeSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send code')
    } finally { setLoading(false) }
  }

  const handlePasswordSignup = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }
    setLoading(true)
    setError('')
    try {
      await signup({ name: form.name, email: form.email, gender: form.gender, phone: form.phone, dob: form.dob, password: form.password })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  const handleCodeSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await signupWithCode(form.email, code, { name: form.name, gender: form.gender, phone: form.phone, dob: form.dob })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  const steps = [
    { title: 'Identity', subtitle: 'Tell us about yourself' },
    { title: 'Details', subtitle: 'A bit more information' },
    { title: useCode ? 'Verification' : 'Security', subtitle: useCode ? 'Check your email' : 'Choose a password' },
  ]

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
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">Enlist</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">{steps[step - 1].subtitle}</p>
          </div>

          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  s <= step ? 'bg-gradient-to-br from-orange-600 to-orange-700 text-white shadow-md' : 'bg-gray-200 dark:bg-[#151515] text-gray-500'
                }`}>{s}</div>
                {s < 3 && <div className={`flex-1 h-1 mx-2 rounded transition-all ${s < step ? 'bg-gradient-to-r from-orange-600 to-orange-700' : 'bg-gray-200 dark:bg-[#151515]'}`} />}
              </div>
            ))}
          </div>

          {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-bold mb-4 text-center">
              {error}
            </motion.p>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className="space-y-4">
                <input type="text" placeholder="Full name" value={form.name} onChange={update('name')}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white placeholder-gray-400 font-medium focus:ring-2 focus:ring-orange-500 outline-none transition" />
                <input type="email" placeholder="Email" value={form.email} onChange={update('email')}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white placeholder-gray-400 font-medium focus:ring-2 focus:ring-orange-500 outline-none transition" />
                <button type="button" onClick={nextStep} className="w-full py-3.5 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold hover:from-orange-500 hover:to-orange-600 shadow-md transition-all">Continue</button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className="space-y-4">
                <select value={form.gender} onChange={update('gender')}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 outline-none transition">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <input type="tel" placeholder="Phone number" value={form.phone} onChange={update('phone')}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white placeholder-gray-400 font-medium focus:ring-2 focus:ring-orange-500 outline-none transition" />
                <input type="date" placeholder="Date of birth" value={form.dob} onChange={update('dob')}
                  className="w-full px-5 py-3.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white font-medium focus:ring-2 focus:ring-orange-500 outline-none transition" />
                <div className="flex gap-2">
                  <button type="button" onClick={prevStep} className="flex-1 py-3.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-[#151515] transition-all">Back</button>
                  <button type="button" onClick={nextStep} className="flex-1 py-3.5 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold hover:from-orange-500 hover:to-orange-600 shadow-md transition-all">Continue</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.2 }} className="space-y-4">
                <div className="flex bg-gray-100 dark:bg-[#151515] rounded-xl p-1 mb-4">
                  {['password', 'code'].map((m) => (
                    <button key={m} onClick={() => { setUseCode(m === 'code'); setCodeSent(false); setError('') }}
                      className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                        (m === 'code') === useCode
                          ? 'bg-white dark:bg-[#0a0a0a] text-orange-600 dark:text-orange-400 shadow-sm border border-gray-200 dark:border-[#1a1a1a]'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                    >
                      {m === 'password' ? 'Password' : 'Email Code'}
                    </button>
                  ))}
                </div>

                {useCode ? (
                  <form onSubmit={handleCodeSignup} className="space-y-4">
                    {!codeSent ? (
                      <button type="button" onClick={handleSendCode} disabled={loading}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold hover:from-orange-500 hover:to-orange-600 disabled:opacity-50 shadow-md transition-all">
                        {loading ? 'Sending...' : 'Send Verification Code'}
                      </button>
                    ) : (
                      <>
                        <input type="text" placeholder="6-digit code" value={code} onChange={(e) => setCode(e.target.value)} required maxLength={6}
                          className="w-full px-5 py-3.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white placeholder-gray-400 font-medium focus:ring-2 focus:ring-orange-500 outline-none transition text-center text-2xl tracking-[12px]" />
                        <button type="submit" disabled={loading}
                          className="w-full py-3.5 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold hover:from-orange-500 hover:to-orange-600 disabled:opacity-50 shadow-md transition-all">
                          {loading ? 'Creating...' : 'Create Account'}
                        </button>
                      </>
                    )}
                  </form>
                ) : (
                  <form onSubmit={handlePasswordSignup} className="space-y-4">
                    <input type="password" placeholder="Password" value={form.password} onChange={update('password')} required
                      className="w-full px-5 py-3.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white placeholder-gray-400 font-medium focus:ring-2 focus:ring-orange-500 outline-none transition" />
                    <input type="password" placeholder="Confirm password" value={form.confirmPassword} onChange={update('confirmPassword')} required
                      className="w-full px-5 py-3.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white placeholder-gray-400 font-medium focus:ring-2 focus:ring-orange-500 outline-none transition" />
                    <div className="flex gap-2">
                      <button type="button" onClick={prevStep} className="flex-1 py-3.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-[#151515] transition-all">Back</button>
                      <button type="submit" disabled={loading} className="flex-1 py-3.5 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold hover:from-orange-500 hover:to-orange-600 disabled:opacity-50 shadow-md transition-all">
                        {loading ? 'Creating...' : 'Create Account'}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6 font-medium">
            Already enlisted?{' '}
            <Link to="/login" className="text-orange-600 dark:text-orange-500 hover:underline font-bold">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default Register
