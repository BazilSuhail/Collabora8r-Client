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
        setProjects(response.data); // This should now be an array of project objects
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
    <div className='xsx:ml-[265px] bg-[#fefefe] flex flex-col'>
      <h2>Joined Projects</h2>
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

export default JoinedProjects;
