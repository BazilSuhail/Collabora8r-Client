import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiFolder, FiPlus, FiShield, FiGrid } from 'react-icons/fi'
import PageHeader from '../../components/PageHeader'
import useProjectStore from '../../stores/projectStore'

const ProjectList = () => {
  const navigate = useNavigate()
  const { adminProjects, joinedProjects, managedProjects, fetchAdminProjects, fetchJoinedProjects, fetchManagedProjects } = useProjectStore()
  const [tab, setTab] = useState('admin')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    Promise.all([fetchAdminProjects(), fetchJoinedProjects(), fetchManagedProjects()]).finally(() => setLoading(false))
  }, [])

  const tabs = [
    { key: 'admin', label: 'Sector Command', count: adminProjects.length },
    { key: 'joined', label: 'Joined', count: joinedProjects.length },
    { key: 'managing', label: 'Directives', count: managedProjects.length },
  ]

  const projects = tab === 'admin' ? adminProjects : tab === 'joined' ? joinedProjects : managedProjects

  return (
    <div>
      <PageHeader
        icon={FiFolder}
        title="Project"
        highlight="Command"
        subtitle="Manage all active sectors"
        action={
          <button
            onClick={() => navigate('/projects/new')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold shadow-md hover:shadow-lg hover:from-orange-500 hover:to-orange-600 transition-all"
          >
            <FiPlus size={18} />
            New Sector
          </button>
        }
      />

      <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-[#151515] rounded-xl p-1 w-fit">
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
              tab === key
                ? 'bg-white dark:bg-[#0a0a0a] text-orange-600 dark:text-orange-400 shadow-sm border border-gray-200 dark:border-[#1a1a1a]'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            {label}
            <span className={`ml-2 px-1.5 py-0.5 rounded text-xs ${
              tab === key ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}>{count}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-6 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a]">
          <FiFolder size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No Active Sectors</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Establish your first project to begin operations.</p>
          <button onClick={() => navigate('/projects/new')} className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-orange-600 to-orange-700 text-white font-bold hover:from-orange-500 hover:to-orange-600 transition-all shadow-md">Create Project</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.button
              key={project._id}
              onClick={() => navigate(`/projects/${project._id}`)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="text-left bg-white dark:bg-[#0a0a0a] rounded-xl border border-gray-200 dark:border-[#1a1a1a] p-6 hover:shadow-xl hover:border-orange-500/30 hover:bg-orange-50/50 dark:hover:bg-orange-500/5 transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform" style={{ background: project.theme ? `linear-gradient(135deg, ${project.theme}, ${project.theme}dd)` : 'linear-gradient(135deg, #ea580c, #dc2626)' }}>
                  {project.name?.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors truncate">{project.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{project.taskCount || 0} missions · {project.teamCount || 0} personnel</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">{project.description}</p>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProjectList
