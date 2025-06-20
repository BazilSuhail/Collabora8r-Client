import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPeopleRoof } from 'react-icons/fa6';
import { FaEye } from 'react-icons/fa';
import TasksTimeline from '../TasksTimeline';
import { GrTask } from 'react-icons/gr';
import { RiTeamLine } from 'react-icons/ri';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const JoinedProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    const fetchJoinedProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/joinedprojects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProjects(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch projects.');
      }
    };

    fetchJoinedProjects();
  }, []);

  const handleProjectClick = (projectId) => {
    setSelectedProjectId(projectId);
  };

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

        {projects.length === 0 ? (
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
            {projects.map((project) => (
              <motion.div 
                key={project._id}
                whileHover={{ y: -5 }}
                className="group bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-[320px]"
              >
                <div className="relative h-32 overflow-hidden">
                  <img 
                    src={`/Themes/${project.theme || 1}.jpg`} 
                    alt="" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                    <Link to={`/joinedprojects/${project._id}`} className="min-w-0">
                      <h3 className="font-bold text-white text-lg leading-tight truncate">
                        {project.name}
                      </h3>
                      <p className="text-xs text-gray-300 font-medium truncate">
                        Directed by {project.createdBy.name}
                      </p>
                    </Link>
                    <button 
                      onClick={() => handleProjectClick(project._id)} 
                      className='p-2 bg-white/10 hover:bg-orange-600 backdrop-blur-md rounded-lg text-white transition-all transform hover:scale-110'
                      title="View Timeline"
                    >
                      <FaEye className='text-lg' />
                    </button>
                  </div>
                </div>

                <div className="px-6 py-6 flex-1 flex flex-col relative">
                  <div className="absolute -top-10 right-6 z-10">
                    <img 
                      src={`/Avatars/${project.createdBy.avatar || 1}.jpg`} 
                      alt="" 
                      className="w-16 h-16 rounded-2xl border-4 border-white dark:border-[#0a0a0a] shadow-lg" 
                    />
                  </div>

                  <div className="space-y-3 mt-2">
                    <div className='flex items-center gap-3'>
                      <RiTeamLine className='text-orange-500' />
                      <span className='text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest'>Collaborators</span>
                      <span className='ml-auto font-bold text-gray-800 dark:text-gray-200'>{project.teamCount}</span>
                    </div>

                    <div className='flex items-center gap-3'>
                      <GrTask className='text-orange-500' />
                      <span className='text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest'>Directives</span>
                      <span className='ml-auto font-bold text-gray-800 dark:text-gray-200'>{project.taskCount}</span>
                    </div>

                    <div className='pt-3 border-t border-gray-50 dark:border-[#1a1a1a]'>
                      <div className='flex items-center gap-2'>
                        <MdOutlineManageAccounts className='text-orange-500' />
                        <span className='text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest'>Project Lead:</span>
                      </div>
                      <p className='mt-1 text-[11px] font-bold text-gray-700 dark:text-gray-300 truncate'>
                        {project.projectManager.status === 'Pending' ? (
                          <span className='text-amber-600/60 italic'>Pending Synchronization...</span>
                        ) : (
                          <span className="underline decoration-orange-500/30 underline-offset-4">{project.projectManager.email}</span>
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
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='bg-white dark:bg-[#0a0a0a] rounded-3xl border border-gray-100 dark:border-[#1a1a1a] p-8 shadow-sm'
            >
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
};

export default JoinedProjectList;