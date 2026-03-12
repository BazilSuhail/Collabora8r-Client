import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiActivity, FiUser } from 'react-icons/fi'
import PageHeader from '../../../components/PageHeader'
import api from '../../../utils/api'

const ActivityLog = () => {
  const { projectId } = useParams()
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api('GET', '/activity/project/' + projectId)
        setActivities(data.activities || data)
      } catch (err) {
        console.error('Failed to load activity:', err)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [projectId])

  return (
    <div>
      <PageHeader
        icon={FiActivity}
        title="Activity"
        highlight="Log"
        subtitle="All sector operations"
      />

      {loading ? (
        <div className="space-y-3 max-w-2xl">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-16 bg-gray-100 dark:bg-[#151515] rounded-xl animate-pulse" />)}
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] max-w-2xl">
          <FiActivity size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Activity</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium">No operations recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-2 max-w-2xl">
          {activities.map((a, i) => (
            <motion.div
              key={a._id || i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-start gap-4 p-4 bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] hover:border-orange-500/30 transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md">
                {(a.user?.name || '?').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  <span className="font-bold">{a.user?.name || 'Someone'}</span> {a.action || a.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                  {a.createdAt ? new Date(a.createdAt).toLocaleString() : ''}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ActivityLog
