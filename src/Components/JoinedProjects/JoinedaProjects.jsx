import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPeopleRoof } from 'react-icons/fa6';
import { FaEye } from 'react-icons/fa';
import TasksTimeline from '../TasksTimeline';

const colors = [
  'bg-red-400', 'bg-blue-400', 'bg-green-700', 'bg-yellow-600', 'bg-indigo-400', 'bg-orange-400', 'bg-cyan-400', 'bg-violet-400'
];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const JoinedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    const fetchJoinedProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/joinedprojects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const updatedProjects = response.data.map((project) => ({
          ...project,
          color: getRandomColor(),
        }));

        setProjects(updatedProjects);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch projects.');
      }
    };

    fetchJoinedProjects();
  }, []);

  const handleProjectClick = (projectId) => {
    setSelectedProjectId(projectId); // Update selected project ID
  };

  // Render conditional components
  return (
    <div className='xsx:ml-[265px] bg-white flex flex-col p-5'>
      <div className="flex items-center space-x-4">
        <FaPeopleRoof className="text-[32px] text-gray-600" />
        <h2 className="text-2xl font-bold">Joined Projects</h2>
      </div>

      <p className='mt-[8px] mb-[15px] font-[400] text-gray-500'>View all of the projects associated with your account.</p>

      {error && !projects.length ? (
        <div className='p-4 bg-blue-100 text-blue-600 border border-blue-300 rounded-md'>
          No projects found.
        </div>
      ) : (
        <>
          <table className='w-full table-auto border-collapse bg-white shadow-md rounded-md'>
            <thead className='bg-gray-200'>
              <tr>
                <th className='p-3 text-left text-gray-600'>Project Name</th>
                <th className='p-3 text-center text-gray-600'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr
                  key={project._id}
                  className='border-b-[3px] border-[#dedede] hover:bg-gray-100 transition-colors cursor-pointer'
                  onClick={() => handleProjectClick(project._id)}
                >
                  <td className="py-3 pl-[15px] flex items-center">
                    {/* Render random color for the first letter */}
                    <div className={`w-[30px] h-[30px] text-[15px] text-center pt-[3px] text-white font-bold rounded-full ${project.color}`}>
                      {project.name.charAt(0)}
                    </div>
                    <span
                      className="ml-6 font-[600] text-lg cursor-pointer hover:underline"
                    >
                      {project.name}
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <button onClick={() => handleProjectClick(project._id)} className='text-gray-600 hover:text-blue-600'>
                      <FaEye className='text-2xl' />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      
      {selectedProjectId ?
        <TasksTimeline projectId={selectedProjectId} />
        : <></>
      }
    </div>
  );
};

export default JoinedProjects;
