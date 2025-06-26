import React, { useState, useEffect, useCallback } from 'react';
import { FaFilter, FaCalendar, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaRedo, FaClipboardList, FaRunning, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import { ImCross } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';

//import NoTasks from "../Assets/NoTasks.webp"; 

import NoTasks from "/resources/1.png";
import Loader from '../components/loaders/Loader';

import { useAuthContext } from '../AuthProvider';
import { motion ,AnimatePresence } from 'framer-motion';

const colors = [
  'bg-red-400', 'bg-blue-400', 'bg-green-700', 'bg-yellow-600', 'bg-indigo-400', 'bg-orange-400', 'bg-cyan-400', 'bg-violet-400'
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [projectColors, setProjectColors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No token found, please sign in again.');
        }
        const tasksResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/overview/assigned-tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedTasks = tasksResponse.data.tasks;
        //console.log(fetchedTasks)
        setTasks(fetchedTasks);
        setFilteredTasks(fetchedTasks);

        const colorMapping = {};

        fetchedTasks.forEach(project => {
          const projectId = project.projectId;
          if (!colorMapping[projectId]) {
            colorMapping[projectId] = getRandomColor();
          }
        });
        setProjectColors(colorMapping);
      }
      catch (err) {
        setError(err.message || 'Error fetching tasks');
      }
      finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const filterTasks = useCallback(() => {
    let filtered = tasks;

    if (statusFilter !== 'All') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (dateFilter !== 'All') {
      const now = new Date();
      if (dateFilter === 'Upcoming') {
        filtered = filtered.filter(task => new Date(task.dueDate) > now);
      } else if (dateFilter === 'Missed') {
        filtered = filtered.filter(task => new Date(task.dueDate) < now && task.status !== 'Completed');
      }
    }

    setFilteredTasks(filtered);
  }, [tasks, statusFilter, dateFilter]);

  useEffect(() => {
    filterTasks();
  }, [statusFilter, dateFilter, filterTasks]);

  const statusCounts = {
    'Not Started': tasks.filter((task) => task.status === 'Not Started').length,
    'In Progress': tasks.filter((task) => task.status === 'In Progress').length,
    'Completed': tasks.filter((task) => task.status === 'Completed').length,
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <main className="min-h-screen bg-[#fcfaf8] p-4 dark:bg-[#000000] transition-colors duration-300">
      <div className="mx-auto space-y-8 pt-4">
        
        {/* Welcome Section */}
        <section className="relative h-32 md:h-48 lg:h-64 rounded-xl overflow-hidden shadow-2xl group">
          <img src={`/themes/4.jpg`} alt="Dashboard Theme" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.2]" />
          <div className="absolute inset-0 bg-linear-to-r from-black/90 via-black/40 to-transparent flex flex-col justify-center px-8 md:px-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-lg md:text-2xl lg:text-3xl font-semibold text-white tracking-tighter mb-1 md:mb-2">
                Protocol: <span className="text-orange-600">Active</span>
              </h1>
              <div className="flex items-center gap-2 md:gap-4">
                <div className="w-1.5 h-8 md:h-12 bg-orange-600 rounded-full" />
                <div className="min-w-0">
                  <p className="text-gray-300 text-xs md:text-[12px] mb-2 font-semibold tracking-[3px] md:tracking-[4px]">Welcome, Specialist</p>
                  <p className="text-white text-2xl md:text-4xl lg:text-6xl font-bold tracking-tight truncate">{user.name}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8">
          {/* Sidebar Stats */}
          <aside className="lg:col-span-3 space-y-4 md:space-y-6">
            <div className="bg-white/60 dark:bg-black/60 backdrop-blur-sm p-4 md:p-8 rounded-xl border border-gray-100 dark:border-[#1a1a1a] shadow-xl space-y-6 md:space-y-8">
              <header className="flex items-center gap-2 md:gap-3 text-orange-600 mb-5">
                <FaCalendar className="text-lg md:text-xl" />
                <h3 className="text-[9px] md:text-[10px] font-black tracking-[2px] md:tracking-[3px]">Mission Metrics</h3>
              </header>

              <StatItem 
                icon={<FaHourglassHalf className="bg-amber-500" />} 
                label="Scheduled" 
                count={statusCounts['Not Started']} 
                color="text-amber-500"
              />
              <StatItem 
                icon={<FaRunning className="bg-orange-600" />} 
                label="Active Ops" 
                count={statusCounts['In Progress']} 
                color="text-orange-600"
              />
              <StatItem 
                icon={<FaCheckCircle className="bg-green-600" />} 
                label="Completed" 
                count={statusCounts['Completed']} 
                color="text-green-600"
              />

              <div className="pt-2 border-t border-gray-300 dark:border-[#1a1a1a]">
                <p className="text-[8px] md:text-[9px] font-black text-gray-400 dark:text-gray-500 tracking-widest leading-relaxed">
                  Real-time intelligence feed active. Awaiting sector updates.
                </p>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-col gap-2 md:gap-3">
              <FilterButton 
                active={dateFilter === 'All'} 
                onClick={() => setDateFilter('All')}
                label="All Dates"
                icon={<FaFilter />}
              />
              <FilterButton 
                active={dateFilter === 'Missed'} 
                onClick={() => setDateFilter('Missed')}
                label="Missed"
                icon={<FaTimesCircle />}
                variant="danger"
              />
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-9 space-y-4 md:space-y-6">
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white/40 dark:bg-black/40 backdrop-blur-sm p-3 md:p-4 rounded-2xl md:rounded-3xl border border-gray-100/50 dark:border-[#1a1a1a]/50">
              <div className="flex overflow-x-auto gap-2 md:gap-3 no-scrollbar pb-1 md:pb-0">
                <StatusFilter 
                  active={statusFilter === 'All'} 
                  onClick={() => setStatusFilter('All')}
                  label="All"
                  icon={<FaRedo />}
                />
                <StatusFilter 
                  active={statusFilter === 'Not Started'} 
                  onClick={() => setStatusFilter('Not Started')}
                  label="Pending"
                />
                <StatusFilter 
                  active={statusFilter === 'In Progress'} 
                  onClick={() => setStatusFilter('In Progress')}
                  label="In Progress"
                />
                <StatusFilter 
                  active={statusFilter === 'Completed'} 
                  onClick={() => setStatusFilter('Completed')}
                  label="Done"
                />
              </div>
              <span className="text-[9px] md:text-[10px] font-black text-orange-600 tracking-widest px-2 md:px-4 border-t sm:border-t-0 sm:border-l border-orange-500/20 pt-2 sm:pt-0">
                {filteredTasks.length} Tasks
              </span>
            </header>

            {/* Task Grid */}
            <div className="grid gap-3 md:gap-4">
              <AnimatePresence mode='popLayout'>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: index * 0.05 }}
                      key={task._id}
                      onClick={() => navigate(`/task/${user._id}/${task._id}`)}
                      className="group bg-white/60 dark:bg-black/60 backdrop-blur-sm p-3 md:p-6 rounded-xl border border-gray-100 dark:border-[#1a1a1a] shadow-lg hover:shadow-2xl hover:bg-white dark:hover:bg-[#0a0a0a] transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-6">
                        <div className="flex items-center gap-3 md:gap-4 min-w-0">
                          <div className="w-10 md:w-14 h-10 md:h-14 bg-gray-100 dark:bg-[#151515] rounded-lg md:rounded-2xl flex-shrink-0 flex items-center justify-center text-gray-400 group-hover:bg-orange-600 group-hover:text-white transition-all">
                            <FaClipboardList className="text-lg md:text-xl" />
                          </div>
                          <div className="min-w-0">
                            <h2 className="text-sm md:text-lg lg:text-xl font-black text-gray-800 dark:text-white tracking-tight leading-tight group-hover:text-orange-600 transition-colors truncate">
                              {task.title}
                            </h2>
                            <div className="flex items-center gap-2 mt-1 min-w-0">
                              <span className={`w-6 md:w-8 h-1 rounded-full flex-shrink-0 ${projectColors[task.projectId] || 'bg-gray-400'}`} />
                              <span className="text-[9px] md:text-[10px] font-black text-gray-400 dark:text-gray-500 tracking-widest truncate">{task.projectName}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-3 md:gap-6 border-t md:border-t-0 border-gray-100 dark:border-[#1a1a1a] pt-3 md:pt-0 flex-shrink-0">
                          <div className="text-center md:text-right">
                            <p className="text-[8px] md:text-[9px] font-black text-gray-400 tracking-[1px] md:tracking-[2px] mb-0.5 md:mb-1">Due</p>
                            <p className="text-xs md:text-sm font-bold text-red-600 dark:text-red-500 tracking-tighter">{new Date(task.dueDate).toLocaleDateString()}</p>
                          </div>
                          
                          <div className={`px-3 md:px-6 py-1.5 md:py-2 rounded-full text-[8px] md:text-[10px] font-black tracking-[1px] md:tracking-[2px] min-w-fit md:min-w-[120px] text-center flex-shrink-0 ${
                            task.status === 'Completed' ? 'bg-green-600/10 text-green-600 border border-green-600/20' :
                            task.status === 'In Progress' ? 'bg-orange-600/10 text-orange-600 border border-orange-600/20' :
                            'bg-gray-100 dark:bg-[#1a1a1a] text-gray-400 border border-transparent'
                          }`}>
                            {task.status}
                          </div>
                          
                          <div className="w-8 md:w-10 h-8 md:h-10 bg-gray-50 dark:bg-[#151515] rounded-lg md:rounded-xl flex-shrink-0 flex items-center justify-center text-gray-300 group-hover:text-orange-600 group-hover:bg-orange-50 dark:group-hover:bg-orange-500/10 transition-all">
                            <FaArrowRight className="text-sm md:text-base" />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="py-12 flex flex-col items-center justify-center grayscale opacity-80"
                  >
                    <img src={NoTasks} alt="No Intel" className="w-64 mb-8" />
                    <h3 className="text-xl font-black text-gray-800 dark:text-white  tracking-tighter">Zero Signals Detected</h3>
                    <p className="text-[10px] font-bold text-gray-400  tracking-widest mt-2">The sector is currently offline or cleared.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

const StatItem = ({ icon, label, count, color }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm shadow-lg transition-transform group-hover:scale-110 ${icon.props.className}`}>
        {icon}
      </div>
      <span className="text-xs font-bold text-gray-500 dark:text-gray-400  tracking-widest">{label}</span>
    </div>
    <span className={`text-xl font-black ${color}`}>{count}</span>
  </div>
);

const FilterButton = ({ active, onClick, label, icon, variant = 'primary' }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 md:gap-4 px-3 md:px-6 py-2 md:py-4 rounded-lg md:rounded-2xl font-black text-[9px] md:text-[10px] tracking-[1px] md:tracking-[2px] transition-all border-2 whitespace-nowrap ${
      active 
        ? variant === 'danger' ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-600/20' : 'bg-orange-600 border-orange-600 text-white shadow-lg shadow-orange-600/20'
        : 'bg-white/40 dark:bg-black/40 text-gray-500 dark:text-gray-400 border-transparent hover:border-gray-200 dark:hover:border-[#1a1a1a]'
    }`}
  >
    <span className="text-sm md:text-base">{icon}</span>
    {label}
  </button>
);

const StatusFilter = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-1 md:gap-2 px-3 md:px-5 py-1.5 md:py-2.5 rounded-lg md:rounded-xl font-black text-[8px] md:text-[10px] tracking-widest transition-all whitespace-nowrap ${
      active 
        ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
        : 'bg-gray-100/50 dark:bg-[#151515] text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#1a1a1a]'
    }`}
  >
    {icon && <span className="text-[10px] md:text-xs">{icon}</span>}
    {label}
  </button>
);

export default Dashboard;
