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
    <main className="min-h-screen bg-[#fcfaf8] dark:bg-[#000000] p-6 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-8 pt-4">
        
        {showModal && <EditProject project={project} setShowModal={setShowModal} />}
        
        <section className='lg:col-span-8 space-y-8'>
          {/* Project Header Card */}
          <div className='bg-white/60 dark:bg-black/60 backdrop-blur-sm p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 border border-gray-100 dark:border-[#1a1a1a] rounded-[2.5rem] shadow-xl relative overflow-hidden group'>
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-orange-600/10 transition-colors" />
            <div className="flex items-center gap-6 relative">
              <div className='w-16 h-16 bg-orange-600 rounded-[2rem] flex items-center justify-center text-3xl text-white shadow-lg shadow-orange-600/20'>
                <FaClipboardList />
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-black text-gray-800 dark:text-white tracking-tighter uppercase leading-tight group-hover:text-orange-600 transition-colors">
                  {project.name}
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-1.5 h-1.5 bg-orange-600 rounded-full animate-pulse" />
                  <p className="text-[10px] md:text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[4px]">Sector ID: {projectId.slice(-8).toUpperCase()}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowModal(true)} 
              className='flex items-center gap-3 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-[3px] transition-all shadow-xl shadow-orange-600/20 active:scale-95 group'
            >
              <FaEdit className="text-xl group-hover:rotate-12 transition-transform" />
              <span>Configure Sector</span>
            </button>
          </div>

          {/* Description Card */}
          <div className='bg-white/60 dark:bg-black/60 backdrop-blur-sm p-8 border border-gray-100 dark:border-[#1a1a1a] rounded-[2.5rem] shadow-xl'>
            <div className='flex items-center gap-3 text-orange-600 mb-6'>
              <CgUiKit className='text-2xl' />
              <h3 className='text-sm font-black uppercase tracking-[3px]'>Sector Objectives & Guidelines</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed pl-8 border-l-2 border-orange-500/10 italic font-medium">
              {project.description}
            </p>
          </div>

          {/* User Recruitment Card */}
          <div className='bg-white/60 dark:bg-black/60 backdrop-blur-sm p-10 border border-gray-100 dark:border-[#1a1a1a] rounded-[2.5rem] shadow-xl min-h-[500px] flex flex-col'>
            <div className="flex items-center gap-4 text-orange-600 mb-10">
              <div className="p-3 bg-orange-600/10 rounded-2xl">
                <MdMarkEmailUnread className="text-3xl" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-[2px] leading-none">Recruit Contributors</h2>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">Expanding the collective knowledge base</p>
              </div>
            </div>

            <div className="relative group mb-10">
              <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Identify unit by email signature..."
                className="w-full pl-16 pr-44 py-6 bg-gray-50 dark:bg-[#151515] text-gray-800 dark:text-white border-2 border-transparent focus:border-orange-500/20 rounded-3xl outline-none transition-all font-bold text-lg"
              />
              <button
                onClick={handleSearch}
                className="absolute right-3 top-3 bottom-3 px-10 bg-orange-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[4px] hover:bg-orange-700 transition-all shadow-lg active:scale-95"
              >
                Scan
              </button>
            </div>

            {isLoading && (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[4px]">Awaiting Signal Verification...</p>
              </div>
            )}
            
            {error && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-red-600/5 border border-red-600/10 text-red-600 rounded-3xl flex items-center gap-4 mb-8">
                <MdErrorOutline className='text-3xl' />
                <span className="text-sm font-black uppercase tracking-widest">{error}</span>
              </motion.div>
            )}
            
            {success && (
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="p-6 bg-green-600/5 border border-green-600/10 text-green-600 rounded-3xl flex items-center gap-4 mb-8">
                <IoCheckmarkDoneCircleSharp className='text-3xl' />
                <span className="text-sm font-black uppercase tracking-widest">{success}</span>
              </motion.div>
            )}

            {user ? (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col sm:flex-row justify-between items-center bg-gray-50/50 dark:bg-[#151515] p-8 rounded-[2.5rem] border border-orange-500/10 gap-8 group/user">
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <img
                      src={`/Avatars/${user.avatar}.jpg`}
                      alt={user.name}
                      className="w-20 h-20 rounded-[2rem] border-4 border-white dark:border-[#0a0a0a] shadow-xl grayscale group-hover/user:grayscale-0 transition-all"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white dark:border-[#151515] rounded-full animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-gray-800 dark:text-white uppercase tracking-tight">{user.name}</h4>
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleAddUser}
                  className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white dark:bg-[#0a0a0a] text-orange-600 border-2 border-orange-600 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[4px] hover:bg-orange-600 hover:text-white transition-all shadow-md active:scale-95"
                >
                  <FaUserPlus className="text-lg" />
                  <span>Transmit Invitation</span>
                </button>
              </motion.div>
            ) : (
              !isLoading && (
                <div className='flex-1 flex flex-col items-center justify-center opacity-40 grayscale'>
                  <img src="/Resources/7.png" alt='Search' className='w-56 mb-6' />
                  <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[6px]">Awaiting Signal Input</p>
                </div>
              )
            )}
          </div>
        </section>

        {/* Sidebar Sections */}
        <section className='lg:col-span-4 space-y-8'>
          {/* Manager Section */}
          <div className="p-8 bg-white/60 dark:bg-black/60 backdrop-blur-sm border border-gray-100 dark:border-[#1a1a1a] rounded-[2.5rem] shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-3 text-orange-600 mb-8 border-b border-gray-50 dark:border-[#1a1a1a] pb-6">
              <MdOutlineAdminPanelSettings className="text-3xl" />
              <h3 className="text-sm font-black uppercase tracking-[3px]">Sector Authority</h3>
            </div>
            
            {project.projectManager.status === 'Pending' ? (
              <div className='flex flex-col gap-4'>
                <div className='flex items-center gap-3 px-4 py-3 bg-amber-600/5 text-amber-600 rounded-2xl text-[10px] font-black uppercase tracking-widest italic border border-amber-600/10'>
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                  Signal Synchronization Pending...
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 px-2 font-bold uppercase tracking-tight truncate">Target: {project.projectManager.email}</p>
              </div>
            ) : (
              <div className="flex items-center gap-5 group/mgr p-2">
                <img
                  src={`/Avatars/2.jpg`}
                  alt={project.projectManager.name}
                  className="w-14 h-14 rounded-2xl border-2 border-white dark:border-[#1a1a1a] shadow-lg grayscale group-hover/mgr:grayscale-0 transition-all duration-500"
                />
                <div className="min-w-0">
                  <p className="text-lg font-black text-gray-800 dark:text-white uppercase tracking-tight truncate leading-none mb-1">{project.projectManager.name}</p>
                  <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest truncate">{project.projectManager.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Members List Section */}
          <div className="p-8 bg-white/60 dark:bg-black/60 backdrop-blur-sm border border-gray-100 dark:border-[#1a1a1a] rounded-[2.5rem] shadow-xl">
            <div className="flex items-center gap-3 text-orange-600 mb-8 border-b border-gray-50 dark:border-[#1a1a1a] pb-6">
              <FaUsers className="text-3xl" />
              <h3 className="text-sm font-black uppercase tracking-[3px]">Active Collective</h3>
              <span className="ml-auto bg-gray-100 dark:bg-[#151515] text-gray-500 px-3 py-1 rounded-xl text-[10px] font-black">
                {project.team.length}
              </span>
            </div>
            
            {project.team.length > 0 ? (
              <div className="flex flex-col gap-6">
                {project.team.map((member, index) => (
                  <div key={index} className="flex items-center gap-4 hover:translate-x-2 transition-all p-1 group/member">
                    <img
                      src={`/Avatars/${member.avatar}.jpg`}
                      alt={member.name}
                      className="w-10 h-10 rounded-xl border-2 border-white dark:border-[#1a1a1a] shadow-md grayscale group-hover/member:grayscale-0 transition-all"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-tight truncate mb-0.5">{member.name}</p>
                      <p className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest truncate">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center opacity-40">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[4px]">Collective Empty</p>
              </div>
            )}
          </div>

          {/* Activity/Tasks Section */}
          <div className="p-8 bg-white/60 dark:bg-black/60 backdrop-blur-sm border border-gray-100 dark:border-[#1a1a1a] rounded-[2.5rem] shadow-xl">
            <div className="flex items-center gap-3 text-orange-600 mb-8 border-b border-gray-50 dark:border-[#1a1a1a] pb-6">
              <IoMdDoneAll className="text-3xl" />
              <h3 className="text-sm font-black uppercase tracking-[3px]">Sector Directives</h3>
            </div>
            
            {project.tasks.length > 0 ? (
              <div className="flex flex-col gap-4">
                {project.tasks.map((task, index) => (
                  <div key={index} className="p-5 bg-gray-50/50 dark:bg-[#151515] hover:bg-white dark:hover:bg-[#0a0a0a] rounded-[2rem] border border-gray-100 dark:border-[#1a1a1a] transition-all group/task shadow-sm">
                    <p className="text-xs font-black text-gray-800 dark:text-white uppercase tracking-tight mb-3 line-clamp-2 leading-tight group-hover/task:text-orange-600 transition-colors">{task.title}</p>
                    <div className='flex justify-between items-center gap-2'>
                      <span className={`text-[8px] font-black uppercase tracking-[2px] px-3 py-1 rounded-full ${
                        task.priority === 'High' ? 'bg-red-600 text-white' : 
                        task.priority === 'Medium' ? 'bg-amber-600 text-white' : 
                        'bg-blue-600 text-white'
                      }`}>
                        {task.priority}
                      </span>
                      <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
                        <span className="text-red-600 mr-1">EPOCH:</span>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center opacity-40 grayscale">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[4px]">Directives Offline</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AdminProjectDetails;