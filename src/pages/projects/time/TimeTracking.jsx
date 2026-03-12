import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiClock } from 'react-icons/fi'
import PageHeader from '../../../components/PageHeader'
import api from '../../../utils/api'

const TimeTracking = () => {
  const { projectId } = useParams()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api('GET', '/time/report/project/' + projectId)
        setEntries(data.entries || data)
      } catch (err) {
        console.error('Failed to load time entries:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [projectId])

  return (
    <div>
      <PageHeader
        icon={FiClock}
        title="Time"
        highlight="Tracking"
        subtitle="Hours logged across operations"
      />

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-100 dark:bg-[#151515] rounded-xl animate-pulse" />)}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a]">
          <FiClock size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Time Entries</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Log time to track your work.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry, i) => (
            <motion.div key={entry._id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className="flex items-center justify-between p-4 bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] hover:border-orange-500/30 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center text-white shadow-md">
                  <FiClock size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{entry.task?.title || entry.description || 'Time entry'}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
                    {entry.user?.name || 'Someone'} · {entry.date ? new Date(entry.date).toLocaleDateString() : new Date(entry.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className="text-lg font-black text-gray-900 dark:text-white">{entry.hours || entry.loggedHours}h</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TimeTracking
