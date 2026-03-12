import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCalendar, FiPlay, FiCheckCircle, FiTrash2 } from 'react-icons/fi'
import PageHeader from '../../../components/PageHeader'
import api from '../../../utils/api'

const SprintDetail = () => {
  const { projectId } = useParams()
  const [sprints, setSprints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await api('GET', '/sprints/' + projectId)
      setSprints(data || [])
      setLoading(false)
    }
    load()
  }, [projectId])

  const handleActivate = async (id) => {
    try {
      const { data } = await api('POST', '/sprints/sprint/' + id + '/activate')
      setSprints((prev) => prev.map((s) => (s._id === id ? data : s)))
    } catch (err) { console.error(err) }
  }
  const handleComplete = async (id) => {
    try {
      const { data } = await api('POST', '/sprints/sprint/' + id + '/complete')
      setSprints((prev) => prev.map((s) => (s._id === id ? data : s)))
    } catch (err) { console.error(err) }
  }
  const handleDelete = async (id) => {
    if (!confirm('Delete this sprint?')) return
    try {
      await api('DELETE', '/sprints/sprint/' + id)
      setSprints((prev) => prev.filter((s) => s._id !== id))
    } catch (err) { console.error(err) }
  }

  return (
    <div>
      <PageHeader
        icon={FiCalendar}
        title="Sprint"
        highlight="Management"
        subtitle="All iterations"
      />

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => <div key={i} className="h-24 bg-gray-100 dark:bg-[#151515] rounded-xl animate-pulse" />)}
        </div>
      ) : sprints.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a]">
          <FiCalendar size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Sprints</h3>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Create one from the backlog page.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sprints.map((sprint) => (
            <motion.div key={sprint._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-6 hover:border-orange-500/30 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center text-white shadow-md">
                    <FiCalendar size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{sprint.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                      {sprint.startDate ? new Date(sprint.startDate).toLocaleDateString() : '—'} — {sprint.endDate ? new Date(sprint.endDate).toLocaleDateString() : '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                    sprint.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    sprint.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>{sprint.status || 'planned'}</span>
                  {sprint.status === 'planned' && (
                    <button onClick={() => handleActivate(sprint._id)} className="p-2.5 rounded-lg text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all" title="Start sprint">
                      <FiPlay size={16} />
                    </button>
                  )}
                  {sprint.status === 'active' && (
                    <button onClick={() => handleComplete(sprint._id)} className="p-2.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all" title="Complete sprint">
                      <FiCheckCircle size={16} />
                    </button>
                  )}
                  {sprint.status !== 'active' && (
                    <button onClick={() => handleDelete(sprint._id)} className="p-2.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all" title="Delete">
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              {sprint.taskCount > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 ml-16 font-medium">{sprint.taskCount} tasks</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SprintDetail
