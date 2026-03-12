import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCalendar, FiClock, FiUser, FiTag, FiPaperclip, FiMessageSquare, FiZap } from 'react-icons/fi'
import PageHeader from '../../components/PageHeader'
import api from '../../utils/api'

const TaskDetail = () => {
  const { taskId } = useParams()
  const [currentTask, setCurrentTask] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await api('GET', '/project-tasks/' + taskId)
      setCurrentTask(data)
      setLoading(false)
    }
    load()
  }, [taskId])

  const priorityColor = {
    High: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    Low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  }

  if (loading || !currentTask) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}
        </div>
        <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    )
  }

  return (
    <div>
      <Link to={`/projects/${currentTask.projectId}`} className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-orange-600 mb-4 transition-colors">
        <FiArrowLeft size={16} /> Back to Operations
      </Link>

      <PageHeader
        icon={FiZap}
        title={currentTask.title}
        subtitle={`Priority: ${currentTask.priority} · Status: ${currentTask.status}`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-6">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Mission Brief</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{currentTask.description || 'No description provided.'}</p>
          </div>

          {currentTask.labels?.length > 0 && (
            <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-6">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FiTag size={14} /> Labels
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentTask.labels.map((label, i) => (
                  <span key={i} className="text-xs px-3 py-1.5 rounded-lg font-bold bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20">
                    {typeof label === 'string' ? label : label.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-6">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FiMessageSquare size={14} /> Communications
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-[#151515]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center text-white text-xs font-bold shrink-0">AI</div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">AI Summary</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Summarize all comments with AI</p>
                </div>
              </div>
              <div className="text-center py-2">
                <button className="text-sm font-bold text-orange-600 hover:text-orange-500 transition-colors">
                  + Generate Acceptance Criteria with AI
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-5">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Details</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Status</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{currentTask.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Priority</span>
                <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${priorityColor[currentTask.priority] || ''}`}>{currentTask.priority}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Assignee</span>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center text-white text-[10px] font-bold">
                    {(currentTask.assignedTo?.name || 'U').charAt(0)}
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{currentTask.assignedTo?.name || 'Unassigned'}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Due Date</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{currentTask.dueDate ? new Date(currentTask.dueDate).toLocaleDateString() : '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Progress</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full" style={{ width: `${currentTask.progress || 0}%` }} />
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{currentTask.progress || 0}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-5">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Time Log</h3>
            <div className="space-y-3">
              {currentTask.estimateHours > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Estimate</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{currentTask.estimateHours}h</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Logged</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">{currentTask.loggedHours || 0}h</span>
              </div>
              {currentTask.remainingHours > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Remaining</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{currentTask.remainingHours}h</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-5">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FiPaperclip size={14} /> Attachments
            </h3>
            <p className="text-sm text-gray-400 text-center py-4 font-medium">No files attached.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetail
