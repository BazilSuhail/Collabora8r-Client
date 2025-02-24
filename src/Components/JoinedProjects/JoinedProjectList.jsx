import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPeopleRoof } from 'react-icons/fa6';
import { FaEye } from 'react-icons/fa';
import TasksTimeline from './TasksTimeline';

import { GrChapterAdd, GrTask, } from 'react-icons/gr';
import { RiTeamLine } from 'react-icons/ri';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { Link } from 'react-router-dom';

const colors = [
  'bg-red-400', 'bg-blue-400', 'bg-green-700', 'bg-yellow-600', 'bg-indigo-400', 'bg-orange-400', 'bg-cyan-400', 'bg-violet-400'
];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const JoinedProjectList = () => {
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
      <p className='mt-[2px] text-[13px] lg:ml-[35px] mb-[15px] font-[500] text-gray-500'>
        View all of the projects associated with your account
      </p>

      <div className='h-[3px] mb-[15px] w-full bg-gray-300 '></div>


      {projects.length === 0 &&
        <div className='flex flex-col mx-auto'>
          <img src="/Resources/5.png" alt='Connection Error' className='scale-[1.1] md:scale-[1.5] mix-blend-multiply mt-[215px] md:mt-[145px]' />
          <p className="text-center md:mt-[35px] text-gray-500 font-[600] text-[11px] md:text-[14px]">You haven't Joined Any Projects Yet.</p>
        </div>
      }

      {(error && projects.length) ? (
        <div className='p-4 bg-red-100 text-red-600 border border-red-300 rounded-md'>
          {error} No projects found.
        </div>
      ) : (
        <div className="w-full mb-[25px] grid grid-cols-1 lg:grid-cols-2 xlx:grid-cols-3 gap-x-3 gap-y-3">
          {projects.map((project) => (
            <div key={project._id} className="w-full xlx:w-[380px] mt-[15px] h-[275px] bg-white overflow-hidden border-[2px] border-[#e5e4e4] shadow-md rounded-[15px]">

              <div className="relative w-full h-[140px] overflow-hidden bg-yellow-300">
                <div className="absolute inset-0 w-full flex pt-3 items-center space-x-2 pb-[8px]">
                  <img src={`/Themes/${project.theme}.jpg`} alt="" className="h-[140px] w-full object-cover" />
                </div>

                <div className="absolute h-[140px] inset-0 w-full flex items-center justify-between px-[18px] space-x-2 bg-black bg-opacity-30 z-10">

                  <Link to={`/joinedprojects/${project._id}`}>
                    <p className="font-[600] ml-[8px] text-[15px] md:text-[20px] text-white">                      
                      {project.name.length > 18 ? project.name.slice(0,18)+" ..." : project.name}
                    </p>
                    <p className="font-[600] ml-[8px] text-[13px] md:text-[13px] text-white">
                      {project.createdBy.name}
                    </p>
                  </Link>

                  <button onClick={() => handleProjectClick(project._id)} className='flex hover:underline mr-[10px] items-center mt-[5px] space-x-2'>
                    <FaEye className='text-white text-[25px]' />
                  </button>
                </div>
              </div>

              <Link to={`/joinedprojects/${project._id}`} className='flex flex-col'>
                <div className='ml-auto mr-[45px] xl:mr-[56px] mt-[-45px] xl:mt-[-40px] mb-[-20px] z-[500] rounded-full overflow-hidden'>
                  <img src={`/Avatars/${project.createdBy.avatar}.jpg`} alt="" className="h-[95px] w-[95px] xl:h-[80px] xl:w-[80px]" />
                </div>
                <div className='pl-[25px] md:mt-[15px]'>
                  <div className='flex items-center space-x-2'>
                    <GrTask className='text-blue-800 mt-[2px]' />
                    <p className='text-[13px] font-[600] text-gray-500'>Team:</p>
                    <p className='font-[600] text-[14px] text-blue-700'>{project.teamCount} <span className='text-[12px]'>{project.teamCount === 1 ? 'member' : 'members'}</span></p>
                  </div>

                  <div className='flex items-center mt-[5px] space-x-2'>
                    <RiTeamLine className='text-blue-800 mt-[2px]' />
                    <p className='text-[13px] font-[600] text-gray-500'>Tasks:</p>
                    <p className='font-[600] text-[14px] text-blue-800'>{project.taskCount}  <span className='text-[12px]'>{project.teamCount === 1 ? 'task' : 'tasks'}</span></p>
                  </div>

                  <div className='flex items-center mt-[5px] space-x-2'>
                    <MdOutlineManageAccounts className='text-blue-800 mt-[2px]' />
                    <p className='text-[13px] font-[600] text-gray-500'>
                      {project.projectManager.status === 'Pending' && 'Requested'} Manager:
                    </p>
                    <p className='font-[600] text-[11px] text-blue-500'>
                      {project.projectManager.status === 'Pending' ?
                        <span className=' pb-[1px] bg-blue-100 px-[15px] rounded-lg'>No manager assigned</span> :
                        <span className='text-[11px] font-[700] text-yellow-600 underline'>{project.projectManager.email}</span>
                      }
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className='w-full overflow-x-auto'>
        {selectedProjectId && (
          <>
            <div className='h-[4px] rounded-lg w-full my-[35px]'></div>
            <TasksTimeline projectId={selectedProjectId} />
          </>
        )}
      </div>
    </div>
  )
};
export default JoinedProjectList