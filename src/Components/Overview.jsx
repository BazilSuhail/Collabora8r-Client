import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';

import { motion } from 'framer-motion';
import { FaTasks, FaCalendar, FaRunning, FaExclamationTriangle } from 'react-icons/fa';
import Loader from '../Assets/Loader';
import NoTasks from "../Assets/NoOverView.webp";


ChartJS.register(ArcElement, Tooltip, Legend);
const colors = [
  'bg-red-400', 'bg-blue-400', 'bg-green-700', 'bg-yellow-600', 'bg-indigo-400', 'bg-orange-400', 'bg-cyan-400', 'bg-violet-400'
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const Overview = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleProjectClick = (projectId) => {
    navigate(`/joinedprojects/${projectId}`);
  };

  // Fetch tasks and projects
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token'); 

        const tasksResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/overview/assigned-tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTasks(tasksResponse.data.tasks);

        const projectResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/joinedprojects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const updatedProjects = projectResponse.data.map((project) => ({
          ...project,
          color: getRandomColor(),
        }));
        setProjects(updatedProjects);
      } catch (err) {
        setError('You Have Not Joinded Any Projects :/');
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
    'Overdue': tasks.filter(task => new Date(task.dueDate) < now && task.status !== 'Completed').length,
  };

  const pieData = {
    labels: ['Scheduled', 'Ongoing', 'Overdue'],
    datasets: [
      {
        label: 'Task Statuses',
        data: [
          taskStatusCounts['Not Started'],
          taskStatusCounts['In Progress'],
          taskStatusCounts['Overdue'],
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
      },
    ],
  };
  const totalTasks = taskStatusCounts['Not Started'] + taskStatusCounts['In Progress'] + taskStatusCounts['Overdue'];

  if (loading) return <Loader />;
  /*if (error) return (
    <div className='xsx:ml-[265px] min-h-screen bg-white flex flex-col'>
      <img src={NoTasks} alt='' className='scale-[0.2]' />
      <p className="text-center text-blue-500 bg-blue-100 rounded-lg px-[35px] py-2">No tasks found.</p>
    </div>
  );*/

  return (
    <div className='xsx:ml-[265px] bg-gray-50 flex flex-col p-5'>
      <h2 className="text-2xl font-semibold mb-4">Overview</h2>

      <h3 className="text-xl font-semibold mb-2">Task Status Breakdown</h3>
      <div className='bg-white overflow-x-hidden rounded-lg mb-[15px] shadow-md  grid md:grid-cols-2 grid-cols-1'>
        <motion.div
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

      <div>
        <h3 className="text-xl font-semibold mb-4">Your Projects</h3>
        {error ?
          <div className='mt-[-138px]'>
            <img src={NoTasks} alt='' className='scale-[0.50] mx-auto mix-blend-multiply' />
            <p className="text-blue-600 text-[14px] text-center mt-[-88px] font-[600]">No Joined Project Found.</p>
          </div> :
          <>
            {projects.length === 0 ? (
              <p>No projects available</p>
            ) : (
              <div className="grid gap-4">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className='border-b-[3px] border-[#dedede] hover:bg-gray-100 transition-colors cursor-pointer'
                    onClick={() => handleProjectClick(project._id)}
                  >
                    <div className="py-3 pl-[15px] flex items-center">
                      {/* Random color for first letter */}
                      <div className={`w-[40px] h-[40px] text-[22px] text-center pt-[3px] text-white font-bold rounded-full ${project.color}`}>
                        {project.name.charAt(0)}
                      </div>
                      <div>
                        <p
                          className="ml-6 font-[600] text-[28px] cursor-pointer hover:underline"
                          onClick={() => handleProjectClick(project._id)}
                        >
                          {project.name}
                        </p>
                        <p
                          className="ml-6 text-[14px] font-[700] text-[#999999] cursor-pointer hover:underline"
                          onClick={() => handleProjectClick(project._id)}
                        >
                          {project.team.length} - {project.team.length <= 1 ? <>Collaborator</> : <>Collaborators</>}
                        </p>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </>}

      </div>
    </div>
  );
};

export default Overview;
