import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiGrid, FiFolder, FiShield, FiPlus, FiBell, FiUser, FiMail } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import useAuthStore from '../stores/authStore'
import api from '../utils/api'

const Dashboard = () => {
  const { user } = useAuthStore()
  const [stats, setStats] = useState(null)
  const [recentTasks, setRecentTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [overviewRes, tasksRes] = await Promise.allSettled([
          api('GET', '/overview/progress-overview'),
          api('GET', '/overview/assigned-tasks'),
        ])
        if (overviewRes.status === 'fulfilled') {
          setStats(overviewRes.value.data.projectCounts || overviewRes.value.data)
        }
        if (tasksRes.status === 'fulfilled') {
          setRecentTasks((tasksRes.value.data.tasks || tasksRes.value.data).slice(0, 5))
        }
      } catch (err) {
        console.error('Dashboard load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const cards = [
    { label: 'Admin Projects', value: stats?.adminProjectsCount ?? '—', icon: FiFolder, desc: 'Projects you own', href: '/projects', color: 'from-orange-600 to-orange-700' },
    { label: 'Joined Projects', value: stats?.joinedProjectsCount ?? '—', icon: FiShield, desc: 'Projects you contribute to', href: '/projects', color: 'from-blue-500 to-blue-600' },
    { label: 'Managing', value: stats?.managerProjectCount ?? '—', icon: FiGrid, desc: 'Projects you manage', href: '/projects', color: 'from-emerald-500 to-emerald-600' },
  ]

  return (
    <div>
      <PageHeader
        icon={FiGrid}
        title="Protocol:"
        highlight="Active"
        subtitle={`Welcome, ${user?.name || 'Specialist'}`}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.href}
            className="block bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-6 hover:shadow-lg hover:border-orange-500/30 transition-all duration-300 group"
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-105 transition-transform`}>
              <card.icon size={22} />
            </div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">
              {loading ? <span className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded inline-block w-14 h-8" /> : card.value}
            </div>
            <div className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{card.label}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{card.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-6"
        >
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiBell size={16} className="text-orange-600" />
            Incoming Tasks
          </h2>
          {recentTasks.length === 0 ? (
            <p className="text-sm text-gray-400 py-8 text-center">No tasks assigned yet.</p>
          ) : (
            <div className="space-y-2">
              {recentTasks.map((task) => (
                <Link
                  key={task._id}
                  to={`/tasks/${task._id}`}
                  className="block p-4 rounded-xl bg-gray-50 dark:bg-[#151515] hover:bg-orange-50 dark:hover:bg-orange-500/5 border border-transparent hover:border-orange-500/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{task.title}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-800 px-2 py-0.5 rounded">{task.projectName || task.projectId?.name || ''}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{task.status}</span>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-lg font-bold shrink-0 ${
                      task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}>{task.priority}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-6"
        >
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiPlus size={16} className="text-orange-600" />
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link to="/projects/new" className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#151515] hover:bg-orange-50 dark:hover:bg-orange-500/5 border border-transparent hover:border-orange-500/20 transition-all group">
              <div className="w-11 h-11 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-105 transition-transform">
                <FiPlus size={20} />
              </div>
              <div><p className="text-sm font-semibold text-gray-900 dark:text-white">Establish New Frontier</p><p className="text-xs text-gray-500 dark:text-gray-400">Create a new project workspace</p></div>
            </Link>
            <Link to="/invitations" className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#151515] hover:bg-orange-50 dark:hover:bg-orange-500/5 border border-transparent hover:border-orange-500/20 transition-all group">
              <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-105 transition-transform">
                <FiMail size={20} />
              </div>
              <div><p className="text-sm font-semibold text-gray-900 dark:text-white">View Invitations</p><p className="text-xs text-gray-500 dark:text-gray-400">Accept or decline pending invites</p></div>
            </Link>
            <Link to="/profile" className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-[#151515] hover:bg-orange-50 dark:hover:bg-orange-500/5 border border-transparent hover:border-orange-500/20 transition-all group">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-105 transition-transform">
                <FiUser size={20} />
              </div>
              <div><p className="text-sm font-semibold text-gray-900 dark:text-white">Update Profile</p><p className="text-xs text-gray-500 dark:text-gray-400">Manage your personal information</p></div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
