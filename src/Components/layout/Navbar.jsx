import  { useState, useEffect } from 'react';
import axios from 'axios';

import { IoMenu } from "react-icons/io5";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdOutlineFolderShared, } from 'react-icons/md';
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";

import { FaCubes } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";

import { RxDashboard } from "react-icons/rx";
import { BsGraphUp } from "react-icons/bs";
import { GoPeople, GoProjectRoadmap } from "react-icons/go";
import { RiLogoutBoxRLine } from 'react-icons/ri';
import NotificationsModal from '../Notifications';
import { LuCopyMinus } from 'react-icons/lu';
import SearchProject from '../profile-modals/SearchProject';
import { useAuthContext } from '../../AuthProvider';

const colors = [
    'bg-red-400', 'bg-blue-400', 'bg-green-700', 'bg-yellow-600', 'bg-indigo-400', 'bg-orange-400', 'bg-cyan-400', 'bg-violet-400'
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const Navbar = ({ isExpanded, setIsExpanded, isDarkMode, toggleDarkMode }) => {
    const navigate = useNavigate();
    const { user, logout, notificationsCount } = useAuthContext();
    const [projectColors, setProjectColors] = useState({});
    const [projects, setProjects] = useState([]);

    const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    const handleNotificationModal = () => {
        setIsNotificationsModalOpen(!isNotificationsModalOpen);
    };

    const handleSearchModal = () => {
        setIsSearchModalOpen(!isSearchModalOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        const fetchJoinedProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_API_BASE_URL}/joinedprojects`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const fetchedProjects = response.data;

                const colorMapping = {};
                fetchedProjects.forEach(project => {
                    colorMapping[project._id] = getRandomColor();
                });

                setProjects(fetchedProjects);
                setProjectColors(colorMapping);
            } catch (error) {
                console.error(error);
            }
        };

        fetchJoinedProjects();
    }, []);


    const handleProjectClick = (projectId) => {
        navigate(`/joinedprojects/${projectId}`);
    };

    const sidebarVariants = {
        expanded: { width: 280 },
        collapsed: { width: 80 }
    };

    return (
        <nav className="relative">
            {isNotificationsModalOpen && <NotificationsModal isNotificationsModalOpen={isNotificationsModalOpen} setIsNotificationsModalOpen={setIsNotificationsModalOpen} />}
            {isSearchModalOpen && <SearchProject isSearchModalOpen={isSearchModalOpen} setIsSearchModalOpen={setIsSearchModalOpen} />}
            
            {/* Desktop Sidebar */}
            <motion.div 
                initial={isExpanded ? "expanded" : "collapsed"}
                animate={isExpanded ? "expanded" : "collapsed"}
                variants={sidebarVariants}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="hidden bg-[#fcfcfc] dark:bg-[#0d0d0d] fixed left-0 top-0 xsx:flex flex-col border-r border-gray-200 dark:border-gray-800/50 h-screen transition-colors duration-300 z-40"
            >
                {/* Floating Edge Toggle Button */}
                <button 
                    onClick={toggleSidebar}
                    className="absolute right-0 top-3 w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-orange-600 transition-all shadow-md z-50 group translate-x-1/2"
                >
                    <motion.div
                        animate={{ rotate: isExpanded ? 0 : 180 }}
                        className="flex items-center justify-center w-full h-full"
                    >
                        <svg width="20" height="20" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 9L4.5 6L7.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </motion.div>
                </button>

                <div className="flex flex-col h-full p-4 overflow-hidden">
                    {/* Top Section: Logo + Icons */}
                    <div className="flex items-center justify-between mb-6 px-1">
                        <div className="flex items-center gap-2">
                            <img src="/logo.svg" alt="Logo" className="w-8 h-8 min-w-[32px]" />
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="text-[19px] font-black text-gray-900 dark:text-gray-100 tracking-tight"
                                    >
                                        Collabor<span className='text-orange-600'>8</span>r
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                                                
                    </div>

<div className={`flex items-center justify-between gap-1 mb-3 ${!isExpanded && 'hidden'}`}>
                            {/* Dark Mode Toggle */}
                            <button 
                                onClick={toggleDarkMode} 
                                className="p-1.5 flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                                title="Toggle Dark Mode"
                            >
                                <AnimatePresence mode="wait">
                                    {isDarkMode ? (
                                        <motion.div key="sun" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
                                        </motion.div>
                                    ) : (
                                        <motion.div key="moon" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <span className='ml-2 text-[15px]'>Dark Mode</span>
                            </button>

                            <div>
                                <button onClick={handleNotificationModal} className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                            </button>
                            <button onClick={handleSearchModal} className="p-1.5 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            </button>
                            </div>
                        </div>

                    {/* Profile Section */}
                    <div className={`flex items-center p-2 rounded-xl bg-gray-200/80 dark:bg-gray-800/30 mb-8 border border-transparent dark:border-gray-800/50 ${!isExpanded ? "justify-center" : "px-3"}`}>
                        <div className="flex items-center w-full gap-3 overflow-hidden">
                            <img src={`/Avatars/${user.avatar}.jpg`} alt="Profile" className="w-8 h-8 min-w-[32px] rounded-lg object-cover ring-2 ring-white/10" />
                            {isExpanded && (
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user.name}</p>
                                    <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium ">{user.email}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation Items (Scrollable) */}
                    <div className="flex-1 overflow-y-auto pr-1 -mr-1 no-scrollbar space-y-1">
                        <NavLink to="/dashboard" className={({ isActive }) => `flex items-center p-2.5 rounded-lg transition-all duration-200 group ${isActive ? 'bg-orange-600/10 text-orange-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'} ${!isExpanded && "justify-center"}`} >
                            <RxDashboard size={20} className="min-w-[20px]" />
                            {isExpanded && <p className="ml-3 font-[500] text-[15px]">Dashboard</p>}
                        </NavLink>
                        <NavLink to="/overview" className={({ isActive }) => `flex items-center p-2.5 rounded-lg transition-all duration-200 group ${isActive ? 'bg-orange-600/10 text-orange-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'} ${!isExpanded && "justify-center"}`} >
                            <MdOutlineFolderShared size={20} className="min-w-[20px]" />
                            {isExpanded && <p className="ml-3 font-[500] text-[15px]">Overview</p>}
                        </NavLink>
                        <NavLink to="/workflow" className={({ isActive }) => `flex items-center p-2.5 rounded-lg transition-all duration-200 group ${isActive ? 'bg-orange-600/10 text-orange-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'} ${!isExpanded && "justify-center"}`} >
                            <BsGraphUp size={20} className="min-w-[20px]" />
                            {isExpanded && <p className="ml-3 font-[500] text-[15px]">Workflow</p>}
                        </NavLink>
                        <NavLink to="/joined-projects" className={({ isActive }) => `flex items-center p-2.5 rounded-lg transition-all duration-200 group ${isActive ? 'bg-orange-600/10 text-orange-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'} ${!isExpanded && "justify-center"}`} >
                            <FaCubes size={20} className="min-w-[20px]" />
                            {isExpanded && <p className="ml-3 font-[500] text-[15px]">Joined Projects</p>}
                        </NavLink>
                        <NavLink to="/manager-projects" className={({ isActive }) => `flex items-center p-2.5 rounded-lg transition-all duration-200 group ${isActive ? 'bg-orange-600/10 text-orange-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'} ${!isExpanded && "justify-center"}`} >
                            <GoPeople size={20} className="min-w-[20px]" />
                            {isExpanded && <p className="ml-3 font-[500] text-[15px]">Shared Workspaces</p>}
                        </NavLink>
                        <NavLink to="/admin-projects" className={({ isActive }) => `flex items-center p-2.5 rounded-lg transition-all duration-200 group ${isActive ? 'bg-orange-600/10 text-orange-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'} ${!isExpanded && "justify-center"}`} >
                            <LuCopyMinus size={20} className="min-w-[20px]" />
                            {isExpanded && <p className="ml-3 font-[500] text-[15px]">My Projects</p>}
                        </NavLink>

                        {/* Flat Project List (No Toggle) */}
                        {isExpanded && projects.length > 0 && (
                            <div className="pt-4 pb-2">
                                <p className="px-3 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Projects</p>
                                {projects.map((project) => (
                                    <div 
                                        key={project._id} 
                                        onClick={() => handleProjectClick(project._id)}
                                        className="flex items-center p-2 mx-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer group transition-all"
                                    >
                                        <div className={`w-5 h-5 text-[10px] flex items-center justify-center text-white font-bold rounded-md ${projectColors[project._id] || 'bg-gray-400'} shadow-sm flex-shrink-0`}>
                                            {project.name.charAt(0)}
                                        </div>
                                        <p className="ml-3 text-[14px] font-medium text-gray-500 dark:text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 truncate">
                                            {project.name}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer Section (Fixed at bottom) */}
                    <div className="mt-auto pt-4 space-y-1">
                       
                         
                        {/* User Bottom Nav (Match Expo Style) */}
                        <div className={`border-t border-gray-100 dark:border-gray-800/50 mt-4 ${!isExpanded && "justify-center"}`}>
                           <button 
                            onClick={handleLogout}
                            className={`flex items-center w-full p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all ${!isExpanded && "justify-center"}`}
                        >
                            <RiLogoutBoxRLine size={20} className="min-w-[20px]" />
                            {isExpanded && <span className="ml-3 font-bold text-[15px]">Sign Out</span>}
                        </button>
                             </div>
                    </div>
                </div>
            </motion.div>
        </nav>
    );
};
export default Navbar; 