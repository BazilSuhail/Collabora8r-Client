import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaUserPlus, FaSearch, FaClipboardList, FaUsers, FaEdit } from 'react-icons/fa';
import Loader from '../../components/loaders/Loader';
import { CgUiKit } from 'react-icons/cg';
import { IoMdDoneAll } from 'react-icons/io';
import { MdErrorOutline, MdMarkEmailUnread, MdOutlineAdminPanelSettings } from 'react-icons/md';
import EditProject from '../../components/project-modals/EditProject';
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
    <main className="min-h-screen bg-[#fcfaf8] dark:bg-[#000000] p-4 md:p-5 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-8 pt-4">
        
        {showModal && <EditProject project={project} setShowModal={setShowModal} />}
        
        <section className='lg:col-span-8 space-y-8'>
          {/* Project Header Card */}
          <div className='bg-white dark:bg-[#0a0a0a] p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 border border-gray-100 dark:border-[#1a1a1a] rounded-2xl md:rounded-3xl shadow-sm'>
            <div className="flex items-center gap-3 md:gap-4">
              <div className='w-11 h-11 md:w-12 md:h-12 bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg md:rounded-xl flex items-center justify-center text-lg md:text-xl text-white shadow-md'>
                <FaClipboardList />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-white tracking-tight uppercase">
                  {project.name}
                </h1>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-semibold mt-1">Project Details</p>
              </div>
            </div>
            <button 
              onClick={() => setShowModal(true)} 
              className='px-5 md:px-8 py-3 md:py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg md:rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 whitespace-nowrap'
            >
              Edit
            </button>
          </div>

          {/* Description Card */}
          <div className='bg-white dark:bg-[#0a0a0a] p-4 md:p-6 border border-gray-100 dark:border-[#1a1a1a] rounded-2xl md:rounded-3xl shadow-sm'>
            <div className='flex items-center gap-3 text-orange-600 mb-4 md:mb-6'>
              <CgUiKit className='text-lg md:text-xl' />
              <h3 className='text-sm md:text-base font-bold uppercase tracking-wide'>About</h3>
            </div>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* User Recruitment Card */}
          <div className='bg-white dark:bg-[#0a0a0a] p-4 md:p-6 border border-gray-100 dark:border-[#1a1a1a] rounded-2xl md:rounded-3xl shadow-sm min-h-[400px] flex flex-col'>
            <div className="flex items-center gap-3 md:gap-4 text-orange-600 mb-6 md:mb-8">
              <div className="w-10 h-10 md:w-11 md:h-11 bg-orange-100 dark:bg-orange-500/10 rounded-lg md:rounded-xl flex items-center justify-center">
                <MdMarkEmailUnread className="text-lg md:text-xl" />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-bold uppercase tracking-wide">Add Members</h2>
                <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">Search and invite team members</p>
              </div>
            </div>

            <div className="relative group mb-6 md:mb-8">
              <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                <FaSearch className="text-xs md:text-sm text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full pl-10 md:pl-12 pr-32 md:pr-40 py-3 md:py-4 bg-gray-50 dark:bg-[#151515] text-gray-800 dark:text-white text-sm md:text-base border border-gray-200 dark:border-[#1a1a1a] focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 rounded-lg md:rounded-xl outline-none transition-all font-medium"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 md:right-3 top-2 md:top-3 bottom-2 md:bottom-3 px-4 md:px-6 bg-orange-600 hover:bg-orange-700 text-white rounded-md md:rounded-lg text-xs md:text-sm font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95"
              >
                Search
              </button>
            </div>

            {isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Searching...</p>
              </div>
            )}
            
            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 md:p-5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-lg md:rounded-xl flex items-start gap-3 mb-6 md:mb-8">
                <MdErrorOutline className='text-lg md:text-xl flex-shrink-0 mt-0.5' />
                <span className="text-xs md:text-sm font-semibold">{error}</span>
              </motion.div>
            )}
            
            {success && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-4 md:p-5 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 text-green-600 dark:text-green-400 rounded-lg md:rounded-xl flex items-start gap-3 mb-6 md:mb-8">
                <IoCheckmarkDoneCircleSharp className='text-lg md:text-xl flex-shrink-0 mt-0.5' />
                <span className="text-xs md:text-sm font-semibold">{success}</span>
              </motion.div>
            )}

            {user ? (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col md:flex-row md:justify-between md:items-center bg-gray-50 dark:bg-[#151515] p-4 md:p-6 rounded-lg md:rounded-xl border border-gray-100 dark:border-[#1a1a1a] gap-4 md:gap-6 group/user">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="relative">
                    <img
                      src={`/avatars/${user.avatar}.jpg`}
                      alt={user.name}
                      className="w-14 h-14 md:w-16 md:h-16 rounded-full md:rounded-xl border-2 border-white dark:border-[#0a0a0a] shadow-md grayscale group-hover/user:grayscale-0 transition-all"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-[#151515] rounded-full animate-pulse" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm md:text-base font-bold text-gray-800 dark:text-white uppercase tracking-tight truncate">{user.name}</h4>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleAddUser}
                  className="w-full md:w-auto flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg md:rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all shadow-sm active:scale-95 whitespace-nowrap"
                >
                  <FaUserPlus />
                  <span>Add</span>
                </button>
              </motion.div>
            ) : (
              !isLoading && (
                <div className='flex-1 flex flex-col items-center justify-center opacity-50'>
                  <img src="/resources/7.png" alt='Search' className='w-40 md:w-56 mb-4 md:mb-6' />
                  <p className="text-xs md:text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Enter an email to search</p>
                </div>
              )
            )}
          </div>
        </section>

        {/* Sidebar Sections */}
        <section className='lg:col-span-4 space-y-8'>
          {/* Manager Section */}
          <div className="p-4 md:p-6 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl md:rounded-3xl shadow-sm">
            <div className="flex items-center gap-3 text-orange-600 mb-4 md:mb-6 border-b border-gray-100 dark:border-[#1a1a1a] pb-4 md:pb-6">
              <MdOutlineAdminPanelSettings className="text-lg md:text-xl" />
              <h3 className="text-sm md:text-base font-bold uppercase tracking-wide">Manager</h3>
            </div>
            
            {project.projectManager.status === 'Pending' ? (
              <div className='flex flex-col gap-3'>
                <div className='flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-medium border border-amber-200 dark:border-amber-500/20'>
                  <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping" />
                  Invitation Pending
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">{project.projectManager.email}</p>
              </div>
            ) : (
              <div className="flex items-center gap-3 md:gap-4 group/mgr">
                <img
                  src={`/avatars/2.jpg`}
                  alt={project.projectManager.name}
                  className="w-12 h-12 md:w-14 md:h-14 rounded-lg md:rounded-xl border-2 border-white dark:border-[#0a0a0a] shadow-sm grayscale group-hover/mgr:grayscale-0 transition-all duration-500"
                />
                <div className="min-w-0">
                  <p className="text-sm md:text-base font-bold text-gray-800 dark:text-white uppercase tracking-tight truncate">{project.projectManager.name}</p>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate">{project.projectManager.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Members List Section */}
          <div className="p-4 md:p-6 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl md:rounded-3xl shadow-sm">
            <div className="flex items-center gap-3 text-orange-600 mb-4 md:mb-6 border-b border-gray-100 dark:border-[#1a1a1a] pb-4 md:pb-6">
              <FaUsers className="text-lg md:text-xl" />
              <h3 className="text-sm md:text-base font-bold uppercase tracking-wide">Team</h3>
              <span className="ml-auto bg-gray-100 dark:bg-[#151515] text-gray-600 dark:text-gray-400 px-2.5 md:px-3 py-1 rounded-lg text-xs font-bold">
                {project.team.length}
              </span>
            </div>
            
            {project.team.length > 0 ? (
              <div className="flex flex-col gap-3">
                {project.team.map((member, index) => (
                  <div key={index} className="flex items-center gap-3 md:gap-4 hover:bg-gray-50 dark:hover:bg-[#151515] transition-colors p-2 md:p-3 rounded-lg group/member">
                    <img
                      src={`/avatars/${member.avatar}.jpg`}
                      alt={member.name}
                      className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-gray-200 dark:border-[#1a1a1a] shadow-sm grayscale group-hover/member:grayscale-0 transition-all flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs md:text-sm font-bold text-gray-800 dark:text-white uppercase tracking-tight truncate">{member.name}</p>
                      <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400 truncate">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 md:py-12 text-center opacity-50">
                <p className="text-xs md:text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">No team members yet</p>
              </div>
            )}
          </div>

          {/* Activity/Tasks Section */}
          <div className="p-4 md:p-6 bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] rounded-2xl md:rounded-3xl shadow-sm">
            <div className="flex items-center gap-3 text-orange-600 mb-4 md:mb-6 border-b border-gray-100 dark:border-[#1a1a1a] pb-4 md:pb-6">
              <IoMdDoneAll className="text-lg md:text-xl" />
              <h3 className="text-sm md:text-base font-bold uppercase tracking-wide">Tasks</h3>
            </div>
            
            {project.tasks.length > 0 ? (
              <div className="flex flex-col gap-3">
                {project.tasks.map((task, index) => (
                  <div key={index} className="p-3 md:p-4 bg-gray-50 dark:bg-[#151515] hover:bg-white dark:hover:bg-[#0a0a0a] rounded-lg md:rounded-xl border border-gray-100 dark:border-[#1a1a1a] transition-colors group/task shadow-sm">
                    <p className="text-xs md:text-md font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2 group-hover/task:text-orange-600 transition-colors">{task.title}</p>
                    <div className='flex justify-between items-center gap-2'>
                      <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${
                        task.priority === 'High' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 
                        task.priority === 'Medium' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                      }`}>
                        {task.priority}
                      </span>
                      <p className="text-[9px] md:text-xs font-medium text-gray-500 dark:text-gray-400">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 md:py-12 text-center opacity-50">
                <p className="text-xs md:text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">No tasks yet</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminProjectDetails;