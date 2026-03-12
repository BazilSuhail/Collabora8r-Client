import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaPeopleRoof, FaEye } from 'react-icons/fa6'
import { GrTask } from 'react-icons/gr'
import { RiTeamLine } from 'react-icons/ri'
import { MdOutlineManageAccounts } from 'react-icons/md'
import { motion } from 'framer-motion'
import useProjectStore from '../../stores/projectStore'
import api from '../../utils/api'

const TasksTimeline = ({ projectId }) => {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api('GET', '/projecttasks/' + projectId)
        setTasks(data.tasks || data || [])
      } catch { /* ignore */ }
    }
    fetchTasks()
  }, [projectId])

  if (tasks.length === 0) return <p className="text-sm text-gray-400 py-8 text-center">No directives found for this sector.</p>

  return (
    <div className="space-y-4">
      {tasks.slice(0, 10).map(({ task, user }) => (
        <div key={task._id} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-[#151515] rounded-xl border border-gray-100 dark:border-[#1a1a1a]">
          <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{task.title}</p>
            <p className="text-xs text-gray-500 truncate">Assigned to: {user?.name || 'Unknown'}</p>
          </div>
          <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase ${
            task.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            task.status === 'In Progress' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
            'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
          }`}>{task.status}</span>
        </div>
      ))}
    </div>
  )
}

const JoinedProjectList = () => {
  const navigate = useNavigate()
  const { joinedProjects, fetchJoinedProjects } = useProjectStore()
  const [selectedProjectId, setSelectedProjectId] = useState(null)

  useEffect(() => {
    fetchJoinedProjects()
  }, [])

  const handleProjectClick = (projectId) => {
    setSelectedProjectId(projectId)
  }

  const handleNavigate = (projectId) => {
    navigate(`/projects/${projectId}/joined`)
  }

  return (
    <div className='min-h-screen bg-[#fcfaf8] dark:bg-[#000000] flex flex-col p-6 transition-colors duration-300'>
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className='w-12 h-12 bg-orange-100 dark:bg-orange-500/10 rounded-xl flex items-center justify-center text-xl text-orange-600'>
              <FaPeopleRoof />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white tracking-tight">Joined Projects</h2>
              <p className='text-sm text-gray-500 dark:text-gray-400 font-medium'>Collaborative sectors you are currently assigned to</p>
            </div>
          </div>
        </div>

        <div className='h-[1px] bg-gray-200 dark:bg-[#1a1a1a] w-full mb-8'></div>

        {joinedProjects.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 bg-white dark:bg-[#0a0a0a] rounded-3xl border border-dashed border-gray-200 dark:border-[#1a1a1a] shadow-sm'>
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-orange-500/10 blur-3xl rounded-full" />
              <img src="/Resources/5.png" alt='No projects' className='w-64 grayscale opacity-40 dark:invert brightness-0' />
            </div>
            <p className="text-lg font-bold text-gray-800 dark:text-white mb-2">Sector Void Detected</p>
            <p className="text-gray-500 dark:text-gray-400">You haven't been assigned to any collaborative projects yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {joinedProjects.map((project) => (
              <motion.div key={project._id} whileHover={{ y: -5 }} className="group bg-white dark:bg-[#121212] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-[320px]">
                <div className="relative h-32 overflow-hidden">
                  <img src={`/themes/${project.theme || 1}.jpg`} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-10 left-6 right-6 flex items-end justify-between">
                    <div className="min-w-0" onClick={() => handleNavigate(project._id)}>
                      <h3 className="font-bold text-white text-lg leading-tight truncate cursor-pointer hover:text-orange-400 transition-colors">{project.name}</h3>
                      <p className="text-xs text-gray-300 font-medium truncate">Directed by {project.createdBy?.name || 'Unknown'}</p>
                    </div>
                    <button onClick={() => handleProjectClick(project._id)} className='p-2 bg-white/10 hover:bg-orange-600 backdrop-blur-md rounded-lg text-white transition-all transform hover:scale-110' title="View Timeline">
                      <FaEye className='text-lg' />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-6 flex-1 flex flex-col relative">
                  <div className="absolute -top-10 right-6 z-10">
                    <img src={`/avatars/${project.createdBy?.avatar || 1}.jpg`} alt="" className="w-16 h-16 rounded-full border-4 border-white dark:border-[#0a0a0a] shadow-lg" />
                  </div>
                  <div className="space-y-3 mt-2">
                    <div className='flex items-center gap-3'>
                      <RiTeamLine className='text-orange-500' />
                      <span className='text-xs font-bold text-gray-400 dark:text-gray-500 tracking-widest'>Collaborators</span>
                      <span className='ml-auto font-bold text-gray-800 dark:text-gray-200'>{project.teamCount || 0}</span>
                    </div>
                    <div className='flex items-center gap-3'>
                      <GrTask className='text-orange-500' />
                      <span className='text-xs font-bold text-gray-400 dark:text-gray-500 tracking-widest'>Directives</span>
                      <span className='ml-auto font-bold text-gray-800 dark:text-gray-200'>{project.taskCount || 0}</span>
                    </div>
                    <div className='pt-3 border-t border-gray-50 dark:border-[#1a1a1a]'>
                      <div className='flex items-center gap-2'>
                        <MdOutlineManageAccounts className='text-orange-500' />
                        <span className='text-xs font-bold text-gray-400 dark:text-gray-500 tracking-widest'>Project Lead:</span>
                      </div>
                      <p className='mt-1 text-[11px] font-bold text-gray-700 dark:text-gray-300 truncate'>
                        {project.projectManager?.status === 'Pending' ? (
                          <span className='text-amber-600/60 italic'>Pending Synchronization...</span>
                        ) : (
                          <span className="underline decoration-orange-500/30 underline-offset-4">{project.projectManager?.email || 'N/A'}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className='w-full mt-12'>
          {selectedProjectId && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='bg-white dark:bg-[#0a0a0a] rounded-3xl border border-gray-100 dark:border-[#1a1a1a] p-8 shadow-sm'>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-orange-600 rounded-full" />
                <h3 className="text-xl font-bold dark:text-white">Directive Timeline</h3>
              </div>
              <TasksTimeline projectId={selectedProjectId} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default JoinedProjectList
