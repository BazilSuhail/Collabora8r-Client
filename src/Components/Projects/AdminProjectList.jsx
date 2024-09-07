import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateProject from './CreateProject';
import { FiClipboard, FiFolder, FiMoreVertical, FiSettings } from 'react-icons/fi';
import { AiOutlinePlus } from 'react-icons/ai';

const colors = [
  'bg-red-400', 'bg-blue-400', 'bg-green-700', 'bg-yellow-600', 'bg-indigo-400', 'bg-orange-400', 'bg-cyan-400', 'bg-violet-400'
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // Track the active dropdown
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

  const handleTaskManagement = (projectId) => {
    setActiveDropdown(null); // Close dropdown after navigation
    navigate(`/tasks/${projectId}`);
  };

  const handleProjectClick = (projectId) => {
    setActiveDropdown(null); // Close dropdown after navigation
    navigate(`/projects/${projectId}`);
  };

  const toggleDropdown = (projectId) => {
    setActiveDropdown(activeDropdown === projectId ? null : projectId); // Toggle specific dropdown
  };

  return (
    <div className='xsx:ml-[265px] h-full pb-[250px] bg-gray-50 flex flex-col p-5'>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FiFolder className="text-2xl text-gray-600" />
          <h2 className="text-2xl font-bold">Created Projects</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className='flex items-center bg-gradient-to-r from-cyan-200 to-blue-100 text-blue-700 font-[600] px-4 py-2 rounded-md shadow-md hover:bg-blue-600'
        >
          <AiOutlinePlus className="mr-2 text-[20px] text-blue-900 rounded-full" />
          Create New Project
        </button>
      </div>
<p className='mt-[8px] mb-[15px] font-[500] text-gray-500' >List of All projects Adminstrated By you</p>

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
        <table className="w-full rounded-lg border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="py-2 pl-[15px]">Project</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id} className="border-b-[3px] border-[#dedede] bg-white hover:bg-gray-100 transition-colors">
                <td className="py-3 pl-[15px] flex items-center">
                  <div className={`w-[30px] h-[30px] text-[15px] text-center pt-[3px] text-white font-bold rounded-full ${project.color}`}>
                    {project.name.charAt(0)}
                  </div>
                  <span
                    className="ml-6 font-[600] text-lg cursor-pointer hover:underline"
                    onClick={() => handleProjectClick(project._id)}
                  >
                    {project.name}
                  </span>
                </td>
                <td className="p-2 text-center relative">
                  <button
                    onClick={() => toggleDropdown(project._id)}
                    className='text-gray-600 hover:text-gray-800'
                  >
                    <FiMoreVertical className='text-2xl' />
                  </button>

                  {activeDropdown === project._id && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <button
                        onClick={() => handleProjectClick(project._id)}
                        className="flex items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                      >
                        <FiSettings className="mr-2" /> Project Management
                      </button>
                      <button
                        onClick={() => handleTaskManagement(project._id)}
                        className="flex items-center w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                      >
                        <FiClipboard className="mr-2" /> Task Management
                      </button>
                    </div>
                  )}
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
