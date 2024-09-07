import React, { useState, useEffect, useCallback } from 'react';
import { FaTasks, FaFilter, FaCalendar, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaRedo } from 'react-icons/fa';
import axios from 'axios';

function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    return payload.id;
  } catch (err) {
    console.error('Failed to decode JWT:', err);
    throw err;
  }
}

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          throw new Error('No token found, please sign in again.');
        }

        // Decode the JWT token to extract the user ID
        const userId = decodeJWT(token);

        // Fetch user profile
        const profileResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { name } = profileResponse.data;
        setUserName(name);

        // Fetch tasks for the user using the decoded userId
        const tasksResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/overview/assigned-tasks/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setTasks(tasksResponse.data.tasks);
        setFilteredTasks(tasksResponse.data.tasks);
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
    return <p className="text-center">Loading tasks...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
  <div className={`ml-auto xsx:ml-[265px] ${tasks.length < 4 ? 'h-screen' : 'min-h-screen' } bg-gray-100 p-6`}>

    <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
      Task Manager for {userName}
    </h1>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {['Not Started', 'In Progress', 'Completed'].map((status) => (
        <div
          key={status}
          className="flex justify-between items-end p-6 bg-white text-white shadow-md rounded-lg transform transition duration-300 hover:scale-105"
        >
          <div>

            {status === 'Not Started'
              ? <FaTasks className="text-4xl text-gray-500 mb-4" />
              : status === 'Completed'
                ? <FaTimesCircle className="text-4xl text-gray-500 mb-4" />
                : <FaHourglassHalf className="text-4xl text-gray-500 mb-4" />
            }
            <h2 className="text-xl text-cyan-950 font-semibold mb-2">{status}</h2>
          </div>
          <p
            className={`text-lg font-bold ${status === 'Not Started'
              ? 'text-blue-600'
              : status === 'Completed'
                ? 'text-green-600'
                : 'text-yellow-600'
              }`}
          >
            <span
              className="text-[60px] font-extrabold leading-none tracking-tight"
              style={{
                color: 'inherit', // Use the dynamic colors based on status
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)', // Slight shadow for prominence
              }}
            >
              {statusCounts[status]}
            </span>
            <span className="text-xl ml-2">tasks</span>
          </p>
        </div>
      ))}
    </div>


    {/* Filters */}
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
      <div className="flex space-x-4">
        <button
          className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-colors duration-200 ${statusFilter === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'
            }`}
          onClick={() => setStatusFilter('All')}
        >
          <FaRedo className="mr-2" />
          All Tasks
        </button>
        {['Not Started', 'In Progress', 'Completed'].map((status) => (
          <button
            key={status}
            className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-colors duration-200 ${statusFilter === status ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'
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

      <div className="flex space-x-4">
        <button
          className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-colors duration-200 ${dateFilter === 'All' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700'
            }`}
          onClick={() => setDateFilter('All')}
        >
          <FaFilter className="mr-2" />
          All Dates
        </button>
        <button
          className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-colors duration-200 ${dateFilter === 'Upcoming' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-700'
            }`}
          onClick={() => setDateFilter('Upcoming')}
        >
          <FaCalendar className="mr-2" />
          Upcoming
        </button>
        <button
          className={`flex items-center px-4 py-2 rounded-lg shadow-md transition-colors duration-200 ${dateFilter === 'Missed' ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-700'
            }`}
          onClick={() => setDateFilter('Missed')}
        >
          <FaTimesCircle className="mr-2" />
          Missed
        </button>
      </div>
    </div>

    {/* Task List */}
    <div className="grid gap-4">
      {filteredTasks.length > 0 ? (
        filteredTasks.map((task) => (
          <div
            key={task.id}
            className="p-4 bg-white shadow-md rounded-lg transform transition duration-300 hover:scale-[1.01]"
          >
            <div className="flex justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">{task.title}</h3>
                <p className="text-gray-600">Project: {task.projectName}</p>
                <p className="text-sm text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <FaCalendar className="text-gray-600" />
                <span className="text-gray-700">{task.status}</span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-600">No tasks found for the selected filters.</p>
      )}
    </div>
  </div>

  );
};

export default Dashboard;
