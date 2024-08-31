import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectDetailsAndUsers = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch project details
        const projectResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/viewProjects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProject(projectResponse.data);

        // Fetch all users
        const usersResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/fetchusers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(usersResponse.data);

      } catch (err) {
        console.error(err);
        setError('Failed to fetch project details or users.');
      }
    };

    fetchProjectDetailsAndUsers();
  }, [projectId]);

  return (
    <div>
      <h2>Project Details</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {project && (
        <div>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
        </div>
      )}

      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectDetail;
