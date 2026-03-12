import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import useAuthStore from '../../stores/authStore'
import useUiStore from '../../stores/uiStore'

const SidebarLayout = () => {
  const { isAuthenticated, token, user, loadUser } = useAuthStore()
  const { sidebarOpen, theme } = useUiStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (token && !user) loadUser()
  }, [token])

  useEffect(() => {
    if (!isAuthenticated) navigate('/login', { replace: true })
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-[#000000]' : 'bg-[#fcfaf8]'} transition-colors duration-300`}>
      <Sidebar />
      <main
        className={`flex-1 transition-all duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] pt-16 lg:pt-0 ${
          sidebarOpen ? 'ml-[280px]' : 'ml-[80px]'
        }`}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default SidebarLayout
