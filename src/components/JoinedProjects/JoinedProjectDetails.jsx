import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import TeamMembers from '../../Assets/ProjectModals/TeamMembers'
import ProjectTasks from './JoinedProjectTasks'
import { FaLandMineOn, FaPeopleGroup } from 'react-icons/fa6'
import { FaBorderAll, FaEye } from 'react-icons/fa'
import { useAuthContext } from '../../AuthProvider'
import Loader from '../../Assets/Loaders/Loader'
import { motion, AnimatePresence } from 'framer-motion'

const JoinedProjectDetails = () => {
  const { user } = useAuthContext();
  const { projectId } = useParams();
  const [loggedUser, setloggedUser] = useState(null);

  const [project, setProject] = useState(null);
  const [teamDetails, setTeamDetails] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [error, setError] = useState({});
  const [view, setView] = useState('all'); // 'all' or 'my'
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        setloggedUser(user._id);
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/joinedprojects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.project) {
          setProject(response.data.project);
          setTeamDetails(response.data.project.team);
        } else {
          setError((prev) => ({ ...prev, project: 'Project not found.' }));
        }
      } catch (err) {
        console.error(err);
        setError((prev) => ({ ...prev, project: 'Failed to fetch project details.' }));
      }
    };

    const fetchProjectTasks = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/project-tasks/${projectId}/tasks`);
        const tasks = response.data.tasks;
        
        // Correctly filter tasks: check task.task.assignedTo against loggedUser
        const assignedToMe = tasks.filter(t => t.task.assignedTo === user._id);
        
        setAllTasks(tasks);
        setMyTasks(assignedToMe);
      } catch (err) {
        console.error(err);
        setError((prev) => ({ ...prev, tasks: 'Failed to fetch project tasks.' }));
      }
    };

    fetchProjectDetails();
    fetchProjectTasks();
  }, [projectId, user._id]);

  if (!project) return <Loader />;

  return (
    <main className="min-h-screen bg-[#fcfaf8] dark:bg-[#000000] p-6 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto">
        {/* Project Header Banner */}
        <div className="relative mb-8 w-full h-48 lg:h-64 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-[#1a1a1a]">
          <img 
            src={`/Themes/${project.theme || 1}.jpg`} 
            alt={project.name} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-2">
                {project.name}
              </h1>
              <p className="max-w-2xl text-sm md:text-base text-gray-200 line-clamp-2 md:line-clamp-none font-medium opacity-90">
                {project.description}
              </p>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-7 gap-8">
          {/* Left Sidebar: Controls & Team */}
          <section className="xl:col-span-2 flex flex-col gap-6">
            {/* View Switcher */}
            <div className="bg-white dark:bg-[#0a0a0a] p-2 rounded-2xl border border-gray-100 dark:border-[#1a1a1a] flex gap-2 shadow-sm">
              <button 
                onClick={() => setView('all')} 
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                  view === 'all' 
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600'
                }`}
              >
                <FaBorderAll />
                <span>All Directives</span>
              </button>
              <button 
                onClick={() => setView('my')} 
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
                  view === 'my' 
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                    : 'text-gray-500 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 hover:text-orange-600'
                }`}
              >
                <FaLandMineOn className="text-lg" />
                <span>My Objectives</span>
              </button>
            </div>

            {/* Team Members List */}
            <div className="bg-white dark:bg-[#0a0a0a] p-6 rounded-3xl border border-gray-100 dark:border-[#1a1a1a] shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3 text-orange-600">
                  <FaPeopleGroup className="text-2xl" />
                  <h3 className="font-bold">Project Collective</h3>
                </div>
                <button 
                  onClick={openModal}
                  className="xl:hidden p-2 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-all"
                >
                  <FaEye />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {teamDetails.map((member) => (
                  <motion.div 
                    key={member._id} 
                    whileHover={{ x: 5 }}
                    className={`flex items-center gap-4 p-3 rounded-2xl border transition-all ${
                      member._id === loggedUser 
                        ? 'bg-orange-50/50 dark:bg-orange-500/5 border-orange-200 dark:border-orange-500/20' 
                        : 'bg-gray-50 dark:bg-[#151515] border-transparent'
                    }`}
                  >
                    <div className="relative">
                      <img
                        src={`/Avatars/${member.avatar || 1}.jpg`}
                        alt={member.name}
                        className="w-10 h-10 rounded-xl border border-gray-200 dark:border-[#1a1a1a]"
                      />
                      {member._id === loggedUser && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-600 border-2 border-white dark:border-[#0a0a0a] rounded-full" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-gray-800 dark:text-gray-200 truncate">
                        {member.name}
                        {member._id === loggedUser && <span className="ml-2 text-[10px] text-orange-600 uppercase">You</span>}
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{member.email}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <TeamMembers teamDetails={teamDetails} isOpen={isModalOpen} onClose={closeModal} />
          </section>

          {/* Main Tasks Area */}
          <section className="xl:col-span-5">
            <div className="bg-white dark:bg-[#0a0a0a] rounded-3xl border border-gray-100 dark:border-[#1a1a1a] p-8 shadow-sm h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-2 h-8 bg-orange-600 rounded-full" />
                <h2 className="text-xl font-bold dark:text-white">
                  {view === 'all' ? 'Universal Directives' : 'Personal Objectives'}
                </h2>
              </div>
              <ProjectTasks 
                creator={project.createdBy} 
                tasks={view === 'all' ? allTasks : myTasks} 
              />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default JoinedProjectDetails;
