import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const stats = [
  { label: 'Active Users', value: '10K+' },
  { label: 'Projects Managed', value: '50K+' },
  { label: 'Tasks Completed', value: '1M+' },
]

const Home = () => {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-red-50 dark:from-bg-dark dark:via-bg-dark dark:to-primary-500/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-200/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-48">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-500 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
              Collaborate in real-time
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">
              Manage Projects
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-red-500">
                Together
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
              Plan, track, and ship projects with your team in one place. AI-powered insights, real-time updates, sprint management.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link
                to="/register"
                className="px-8 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors shadow-lg shadow-primary-200 dark:shadow-primary-900/30"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 rounded-xl border border-gray-300 dark:border-border-dark text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-surface-hover transition-colors"
              >
                Sign In
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-24 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {stats.map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 dark:bg-surface-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything you need to ship
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
              Sprint planning, Kanban boards, time tracking, and AI-powered insights — all in one workspace.
            </p>
          </motion.div>
        </div>
      </section>

      <footer className="py-8 border-t border-gray-200 dark:border-border-dark">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Collabora8r. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Home
