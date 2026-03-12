import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiCalendar, FiPlus, FiChevronRight } from 'react-icons/fi'
import PageHeader from '../../../components/PageHeader'
import api from '../../../utils/api'

const SprintPlanning = () => {
  const { projectId } = useParams()
  const [sprints, setSprints] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '' })

  useEffect(() => {
    const load = async () => {
      const [sprintsRes, tasksRes] = await Promise.all([
        api('GET', '/sprints/' + projectId),
        api('GET', '/manageTasks/project/' + projectId),
      ])
      setSprints(sprintsRes.data || [])
      setTasks(tasksRes.data.tasks || tasksRes.data || [])
      setLoading(false)
    }
    load()
  }, [projectId])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return
    try {
      const { data } = await api('POST', '/sprints/' + projectId, form)
      setSprints((prev) => [...prev, data])
      setForm({ name: '', startDate: '', endDate: '' })
      setShowForm(false)
    } catch (err) {
      console.error('Sprint create failed:', err)
    }
  }

  const backlogTasks = tasks.filter((t) => !t.sprintId)

  return (
    <div>
      <PageHeader
        icon={FiCalendar}
        title="Sprint"
        highlight="Planning"
        subtitle="Backlog and iteration management"
        action={
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold shadow-md hover:from-orange-500 hover:to-orange-600 transition-all">
            <FiPlus size={18} /> New Sprint
          </button>
        }
      />

      {showForm && (
        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCreate}
          className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-6 mb-6 flex items-end gap-4 flex-wrap"
        >
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Sprint 1" required
              className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white placeholder-gray-400 font-medium focus:ring-2 focus:ring-orange-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">Start</label>
            <input type="date" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
              className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">End</label>
            <input type="date" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
              className="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-[#1a1a1a] bg-white dark:bg-[#000] text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition" />
          </div>
          <button type="submit" className="px-6 py-2.5 rounded-lg bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold hover:from-orange-500 hover:to-orange-600 transition-all shadow-md">Create Sprint</button>
        </motion.form>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-6">
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiCalendar size={16} className="text-orange-600" />
            Sprints ({sprints.length})
          </h2>
          {loading ? (
            <div className="space-y-2">{[1, 2].map((i) => <div key={i} className="h-16 bg-gray-100 dark:bg-[#151515] rounded-lg animate-pulse" />)}</div>
          ) : sprints.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8 font-medium">No sprints yet. Create one to begin.</p>
          ) : (
            <div className="space-y-2">
              {sprints.map((sprint) => (
                <div key={sprint._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-[#151515] hover:bg-orange-50 dark:hover:bg-orange-500/5 transition-all cursor-pointer border border-transparent hover:border-orange-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center text-white">
                      <FiCalendar size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{sprint.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {sprint.startDate ? new Date(sprint.startDate).toLocaleDateString() : '—'} - {sprint.endDate ? new Date(sprint.endDate).toLocaleDateString() : '—'}
                      </p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${
                    sprint.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                    sprint.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>{sprint.status || 'planned'}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-6">
          <h2 className="text-lg font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FiChevronRight size={16} className="text-orange-600" />
            Backlog ({backlogTasks.length})
          </h2>
          {loading ? (
            <div className="space-y-2">{[1, 2, 3].map((i) => <div key={i} className="h-12 bg-gray-100 dark:bg-[#151515] rounded-lg animate-pulse" />)}</div>
          ) : backlogTasks.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8 font-medium">No unassigned tasks. Good.</p>
          ) : (
            <div className="space-y-2">
              {backlogTasks.map((task) => (
                <div key={task._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#151515] hover:bg-orange-50 dark:hover:bg-orange-500/5 transition-all border border-transparent hover:border-orange-500/20">
                  <div className="flex items-center gap-3 min-w-0">
                    <FiChevronRight className="text-gray-400 shrink-0" size={14} />
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{task.title}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-bold shrink-0 ml-2 ${
                    task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}>{task.priority}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SprintPlanning
