import React, { useState, useEffect, useCallback } from 'react';
import { FaFilter, FaCalendar, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaRedo, FaClipboardList, FaRunning, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import { ImCross } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';

import NoTasks from "../Assets/NoTasks.webp";

import decodeJWT from '../decodeJWT';
import Loader from '../Assets/Loader';

const colors = [
  'bg-red-400', 'bg-blue-400', 'bg-green-700', 'bg-yellow-600', 'bg-indigo-400', 'bg-orange-400', 'bg-cyan-400', 'bg-violet-400'
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const Dashboard = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');

  const [usersId, setUsersId] = useState('');
  const [projectColors, setProjectColors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No token found, please sign in again.');
        }

        const userId = decodeJWT(token);
        setUsersId(userId);

        // Fetch user profile
        const profileResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { name } = profileResponse.data;
        setUserName(name);

        const tasksResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/overview/assigned-tasks/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const fetchedTasks = tasksResponse.data.tasks;
        setTasks(fetchedTasks);
        setFilteredTasks(fetchedTasks);

        const colorMapping = {};

        fetchedTasks.forEach(project => {
          const projectId = project._id; 
          // Assign a color only if it hasn't already been assigned to this project
          if (!colorMapping[projectId]) {
            colorMapping[projectId] = getRandomColor();
          }
        });

        setProjectColors(colorMapping);
      } catch (err) {
        setError(err.message || 'Error fetching tasks');
      } finally {
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
    return <Loader/>;
  }

  if (error) {
    navigate('/login');
  }

  return (
    <main className="ml-auto xsx:ml-[265px] min-h-screen bg-white p-6">

      <section className="mb-[15px] bg-gradient-to-r from-cyan-100 via-blue-100 to-purple-100 border-2 border-blue-300 p-6 rounded-xl shadow-md">
        <div className="flex xl:mt-[75px] lg:flex-row flex-col lg:items-end text-[25px] lg:text-[35px] font-extrabold text-blue-700">
          Hello,
          <p className="lg:ml-[15px] text-[30px]  lg:text-[45px] text-blue-900">{userName}</p>
        </div>
      </section>

      <section className='grid grid-cols-1 xsx:grid-cols-7 xsx:grid-rows-1'>

        <div className='col-span-2 mb-[15px] xsx:mx-[8px]'>
          <div className='flex mb-[15px] xsx:pl-[8px]'>
            <button
              className={`flex whitespace-nowrap mr-[12px] items-center px-4 py-[4px] rounded-lg shadow-md transition-colors duration-200 ${dateFilter === 'All' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700'
                }`}
              onClick={() => setDateFilter('All')}
            >
              <FaFilter className="mr-2" />
              All Dates
            </button>
            <button
              className={`flex whitespace-nowrap items-center px-4 py-[4px] rounded-lg shadow-md transition-colors duration-200 ${dateFilter === 'Missed' ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-700'
                }`}
              onClick={() => setDateFilter('Missed')}
            >
              <FaTimesCircle className="mr-2" />
              Missed
            </button>
          </div>

          <div className='xsx:mx-[5px] border-[2px] pl-[15px] py-[20px] w-full rounded-xl bg-white'>
            <div className="mb-[12px]  flex items-center text-gray-700 lg:text-[18px]">
              <FaCalendar className="bg-blue-500 mr-[5px] lg:mr-[10px] text-white rounded-full p-2 text-[24px] lg:text-[28px]" />
              <span>Scheduled: </span>
              <span className="font-semibold text-lg lg:text-[19px] ml-[8px]">
                {statusCounts['Not Started']}
              </span>
            </div>
            <div className="mb-[12px] flex items-center text-gray-700 lg:text-[18px]">
              <FaRunning className="bg-yellow-500 mr-[5px] lg:mr-[10px] text-white rounded-full p-2 text-[24px] lg:text-[28px]" />
              <span>In Progress: </span>
              <span className="font-semibold text-lg lg:text-[19px] ml-[8px]">
                {statusCounts['In Progress']}
              </span>
            </div>
            <div className="flex items-center text-gray-700 lg:text-[18px]">
              <ImCross className="bg-green-500 mr-[5px] lg:mr-[10px] text-white rounded-full p-2 text-[24px] lg:text-[28px]" />
              <span>Completed: </span>
              <span className="font-semibold text-lg lg:text-[19px] ml-[8px]">
                {statusCounts['Completed']}
              </span>
            </div>
          </div>
        </div>

        <div className='col-span-5 xl:px-[25px]'>
          <div className="flex overflow-x-auto space-x-4 hide-scrollbar">
            <button
              className={`flex whitespace-nowrap items-center px-4 py-[4px] rounded-lg transition-colors duration-200 ${statusFilter === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'
                }`}
              onClick={() => setStatusFilter('All')}
            >
              <FaRedo className="mr-2" />
              All Tasks
            </button>
            {['Not Started', 'In Progress', 'Completed'].map((status) => (
              <button
                key={status}
                className={`flex whitespace-nowrap items-center px-4 py-[4px] rounded-lg transition-colors duration-200 ${statusFilter === status ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'
                  }`}
                onClick={() => setStatusFilter(status)}
              >
                {status === 'Not Started' && <FaHourglassHalf className="mr-2" />}
                {status === 'In Progress' && <FaCheckCircle className="mr-2" />}
                {status === 'Completed' && <FaTimesCircle className="mr-2" />}
                {status}
              </button>
            ))}
          </div>
          {/* Task List */}
          <div className="grid gap-4 mt-[20px]">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div
                  onClick={() => {
                    navigate(`/task/${usersId}/${task._id}`);
                  }}
                  key={task._id}
                  className="px-4 pt-4 pb-[-12px] bg-white border-[2px] rounded-lg transform transition duration-300 hover:scale-[1.01]"
                >

                  <div className='flex xsx:flex-row flex-col xsx:items-center xsx:justify-between'>
                    <h1 className="text-[17px] xsx:text-[19px] flex items-center font-[600]"><span className='bg-gray-400 p-[5px] xsx:p-[8px] rounded-full'><FaClipboardList className='text-white  text-[17px] xsx:text-[20px]' /></span><span className='ml-[8px] mt-[-3px]'>{task.title}</span></h1>
                    <p
                      className={`text-[15px] w-[120px] text-center xsx:block hidden font-[600] px-[15px] py-1 rounded-[15px] ${task.status === 'Not Started'
                        ? 'text-blue-600 bg-blue-100'
                        : task.status === 'Completed'
                          ? 'text-green-600 bg-green-100'
                          : 'text-yellow-600 bg-yellow-100'
                        }`}
                    >
                      {task.status}
                    </p>
                  </div>
                  {/*   <p className='text-[14px] xsx:text-[15px] xsx:mt-0 mt-[8px] ml-[35px] xsx:ml-[45px] text-gray-800 font-[450]'>{task.description}</p> */}
                  <p className="text-[15px] mt-[8px]  ml-[35px] xsx:ml-[45px] ">
                    <span className='text-red-500 mr-[5px]'>Due:</span> <span className='text-red-700 underline font-[600] rounded-xl '>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </p>

                  <div className='h-[2px] w-full bg-[#eeeeee] rounded-xl mt-[8px]'></div>
                  <div className='py-[12px] hover:bg-gray-100 flex justify-between items-center'>
                    <div className='flex items-center'>
                      <p className={`text-[12px] xsx:ml-[45px] text-center px-[12px] rounded-xl py-[3px] text-white font-[600] ${projectColors[task._id]}`}>
                        {task.projectName}
                      </p>
                      <p
                        className={`text-[11px] ml-[6px] xsx:hidden block w-[100px] text-center  xl:text-[14px] font-[600] px-[15px] py-1 rounded-[15px] ${task.status === 'Not Started'
                          ? 'text-blue-600 bg-blue-100'
                          : task.status === 'Completed'
                            ? 'text-green-600 bg-green-100'
                            : 'text-yellow-600 bg-yellow-100'
                          }`}
                      >
                        {task.status}
                      </p>
                    </div>
                    <FaArrowRight className='text-[22px] text-gray-400 xsx:text-[25px]' />
                  </div>

                </div>
              ))
            ) : (
              <div className='flex  flex-col items-center '>
                <img src={NoTasks} alt='' className='scale-[0.75] mt-[55px] md:mt-[-80px]' />
                <p className="text-center text-blue-500 mt-[-45px] md:mt-[-105px] bg-blue-100 rounded-lg px-[35px] py-2">No tasks found.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
