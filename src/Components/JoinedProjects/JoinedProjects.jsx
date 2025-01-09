import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPeopleRoof } from 'react-icons/fa6';
import { FaEye } from 'react-icons/fa';
import TasksTimeline from '../TasksTimeline';

import { GrChapterAdd, GrTask, } from 'react-icons/gr';
import { RiTeamLine } from 'react-icons/ri';
import { MdOutlineManageAccounts } from 'react-icons/md';

const colors = [
  'bg-red-400', 'bg-blue-400', 'bg-green-700', 'bg-yellow-600', 'bg-indigo-400', 'bg-orange-400', 'bg-cyan-400', 'bg-violet-400'
];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const JoinedProjects = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  useEffect(() => {
    const fetchJoinedProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/joinedprojects`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const updatedProjects = response.data.map((project) => ({
          ...project,
          color: getRandomColor(),
        }));

        setProjects(updatedProjects);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch projects.');
      }
    };

    fetchJoinedProjects();
  }, []);

  const handleProjectClick = (projectId) => {
    setSelectedProjectId(projectId); // Update selected project ID
  };

  // Render conditional components
  return (
    <div className='xsx:ml-[265px] bg-white flex flex-col p-5'>

      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center">
        <div className="flex items-center space-x-2">
          <FaPeopleRoof className="text-2xl text-gray-600" />
          <h2 className="text-[24px] text-gray-600 font-bold">Joined Projects</h2>
        </div>
      </div>
      <p className='mt-[2px] text-[13px] lg:ml-[35px] mb-[15px] font-[500] text-gray-500' >View all of the projects associated with your account</p>

      {(error && !projects.length) ? (
        <div className='p-4 bg-red-100 text-red-600 border border-red-300 rounded-md'>
          {error} No projects found.
        </div>
      ) : (
        <div className="w-full mb-[25px] grid grid-cols-1 lg:grid-cols-2 xlx:grid-cols-3 gap-x-3 gap-y-3">
          {projects.map((project) => (
            <div key={project._id} className="w-full xlx:w-[380px] mt-[15px] h-[210px] bg-white overflow-hidden border rounded-[15px]">

              <div className='flex px-4 pt-3 bg-blue-100 items-center md:mb-0 mb-[15px] space-x-2 pb-[8px]'>
                <div className={`w-[32px] h-[32px] md:w-[38px] md:h-[38px] rounded-full flex items-center justify-center text-[20px] ${project.color} text-blue-50`}>
                  <span className='mt-[-4px]'>{project.name.charAt(0)}</span>
                </div>
                <div className='flex w-[85%] pb-[4px] justify-between items-center'>
                  <div className='font-[600] text-[15px] md:text-[20px] text-blue-600'><p>{project.name}</p></div>
                  <p className='bg-green-100 text-green-600  px-[12px] py-[1px] rounded-[15px] mr-[5px] text-[12px] hover:text-green-800 '>
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
                  <FaEye className='text-blue-800 mt-[2px]' />
                  <p className='font-[700] text-[14px] text-blue-800'>See Details</p>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className='w-full overflow-x-auto'>
        {selectedProjectId && <>
          <div className='h-[4px] rounded-lg bg-gray-300 w-full my-[35px]'></div>
          <TasksTimeline projectId={selectedProjectId} />
        </>}
      </div>
    </div>
  );
};

export default JoinedProjects;
