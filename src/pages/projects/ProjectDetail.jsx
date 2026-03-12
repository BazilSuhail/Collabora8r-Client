import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiColumns, FiCalendar, FiUsers, FiSettings, FiClock, FiActivity, FiTag, FiPlus } from 'react-icons/fi'
import PageHeader from '../../components/PageHeader'
import useProjectStore from '../../stores/projectStore'
import api from '../../utils/api'

const subLinks = (projectId) => [
  { to: `/projects/${projectId}/board`, label: 'Board', icon: FiColumns, desc: 'Kanban view' },
  { to: `/projects/${projectId}/backlog`, label: 'Backlog', icon: FiCalendar, desc: 'Sprint planning' },
  { to: `/projects/${projectId}/team`, label: 'Team', icon: FiUsers, desc: 'Personnel' },
  { to: `/projects/${projectId}/sprints`, label: 'Sprints', icon: FiCalendar, desc: 'Iterations' },
  { to: `/projects/${projectId}/time`, label: 'Time', icon: FiClock, desc: 'Tracking' },
  { to: `/projects/${projectId}/activity`, label: 'Activity', icon: FiActivity, desc: 'Log' },
  { to: `/projects/${projectId}/labels`, label: 'Labels', icon: FiTag, desc: 'Tags' },
  { to: `/projects/${projectId}/settings`, label: 'Settings', icon: FiSettings, desc: 'Config' },
]

const ProjectDetail = () => {
  const { projectId } = useParams()
  const { currentProject, fetchProjectDetail } = useProjectStore()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchProjectDetail(projectId),
      api('GET', '/manageTasks/project/' + projectId).then(res => setTasks(res.data.tasks || res.data || []))
    ]).finally(() => setLoading(false))
  }, [projectId])

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (!currentProject) return <p className="text-gray-500 dark:text-gray-400">Sector not found.</p>

  const grouped = {
    'Not Started': tasks.filter((t) => t.status === 'Not Started'),
    'In Progress': tasks.filter((t) => t.status === 'In Progress'),
    'Completed': tasks.filter((t) => t.status === 'Completed'),
  }

  return (
    <div>
      <PageHeader
        icon={FiColumns}
        title={currentProject.name}
        subtitle={currentProject.description || 'No mission brief'}
        action={
          <Link to={`/projects/${projectId}/backlog`} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold shadow-md hover:from-orange-500 hover:to-orange-600 transition-all">
            <FiPlus size={18} /> New Task
          </Link>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {subLinks(projectId).map(({ to, label, icon: Icon, desc }) => (
          <Link key={to} to={to}
            className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-[#1a1a1a] hover:border-orange-500/30 hover:shadow-lg transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-[#151515] flex items-center justify-center text-gray-500 dark:text-gray-400 group-hover:bg-orange-100 dark:group-hover:bg-orange-500/10 group-hover:text-orange-600 transition-all shrink-0">
              <Icon size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(grouped).map(([status, items]) => (
          <div key={status} className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-5">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
              {status}
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#151515] px-2.5 py-1 rounded-full font-bold">{items.length}</span>
            </h3>
            <div className="space-y-2">
              {items.slice(0, 5).map((task) => (
                <Link
                  key={task._id}
                  to={`/tasks/${task._id}`}
                  className="block p-3 rounded-xl bg-gray-50 dark:bg-[#151515] hover:bg-orange-50 dark:hover:bg-orange-500/5 border border-transparent hover:border-orange-500/20 transition-all"
                >
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{task.title}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                      task.priority === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    }`}>{task.priority}</span>
                    {task.dueDate && <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(task.dueDate).toLocaleDateString()}</span>}
                  </div>
                </Link>
              ))}
              {items.length > 5 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2 font-bold">+{items.length - 5} more</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProjectDetail
