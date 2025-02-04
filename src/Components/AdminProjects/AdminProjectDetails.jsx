import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { FaUserPlus, FaSearch, FaClipboardList, FaUserAlt, FaUsers, FaEdit } from 'react-icons/fa';
import Loader from '../../Assets/Loaders/Loader';
import { CgUiKit } from 'react-icons/cg';
import { IoMdDoneAll } from 'react-icons/io';
import { MdErrorOutline, MdMarkEmailUnread, MdOutlineAdminPanelSettings } from 'react-icons/md';
import EditProject from '../../Assets/ProjectModals/EditProject';
import { GrChapterAdd } from 'react-icons/gr';
import { IoCheckmarkDoneCircleSharp } from 'react-icons/io5';

import { motion } from 'framer-motion';

const AdminProjectDetails = () => {
  const { projectId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [project, setProject] = useState(null);
  const [email, setEmail] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Fetch project details
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem('token');

        const projectResponse = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/admin-projects/${projectId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProject(projectResponse.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch project details.');
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handleSearch = async () => {
    setError('');
    setUser(null);
    setSuccess('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/admin-projects/get-searched-user`,
        { email, projectId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data)
      setUser(response.data); // Assuming the API returns { name, email, avatar }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to find the user.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async () => {
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/admin-projects/send-project-invitation`,
        { userId: user.userId, projectId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(response.data.message);
    } catch (err) {
      console.error(err);
      setError('Failed to add user to project.');
    }
  };

  if (!project) {
    return <Loader />;
  }

  return (
    <main className="xsx:pl-[287px] grid xl:grid-cols-7 grid-cols-1 pt-[35px] bg-gray-50 min-h-screen pb-[15px] px-6">

      {showModal && <EditProject project={project} setShowModal={setShowModal} />}
      <section className='lg:col-span-5 xl:pr-[20px]'>

        <div className='bg-white p-[12px] flex lg:items-center lg:justify-between lg:flex-row flex-col xl:p-[25px] border rounded-[18px] '>
          <div className="text-[18px] md:text-[24px] flex md:flex-row flex-col md:items-center font-[600]">
            <p className='bg-blue-200 w-[50px] mr-[12px] h-[50px] rounded-full flex items-center justify-center text-[28px] text-blue-600  md:mb-0 mb-[15px] '>
              <FaClipboardList />
            </p>
            {project.name}
          </div>
          <div onClick={() => setShowModal(true)} className='w-[170px] hover:cursor-pointer lg:mt-0 mt-[15px] py-[8px] flex items-center bg-gradient-to-r to-blue-950 from-cyan-800 rounded-[15px]'>
            <FaEdit className="lg:scale-[1] scale-[0.8] ml-[15px] text-[18px] mt-[2px] text-blue-50" />
            <span className='text-[13px] ml-[8px] font-[600] mt-[px] text-blue-50'>Edit Project Details</span>
          </div>
        </div>


        <div className='bg-white p-[12px] mt-[15px] xl:px-[35px] py-[15px] border rounded-[18px] '>
          <div className='flex  text-blue-600 items-center'>
            <CgUiKit className='text-[18px]  mr-[5px]' />
            <span className='text-[14px] font-[600]'>Task Guidelines</span>
          </div>
          <p className="mt-2 font-[500] text-[14px] pl-[22px] text-gray-500">{project.description}</p>
        </div>

        <div className='bg-white min-h-[450px] overflow-hidden p-[12px] mt-[15px] xl:px-[35px] py-[15px] border rounded-[18px] '>
          <div className="flex items-center pb-[3px] text-blue-700 border-b-[2px] mb-[15px] mt-4">
            <MdMarkEmailUnread className="mr-2 text-[20px]" />
            <span className="font-medium  text-[15px]">
              Search User by Email
            </span>
          </div>

          <div className="flex items-center border-2 rounded-[25px] border-gray-300 mb-6">
            <FaSearch className="text-gray-400 text-[20px] ml-3" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email"
              className="w-full pl-3 py-[6px] text-gray-600 focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="text-[14px] px-4 py-[7px] bg-blue-800 text-white rounded-[25px] hover:bg-indigo-600 transition"
            >
              Search
            </button>
          </div>


          {isLoading && <Loader />}
          {error && <div className="text-red-600 border border-red-400 text-[16px] font-[600] mb-[25px] bg-red-50 px-[15px] rounded-md py-[5px] flex items-center">
            <MdErrorOutline className='mr-[8px]' />
            {error}
          </div>
          }
          {success &&
            <motion.div
              initial={{ scale: 0.7, opacity: 1, x: -500 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              className="text-green-600 border border-green-400 text-[16px] font-[600] mb-[25px] bg-green-50 px-[15px] rounded-md py-[5px] flex items-center">
              <IoCheckmarkDoneCircleSharp className='mr-[8px]' />
              {success}
            </motion.div>
          }

          {user ? (
            <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg border">
              <div className="flex items-center space-x-4">
                <img
                  src={`/Avatars/${user.avatar}.jpg`}
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="text-gray-800 font-semibold">{user.name}</p>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleAddUser}
                className="flex items-center space-x-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
              >
                <FaUserPlus />
                <span>Add User</span>
              </button>
            </div>
          ) :
            <div className='mx-auto flex flex-col items-center'>
              <div className='w-[240px] h-[240px]'>
                <img src="/Resources/7.png" alt='Connection Error' className='w-full h-full' />
              </div>
              <div className="text-center pl-[28px] text-gray-500 bg-white mt-[-45px] py-[15px] font-[600] text-[14px] ">Add a Team Member Now</div>
            </div>
          }
        </div>
      </section>

      <section className='lg:col-span-2 lg:px-[8px]'>
        {project.projectManager.status === 'Pending' ?
          <div className="px-[20px] py-[15px] mb-[25px] bg-white rounded-lg border-[2px]">
            <div className="flex items-center pb-[3px] text-blue-700 border-b-[2px] mb-[15px] mt-4">
              <MdOutlineAdminPanelSettings className="mr-2 text-[20px]" />
              <span className="font-medium  text-[15px]">
                Project Manager Member
              </span>
            </div>
            <div className='ml-[30px] text-[12px] bg-yellow-100 w-[214px] px-[15px] pt-[2px] pb-[4px] rounded-lg text-yellow-700 font-[600]'>Pending !! waiting for response ...</div>
          </div>
          :
          <div className="px-[20px] py-[15px] mb-[25px] bg-white rounded-lg border-[2px]">
            <div className="flex items-center pb-[3px] text-blue-700 border-b-[2px] mb-[15px] mt-4">
              <FaUsers className="mr-2 text-[23px]" />
              <span className="font-medium  text-[17px]">
                Project Manager
              </span>
            </div>
            <div
              className="flex items-center pl-3 border-b-[2px] border-gray-300 pb-[8px] rounded-lg"
            >
              <img
                src={`/Avatars/2.jpg`}
                alt={project.projectManager.name}
                className="w-[35px] h-[35px] border border-gray-400 rounded-full mr-4"
              />
              <div>
                <p className="text-[16px] font-semibold text-gray-800">{project.projectManager.name}</p>
                <p className="text-[12px] text-gray-600">{project.projectManager.email}</p>
              </div>
            </div>
          </div>
        }

        {/* Team Members Section */}
        <div className="px-[20px] py-[15px] mb-[25px] bg-white rounded-lg border-[2px]">
          <div className="flex items-center pb-[3px] text-blue-700 border-b-[2px] mb-[15px] mt-4">
            <FaUsers className="mr-2 text-[23px]" />
            <span className="font-medium  text-[17px]">
              Team Member
            </span>
          </div>
          {project.team.length > 0 ? (
            <div className="space-y-3">
              {project.team.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center pl-3 border-b-[2px] border-gray-300 pb-[8px] rounded-lg"
                >
                  <img
                    src={`/Avatars/${member.avatar}.jpg`}
                    alt={member.name}
                    className="w-[35px] h-[35px] border border-gray-400 rounded-full mr-4"
                  />
                  <div>
                    <p className="text-[16px] font-semibold text-gray-800">{member.name}</p>
                    <p className="text-[12px] text-gray-600">{member.email}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No team members available.</p>
          )}
        </div>

        {/* Tasks Section */}
        <div className="p-[20px] bg-white rounded-lg border">
          <div className="flex items-center text-blue-700 pb-[3px] border-b-[2px] mb-[15px] mt-4">
            <IoMdDoneAll className="mr-2 text-[23px]" />
            <span className="font-medium text-[17px]">
              Project Tasks
            </span>
          </div>
          {project.tasks.length > 0 ? (
            <div className="space-y-3">
              {project.tasks.map((task, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg shadow-sm border">
                  <p className="text-[15px] font-[600] text-gray-800 mb-[12px] pl-[5px] ">{task.title}</p>

                  <div className='w-full flex justify-between items-center'>
                    <p className={`text-[11px] rounded-2xl py-[2px] w-[65px] text-center font-semibold ${task.priority === 'High'
                      ? 'text-red-700 bg-red-100' : task.priority === 'Medium' ? 'text-yellow-700 border bg-yellow-100'
                        : 'text-green-700 bg-green-100'
                      }`}>
                      {task.priority}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className='mr-[3px] text-[10px] font-[600] text-red-700'>Due:</span> <span className="text-red-600 text-[12px] font-[600]">{new Date(task.dueDate).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tasks available.</p>
          )}
        </div>
      </section>

    </main>

  );
};

export default AdminProjectDetails;
/*

 <div className="xsx:ml-[265px] h-screen bg-gray-100 flex flex-col p-5"> 
      <div className="flex items-center bg-white text-white rounded-lg p-3 lg:p-6 border">
        <h2 className="text-[19px] md:text-3xl flex mb-[15px] text-blue-950 items-center font-bold">
          {project.name}
        </h2>
        <p className="text-[15px] text-blue-900 font-[600] lg:ml-[35px]">
          {project.description}
        </p>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
 
      <div className="bg-white mt-[28px] rounded-lg border p-8">
        <div className="flex items-center mb-6">
          <FaUserPlus className="text-indigo-600 text-3xl mr-3" />
          <h2 className="text-2xl font-semibold text-gray-800">Add Users to Project</h2>
        </div>
 
        <div className="flex items-center border-2 rounded-lg border-gray-300 mb-6">
          <FaSearch className="text-gray-400 text-xl ml-3" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter user email"
            className="w-full px-4 py-2 text-gray-600 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="ml-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
          >
            Search
          </button>
        </div>

        {isLoading && <Loader />}
        {user && (
          <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg border">
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar || '/default-avatar.png'}
                alt={user.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="text-gray-800 font-semibold">{user.name}</p>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleAddUser}
              className="flex items-center space-x-2 bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
            >
              <FaUserPlus />
              <span>Add User</span>
            </button>
          </div>
        )}
      </div>
    </div>

*/