import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar'

const stats = [
  { label: 'Active Operatives', value: '10K+' },
  { label: 'Sectors Managed', value: '50K+' },
  { label: 'Missions Complete', value: '1M+' },
]

const features = [
  { title: 'Mission Control', desc: 'Kanban boards, sprint planning, and backlog management — all in one command center.' },
  { title: 'AI Intelligence', desc: 'Automated task breakdown, risk detection, acceptance criteria generation, and smart search.' },
  { title: 'Real-time Ops', desc: 'Live updates via websocket. Instant notifications on task changes, comments, and assignments.' },
]

const Home = () => {
  return (
    <div className="min-h-screen bg-[#fcfaf8] dark:bg-[#000000] transition-colors duration-300">
      <Navbar />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-[#000] dark:via-[#000] dark:to-orange-500/5" />
        <div className="absolute top-20 left-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-orange-600/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-48">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 text-sm font-bold mb-8 border border-orange-200 dark:border-orange-500/20">
              <span className="w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
              Real-time collaboration platform
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-gray-900 dark:text-white mb-6">
              Manage Projects
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">
                Together
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto font-medium">
              Plan, track, and ship projects with your team in one place. AI-powered insights, real-time updates, sprint management.
            </p>

            <div className="flex items-center justify-center gap-4">
              <Link to="/register" className="px-8 py-3.5 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold hover:from-orange-500 hover:to-orange-600 shadow-lg shadow-orange-500/20 transition-all">
                Get Started Free
              </Link>
              <Link to="/login" className="px-8 py-3.5 rounded-xl border border-gray-300 dark:border-[#1a1a1a] text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-[#151515] transition-all">
                Sign In
              </Link>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-24 grid grid-cols-3 gap-12 max-w-2xl mx-auto"
          >
            {stats.map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-4xl font-black text-gray-900 dark:text-white">{value}</div>
                <div className="text-sm font-bold text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">Everything you need to ship</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto font-medium">
              Sprint planning, Kanban boards, time tracking, and AI-powered insights — all in one command center.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ title, desc }, i) => (
              <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-[#fcfaf8] dark:bg-[#151515] rounded-2xl border border-gray-200 dark:border-[#1a1a1a] p-8 hover:shadow-xl hover:border-orange-500/30 transition-all"
              >
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-3">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 border-t border-gray-200 dark:border-[#1a1a1a] bg-[#fcfaf8] dark:bg-[#000]">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Collabora8r. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default Home
