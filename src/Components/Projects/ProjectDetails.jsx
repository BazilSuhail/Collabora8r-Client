import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
        const usersResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/manageusers/getallUsers`, {
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

  const handleAddUser = async (userId) => {
    try {
      const token = localStorage.getItem('token');

      // Add user to project
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/manageusers/${projectId}/addUser`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add project ID to user's JoinProject document
      await axios.patch(
        `${process.env.REACT_APP_API_BASE_URL}/manageusers/${userId}/joinProject`,
        { projectId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess('User added to project successfully.');
    } catch (err) {
      console.error(err);
      setError('Failed to add user to project.');
    }
  };

  return (
    <div className='xsx:ml-[265px] bg-[#fefefe] flex flex-col'>
      <h2>Project Details</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {project && (
        <div>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
        </div>
      )}

      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.email}
            <button onClick={() => handleAddUser(user._id)}>Add User</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectDetail;
