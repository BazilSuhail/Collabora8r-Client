import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreateProject from './CreateProject';
import { FiClipboard, FiFolder, FiSettings } from 'react-icons/fi';
import { AiOutlinePlus } from 'react-icons/ai';
import { GrChapterAdd, GrTask, } from 'react-icons/gr';
import { RiTeamLine } from 'react-icons/ri';
import { PiGraphDuotone } from 'react-icons/pi';
import { MdOutlineManageAccounts } from 'react-icons/md';

const colors = [
  'bg-red-400', 'bg-blue-400', 'bg-green-700', 'bg-yellow-600', 'bg-indigo-400', 'bg-orange-400', 'bg-cyan-400', 'bg-violet-400'
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const AdminProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // Track the active dropdown
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/admin-projects/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data)
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
    setActiveDropdown(null);
    navigate(`/tasks/${projectId}`);
  };

  const handleProjectClick = (projectId) => {
    setActiveDropdown(null);
    navigate(`/projects/${projectId}`);
  };


  return (
    <div className='xsx:ml-[265px] h-full pb-[250px] bg-gray-50 flex flex-col p-5'>

      {showModal && <CreateProject setShowModal={setShowModal} />}
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center">
        <div className="flex items-center space-x-2">
          <FiFolder className="text-2xl text-gray-600" />
          <h2 className="text-[24px] text-gray-600 font-bold">Created Projects</h2>
        </div>
      </div>
      <p className='mt-[2px] text-[13px] lg:ml-[35px] mb-[15px] font-[500] text-gray-500' >List of All projects Adminstrated By you</p>
      <div className='h-[2px] bg-gray-300 w-full rounded-2xl mb-[6px]'></div>

      {(error && !projects.length) ? (
        <div className='p-4 bg-red-100 text-red-600 border border-red-300 rounded-md'>
          {error} No projects found.
        </div>
      ) : (
        <div className="w-full mb-[25px] grid grid-cols-1 lg:grid-cols-2 xlx:grid-cols-3 gap-x-3 gap-y-3">
          <div onClick={() => setShowModal(true)} className='hidden w-full xlx:w-[380px] h-[300px] border-[2px] border-gray-300 lg:flex flex-col justify-center items-center mt-[15px] bg-gray-50 hover:bg-gray-200 rounded-[15px]'>
            <AiOutlinePlus className="mr-2 text-[65px] text-gray-300 hover:text-blue-700 rounded-full" />
            <span className='text-[11px] ml-[-6px] font-[700] mt-[px] text-gray-400'>Create a new</span>
            <span className='text-[11px] ml-[-4px] font-[700] mt-[-2px] text-gray-400'>Project</span>
          </div>

          <div onClick={() => setShowModal(true)} className='lg:hidden w-full xlx:w-[380px] py-[10px] flex items-center mt-[15px] bg-gradient-to-r from-blue-100 to-cyan-300 border-[2px]  border-blue-300 hover:bg-blue-50 rounded-[5px]'>
            <GrChapterAdd className="ml-[15px] text-[18px] mt-[2px] text-blue-700" />
            <span className='text-[15px] ml-[8px] font-[600] mt-[px] text-blue-700'>Create a new Project</span>
          </div>

          {projects.map((project) => (
            <div key={project._id} className="w-full xlx:w-[380px] mt-[15px] h-[300px] bg-white overflow-hidden border rounded-[15px]">

              <div className='flex px-4 pt-3 bg-blue-900 items-center md:mb-0 mb-[15px] space-x-2 pb-[8px] border-b-[2px] border-blue-700 '>
                <div className={`w-[32px] h-[32px] md:w-[38px] md:h-[38px] rounded-full flex items-center justify-center text-[20px] ${project.color} text-blue-50`}>
                  <span className='mt-[-4px]'>{project.name.charAt(0)}</span>
                </div>
                <div className='flex w-[85%] pb-[4px] justify-between items-center'>
                  <div className='font-[600] text-[15px] md:text-[20px] text-blue-50'><p>{project.name}</p></div>
                  <p className='bg-green-800 text-green-300  px-[12px] py-[2px] rounded-[15px] mr-[5px] text-[12px] hover:text-blue-300 '>
                    Active
                  </p>
                </div>
              </div>

              <div className='ml-[53px] md:mt-[15px]'>
                <div className='flex items-center space-x-2'>
                  <GrTask className='text-blue-800 mt-[2px]' />
                  <p className='text-[14px] font-[600] text-gray-500 '>Team:</p>
                  <p className='font-[600] text-[14px] text-b;ue-700'>{project.team.length}</p>
                </div>

                <div className='flex items-center mt-[5px] space-x-2'>
                  <RiTeamLine className='text-blue-800 mt-[2px]' />
                  <p className='text-[13px] font-[600] text-gray-500 '>Tasks:</p>
                  <p className='font-[600] text-[14px] text-blue-800'>{project.tasks.length}</p>
                </div>

                <div className='flex items-center mt-[5px] space-x-2'>
                  <MdOutlineManageAccounts className='text-blue-800 mt-[2px]' />
                  <p className='text-[13px] font-[600] text-gray-500 '> {project.projectManager.status === 'Pending' && 'Requested'} Manager:</p>
                  <p className='font-[600] text-[14px] text-blue-800'>
                    {project.projectManager.status === 'Pending' ? <p className='text-[11px] font-[700] text-yellow-600 underline'>
                      {project.projectManager.email}
                    </p> : <p>
                    </p>}
                  </p>
                </div>

                <div className='h-[2px] bg-gray-200 rounded-xl w-[280px] my-[12px]'></div>
                <button onClick={() => handleProjectClick(project._id)} className='flex hover:underline items-center mt-[5px] space-x-2'>
                  <FiSettings className='text-blue-800 mt-[2px]' />
                  <p className='font-[700] text-[14px] text-blue-800'>Manage Project</p>
                </button>

                <button onClick={() => handleTaskManagement(project._id)} className='flex hover:underline items-center mt-[5px] space-x-2'>
                  <FiClipboard className='text-blue-800 mt-[2px]' />
                  <p className='font-[700] text-[14px] text-blue-800'>Manage Project Tasks</p>
                </button>
              </div>

              <div className='flex items-center mx-[25px] justify-center py-[8px] rounded-[7px] mt-[22px] bg-gray-50 border-[2px] border-gray-200'>
                <PiGraphDuotone className='text-red-600 text-[22px] spin-slow mr-[8px]' />
                {project.projectManager.status === 'Pending' ? <p className='text-[14px] font-[700] text-blue-800'>
                  Assign A Manager
                </p> : <p>
                </p>}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default AdminProjectList;
