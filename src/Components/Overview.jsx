import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';

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

// Register the chart elements
ChartJS.register(ArcElement, Tooltip, Legend);

// Define color options and function to get a random color
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
        const userId = decodeJWT(token);

        // Fetch tasks        
        const tasksResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/overview/assigned-tasks/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          setTasks(tasksResponse.data.tasks);

        // Fetch projects
        const projectResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/joinedprojects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Assign random color to each project
        const updatedProjects = projectResponse.data.map((project) => ({
          ...project,
          color: getRandomColor(),
        }));
        setProjects(updatedProjects);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  // Calculate task status counts for pie chart
  const taskStatusCounts = {
    'Not Started': tasks.filter((task) => task.status === 'Not Started').length,
    'In Progress': tasks.filter((task) => task.status === 'In Progress').length,
    'Completed': tasks.filter((task) => task.status === 'Completed').length,
  };

  const pieData = {
    labels: ['Not Started', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Task Statuses',
        data: [
          taskStatusCounts['Not Started'],
          taskStatusCounts['In Progress'],
          taskStatusCounts['Completed'],
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0'],
      },
    ],
  };

  return (
    <div className='xsx:ml-[265px] bg-gray-50 flex flex-col p-5'> 
      <h2 className="text-2xl font-semibold mb-4">Overview</h2>

      {/* Pie Chart for Task Status */}
      <div className="mb-8" style={{ width: '300px', height: '300px' }}>
  <h3 className="text-xl font-semibold mb-2">Task Status Breakdown</h3>
  <Pie data={pieData} />
</div>


      {/* List of Projects */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Your Projects</h3>
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
                    {project.team.length} - {project.team.length <= 1 ?<>Collaborator</> : <>Collaborators</>}
                  </p>
                  </div>
                </div>
              
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
