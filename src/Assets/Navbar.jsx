import  { useState, useEffect } from 'react';
import axios from 'axios';

import { IoMenu, IoClose } from "react-icons/io5";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdOutlineFolderShared, } from 'react-icons/md';
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";


import { FaBell, FaCubes } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";

import { RxDashboard } from "react-icons/rx";
import { BsGraphUp } from "react-icons/bs";
import { GoPeople, GoProjectRoadmap } from "react-icons/go";
import { RiLogoutBoxRLine } from 'react-icons/ri';
import NotificationsModal from '../components/Profile/Notifications';
import { LuCopyMinus } from 'react-icons/lu';
import SearchProject from './ProfileModals/SearchProject';
import { useAuthContext } from '../AuthProvider';

const colors = [
    'bg-red-400', 'bg-blue-400', 'bg-green-700', 'bg-yellow-600', 'bg-indigo-400', 'bg-orange-400', 'bg-cyan-400', 'bg-violet-400'
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const Navbar = ({ isExpanded, setIsExpanded, isDarkMode, toggleDarkMode }) => {
    const navigate = useNavigate();
    const { user, logout, notificationsCount } = useAuthContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [projectColors, setProjectColors] = useState({});
    const [projects, setProjects] = useState([]);

    const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    const handleNotificationModal = () => {
        setIsNotificationsModalOpen(!isNotificationsModalOpen);
    };

    const handleSearchModal = () => {
        setIsSearchModalOpen(!isSearchModalOpen);
        setIsMenuOpen(false);
    };

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const [isArrowOpen, setisArrowOpen] = useState(true);
    const toggleOpen = () => setisArrowOpen(!isArrowOpen);

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
        <nav>
            {isNotificationsModalOpen && <NotificationsModal isNotificationsModalOpen={isNotificationsModalOpen} setIsNotificationsModalOpen={setIsNotificationsModalOpen} />}
            {isSearchModalOpen && <SearchProject isSearchModalOpen={isSearchModalOpen} setIsSearchModalOpen={setIsSearchModalOpen} />}
            
            {/* Desktop Sidebar */}
            <motion.div 
                initial={isExpanded ? "expanded" : "collapsed"}
                animate={isExpanded ? "expanded" : "collapsed"}
                variants={sidebarVariants}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="hidden bg-white dark:bg-[#0a0a0a] overflow-y-auto no-scrollbar fixed left-0 top-0 xsx:flex flex-col shadow-xl border-r border-gray-200 dark:border-[#1a1a1a] h-screen p-4 transition-colors duration-300"
            >
                <div className="flex flex-col h-full">
                    {/* Header/Toggle Section */}
                    <div className="flex items-center justify-between mb-8 overflow-hidden">
                        <div className="flex items-center">
                            <motion.div
                                animate={{ rotate: isExpanded ? 0 : 360 }}
                                transition={{ duration: 0.5 }}
                            >
                                <img src="/logo.svg" alt="Logo" className="w-8 h-8 min-w-[32px]" />
                            </motion.div>
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="text-[19px] font-bold text-[#575757] dark:text-white ml-3 whitespace-nowrap"
                                    >
                                        Collabora<span className='text-orange-600'>8</span>r
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <button 
                            onClick={toggleSidebar}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-[#1a1a1a] rounded-lg transition-colors text-gray-500"
                        >
                            <IoMenu size={20} />
                        </button>
                    </div>

                    {/* Search Section */}
                    <div onClick={handleSearchModal} className={`flex cursor-pointer items-center p-2 mb-6 border border-gray-100 dark:border-[#1a1a1a] bg-gray-50 dark:bg-[#000000] rounded-xl hover:border-orange-500/50 transition-all ${!isExpanded && "justify-center"}`}>
                        <IoMdSearch className="text-[#8c8c8c] text-[24px] min-w-[24px]" />
                        {isExpanded && <div className="text-[15px] font-medium text-[#7f7f7f] ml-3">Search</div>}
                    </div>

                    {/* Navigation Items */}
                    <div className="space-y-1 overflow-hidden">
                        <NavLink to="/dashboard" className={({ isActive }) => `flex items-center p-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-orange-600 shadow-lg shadow-orange-600/20 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-[#1a1a1a] hover:text-orange-600'} ${!isExpanded && "justify-center"}`} >
                            <RxDashboard className="text-[22px] min-w-[22px]" />
                            {isExpanded && <p className="ml-3 font-semibold text-[15px]">Dashboard</p>}
                        </NavLink>
                        <NavLink to="/overview" className={({ isActive }) => `flex items-center p-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-orange-600 shadow-lg shadow-orange-600/20 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-[#1a1a1a] hover:text-orange-600'} ${!isExpanded && "justify-center"}`} >
                            <MdOutlineFolderShared className="text-[22px] min-w-[22px]" />
                            {isExpanded && <p className="ml-3 font-semibold text-[15px]">Overview</p>}
                        </NavLink>
                        <NavLink to="/workflow" className={({ isActive }) => `flex items-center p-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-orange-600 shadow-lg shadow-orange-600/20 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-[#1a1a1a] hover:text-orange-600'} ${!isExpanded && "justify-center"}`} >
                            <BsGraphUp className="text-[22px] min-w-[22px]" />
                            {isExpanded && <p className="ml-3 font-semibold text-[15px]">Workflow</p>}
                        </NavLink>
                        <NavLink to="/joined-projects/" className={({ isActive }) => `flex items-center p-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-orange-600 shadow-lg shadow-orange-600/20 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-[#1a1a1a] hover:text-orange-600'} ${!isExpanded && "justify-center"}`} >
                            <FaCubes className="text-[22px] min-w-[22px]" />
                            {isExpanded && <p className="ml-3 font-semibold text-[15px]">Joined Projects</p>}
                        </NavLink>
                        <NavLink to="/manager-projects" className={({ isActive }) => `flex items-center p-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-orange-600 shadow-lg shadow-orange-600/20 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-[#1a1a1a] hover:text-orange-600'} ${!isExpanded && "justify-center"}`} >
                            <GoPeople className="text-[22px] min-w-[22px]" />
                            {isExpanded && <p className="ml-3 font-semibold text-[15px]">Shared Workspaces</p>}
                        </NavLink>
                        <NavLink to="/associated-projects" className={({ isActive }) => `flex items-center p-3 rounded-xl transition-all duration-200 ${isActive ? 'bg-orange-600 shadow-lg shadow-orange-600/20 text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-[#1a1a1a] hover:text-orange-600'} ${!isExpanded && "justify-center"}`} >
                            <LuCopyMinus className="text-[22px] min-w-[22px]" />
                            {isExpanded && <p className="ml-3 font-semibold text-[15px]">My Projects</p>}
                        </NavLink>
                    </div>

                    {/* Projects Section */}
                    {projects.length > 0 && isExpanded && (
                        <div className="mt-8">
                            <div 
                                className="flex items-center justify-between px-3 cursor-pointer text-gray-400 hover:text-orange-600 transition-colors"
                                onClick={toggleOpen}
                            >
                                <div className="flex items-center">
                                    <GoProjectRoadmap size={20} />
                                    <span className="ml-3 font-bold text-xs uppercase tracking-wider">Projects</span>
                                </div>
                                {isArrowOpen ? <MdKeyboardArrowDown /> : <MdKeyboardArrowUp />}
                            </div>
                            
                            <motion.div
                                initial={false}
                                animate={{ height: isArrowOpen ? 'auto' : 0, opacity: isArrowOpen ? 1 : 0 }}
                                className="overflow-hidden mt-4 space-y-1"
                            >
                                {projects.map((project) => (
                                    <div 
                                        key={project._id} 
                                        onClick={() => handleProjectClick(project._id)}
                                        className="flex items-center p-2 mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-[#1a1a1a] cursor-pointer group transition-all"
                                    >
                                        <div className={`w-8 h-8 text-[12px] flex items-center justify-center text-white font-bold rounded-lg ${projectColors[project._id]} shadow-sm`}>
                                            {project.name.charAt(0)}
                                        </div>
                                        <p className="ml-3 text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-orange-600 truncate">
                                            {project.name}
                                        </p>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    )}

                    {/* Footer Section */}
                    <div className="mt-auto pt-8 border-t border-gray-200 dark:border-[#1a1a1a]">
                        <div className={`flex items-center p-3 rounded-xl bg-gray-50 dark:bg-[#000000] border border-gray-100 dark:border-[#1a1a1a] ${!isExpanded && "justify-center"}`}>
                            <div className="flex items-center w-full overflow-hidden">
                                <img src={`/Avatars/${user.avatar}.jpg`} alt="Profile" className="w-8 h-8 min-w-[32px] rounded-lg object-cover" />
                                {isExpanded && (
                                    <div className="ml-3 overflow-hidden">
                                        <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{user.name}</p>
                                        <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button 
                            onClick={toggleDarkMode}
                            className={`flex items-center w-full p-3 mt-4 transition-all rounded-xl ${
                                isDarkMode 
                                    ? 'text-orange-500 hover:bg-orange-950/20' 
                                    : 'text-gray-600 hover:bg-gray-100'
                            } ${!isExpanded && "justify-center"}`}
                            title={isDarkMode ? "Active Theme: Jet-Black" : "Active Theme: Light"}
                        >
                            <AnimatePresence mode="wait">
                                {isDarkMode ? (
                                    <motion.div
                                        key="sun"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        className="min-w-[22px]"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                                        </svg>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="moon"
                                        initial={{ rotate: -90, opacity: 0 }}
                                        animate={{ rotate: 0, opacity: 1 }}
                                        exit={{ rotate: 90, opacity: 0 }}
                                        className="min-w-[22px]"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                        </svg>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            {isExpanded && (
                                <span className="ml-3 font-semibold text-[15px]">
                                    {isDarkMode ? "Light Protocol" : "Deep Space Mode"}
                                </span>
                            )}
                        </button>
                        <button 
                            onClick={handleLogout}
                            className={`flex items-center w-full p-3 mt-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all ${!isExpanded && "justify-center"}`}
                        >
                            <RiLogoutBoxRLine size={22} className="min-w-[22px]" />
                            {isExpanded && <span className="ml-3 font-semibold text-[15px]">Sign Out</span>}
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Mobile Header (Same colors as requested) */}
            <div className="xsx:hidden fixed top-0 left-0 right-0 z-[1000] bg-white dark:bg-[#000000] border-b border-gray-200 dark:border-[#1a1a1a] px-4 h-16 flex items-center justify-between transition-colors">
                <div className="flex items-center">
                    <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
                    <span className="ml-2 text-xl font-bold text-gray-800 dark:text-white">Collabora<span className="text-orange-600">8</span>r</span>
                </div>
                <div className="flex items-center space-x-1.5">
                    <button 
                        onClick={toggleDarkMode}
                        className="p-2 text-gray-400 hover:text-orange-600 transition-colors"
                    >
                        {isDarkMode ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>}
                    </button>
                    <div onClick={handleNotificationModal} className="relative cursor-pointer text-gray-500 p-2">
                        <FaBell size={22} />
                        {notificationsCount > 0 && (
                            <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-[#000000]">
                                {notificationsCount}
                            </span>
                        )}
                    </div>
                    <button onClick={handleMenuToggle} className="text-gray-500 p-2">
                        {isMenuOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[999] bg-white dark:bg-[#000000] p-6 xsx:hidden flex flex-col"
                    >
                        <div className="mt-16 space-y-4">
                            <NavLink onClick={handleMenuToggle} to="/dashboard" className="flex items-center p-4 rounded-2xl bg-gray-50 dark:bg-[#0a0a0a] text-gray-800 dark:text-white font-bold">
                                <RxDashboard size={24} className="mr-4" /> Dashboard
                            </NavLink>
                            <NavLink onClick={handleMenuToggle} to="/overview" className="flex items-center p-4 rounded-2xl bg-gray-50 dark:bg-[#0a0a0a] text-gray-800 dark:text-white font-bold">
                                <MdOutlineFolderShared size={24} className="mr-4" /> Overview
                            </NavLink>
                            <NavLink onClick={handleMenuToggle} to="/workflow" className="flex items-center p-4 rounded-2xl bg-gray-50 dark:bg-[#0a0a0a] text-gray-800 dark:text-white font-bold">
                                <BsGraphUp size={24} className="mr-4" /> Workflow
                            </NavLink>
                            {/* ... more mobility links if needed */}
                        </div>
                        
                        <div className="mt-auto border-t border-gray-100 dark:border-[#1a1a1a] pt-6">
                            <div className="flex items-center mb-6">
                                <img src={`/Avatars/${user.avatar}.jpg`} alt="Profile" className="w-12 h-12 rounded-2xl object-cover" />
                                <div className="ml-4">
                                    <p className="font-bold text-gray-800 dark:text-white">{user.name}</p>
                                    <p className="text-sm text-gray-400">{user.email}</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleLogout}
                                className="w-full p-4 rounded-2xl bg-red-50 text-red-600 font-bold flex items-center justify-center animate-pulse-slow"
                            >
                                <RiLogoutBoxRLine size={24} className="mr-3" /> Log Out
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};
export default Navbar; 