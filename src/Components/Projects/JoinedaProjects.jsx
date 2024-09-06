import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const JoinedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJoinedProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/joinedprojects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch projects.');
      }
    };

    fetchJoinedProjects();
  }, []);

  const handleProjectClick = (projectId) => {
    navigate(`/joinedprojects/${projectId}`);
  };

  return (
    <div className='xsx:ml-[265px] bg-[#fefefe] flex flex-col p-5'>
      <h2 className='text-2xl font-bold mb-4'>Joined Projects</h2>

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
        <table className='w-full table-auto border-collapse bg-white shadow-md rounded-md'>
          <thead className='bg-gray-200'>
            <tr>
              <th className='p-3 text-left text-gray-600'>Project Name</th>
              <th className='p-3 text-left text-gray-600'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project._id}
                className='border-b hover:bg-gray-100 transition-colors cursor-pointer'
                onClick={() => handleProjectClick(project._id)}
              >
                <td className='p-3'>{project.name}</td>
                <td className='p-3 text-right'>
                  <button className='text-blue-500 hover:text-blue-700'>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default JoinedProjects;
