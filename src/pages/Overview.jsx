import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

import { GiProgression } from 'react-icons/gi';
import { SiMyspace } from 'react-icons/si';
import { FaCalendar, FaRunning, FaExclamationTriangle } from 'react-icons/fa';
import { MdManageAccounts, MdOutlineJoinInner } from 'react-icons/md';
import { motion } from 'framer-motion';

import Loader from '../components/loaders/Loader'; 
import { BsListTask } from 'react-icons/bs';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Overview = () => {
  const [tasks, setTasks] = useState([]);
  const [projectsCount, setProjectsCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/overview/progress-overview`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTasks(response.data.tasks);
        console.log(response.data.tasks);
        setProjectsCount(response.data.projectCounts);
        console.log(projectsCount);

      } catch (err) {
        setError('You Have Not Joined Any Projects :/');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const now = new Date();
  const taskStatusCounts = {
    'Not Started': tasks.filter((task) => task.status === 'Not Started').length,
    'In Progress': tasks.filter((task) => task.status === 'In Progress').length,
    'Completed': tasks.filter((task) => task.status === 'Completed').length,
    'Overdue': tasks.filter((task) => new Date(task.dueDate) < now && task.status !== 'Completed').length,
  };

  const pieData = {
    labels: ['Scheduled', 'In Progress', 'Overdue', 'Completed'],
    datasets: [
      {
        label: 'Task Statuses',
        data: [
          taskStatusCounts['Not Started'],
          taskStatusCounts['In Progress'],
          taskStatusCounts['Overdue'],
          taskStatusCounts['Completed'],
        ],
        backgroundColor: ['#4759c9', '#be9533', '#e24e4e', '#0fa878'],
        hoverBackgroundColor: ['#172894', '#8e6b1a', '#8b2b2b', '#2c765e'],
      },
    ],
  };

  const barData = {
    labels: tasks.map((task) => task.title.slice(0, 10)),
    datasets: [
      {
        label: 'Task Progress',
        data: tasks.map((task) => task.progress),
        backgroundColor: '#1779bb',
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) return <Loader />;

  if (error)
    return (
      <div className='min-h-screen p-4 md:p-6 flex flex-col bg-[#fcfaf8] dark:bg-[#000000] overflow-hidden transition-colors duration-300'>
        <div className="flex flex-col gap-2 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center text-white">
              <GiProgression className="text-2xl" />
            </div>
            <h2 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-black">Progress Analytics</h2>
          </div>
        </div>
        <p className='text-sm md:text-base text-gray-600 dark:text-gray-400 font-semibold'>
          Start by joining projects to view your progress analytics and statistics.
        </p>

        <div className='h-px mb-8 w-full bg-gray-200 dark:bg-[#1a1a1a]'></div>

        <div className='flex flex-col items-center justify-center flex-1'>
          <img src="/resources/2.png" alt='Connection Error' className='w-64 md:w-80 mb-6 opacity-60' />
          <p className="text-center text-gray-700 dark:text-gray-400 font-semibold text-sm">No projects yet.</p>
          <p className="text-center text-gray-600 dark:text-gray-500 text-xs mt-2">Join or create a project to start tracking progress</p>
        </div>
      </div>
    );

  return (
    <div className='min-h-screen bg-[#fcfaf8] dark:bg-[#000000] p-4 md:p-6 transition-colors duration-300'>
      <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-8 pt-2">
        
        {/* Page Header */}
        <header className="relative p-5 md:p-8 rounded-2xl md:rounded-3xl bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] shadow-sm overflow-hidden group">
          <div className="absolute top-0 right-0 w-56 h-56 bg-orange-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-orange-600/8 transition-colors" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl md:rounded-[2rem] flex items-center justify-center text-white shadow-md shadow-orange-600/20">
                <GiProgression className="text-2xl md:text-3xl" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-gray-800 dark:text-white tracking-tighter">
                  Progress <span className="text-orange-600">Analytics</span>
                </h1>
                <p className="text-[8px] md:text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[2px] md:tracking-[3px] mt-1">
                  Metrics & statistical analysis
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 bg-green-600/10 dark:bg-green-600/10 rounded-xl md:rounded-2xl border border-green-600/20">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[8px] md:text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-wider">Live</span>
            </div>
          </div>
        </header>

        {/* Intelligence Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
          <StatCard 
            icon={<SiMyspace />} 
            label="Sector Projects" 
            count={projectsCount.adminProjectsCount} 
            color="bg-blue-600"
            delay={0}
          />
          <StatCard 
            icon={<MdOutlineJoinInner />} 
            label="Joined Sectors" 
            count={projectsCount.joinedProjectsCount} 
            color="bg-indigo-600"
            delay={0.1}
          />
          <StatCard 
            icon={<MdManageAccounts />} 
            label="Command Authority" 
            count={projectsCount.managerProjectCount} 
            color="bg-violet-600"
            delay={0.2}
          />
          <StatCard 
            icon={<FaCalendar />} 
            label="Scheduled Objectives" 
            count={taskStatusCounts['Not Started']} 
            color="bg-amber-500"
            delay={0.3}
          />
          <StatCard 
            icon={<FaRunning />} 
            label="Ongoing Operations" 
            count={taskStatusCounts['In Progress']} 
            color="bg-orange-600"
            delay={0.4}
          />
          <StatCard 
            icon={<FaExclamationTriangle />} 
            label="Critical Delays" 
            count={taskStatusCounts['Overdue']} 
            color="bg-red-600"
            delay={0.5}
          />
        </section>

        {/* Visual Analytics */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          <div className="lg:col-span-8 bg-white dark:bg-[#0a0a0a] p-5 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-[#1a1a1a] shadow-sm">
            <header className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="w-1 h-5 md:h-6 bg-blue-600 rounded-full" />
              <h3 className="text-xs md:text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider md:tracking-widest">Operational Efficiency</h3>
            </header>
            <div className="h-[350px]">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          <div className="lg:col-span-4 bg-white dark:bg-[#0a0a0a] p-5 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-[#1a1a1a] shadow-sm flex flex-col">
            <header className="flex items-center gap-3 mb-6 md:mb-8">
              <div className="w-1 h-5 md:h-6 bg-orange-600 rounded-full" />
              <h3 className="text-xs md:text-sm font-bold text-gray-800 dark:text-white uppercase tracking-wider md:tracking-widest">Status Distribution</h3>
            </header>
            <div className="flex-1 flex items-center justify-center p-4">
              <div className="w-full max-w-[280px] aspect-square">
                <Pie 
                  data={pieData} 
                  options={{
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          usePointStyle: true,
                          padding: 20,
                          font: {
                            weight: 'bold',
                            size: 10
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, count, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white dark:bg-[#0a0a0a] p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-100 dark:border-[#1a1a1a] shadow-sm flex flex-col md:flex-row md:items-center gap-3 md:gap-5 group hover:border-orange-500/30 hover:bg-white dark:hover:bg-[#151515] transition-all cursor-default"
  >
    <div className={`w-12 h-12 md:w-14 md:h-14 flex-shrink-0 rounded-lg md:rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl shadow-md transition-transform group-hover:scale-110 group-hover:rotate-3 ${color}`}>
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[8px] md:text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[1px] md:tracking-[2px] mb-1">{label}</p>
      <p className="text-xl md:text-2xl font-black text-gray-800 dark:text-white tracking-tighter">{count}</p>
    </div>
  </motion.div>
);

export default Overview;