import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

import { GiProgression } from 'react-icons/gi';
import { SiMyspace } from 'react-icons/si';
import { FaCalendar, FaRunning, FaExclamationTriangle } from 'react-icons/fa';
import { MdManageAccounts, MdOutlineJoinInner } from 'react-icons/md';
import { motion } from 'framer-motion';

import Loader from '../Assets/Loaders/Loader'; 
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
      <div className='xsx:ml-[265px] min-h-screen p-5 flex flex-col overflow-hidden'>
        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center">
          <div className="flex items-center space-x-2">
            <GiProgression className="text-2xl text-gray-600" />
            <h2 className="text-[24px] text-gray-600 font-bold">Progress Overview</h2>
          </div>
        </div>
        <p className='mt-[2px] text-[12px] sm:text-[13px] lg:ml-[35px] mb-[15px] font-[500] text-gray-500'>
          View statistics and visual overview of all your progress at one place.
        </p>

        <div className='h-[3px] mb-[15px] w-full bg-gray-300 '></div>

        <div className='flex flex-col mx-auto'>
          <img src="/Resources/2.png" alt='Connection Error' className='scale-[0.8] md:scale-[0.9] mt-[155px]' />
          <p className="text-center text-gray-700 font-[600] text-[11px] md:text-[14px]">This is where you will track your progress,</p>
          <p className="text-center text-gray-700 font-[600] text-[11px] md:text-[14px]">projects and tasks statistical analyzsis.</p>
        </div>
      </div>
    );

  return (
    <div className='xsx:ml-[265px] bg-gray-50 flex flex-col p-5'>
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center">
        <div className="flex items-center space-x-2">
          <GiProgression className="text-2xl text-gray-600" />
          <h2 className="text-[24px] text-gray-600 font-bold">Progress Overview</h2>
        </div>
      </div>
      <p className='mt-[2px] text-[13px] lg:ml-[35px] mb-[15px] font-[500] text-gray-500'>
        View statistics and visual overview of all your progress made at one place.
      </p>

      <div className='h-[3px] mb-[15px] w-full bg-gray-300 '></div>

      <div className='grid overflow-hidden grid-cols-2 mb-[20px] bg-white p-4 rounded-[15px] border place-items-center gap-2 lg:grid-cols-3'>
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='bg-gray-100 border rounded-2xl text-white p-[15px] w-full  flex flex-row xsx:w-[90%]'>
          <SiMyspace className='mr-[5px] text-[38px] md:text-[44px] text-gray-100 bg-blue-500 p-[9px] rounded-full' />
          <div className='ml-[15px]'>
            <p className='font-bold text-gray-400 text-[10px] md:text-[12px]'>My Projects:</p>
            <p className='font-medium text-gray-600 text-[18px] md:text-[22px]'>{projectsCount.adminProjectsCount}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='bg-gray-100 border rounded-2xl text-white p-[15px] w-full  flex flex-row xsx:w-[90%]'>
          <MdOutlineJoinInner className='mr-[5px] text-[38px] md:text-[44px] text-gray-100 bg-blue-500 p-[9px] rounded-full' />
          <div className='ml-[15px]'>
            <p className='font-bold text-gray-400 text-[10px] md:text-[12px]'>Joined Projects:</p>
            <p className='font-medium text-gray-600 text-[18px] md:text-[22px]'>{projectsCount.joinedProjectsCount}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='bg-gray-100 border rounded-2xl text-white p-[15px] w-full flex flex-row xsx:w-[90%]'>
          <MdManageAccounts className='mr-[5px] text-[38px] md:text-[44px] text-gray-100 bg-blue-500 p-[9px] rounded-full' />
          <div className='ml-[15px]'>
            <p className='font-bold text-gray-400 text-[10px] md:text-[12px]'>Projects Control:</p>
            <p className='font-medium text-gray-600 text-[18px] md:text-[22px]'>{projectsCount.managerProjectCount}</p>
          </div>
        </motion.div>


        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='bg-gray-100 border rounded-2xl text-white p-[15px] w-full flex flex-row xsx:w-[90%]'>
          <FaCalendar className='mr-[5px] text-[38px] md:text-[44px] text-gray-100 bg-cyan-600 p-[9px] rounded-full' />
          <div className='ml-[15px]'>
            <p className='font-bold text-gray-400 text-[10px] md:text-[12px]'>Scheduled Tasks:</p>
            <p className='font-medium text-gray-600 text-[18px] md:text-[22px]'> {taskStatusCounts['Not Started']}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='bg-gray-100 border rounded-2xl text-white p-[15px] w-full flex flex-row xsx:w-[90%]'>
          <FaRunning className='mr-[5px] text-[38px] md:text-[44px] text-gray-100 bg-cyan-500 p-[9px] rounded-full' />
          <div className='ml-[15px]'>
            <p className='font-bold text-gray-400 text-[10px] md:text-[12px]'>Ongoing Tasks:</p>
            <p className='font-medium text-gray-600 text-[18px] md:text-[22px] xl:text-[22px]'>{taskStatusCounts['In Progress']}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className='bg-gray-100 border rounded-2xl text-white p-[15px] w-full flex flex-row xsx:w-[90%]'>
          <FaExclamationTriangle className='mr-[5px] text-[38px] md:text-[44px] text-gray-100 bg-cyan-500 p-[9px] rounded-full' />
          <div className='ml-[15px]'>
            <p className='font-bold text-gray-400 text-[10px] md:text-[12px]'>Overdue Tasks:</p>
            <p className='font-medium text-gray-600 text-[18px] md:text-[22px]'> {taskStatusCounts['Overdue']}</p>
          </div>
        </motion.div>
      </div>

      <h3 className="text-[16px] flex items-center font-semibold mb-[18px]"><BsListTask className='mr-[8px] text-[20px] mt-[5px]' /> Task Status Breakdown</h3>

      <div className='grid gap-[15px] grid-cols-1 lg:grid-cols-2'>
        <div className='flex flex-col py-[12px] bg-white rounded-lg border'>
          <div className='mx-auto p-[12px] w-full h-full'>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
        <div className='flex flex-col py-[12px] bg-white rounded-lg border'>
          <div className="w-[250px] h-[250px] lg:w-[300px] mx-auto lg:h-[300px]">
            <Pie data={pieData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;


/*
  <div className='grid grid-cols-1 mb-[20px] bg-white p-4 rounded-[15px] space-y-[15px] border place-items-center gap-x-2 lg:grid-cols-3'>

        <motion.div
        initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        className='bg-gray-100 border rounded-2xl text-white p-[15px] w-full  flex flex-row xsx:w-[90%]'>
          <FaCalendar className='mr-[5px] text-[44px] text-gray-100 bg-gray-500 p-[9px] rounded-full' />
          <div className='ml-[15px]'>
            <p className='font-bold text-gray-400 text-[10px] md:text-[12px]'>My Projects:</p>
            <p className='font-medium text-gray-600 text-[18px] md:text-[22px]'>{projectsCount.adminProjectsCount}</p>
          </div>
        </motion.div>

        <motion.div
        initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        className='bg-gray-100 border rounded-2xl text-white p-[15px] w-full flex flex-row xsx:w-[90%]'>
          <FaRunning className='mr-[5px] text-[44px] text-gray-100 bg-gray-500 p-[9px] rounded-full' />
          <div className='ml-[15px]'>
            <p className='font-bold text-gray-400 text-[10px] md:text-[12px]'>Joined Projects:</p>
            <p className='font-medium text-gray-600 lg:text-[15px] text-[22px] xl:text-[22px]'>{projectsCount.joinedProjectsCount}</p>
          </div>
        </motion.div>

        <motion.div
        initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        className='bg-gray-100 border rounded-2xl text-white p-[15px] w-full flex flex-row xsx:w-[90%]'>
          <FaExclamationTriangle className='mr-[5px] text-[44px] text-gray-100 bg-gray-500 p-[9px] rounded-full' />
          <div className='ml-[15px]'>
            <p className='font-bold text-gray-400 text-[10px] md:text-[12px]'>Overdue:</p>
            <p className='font-medium text-gray-600 text-[18px] md:text-[22px]'>{projectsCount.managerProjectCount}</p>
          </div>
        </motion.div>


        <motion.div
        initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        className='bg-gray-100 border rounded-2xl text-white p-[15px] w-full flex flex-row xsx:w-[90%]'>
          <FaCalendar className='mr-[5px] text-[44px] text-gray-100 bg-gray-500 p-[9px] rounded-full' />
          <div className='ml-[15px]'>
            <p className='font-bold text-gray-400 text-[10px] md:text-[12px]'>Not Started:</p>
            <p className='font-medium text-gray-600 text-[18px] md:text-[22px]'> {taskStatusCounts['Not Started']}</p>
          </div>
        </motion.div>

        <motion.div
        initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        className='bg-gray-100 border rounded-2xl text-white p-[15px] w-full flex flex-row xsx:w-[90%]'>
          <FaRunning className='mr-[5px] text-[44px] text-gray-100 bg-gray-500 p-[9px] rounded-full' />
          <div className='ml-[15px]'>
            <p className='font-bold text-gray-400 text-[10px] md:text-[12px]'>Ongoing:</p>
            <p className='font-medium text-gray-600 lg:text-[15px] text-[22px] xl:text-[22px]'>{taskStatusCounts['In Progress']}</p>
          </div>
        </motion.div>

        <motion.div
        initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        className='bg-gray-100 border rounded-2xl text-white p-[15px] w-full flex flex-row xsx:w-[90%]'>
          <FaExclamationTriangle className='mr-[5px] text-[44px] text-gray-100 bg-gray-500 p-[9px] rounded-full' />
          <div className='ml-[15px]'>
            <p className='font-bold text-gray-400 text-[10px] md:text-[12px]'>Overdue:</p>
            <p className='font-medium text-gray-600 text-[18px] md:text-[22px]'> {taskStatusCounts['Overdue']}</p>
          </div>
        </motion.div>
      </div>
*/

/*

      <div className='bg-white overflow-x-hidden rounded-lg mb-[15px] shadow-md  grid md:grid-cols-2 grid-cols-1'>
        {/* <motion.div
          className="ml-[25px] mt-[15px]"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 text-[25px] font-semibold text-gray-600 lg:text-[45px]">
            <FaTasks className="inline-block mb-1 lg:mb-3 mr-2 text-blue-500 text-[25px] lg:text-[40px]" />
            <span>Total Tasks: </span>
            <span className="font-bold text-black text-[28px] lg:text-[45px]">
              {totalTasks}
            </span>
          </div>

          <div className="mb-[15px] scale-[0.8] mt-[30px] flex items-center text-gray-700 lg:text-[25px]">
            <FaCalendar className="bg-gray-500 mr-[5px] lg:mr-[10px] text-white rounded-full p-2 text-[33px] lg:text-[40px]" />
            <span>Scheduled: </span>
            <span className="font-semibold text-lg lg:text-[25px] ml-[8px]">
              {taskStatusCounts['Not Started']}
            </span>
          </div>
          <div className="mb-[15px] scale-[0.8] flex items-center text-gray-700 lg:text-[25px]">
            <FaRunning className="bg-gray-500 mr-[5px] lg:mr-[10px] text-white rounded-full p-2 text-[33px] lg:text-[40px]" />
            <span>Ongoing: </span>
            <span className="font-semibold text-lg lg:text-[25px] ml-[8px]">
              {taskStatusCounts['In Progress']}
            </span>
          </div>
          <div className="mb-[15px] scale-[0.8] flex items-center text-gray-700 lg:text-[25px]">
            <FaExclamationTriangle className="bg-gray-500 mr-[5px] lg:mr-[10px] text-white rounded-full p-2 text-[33px] lg:text-[40px]" />
            <span>Overdue: </span>
            <span className="font-semibold text-lg lg:text-[25px] ml-[8px]">
              {taskStatusCounts['Overdue']}
            </span>
          </div>
        </motion.div>

        <div className="mb-8 md:scale-[1]  scale-[0.78] mx-auto xl:mt-[25px] w-[350px] h-[300px]">
          <Pie data={pieData} />
        </div>
        
        </div>
*/