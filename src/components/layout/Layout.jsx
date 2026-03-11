import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'

const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password']

const Layout = () => {
  const { pathname } = useLocation()
  const isAuthPage = authRoutes.includes(pathname)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {!isAuthPage && <Navbar />}
      <main className={isAuthPage ? '' : 'pt-16'}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
