import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPeopleRoof } from 'react-icons/fa6';
import { GrTask } from 'react-icons/gr';
import { RiAdminLine, RiTeamLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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

                setProjects(response.data);
            } catch (err) {
                console.error(err);
                setError('Failed to synchronize managerial sectors.');
            }
        };

        fetchAsManagerProjects();
    }, []);

    return (
        <div className='min-h-screen bg-[#fcfaf8] dark:bg-[#000000] flex flex-col p-6 transition-colors duration-300'>
            <div className="max-w-[1400px] mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className='w-12 h-12 bg-orange-100 dark:bg-orange-500/10 rounded-xl flex items-center justify-center text-xl text-orange-600 shadow-sm'>
                            <FaPeopleRoof />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white tracking-tighter">Command Center</h2>
                            <p className='text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest opacity-60'>Operational sectors under your jurisdiction</p>
                        </div>
                    </div>
                </div>

                <div className='h-0.75 bg-gray-200 dark:bg-[#2a2828] w-full mb-10'></div>

                {projects.length === 0 ? (
                    <div className='flex flex-col items-center justify-center py-20 bg-white dark:bg-[#0a0a0a] rounded-xl border border-dashed border-gray-200 dark:border-[#1a1a1a] shadow-sm'>
                        <div className="relative mb-8">
                           <div className="absolute inset-0 bg-orange-500/10 blur-3xl rounded-full" />
                           <img src="/Resources/6.png" alt='No projects' className='w-64 grayscale opacity-40 dark:invert brightness-0' />
                        </div>
                        <p className="text-lg font-black text-gray-800 dark:text-white mb-2 uppercase tracking-widest">Authority Void</p>
                        <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs font-medium">You haven't been appointed as a lead for any sectors yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <motion.div 
                                key={project._id}
                                whileHover={{ y: -8 }}
                                className="group bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-[#1a1a1a] rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-70"
                            >
                                <div className="relative h-32 overflow-hidden">
                                    <img 
                                        src={`/themes/${project.theme || 1}.jpg`} 
                                        alt="" 
                                        className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-[1.5s] grayscale-[0.5] group-hover:grayscale-0" 
                                    />
                                    <div className="absolute inset-0 bg-linear-to-l from-black/80 via-black/40 to-transparent flex items-center justify-end pl-10 pr-2">
                                        <Link to={`/manager-tasks/${project._id}`} className="font-black text-white text-lg tracking-tight hover:text-orange-500 transition-colors uppercase">
                                            {project.name.length > 20 ? project.name.slice(0, 20) + "..." : project.name}
                                        </Link>
                                    </div>
                                </div>

                                <div className="px-8 py-8 flex-1 flex relative">
                                    <div className="absolute -top-12 left-4 z-10 transition-transform duration-500 group-hover:-translate-y-2">
                                        <img 
                                            src={`/avatars/${project.createdBy.avatar || 1}.jpg`} 
                                            alt="" 
                                            className="w-20 h-20 rounded-full border-4 border-white dark:border-[#0a0a0a] shadow-2xl" 
                                        />
                                    </div>

                                    <div className="ml-24 flex-1 space-y-3">
                                        <div className='flex items-center gap-3'>
                                            <RiAdminLine className='text-orange-600' />
                                            <span className='text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest'>Admin:</span>
                                            <span className='ml-auto font-bold text-gray-800 dark:text-gray-200 text-sm'>{project.createdBy.name}</span>
                                        </div>

                                        <div className='flex items-center gap-3'>
                                            <GrTask className='text-orange-600' />
                                            <span className='text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest'>Squad:</span>
                                            <span className='ml-auto font-bold text-gray-800 dark:text-gray-200 text-sm'>
                                                {project.teamCount} <span className="text-[10px] opacity-60">UNITS</span>
                                            </span>
                                        </div>

                                        <div className='flex items-center gap-3 pt-2 border-t border-gray-50 dark:border-[#1a1a1a]'>
                                            <RiTeamLine className='text-orange-600' />
                                            <span className='text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest'>Directives:</span>
                                            <span className='ml-auto font-bold text-gray-800 dark:text-gray-200 text-sm'>
                                                {project.taskCount} <span className="text-[10px] opacity-60">ACTIVE</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Link to={`/manager-tasks/${project._id}`} className="w-full py-4 text-center bg-gray-50 dark:bg-[#151515] hover:bg-orange-600 hover:text-white text-[10px] font-black uppercase tracking-[3px] transition-all border-t border-gray-100 dark:border-[#1a1a1a]">
                                    Assume Command &rarr;
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
};

export default ManagerProjectList;