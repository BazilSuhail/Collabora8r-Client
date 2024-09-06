import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
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
        setProjects(response.data);
      } catch (err) {
        setError('Failed to fetch projects.');
      }
    };

    fetchProjects();
  }, []);

  const handleProjectClick = (projectId) => {
    // Navigate to the ProjectDetail component with the selected project ID
    //navigate(`/tasks/${projectId}`);
    
    navigate(`/projects/${projectId}`);
  };

  return (
    
    <div className='xsx:ml-[265px] bg-[#fefefe] flex flex-col'>
      <h2>Your Projects</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            <button onClick={() => handleProjectClick(project._id)}>
              {project.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectList;
