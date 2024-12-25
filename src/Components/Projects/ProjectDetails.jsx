import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaUserPlus, FaSearch, FaClipboardList } from 'react-icons/fa'; // Import icons
import { FiFileText } from 'react-icons/fi'; // Import icon for Project details
import Loader from '../../Assets/Loader';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProjectDetailsAndUsers = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch project details
        const projectResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/viewProjects/${projectId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProject(projectResponse.data);

        // Fetch all users
        const usersResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/manageusers/getallUsers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(usersResponse.data);
        setFilteredUsers(usersResponse.data);

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
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/manageusers/${projectId}/addUser`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Add project ID to user's JoinProject document
      await axios.patch(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/manageusers/${userId}/joinProject`,
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filtered = users.filter(user =>
      user.email.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  if (!project) {
    return <Loader />;
  }

  return (
    <div className='xsx:ml-[265px] h-screen bg-gray-100 flex flex-col p-5'>
      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] lg:w-[50%]">
            <h2 className="text-lg font-bold mb-4">Project Description</h2>
            <p className="text-[16px] text-gray-800">{project.description}</p>
            <button
              className="mt-4 text-[15px] px-4 py-[3px] bg-blue-600 text-white rounded-lg"
              onClick={() => setIsModalOpen(!isModalOpen)}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {/* Project Details Section */}
      <div className="flex items-center bg-white text-white rounded-lg p-3 lg:p-6 border">
        <FiFileText className="text-4xl mr-4" />
        {project &&
          <div>
            <h2 className="text-[19px] md:text-3xl flex mb-[15px] text-blue-950 items-center font-bold"><FaClipboardList className='text-blue-900 mr-[8px]' />{project.name}</h2>
            <p className="text-[15px] text-blue-900 font-[600] lg:ml-[35px]" >
              {project.description.split(" ").length > 40 ? `${project.description.split(" ").slice(0, 40).join(" ")}...` : project.description}
              {project.description.split(" ").length > 40 && (
                <span className="text-blue-600 cursor-pointer ml-2" onClick={() => setIsModalOpen(!isModalOpen)} >
                  Read More
                </span>
              )}
            </p>
          </div>}
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      {/* Add Users Section */}
      <div className="bg-white mt-[28px] rounded-lg border p-8">
        <div className="flex items-center mb-6">
          <FaUserPlus className="text-indigo-600 text-3xl mr-3" />
          <h2 className="text-2xl font-semibold text-gray-800">Add Users to Project</h2>
        </div>

        <div className="flex items-center border-2 rounded-lg border-gray-300 mb-6">
          <FaSearch className="text-gray-400 text-xl ml-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search users by email"
            className="w-full px-4 py-2 text-gray-600 focus:outline-none"
          />
        </div>

        {searchQuery === '' && (
          <div className="flex mt-[75px] flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="grayscale-1 w-32 h-32 mb-4">
              <path fill="#fdd835" d="M32 4a28 28 0 1028 28A28.031 28.031 0 0032 4z"></path>
              <g fill="#f9a825">
                <path d="M32 0v8a24 24 0 000 48v8A32 32 0 1132 0zM0 32h8a24 24 0 0048 0h8A32 32 0 110 32z"></path>
              </g>
              <path fill="#fff" d="M23 43H9a3 3 0 01-3-3v-3a5 5 0 015-5h6a5 5 0 015 5v3a3 3 0 01-3 3zM41 43H27a3 3 0 01-3-3v-3a5 5 0 015-5h6a5 5 0 015 5v3a3 3 0 01-3 3z"></path>
              <circle cx="16" cy="27" r="6" fill="#f9a825"></circle>
              <circle cx="32" cy="27" r="6" fill="#fdd835"></circle>
            </svg>
            <p className="rounded-lg p-2 text-center font-[600] text-blue-600 text-[15px]">Start typing to find and add users to the project.</p>
          </div>
        )}

        {/* User List */}
        {searchQuery !== '' && (
          <ul className="space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <li key={user._id} className="flex justify-between items-center bg-gray-100 p-4 rounded-lg border">
                  <span className="text-gray-800">{user.email}</span>
                  <button
                    onClick={() => handleAddUser(user._id)}
                    className="flex items-center space-x-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
                  >
                    <FaUserPlus />
                    <span>Add User</span>
                  </button>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No users found</p>
            )}
          </ul>
        )}
      </div>
    </div >
  );
};

export default ProjectDetail;
