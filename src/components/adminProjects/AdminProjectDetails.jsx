import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaUserPlus, FaSearch, FaClipboardList, FaUsers, FaEdit } from 'react-icons/fa';
import Loader from '../../Assets/Loaders/Loader';
import { CgUiKit } from 'react-icons/cg';
import { IoMdDoneAll } from 'react-icons/io';
import { MdErrorOutline, MdMarkEmailUnread, MdOutlineAdminPanelSettings } from 'react-icons/md';
import EditProject from '../../Assets/ProjectModals/EditProject';
import { IoCheckmarkDoneCircleSharp } from 'react-icons/io5';

import { motion } from 'framer-motion';

const AdminProjectDetails = () => {
  const { projectId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [project, setProject] = useState(null);
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch project details
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem('token');

        const projectResponse = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/admin-projects/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProject(projectResponse.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch project details.');
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handleSearch = async () => {
    setError('');
    setUser(null);
    setSuccess('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/admin-projects/get-searched-user`,
        { email, projectId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUser(response.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to find the user.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async () => {
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/admin-projects/send-project-invitation`,
        { userId: user.userId, projectId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(response.data.message);
    } catch (err) {
      console.error(err);
      setError('Failed to add user to project.');
    }
  };

  if (!project) {
    return <Loader />;
  }

  return (
    <main className="min-h-screen bg-[#fcfaf8] dark:bg-[#000000] p-6 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto grid xl:grid-cols-7 grid-cols-1 gap-6 pt-4">
        
        {showModal && <EditProject project={project} setShowModal={setShowModal} />}
        
        <section className='lg:col-span-5 flex flex-col gap-6'>
          {/* Project Header Card */}
          <div className='bg-white dark:bg-[#0a0a0a] p-6 flex lg:items-center justify-between lg:flex-row flex-col gap-4 border border-gray-100 dark:border-[#1a1a1a] rounded-2xl shadow-sm'>
            <div className="flex items-center gap-4">
              <div className='w-14 h-14 bg-orange-100 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center text-2xl text-orange-600'>
                <FaClipboardList />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white tracking-tight">{project.name}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Project ID: {projectId.slice(-8).toUpperCase()}</p>
              </div>
            </div>
            <button 
              onClick={() => setShowModal(true)} 
              className='flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-orange-600/20'
            >
              <FaEdit className="text-lg" />
              <span>Configure Project</span>
            </button>
          </div>

          {/* Description Card */}
          <div className='bg-white dark:bg-[#0a0a0a] p-6 border border-gray-100 dark:border-[#1a1a1a] rounded-2xl shadow-sm'>
            <div className='flex items-center gap-2 text-orange-600 mb-3'>
              <CgUiKit className='text-xl' />
              <span className='text-xs font-bold uppercase tracking-wider'>Task Guidelines & Mission</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed pl-7">{project.description}</p>
          </div>

          {/* User Recruitment Card */}
          <div className='bg-white dark:bg-[#0a0a0a] p-8 border border-gray-100 dark:border-[#1a1a1a] rounded-2xl shadow-sm flex-1 min-h-[400px]'>
            <div className="flex items-center gap-3 text-orange-600 mb-8">
              <MdMarkEmailUnread className="text-2xl" />
              <h2 className="text-lg font-bold">Recruit Contributors</h2>
            </div>

            <div className="relative group mb-8">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Contributor's identification email"
                className="w-full pl-12 pr-32 py-4 bg-gray-50 dark:bg-[#151515] text-gray-800 dark:text-white border-none rounded-2xl focus:ring-2 focus:ring-orange-500/50 transition-all outline-none"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-2 bottom-2 px-6 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-all"
              >
                Find
              </button>
            </div>

            {isLoading && <div className="py-10"><Loader /></div>}
            
            {error && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3 mb-6">
                <MdErrorOutline className='text-xl' />
                <span className="font-bold">{error}</span>
              </motion.div>
            )}
            
            {success && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-500/20 text-green-600 dark:text-green-400 rounded-xl flex items-center gap-3 mb-6">
                <IoCheckmarkDoneCircleSharp className='text-xl' />
                <span className="font-bold">{success}</span>
              </motion.div>
            )}

            {user ? (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col sm:flex-row justify-between items-center bg-gray-50 dark:bg-[#151515] p-6 rounded-2xl border border-gray-100 dark:border-[#1a1a1a] gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={`/Avatars/${user.avatar}.jpg`}
                      alt={user.name}
                      className="w-14 h-14 rounded-full border-2 border-orange-500"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-[#151515] rounded-full" />
                  </div>
                  <div>
                    <h4 className="text-gray-800 dark:text-white font-bold">{user.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleAddUser}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-[#0a0a0a] text-orange-600 border border-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-600 hover:text-white transition-all shadow-sm"
                >
                  <FaUserPlus />
                  <span>Send Invitation</span>
                </button>
              </motion.div>
            ) : (
              !isLoading && (
                <div className='flex flex-col items-center justify-center py-10 opacity-60'>
                  <img src="/Resources/7.png" alt='Search' className='w-48 grayscale dark:invert brightness-0 opacity-20' />
                  <p className="text-gray-500 dark:text-gray-400 font-bold mt-2">Ready to expand the collective</p>
                </div>
              )
            )}
          </div>
        </section>

        {/* Sidebar Sections */}
        <section className='lg:col-span-2 flex flex-col gap-6'>
          {/* Manager Section */}
          <div className="p-6 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 text-orange-600 mb-6 pb-2 border-b border-gray-50 dark:border-[#1a1a1a]">
              <MdOutlineAdminPanelSettings className="text-2xl" />
              <h3 className="font-bold">Project Lead</h3>
            </div>
            
            {project.projectManager.status === 'Pending' ? (
              <div className='flex flex-col gap-3'>
                <div className='flex items-center gap-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/10 text-yellow-700 dark:text-yellow-500 rounded-lg text-xs font-bold italic'>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  Transmission Pending...
                </div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 px-1 truncate">Sent to: {project.projectManager.email}</p>
              </div>
            ) : (
              <div className="flex items-center gap-3 group">
                <img
                  src={`/Avatars/2.jpg`}
                  alt={project.projectManager.name}
                  className="w-10 h-10 rounded-xl border border-gray-200 dark:border-[#1a1a1a] group-hover:border-orange-500 transition-colors"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{project.projectManager.name}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{project.projectManager.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Members List Section */}
          <div className="p-6 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 text-orange-600 mb-6 pb-2 border-b border-gray-50 dark:border-[#1a1a1a]">
              <FaUsers className="text-xl" />
              <h3 className="font-bold">Contributors</h3>
              <span className="ml-auto bg-gray-100 dark:bg-[#151515] text-gray-500 px-2 py-0.5 rounded text-[10px] font-bold">
                {project.team.length}
              </span>
            </div>
            
            {project.team.length > 0 ? (
              <div className="flex flex-col gap-4">
                {project.team.map((member, index) => (
                  <div key={index} className="flex items-center gap-3 hover:translate-x-1 transition-transform cursor-pointer">
                    <img
                      src={`/Avatars/${member.avatar}.jpg`}
                      alt={member.name}
                      className="w-9 h-9 rounded-lg border border-gray-100 dark:border-[#1a1a1a]"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{member.name}</p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-xs font-medium text-gray-400">Project currently solitary.</p>
              </div>
            )}
          </div>

          {/* Activity/Tasks Section */}
          <div className="p-6 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 text-orange-600 mb-6 pb-2 border-b border-gray-50 dark:border-[#1a1a1a]">
              <IoMdDoneAll className="text-xl" />
              <h3 className="font-bold">Operational Units</h3>
            </div>
            
            {project.tasks.length > 0 ? (
              <div className="flex flex-col gap-3">
                {project.tasks.map((task, index) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-[#151515] hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-xl border border-gray-100 dark:border-[#1a1a1a] transition-all group">
                    <p className="text-xs font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">{task.title}</p>
                    <div className='flex justify-between items-center gap-2'>
                      <span className={`text-[9px] font-bold uppercase tracking-tight px-2 py-0.5 rounded-md ${
                        task.priority === 'High' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 
                        task.priority === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                      }`}>
                        {task.priority}
                      </span>
                      <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                        <span className="text-red-600/60 mr-1">T-</span>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-xs font-medium text-gray-400">Zero active directives.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminProjectDetails;