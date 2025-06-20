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
      <div className='min-h-screen p-5 flex flex-col bg-white dark:bg-[#000000] overflow-hidden transition-colors duration-300'>
        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center">
          <div className="flex items-center space-x-2">
            <GiProgression className="text-2xl text-gray-600 dark:text-gray-400" />
            <h2 className="text-[24px] text-gray-600 dark:text-gray-300 font-bold">Progress Overview</h2>
          </div>
        </div>
        <p className='mt-[2px] text-[12px] sm:text-[13px] lg:ml-[35px] mb-[15px] font-[500] text-gray-500 dark:text-gray-400'>
          View statistics and visual overview of all your progress at one place.
        </p>

        <div className='h-[1px] mb-[15px] w-full bg-gray-200 dark:bg-[#1a1a1a]'></div>

        <div className='flex flex-col mx-auto'>
          <img src="/Resources/2.png" alt='Connection Error' className='scale-[0.8] md:scale-[0.9] mt-[155px]' />
          <p className="text-center text-gray-700 font-[600] text-[11px] md:text-[14px]">This is where you will track your progress,</p>
          <p className="text-center text-gray-700 font-[600] text-[11px] md:text-[14px]">projects and tasks statistical analyzsis.</p>
        </div>
      </div>
    );

  return (
    <div className='min-h-screen bg-[#fcfaf8] dark:bg-[#000000] p-6 transition-colors duration-300'>
      <div className="max-w-[1400px] mx-auto space-y-8 pt-4">
        
        {/* Page Header */}
        <header className="relative p-8 rounded-[2.5rem] bg-white/60 dark:bg-black/60 backdrop-blur-sm border border-gray-100 dark:border-[#1a1a1a] shadow-xl overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-orange-600/10 transition-colors" />
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-orange-600 rounded-[2rem] flex items-center justify-center text-white shadow-lg shadow-orange-600/20">
                <GiProgression className="text-3xl" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-black text-gray-800 dark:text-white tracking-tighter uppercase">
                  Progress <span className="text-orange-600">Analytics</span>
                </h1>
                <p className="text-[10px] md:text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-[4px] mt-1">
                  Sector synchronization metrics & statistical analysis
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 px-6 py-3 bg-gray-50 dark:bg-[#151515] rounded-2xl border border-transparent">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Feed Status: Authorized</span>
            </div>
          </div>
        </header>

        {/* Intelligence Grid */}
        <section className="grid grid-cols-2 lg:grid-cols-3 gap-6">
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
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-white/60 dark:bg-black/60 backdrop-blur-sm p-8 rounded-[2.5rem] border border-gray-100 dark:border-[#1a1a1a] shadow-xl">
            <header className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
              <h3 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest">Operational Efficiency</h3>
            </header>
            <div className="h-[350px]">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          <div className="lg:col-span-4 bg-white/60 dark:bg-black/60 backdrop-blur-sm p-8 rounded-[2.5rem] border border-gray-100 dark:border-[#1a1a1a] shadow-xl flex flex-col">
            <header className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-6 bg-orange-600 rounded-full" />
              <h3 className="text-sm font-black text-gray-800 dark:text-white uppercase tracking-widest">Status Distribution</h3>
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
    className="bg-white/60 dark:bg-black/60 backdrop-blur-sm p-6 rounded-[2.5rem] border border-gray-100 dark:border-[#1a1a1a] shadow-xl flex items-center gap-6 group hover:bg-white dark:hover:bg-[#0a0a0a] transition-all cursor-default"
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-6 ${color}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[2px] mb-1">{label}</p>
      <p className="text-2xl font-black text-gray-800 dark:text-white tracking-tighter">{count}</p>
    </div>
  </motion.div>
);

export default Overview;