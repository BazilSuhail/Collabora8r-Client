import React, { useState, useEffect, useCallback } from 'react';
import { FaFilter, FaCalendar, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaRedo, FaClipboardList, FaRunning, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import { ImCross } from 'react-icons/im';
import { useNavigate } from 'react-router-dom';

//import NoTasks from "../Assets/NoTasks.webp"; 

import NoTasks from "/Resources/1.png";
import Loader from '../Assets/Loaders/Loader';

import { useAuthContext } from '../AuthProvider';

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

  /*if (error) {
    navigate('/login');
  }
  */
  return (
    <main className="ml-auto xsx:ml-[265px] min-h-screen bg-white py-6 px-3 sm:p-6">

      <section className="relative mb-[18px] xl:mb-[25px] w-full h-[100px] lg:h-[180px] xl:h-[150px] rounded-xl overflow-hidden bg-gray-300">
        <div className="absolute inset-0 w-full flex pt-3 items-center space-x-2 pb-[8px]">
          <img src={`/Themes/3.jpg`} alt="" className=" h-[120px] lg:h-[180px] xl:h-[150px] w-full object-cover" />
        </div>

        <div className="absolute h-[100px] flex flex-col justify-center lg:h-[180px] xl:h-[150px] inset-0 w-full px-[18px] space-x-2 bg-black bg-opacity-30 z-10">
          <p className="ml-[8px] xl:ml-[120px] xl:scale-[1.2] font-[700]  text-white">
            <span className='text-gray-300 text-[21px] sm:text-[28px]'>Hello,</span><span className='ml-[8px] text-[34px] md:text-[44px]'>{user.name.split(" ")[0]}</span>
          </p>
        </div>
      </section>

      <section className='grid grid-cols-1 xl:grid-cols-7  xsx:grid-rows-1'>
        <div className='col-span-1 xl:col-span-2 mb-[15px] xsx:mx-[8px]'>
          {filteredTasks.length > 0 &&
            <div className='flex mb-[15px] space-x-3 xsx:pl-[8px]'>
              <button
                className={`text-[15px] border border-gray-300 flex whitespace-nowrap md:mr-[12px] items-center px-4 py-[3px] rounded-lg shadow-md transition-colors duration-200 ${dateFilter === 'All' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                onClick={() => setDateFilter('All')}
              >
                <FaFilter className="mr-2" />
                All Dates
              </button>
              <button
                className={`flex whitespace-nowrap text-[15px] border border-gray-300 items-center px-4 py-[3px] rounded-lg shadow-md transition-colors duration-200 ${dateFilter === 'Missed' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                onClick={() => setDateFilter('Missed')}
              >
                <FaTimesCircle className="mr-2" />
                Missed
              </button>
            </div>
          }

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

        <div className='col-span-3 xsx:mx-[8px] xl:col-span-5 xl:px-[25px]'>
          {filteredTasks.length > 0 &&
            <div className="flex overflow-x-auto space-x-[4px space-x-[8px] hide-scrollbar">
              <button
                className={`flex text-[15px] border border-gray-300 whitespace-nowrap items-center px-3 py-[2px] rounded-lg transition-colors duration-200 ${statusFilter === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                onClick={() => setStatusFilter('All')}
              >
                <FaRedo className="mr-2" />
                All Tasks
              </button>
              {['Not Started', 'In Progress', 'Completed'].map((status) => (
                <button
                  key={status}
                  className={`flex whitespace-nowrap text-[15px] border border-gray-300 items-center px-3 py-[3px] rounded-lg transition-colors duration-200 ${statusFilter === status ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
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
          }

          {/* Task List */}
          <div className="grid gap-4 mt-[20px]">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <div
                  onClick={() => {
                    navigate(`/task/${user._id}/${task._id}`);
                  }}
                  key={task._id}
                  className="px-4 pt-4 pb-[-12px] bg-white border-[2px] rounded-lg transform transition duration-300 hover:scale-[1.01]"
                >
                  <div className='flex xsx:flex-row flex-col xsx:items-center xsx:justify-between'>
                    <h1 className="text-[17px] xsx:text-[19px] flex items-center font-[600]">
                      <span className='bg-gray-400 p-[5px] xsx:p-[8px] rounded-full'>
                        <FaClipboardList className='text-white  text-[17px] xsx:text-[20px]' />
                      </span>
                      <span className='ml-[8px] text-[14px] sm:text-[17px] mt-[-3px]'>{task.title.slice(0, 48)} {task.title.lenth > 29 && '...'}</span>
                    </h1>

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
                  <p className="smLscale-[1] scale-[0.8] text-[15px] mt-[8px]  sm:ml-[35px] xsx:ml-[45px] ">
                    <span className='text-red-500 mr-[5px]'>Due:</span> <span className='text-red-700 underline font-[600] rounded-xl '>{new Date(task.dueDate).toLocaleDateString()}</span>
                  </p>

                  <div className='h-[2px] w-full bg-[#eeeeee] rounded-xl mt-[8px]'></div>

                  <div className='py-[12px] hover:bg-gray-100 flex justify-between items-center'>
                    <div className='flex scale-[0.82] sm:scale-[1]  xsx:ml-[45px] ml-[-15px] items-center'>
                      <p className={`text-[12px] text-center px-[12px] rounded-xl py-[3px] text-white font-[600] ${projectColors[task.projectId]}`}>
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
                    <FaArrowRight className='text-[18px] text-gray-400 xsx:text-[25px]' />
                  </div>

                </div>
              ))
            ) : (
              <div className='flex flex-col items-center '>
                <img src={NoTasks} alt='Connection Error' className='scale9] mt-[95px] lg:mt-[105px]' />
                <p className="text-center text-gray-600 text-[14px] font-[600] mt-[10px]">Your Tasks Will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Dashboard;
