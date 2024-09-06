import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CreateProject = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [projectManager, setProjectManager] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/projects/users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(response.data);
      } catch (err) {
        setError('Failed to fetch users.');
      }
    };

    fetchUsers();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/projects/create`,
        { name, description, projectManager },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSuccess('Project created successfully!');
      setName('');
      setDescription('');
      setProjectManager('');
    } catch (err) {
      setError('Failed to create project.');
    }
  };

  return (
    <div className='xsx:ml-[265px] bg-[#fefefe] flex flex-col'>

      <div className='mt-[18px] flex flex-col w-[95%] mx-auto p-[15px] justify-center rounded-xl overflow-x-auto'>
        <h2 className='text-2xl text-custom-blue mb-[8px] font-bold '>Create A New Project</h2>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <form onSubmit={handleCreateProject}>


          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label className="mt-[15px] text-[16px] font-medium text-gray-700" htmlFor="studentEmail">Enter Project Name:</label>
            <input
              className="my-[5px] border border-gray-500 block w-full px-3 py-2 border-3 font-bold border-custom-blue placeholder-gray-400 focus:outline-none focus:ring focus:border-custom-blue sm:text-sm rounded-md"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label className="mt-[15px] text-[16px] font-medium text-gray-700" htmlFor="studentEmail">Enter Project Description:</label>
            <input
              className="my-[5px] border border-gray-500 block w-full px-3 py-2 border-3 font-bold border-custom-blue placeholder-gray-400 focus:outline-none focus:ring focus:border-custom-blue sm:text-sm rounded-md"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <label className="mt-[15px] text-[16px] font-medium text-gray-700" htmlFor="studentEmail">Choose Project Manager:</label>
            <select
              value={projectManager}
              onChange={(e) => setProjectManager(e.target.value)}
              className="w-full mt-[4px] py-[6px] px-3 border border-gray-500 text-[$363636] rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600"
           
              required
            >
              <option value="">Select a project manager</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.email}
                </option>
              ))}
            </select>
            
          <button className='mt-[25px] py-[5px] ml-auto px-[15px] rounded-md bg-[#072f63] text-[17px] font-semibold hover:text-[#072f63] hover:bg-white text-white' type="submit" >
              Create Project
          </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default CreateProject;
