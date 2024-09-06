import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateProject from './CreateProject';
import { FiMoreVertical } from 'react-icons/fi'; // For three-dot icon
import { AiOutlinePlus } from 'react-icons/ai';  // For plus icon

const colors = [
  'bg-red-400', 'bg-blue-400', 'bg-green-700', 'bg-yellow-600', 'bg-indigo-400', 'bg-orange-400', 'bg-cyan-400', 'bg-violet-400'
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/viewProjects/admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const updatedProjects = response.data.map((project) => ({
          ...project,
          color: getRandomColor(),
        }));
        setProjects(updatedProjects);
      } catch (err) {
        setError('Failed to fetch projects.');
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className='xsx:ml-[265px] bg-[#fefefe] flex flex-col p-5'>
      <div className="flex justify-between items-center mb-4">
        <h2 className='text-2xl font-bold'>Created Projects</h2>
        <button
          onClick={() => setShowModal(true)}
          className='flex items-center bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600'
        >
          <AiOutlinePlus className="mr-2" />
          Create New Project
        </button>
      </div>

      {error && !projects.length && (
        <div className='p-4 bg-red-100 text-red-600 border border-red-300 rounded-md'>
          {error}
        </div>
      )}

      {!error && !projects.length ? (
        <div className='p-4 bg-gray-100 text-gray-600 border border-gray-300 rounded-md'>
          No projects found.
        </div>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Project</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id} className="border-b hover:bg-gray-100 transition-colors">
                <td className="p-2 flex items-center">
                  <div className={`w-[28px] h-[28px] text-[15px] text-center pt-[3px] text-white font-bold rounded-full ${project.color}`}>
                    {project.name.charAt(0)}
                  </div>
                  <span 
                    className="ml-4 text-lg cursor-pointer hover:underline"
                    onClick={() => handleProjectClick(project._id)}
                  >
                    {project.name}
                  </span>
                </td>
                <td className="p-2 text-right">
                  <button
                    onClick={() => handleProjectClick(project._id)}
                    className='text-gray-600 hover:text-gray-800'
                  >
                    <FiMoreVertical className='text-2xl' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && <CreateProject setShowModal={setShowModal} />}
    </div>
  );
};

export default ProjectList;
