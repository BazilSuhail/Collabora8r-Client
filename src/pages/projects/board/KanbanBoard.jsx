import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiColumns, FiPlus } from 'react-icons/fi'
import PageHeader from '../../../components/PageHeader'
import api from '../../../utils/api'

const statuses = ['Not Started', 'In Progress', 'Paused', 'Completed']

const KanbanBoard = () => {
  const { projectId } = useParams()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data } = await api('GET', '/manageTasks/project/' + projectId)
      setTasks(data.tasks || data || [])
      setLoading(false)
    }
    load()
  }, [projectId])

  return (
    <div>
      <PageHeader
        icon={FiColumns}
        title="Kanban"
        highlight="Board"
        subtitle="Drag-and-drop mission control"
        action={
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold shadow-md hover:from-orange-500 hover:to-orange-600 transition-all">
            <FiPlus size={18} /> Add Task
          </button>
        }
      />

      {loading ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {statuses.map((s) => (
            <div key={s} className="flex-1 min-w-[280px] bg-gray-100 dark:bg-[#151515] rounded-xl p-4 animate-pulse">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />
              {[1, 2].map((i) => <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3" />)}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {statuses.map((status) => {
            const columnTasks = tasks.filter((t) => t.status === status)
            return (
              <div key={status} className="flex-1 min-w-[280px] bg-gray-100 dark:bg-[#151515] rounded-xl p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between px-1">
                  {status}
                  <span className="text-xs bg-white dark:bg-[#0a0a0a] text-gray-500 dark:text-gray-400 px-2.5 py-1 rounded-full font-bold shadow-sm">{columnTasks.length}</span>
                </h3>
                <div className="space-y-3">
                  {columnTasks.map((task, i) => (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-4 shadow-sm hover:shadow-md hover:border-orange-500/30 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{task.title}</p>
                        <span className={`text-xs px-2 py-0.5 rounded font-bold shrink-0 ${
                          task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>{task.priority}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        {task.assignedTo?.name && (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center text-white text-[10px] font-bold">
                              {task.assignedTo.name.charAt(0)}
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{task.assignedTo.name}</span>
                          </div>
                        )}
                        {task.dueDate && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(task.dueDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  {columnTasks.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-8 font-medium">No tasks</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default KanbanBoard
