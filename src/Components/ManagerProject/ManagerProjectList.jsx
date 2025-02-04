import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPeopleRoof } from 'react-icons/fa6';

import { GrTask, } from 'react-icons/gr';
import { RiAdminLine, RiTeamLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

const colors = [
    'bg-red-400', 'bg-blue-400', 'bg-green-700', 'bg-yellow-600', 'bg-indigo-400', 'bg-orange-400', 'bg-cyan-400', 'bg-violet-400'
];
const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const ManagerProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAsManagerProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/joinedprojects/as-manager`, {
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

        fetchAsManagerProjects();
    }, []);

    // Render conditional components
    return (
        <div className='xsx:ml-[265px] bg-white flex flex-col p-5'>

            <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center">
                <div className="flex items-center space-x-2">
                    <FaPeopleRoof className="text-2xl text-gray-600" />
                    <h2 className="text-[24px] text-gray-600 font-bold">Projects to Manage</h2>
                </div>
            </div>
            <p className='mt-[2px] text-[13px] lg:ml-[35px] mb-[15px] font-[500] text-gray-500'>
                View all of the projects associated with your account
            </p>

            <div className='h-[3px] mb-[15px] w-full bg-gray-300 '></div>


            {projects.length === 0 &&
                <div className='flex flex-col mx-auto'>
                    <img src="/Resources/6.png" alt='Connection Error' className='scale-[1] md:scale-[1.1] mix-blend-multiply mt-[215px] md:mt-[145px]' />
                    <p className="text-center md:mt-[25px] text-gray-500 font-[600] text-[11px] md:text-[14px]">You haven't been invited</p>
                    <p className="text-center text-gray-500 font-[600] text-[11px] md:text-[14px]">in any Projects Yet.</p>
                </div>
            }

            {error ? (
                <div className='p-4 bg-red-100 text-red-600 border border-red-300 rounded-md'>
                    {error} No projects found.
                </div>
            ) : (
                <div className="w-full mb-[25px] grid grid-cols-1 lg:grid-cols-2 xlx:grid-cols-3 gap-x-3 gap-y-3">
                    {projects.map((project) => (
                        <div key={project._id} className="w-full xlx:w-[380px] mt-[15px] h-[190px] bg-white overflow-hidden border-[2px] border-[#e5e4e4] shadow-md rounded-[15px]">

                            <div className="relative w-full h-[75px] overflow-hidden bg-yellow-300">
                                <div className="absolute inset-0 w-full flex pt-3 items-center space-x-2 pb-[8px]">
                                    <img src={`/Themes/${project.theme}.jpg`} alt="" className="h-[100px] scale-x-[-1] w-full object-cover" />
                                </div>

                                <Link to={`/tasks/${project._id}`} className="absolute h-[75px] pr-[12px] inset-0 w-full flex justify-end items-center text-[14px] md:text-[17px] text-white bg-black bg-opacity-30 z-10">
                                {project.name.length > 20 ? project.name.slice(0,20)+" ..." : project.name}
                                </Link>
                            </div>

                            <Link to={`/tasks/${project._id}`} className='flex flex-col'>
                                <div className='mr-auto ml-[40px] mt-[-45px] xl:mt-[-30px] mb-[-20px] z-50 rounded-full overflow-hidden'>
                                    <img src={`/Avatars/${project.createdBy.avatar}.jpg`} alt="" className="h-[85px] w-[85px]" />
                                </div>
                                <div className='ml-auto mt-[-12px] mr-[58px]'>
                                    <div className='flex items-center space-x-2'>
                                        <RiAdminLine className='text-blue-800 mb-[2px]' />
                                        <p className='text-[12px] font-[600] text-gray-500'>Admin:</p>
                                        <p className='font-[600] text-[14px] text-blue-700'>{project.createdBy.name}</p>
                                    </div>
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
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
};
export default ManagerProjectList