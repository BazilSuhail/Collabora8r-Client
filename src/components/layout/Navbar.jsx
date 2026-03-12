import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiMenu, FiX, FiLogOut, FiSun, FiMoon } from 'react-icons/fi'
import useAuthStore from '../../stores/authStore'
import useUiStore from '../../stores/uiStore'

const guestLinks = [
  { to: '/', label: 'Home' },
  { to: '/login', label: 'Sign In' },
  { to: '/register', label: 'Sign Up' },
]

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { theme, toggleTheme } = useUiStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const links = isAuthenticated
    ? [{ to: '/dashboard', label: 'Command Center' }]
    : guestLinks

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-lg border-b border-gray-200 dark:border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center shadow-md">
              <img src="/collabor8r.svg" alt="C" className="w-5 h-5 brightness-0 invert" />
            </div>
            <span className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">Collabora8r</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  pathname === to
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/50'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggleTheme} className="p-2.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all" title="Toggle theme">
              {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
            {isAuthenticated && user ? (
              <>
                <Link to="/profile" className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all group">
                  <div className="w-8 h-8 rounded-lg overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700 group-hover:ring-orange-500/40 transition-all">
                    <img src={`/avatars/${user.avatar || '1'}.jpg`} alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        const fb = e.target.nextSibling
                        if (fb) fb.style.display = 'flex'
                      }}
                    />
                    <div className="hidden w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-500/20 dark:to-orange-600/20 items-center justify-center text-orange-600 dark:text-orange-400 text-xs font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300 max-w-[120px] truncate">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="p-2.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                  <FiLogOut size={18} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all">
                  Sign In
                </Link>
                <Link to="/register" className="px-5 py-2 rounded-lg text-sm font-bold bg-gradient-to-br from-orange-600 to-orange-700 text-white hover:from-orange-500 hover:to-orange-600 shadow-md transition-all">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800/50">
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-gray-200 dark:border-[#1a1a1a] bg-white dark:bg-[#0a0a0a]"
        >
          <div className="px-4 py-3 space-y-1">
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 px-4 py-3 mb-2 border-b border-gray-200 dark:border-[#1a1a1a]">
                <div className="w-10 h-10 rounded-lg overflow-hidden ring-2 ring-gray-200 dark:ring-gray-700">
                  <img src={`/avatars/${user.avatar || '1'}.jpg`} alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      const fb = e.target.nextSibling
                      if (fb) fb.style.display = 'flex'
                    }}
                  />
                  <div className="hidden w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-500/20 dark:to-orange-600/20 items-center justify-center text-orange-600 dark:text-orange-400 text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                </div>
              </div>
            )}
            {links.map(({ to, label }) => (
              <Link key={to} to={to} onClick={() => setOpen(false)}
                className={`block px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  pathname === to
                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800/50'
                }`}
              >
                {label}
              </Link>
            ))}
            <button onClick={toggleTheme} className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
              {theme === 'dark' ? <FiSun size={16} /> : <FiMoon size={16} />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            {isAuthenticated && (
              <button onClick={() => { setOpen(false); handleLogout() }}
                className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <FiLogOut size={16} /> Logout
              </button>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  )
}

export default Navbar
