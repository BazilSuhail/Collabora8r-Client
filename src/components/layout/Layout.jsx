import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import useAuthStore from '../../stores/authStore'
import useUiStore from '../../stores/uiStore'

const Layout = () => {
  const { token, user, loadUser } = useAuthStore()
  const { theme } = useUiStore()

  useEffect(() => {
    if (token && !user) loadUser()
  }, [token])

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#000000]' : 'bg-[#fcfaf8]'} text-gray-900 dark:text-gray-100 transition-colors duration-300`}>
      <Outlet />
    </div>
  )
}

export default Layout
