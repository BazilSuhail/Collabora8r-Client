import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateProject from '../../components/project-modals/CreateProject';
import { FiClipboard, FiFolder, FiSettings } from 'react-icons/fi';
import { AiOutlinePlus } from 'react-icons/ai';
import { GrTask } from 'react-icons/gr';
import { RiTeamLine } from 'react-icons/ri';
import { PiGraphDuotone } from 'react-icons/pi';
import { MdOutlineManageAccounts } from 'react-icons/md';
import EditProject from '../../components/project-modals/EditProject';

const colors = [
  'bg-red-400', 'bg-blue-400', 'bg-green-700', 'bg-yellow-600', 'bg-indigo-400', 'bg-orange-400', 'bg-cyan-400', 'bg-violet-400'
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const AdminProjectList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [projectDetails, setProjectDetails] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editModal, showEditModal] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/admin-projects/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const updatedProjects = response.data.map((project) => ({
          ...project,
          color: getRandomColor(),
        }));
        setProjects(updatedProjects);
      } catch (err) {
        setError('Failed to fetch projects.');
      }
    };

    fetchProjects();
  }, []);

  const handleTaskManagement = (projectId) => {
    navigate(`/manager-tasks/${projectId}`);
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleManagerAssignmentClick = (project) => {
    showEditModal(true)
    setProjectDetails(project)
  };


  return (
    <div className='min-h-screen bg-[#fcfaf8] dark:bg-[#000000] flex flex-col p-6 transition-colors duration-300'>

      {showModal && <CreateProject setShowModal={setShowModal} />}
      {editModal && <EditProject project={projectDetails} heading={'Assign a Manager'} setShowModal={showEditModal} />}

      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center">
        <div className="flex items-center space-x-2">
          <FiFolder className="text-2xl text-gray-600 dark:text-gray-400" />
          <h2 className="text-2xl md:text-3xl text-gray-800 dark:text-white font-bold tracking-tight">Created Projects</h2>
        </div>
      </div>
      <p className='mt-1 text-sm text-gray-500 dark:text-gray-400 lg:ml-8 mb-6' >Manage and administrate your established project ecosytems.</p>
      <div className='h-[1px] bg-gray-200 dark:bg-[#1a1a1a] w-full mb-8'></div>

      {error &&
        <div className='p-4 bg-red-100 dark:bg-red-900/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 rounded-xl mb-6'>
          {error} No projects found.
        </div>
      }

      {projects.length <= 0 ? (
        <div className='flex flex-col items-center justify-center py-20'>
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-orange-500/10 blur-3xl rounded-full" />
            <img src="/Resources/3.png" alt='No projects' className='relative w-64 md:w-80 opacity-80 dark:opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700' />
          </div>
          <p className="text-lg font-bold text-gray-800 dark:text-white mb-4">You haven't created any Project</p>
          <button onClick={() => setShowModal(true)} className="px-8 py-3 bg-orange-600 text-white rounded-2xl font-bold dark:shadow-none shadow-lg shadow-orange-600/20 hover:bg-orange-700 transition-all">
            Create One Now
          </button>
        </div>
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div onClick={() => setShowModal(true)} className='cursor-pointer group relative overflow-hidden h-[320px] border-2 border-dashed border-gray-200 dark:border-[#1a1a1a] flex flex-col justify-center items-center bg-white/50 dark:bg-[#0a0a0a]/50 hover:bg-white dark:hover:bg-[#0a0a0a] rounded-2xl transition-all duration-300'>
            <div className="p-5 bg-orange-50 dark:bg-orange-500/10 rounded-full group-hover:scale-110 transition-transform duration-500">
               <AiOutlinePlus className="text-4xl text-orange-600" />
            </div>
            <span className='text-sm font-bold mt-4 text-gray-500 dark:text-gray-400 group-hover:text-orange-600 transition-colors'>Establish New Frontier</span>
          </div>

          {projects.map((project) => (
            <div key={project._id} className="group h-88 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
              
              <div className='p-4 bg-gray-50 dark:bg-[#151515] border-b border-gray-100 dark:border-[#1a1a1a] flex items-center justify-between'>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg ${project.color}`}>
                    {project.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className='font-bold text-gray-800 dark:text-white text-sm md:text-base leading-tight'>
                      {project.name.length > 20 ? project.name.slice(0, 20) + "..." : project.name}
                    </h3>
                  </div>
                </div>
                <span className='px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'>
                  Active
                </span>
              </div>

              <div className='p-5 flex-1 space-y-3'>
                <div className='flex items-center gap-3 text-sm'>
                  <RiTeamLine className='text-orange-500 text-lg' />
                  <span className='text-gray-500 dark:text-gray-400 font-medium'>Contributors:</span>
                  <span className='font-bold text-gray-800 dark:text-white'>{project.team.length}</span>
                </div>

                <div className='flex items-center gap-3 text-sm'>
                  <GrTask className='text-orange-500 text-lg' />
                  <span className='text-gray-500 dark:text-gray-400 font-medium'>Work Units:</span>
                  <span className='font-bold text-gray-800 dark:text-white'>{project.tasks.length}</span>
                </div>

                {project.projectManager.status === 'Pending' &&
                  <div className='flex items-center gap-3 text-sm'>
                    <MdOutlineManageAccounts className='text-orange-500 text-lg' />
                    <span className='text-gray-500 dark:text-gray-400 font-medium'>Manager:</span>
                    <span className='text-yellow-600 dark:text-yellow-500 font-bold truncate underline underline-offset-4 decoration-yellow-600/40'>
                      {project.projectManager.email.split('@')[0]}
                    </span>
                  </div>
                }

                <div className='pt-3 border-t border-gray-50 dark:border-[#1a1a1a] space-y-2'>
                  <button onClick={() => handleProjectClick(project._id)} className='w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400 transition-all text-xs font-bold'>
                    <FiSettings />
                    Environment Architect
                  </button>
                  <button onClick={() => handleTaskManagement(project._id)} className='w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600 dark:hover:text-orange-400 transition-all text-xs font-bold'>
                    <FiClipboard />
                    Workflow Orchestrator
                  </button>
                </div>
              </div>

              <div className="px-5 pb-5">
                {project.projectManager.status === 'Pending' ?
                  <button onClick={() => handleManagerAssignmentClick(project)}
                    className='w-full cursor-pointer flex items-center justify-center gap-3 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white transition-all shadow-lg shadow-orange-600/20'>
                    <PiGraphDuotone className='text-xl animate-spin-slow' />
                    <span className='text-xs font-bold'>Appoint Manager</span>
                  </button> :
                  <div className='flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-[#151515] border border-gray-100 dark:border-[#1a1a1a]'>
                    <PiGraphDuotone className='text-orange-500 text-xl' />
                    <div className='min-w-0'>
                      <p className='text-[10px] uppercase tracking-wider font-bold text-gray-400'>Project Lead</p>
                      <p className='text-xs font-bold text-gray-700 dark:text-gray-300 truncate'>{project.projectManager.email}</p>
                    </div>
                  </div>
                }
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminProjectList;
