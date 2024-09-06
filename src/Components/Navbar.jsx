import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { IoMenu, IoClose } from "react-icons/io5";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdOutlineFolderShared, } from 'react-icons/md';
import { motion, AnimatePresence } from "framer-motion";

import { MdList, MdOutlineDashboard, MdProductionQuantityLimits } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";

import { MdOutlineCategory } from "react-icons/md";
import { TbCategory } from "react-icons/tb";

import { FaBell, FaCubes } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";


import texleathlogo from "../texleathlogo.svg";
import { RxDashboard } from "react-icons/rx";
import { BsGraphUp } from "react-icons/bs";
import { GoPeople, GoProjectRoadmap } from "react-icons/go";
import { RiLogoutBoxRLine } from 'react-icons/ri';


const colors = [
    'bg-red-400', 'bg-blue-400', 'bg-green-700', 'bg-yellow-600', 'bg-indigo-400', 'bg-orange-400', 'bg-cyan-400', 'bg-violet-400'
];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];


const Navbar = () => {

    const [profile, setProfile] = useState(null);
    const [projectColors, setProjectColors] = useState({});
    const [projects, setProjects] = useState([]);


    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const [isArrowOpen, setisArrowOpen] = useState(true);
    const toggleOpen = () => setisArrowOpen(!isArrowOpen);


    const [isOrderArrowOpen, setisOrderArrowOpen] = useState(true);
    const toogleOrderOpen = () => setisOrderArrowOpen(!isOrderArrowOpen);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/profile`, config);
                setProfile(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchJoinedProjects = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/joinedprojects`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const fetchedProjects = response.data; // Assuming this is an array of project objects

                // Assign a random color to each project and store it in the projectColors state
                const colorMapping = {};
                fetchedProjects.forEach(project => {
                    colorMapping[project._id] = getRandomColor();
                });

                setProjects(fetchedProjects);
                setProjectColors(colorMapping);
            } catch (err) {
                console.error(err);
            }
        };

        fetchProfile();
        fetchJoinedProjects();
    }, []);


    const handleProjectClick = (projectId) => {
        navigate(`/joinedprojects/${projectId}`);
    };


    return (
        <nav className="xsx">
            {/* Navbar for larger screens */}

            <div className=" hidden bg-[#ffffff] fixed xsx:flex pl-[25px] xsx:flex-col xsx:justify-between shadow-xl rounded-lg xsx:items-center ml-[-20px] w-[280px] h-screen  p-[10px]">
                <div className="flex text-red-50 flex-col w-[95%]">

                    <div className="flex justify-between">
                        <div className="text-[22px] font-bold text-[#363636]">Collabora8r</div>
                        <FaBell className="mt-[10px] text-[#363636] text-[20px]" />
                    </div>

                    <div className="flex items-center px-[8px] py-[5px] mt-[15px] border-[2px] border-[#8c8c8c] rounded-lg">
                        <IoMdSearch className=" text-[#8c8c8c] text-[24px]" />
                        <div className="text-[15px] font-medium text-[#7f7f7f]">Search</div>
                    </div>

                    <div className='  mt-[15px] flex items-center justify-between'>
                        <p className="text-[#6a6a6a] font-bold ml-[5px]">Account</p>
                        <RiLogoutBoxRLine onClick={handleLogout} className='text-[22px] text-[#ff5555]' />
                    </div>

                    <NavLink to="/profile" className="flex items-center pl-[20px] py-[12px] mt-[8px] shadow-profile-navbar rounded-lg">
                        {loading || !profile?.avatar ? (
                            <p className='text-[#363636]'>Login To Continue</p>
                        ) : (
                            <img
                                src={`/Assets/${profile.avatar}.jpg`}
                                alt="Profile"
                                className="w-[25px] h-[25px] rounded-full"
                            />
                        )}
                        {loading || !profile?.name ? (
                            <p className='text-white'>L</p>
                        ) : (
                            <div className="text-[17px] ml-[10px] font-medium text-[#7f7f7f]">{profile.name}</div>
                        )} 
                    </NavLink>


                    <div className="border-t-2 mt-[20px] pl-[4px] pt-[15px] border-gray-300 ">

                        <NavLink to="/student-profile" className={({ isActive }) => `pl-[8px] flex font-[500] items-center py-[10px] rounded-md ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 hover:font-[600] hover:text-blue-700 text-[#474747]'}`} >
                            <RxDashboard className="text-[23px] mb-[3px] mr-[12px]" /><p className="mb-[2px] text-[15px]">Dashboard</p>
                        </NavLink>
                        <NavLink to="/student-profile" className={({ isActive }) => `pl-[8px] flex font-[500] items-center py-[10px] rounded-md ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 hover:font-[600] hover:text-blue-700 text-[#474747]'}`} >
                            <MdOutlineFolderShared className="text-[23px] mb-[3px] mr-[12px]" /><p className="mb-[2px] text-[15px]">Overview</p>
                        </NavLink>
                        <NavLink to="/student-profile" className={({ isActive }) => `pl-[8px] flex font-[500] items-center py-[10px] rounded-md ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 hover:font-[600] hover:text-blue-700 text-[#474747]'}`} >
                            <BsGraphUp className="text-[23px] mb-[3px] mr-[12px]" /><p className="mb-[2px] text-[15px]">Usage</p>
                        </NavLink>
                        <NavLink to="/joinedprojects/" className={({ isActive }) => `pl-[8px] flex font-[500] items-center py-[10px] rounded-md ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 hover:font-[600] hover:text-blue-700 text-[#474747]'}`} >
                            <FaCubes className="text-[23px] mb-[3px] mr-[12px]" /><p className="mb-[2px] text-[15px]">Snacks</p>
                        </NavLink>
                        <NavLink to="/associated-projects" className={({ isActive }) => `pl-[8px] flex font-[500] items-center py-[10px] rounded-md ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 hover:font-[600] hover:text-blue-700 text-[#474747]'}`} >
                            <GoPeople className="text-[23px] mb-[3px] mr-[12px]" /><p className="mb-[2px] text-[15px]">Associated Projects</p>
                        </NavLink>

                        <div className="pl-[8px]  my-[5px]">
                            <div className="text-lg text-[#363636] flex items-center justify-between cursor-pointer" onClick={toggleOpen}>
                                <div className="flex items-center">
                                    <GoProjectRoadmap className="text-[22px] mt-[4px] mr-[12px]" />
                                    <p className="font-[500] text-[16px]">Projects</p>
                                </div>
                                {isArrowOpen ? (
                                    <MdKeyboardArrowDown className="ml-2" />
                                ) : (
                                    <MdKeyboardArrowUp className="ml-2 text-xl font-bold" />
                                )}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: isArrowOpen ? 1 : 0, height: isArrowOpen ? 'auto' : 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className='flex flex-col pt-[15px] items-start text-[#363636]'>
                                    {projects.map((project) => (
                                        <div key={project._id} className='flex mb-[4px] py-[8px] hover:rounded-xl px-[4px] w-[calc(100%-28px)] border-b-[2px] border-[#cccccc] hover:border-white hover:bg-blue-100 ml-[28px]'>
                                            <div className={`w-[28px] h-[28px] text-[15px] text-center pt-[3px] text-white font-[700] rounded-full ${projectColors[project._id]}`}>
                                                {project.name.charAt(0)}
                                            </div>
                                            <button className='ml-[8px] font-[600]' onClick={() => handleProjectClick(project._id)}>
                                                {project.name}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>


                    </div>

                </div>
            </div>

            <div className="relative text-white xsx:hidden">
                <div className="flex items-center h-[70px] justify-between bg-gradient-to-r from-red-950 to-red-900 px-4 py-3 z-50 relative">
                    <div className="flex items-center">
                        <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: isMenuOpen ? 0 : 1 }}
                            transition={{ duration: 0.2 }} // Adjust duration as needed
                        >
                            <img src={texleathlogo} alt="TL" className="md:w-[45px] w-[33px] h-[33px] md:h-[45px]" />
                        </motion.div>
                        <motion.div
                            className="text-[28px] font-bold"
                            initial={{ x: 40 }}
                            animate={{ x: isMenuOpen ? -40 : 0 }}
                            transition={{ duration: 0.5 }} // Adjust duration as needed
                        >
                            <div className="flex">
                                <div className="text-red-700 ml-[4px] md:text-[25px] text-[19px] font-bold">TEXLEATH</div>
                                <div className="text-red-100 ml-[5px] md:text-[25px] text-[18px] font-bold">INDUSTRIES</div>
                            </div>
                        </motion.div>
                    </div>
                    <motion.div
                        key={isMenuOpen ? 'close' : 'menu'} // Unique key to trigger animation on change
                        initial={{ opacity: 0, rotate: isMenuOpen ? 180 : -180 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: isMenuOpen ? -180 : 180 }} // Animate out with reverse rotation
                        transition={{ duration: 0.3 }} // Duration for the animation
                        className="cursor-pointer text-gray-300"
                        onClick={handleMenuToggle}
                    >

                        {isMenuOpen ? (
                            <IoClose size={35} />
                        ) : (
                            <IoMenu size={35} />
                        )}
                    </motion.div>
                </div>

                {/* Full navbar for smaller screens */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "70vw", transition: { duration: 0.5 } }}
                            exit={{ width: 0, transition: { duration: 0.3, delay: 0.1 } }}
                            className="fixed inset-0 bg-navbar-color bg-gradient-to-r from-red-950 to-red-900 flex w-[70vw] flex-col h-screen px-[5px] py-3 z-30"

                        >
                            <div className='my-[25px]'></div>
                            {/* Menu items */}
                            <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.3 } }}
                                exit={{ x: -100, opacity: 0, transition: { duration: 0.2 } }}
                                className="flex flex-col mt-[25px]"
                            >
                                <NavLink to="/student-profile" className={({ isActive }) => `flex mt-[5px] mb-[7px] font-medium items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                                    <MdOutlineDashboard onClick={handleMenuToggle} className="text-[22px] mb-[3px] mr-[4px]" /><p className="mb-[2px] text-[18px]">Dashboard</p>
                                </NavLink>

                                <div className="w-[95%] rounded-lg mb-[15px] h-[2px] bg-red-50 mx-auto my-[5px]"></div>

                                <div className="my-[5px]">
                                    <div className="ml-[6px] text-lg flex items-center justify-between cursor-pointer" onClick={toggleOpen}>
                                        <span className="font-semibold">Ecommerce</span>
                                        {isArrowOpen ? (
                                            <MdKeyboardArrowUp className="ml-2 text-xl font-bold" />
                                        ) : (
                                            <MdKeyboardArrowDown className="ml-2" />
                                        )}
                                    </div>
                                    {isArrowOpen &&
                                        <div className="w-[95%] rounded-lg h-[1px] bg-red-50 mx-auto my-[5px]"></div>
                                    }
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: isArrowOpen ? 1 : 0, height: isArrowOpen ? 'auto' : 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <NavLink onClick={handleMenuToggle} to="/productList" className={({ isActive }) => `ml-[15px] py-[6px] mt-[8px] flex items-center ${isActive ? 'bg-red-50 text-red-800 font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-red-900 text-red-50'} text-sm rounded-md px-[8px] w-[90%] flex flex-row`}>
                                            <MdList className="text-[26px] mr-[4px]" /><p className="text-[16px] mb-[1px] font-medium">Products</p>
                                        </NavLink>
                                        <NavLink onClick={handleMenuToggle} to="/addProduct" className={({ isActive }) => `ml-[15px] py-[6px] my-[12px] flex items-center ${isActive ? 'bg-red-50 text-red-800 font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-red-900 text-red-50'} text-sm rounded-md px-[8px] w-[90%] flex flex-row`}>
                                            <MdProductionQuantityLimits className="text-[26px] mr-[6px]" /><p className="text-[16px] mb-[1px] font-medium">Add Products</p>
                                        </NavLink>
                                    </motion.div>
                                </div>


                                <div className="my-[5px]">
                                    <div className="ml-[6px] text-lg flex items-center justify-between cursor-pointer" onClick={toogleOrderOpen}>
                                        <span className="font-semibold">Orders</span>
                                        {isOrderArrowOpen ? (
                                            <MdKeyboardArrowUp className="ml-2 text-xl font-bold" />
                                        ) : (
                                            <MdKeyboardArrowDown className="ml-2" />
                                        )}
                                    </div>
                                    {isOrderArrowOpen &&
                                        <div className="w-[95%] rounded-lg h-[1px] bg-red-50 mx-auto my-[5px]"></div>
                                    }
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: isOrderArrowOpen ? 1 : 0, height: isOrderArrowOpen ? 'auto' : 0 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <NavLink onClick={handleMenuToggle} to="/order-tracking" className={({ isActive }) => `ml-[15px] py-[6px] mt-[8px] flex items-center ${isActive ? 'bg-red-50 text-red-800 font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-red-900 text-red-50'} text-sm rounded-md px-[8px] w-[90%] flex flex-row`}>
                                            <MdList className="text-[26px] mr-[4px]" /><p className="text-[16px] mb-[1px] font-medium">Order Tracking</p>
                                        </NavLink>
                                        <NavLink onClick={handleMenuToggle} to="/admin-orders-list" className={({ isActive }) => `ml-[15px] py-[6px] my-[12px] flex items-center ${isActive ? 'bg-red-50 text-red-800 font-bold' : 'hover:bg-red-50 hover:rounded-xl font-medium hover:text-red-900 text-red-50'} text-sm rounded-md px-[8px] w-[90%] flex flex-row`}>
                                            <MdProductionQuantityLimits className="text-[26px] mr-[6px]" /><p className="text-[16px] mb-[1px] font-medium">Orders List</p>
                                        </NavLink>
                                    </motion.div>
                                </div>

                                <div className="w-[95%] rounded-lg mt-[15px] h-[1.5px] bg-red-50 mx-auto my-[5px]"></div>
                                <NavLink onClick={handleMenuToggle} to="/categoryList" className={({ isActive }) => `flex mt-[10px] mb-[7px] font-medium items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                                    <TbCategory className="text-[22px] mb-[3px] mr-[4px]" /><p className="mb-[2px] text-[18px]">Categories</p>
                                </NavLink>
                                <NavLink onClick={handleMenuToggle} to="/subCategoryList" className={({ isActive }) => `flex font-medium items-center py-[3px] px-2 rounded-md ${isActive ? 'bg-red-50 text-red-800' : 'hover:bg-red-50 hover:rounded-2xl hover:text-red-900 text-red-50'}`} >
                                    <MdOutlineCategory className="text-[22px] mb-[3px] mr-[4px]" /><p className="mb-[2px] text-[18px]">Sub-Categories</p>
                                </NavLink>
                            </motion.div>


                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </nav>
    );
};

export default Navbar;
/*
import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

import { IoMenu, IoClose } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from "framer-motion";
import { selectCartLength } from "../redux/cartSlice";
import { MdShoppingCart } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { IoPersonCircleOutline } from "react-icons/io5";
import texleathlogo from "../texleathlogo.svg";
const Navbar = () => {

    const cartLength = useSelector(selectCartLength);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    const [openIndex, setOpenIndex] = useState(null);

    const handleToggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Use useCallback to memoize the fetchProfile function
    const fetchProfile = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.status === 200) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            setIsLoggedIn(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };
 

    // Change text index every 2 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }, 5000); // Change text every 2 seconds

        return () => clearInterval(interval);
    });

    return (
        <nav className="bg-gradient-to-r from-red-950 via-custom-red to-red-950 ">

            <div className="w-full xsx:flex hidden h-[55px] pt-[8px]  p-4 items-center justify-between z-50">
                <div>
                    <NavLink to="/register" className="text-gray-200  font-semibold cursor-pointer relative border-none bg-transparent transition-all duration-800 ease-[cubic-bezier(0.25,0.8,0.25,1)] focus:text-white hover:text-white after:content-[''] after:pointer-events-none after:absolute after:bottom-[-2px] after:left-1/2 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-400 after:ease-[cubic-bezier(0.25,0.8,0.25,1)] focus:after:w-full focus:after:left-0 hover:after:w-full hover:after:left-0 mt-[10px]" >
                        Register
                    </NavLink>
                    <NavLink to="/login" className="text-red-200 ml-[12px] font-bold cursor-pointer relative border-none bg-transparent transition-all duration-800 ease-[cubic-bezier(0.25,0.8,0.25,1)] focus:text-white hover:text-white after:content-[''] after:pointer-events-none after:absolute after:bottom-[-2px] after:left-1/2 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-400 after:ease-[cubic-bezier(0.25,0.8,0.25,1)] focus:after:w-full focus:after:left-0 hover:after:w-full hover:after:left-0 mt-[10px]" >
                        login
                    </NavLink>
                    <NavLink to="/profile" className="text-red-200 ml-[12px] font-bold cursor-pointer relative border-none bg-transparent transition-all duration-800 ease-[cubic-bezier(0.25,0.8,0.25,1)] focus:text-white hover:text-white after:content-[''] after:pointer-events-none after:absolute after:bottom-[-2px] after:left-1/2 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-400 after:ease-[cubic-bezier(0.25,0.8,0.25,1)] focus:after:w-full focus:after:left-0 hover:after:w-full hover:after:left-0 mt-[10px]" >
                        Profile
                    </NavLink>
                    <NavLink to="/createproject" className="text-red-200 ml-[12px] font-bold cursor-pointer relative border-none bg-transparent transition-all duration-800 ease-[cubic-bezier(0.25,0.8,0.25,1)] focus:text-white hover:text-white after:content-[''] after:pointer-events-none after:absolute after:bottom-[-2px] after:left-1/2 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-400 after:ease-[cubic-bezier(0.25,0.8,0.25,1)] focus:after:w-full focus:after:left-0 hover:after:w-full hover:after:left-0 mt-[10px]" >
                        Create project
                    </NavLink>
                    <NavLink to="/projects" className="text-red-200 ml-[12px] font-bold cursor-pointer relative border-none bg-transparent transition-all duration-800 ease-[cubic-bezier(0.25,0.8,0.25,1)] focus:text-white hover:text-white after:content-[''] after:pointer-events-none after:absolute after:bottom-[-2px] after:left-1/2 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-400 after:ease-[cubic-bezier(0.25,0.8,0.25,1)] focus:after:w-full focus:after:left-0 hover:after:w-full hover:after:left-0 mt-[10px]" >
                        Admin ProjectList
                    </NavLink>
                    
                    <NavLink to="/joinedprojects" className="text-red-200 ml-[12px] font-bold cursor-pointer relative border-none bg-transparent transition-all duration-800 ease-[cubic-bezier(0.25,0.8,0.25,1)] focus:text-white hover:text-white after:content-[''] after:pointer-events-none after:absolute after:bottom-[-2px] after:left-1/2 after:w-0 after:h-[2px] after:bg-white after:transition-all after:duration-400 after:ease-[cubic-bezier(0.25,0.8,0.25,1)] focus:after:w-full focus:after:left-0 hover:after:w-full hover:after:left-0 mt-[10px]" >
                        Joined ProjectList
                    </NavLink>
                </div>


            </div>


            <div className="relative text-white xsx:hidden">
                <div className="flex items-center h-[70px] justify-between bg-gradient-to-r from-red-950 via-custom-red to-red-950 px-4 py-3 z-50 relative">
                    <div className="flex items-center">
                        <motion.div
                            initial={{ opacity: 1 }}
                            animate={{ opacity: isMenuOpen ? 0 : 1 }}
                            transition={{ duration: 0.2 }} // Adjust duration as needed
                        >
                            <img src={texleathlogo} alt="TL" className="md:w-[45px] w-[33px] h-[33px] md:h-[45px]" />
                        </motion.div>
                        <motion.div
                            className="text-[28px] font-bold"
                            initial={{ x: 40 }}
                            animate={{ x: isMenuOpen ? -40 : 0 }}
                            transition={{ duration: 0.5 }} // Adjust duration as needed
                        >
                            <div className="flex">
                                <div className="text-red-700 ml-[4px] md:text-[25px] text-[19px] font-bold">TEXLEATH</div>
                                <div className="text-red-100 ml-[5px] md:text-[25px] text-[18px] font-bold">INDUSTRIES</div>
                            </div>
                        </motion.div>
                    </div>
                    <div className="flex">
                        {isLoggedIn &&
                            <>
                                <NavLink to="/cart"><MdShoppingCart className="text-white hover:scale-110 hover:text-red-500 mt-[5px] text-[28px]" /></NavLink>
                                <p className=" text-md w-[23px] h-[23px] bg-white text-red-700 rounded-full text-center font-extrabold mr-[5px]">{cartLength}</p>
                            </>
                        }
                        <motion.div
                            key={isMenuOpen ? 'close' : 'menu'} // Unique key to trigger animation on change
                            initial={{ opacity: 0, rotate: isMenuOpen ? 180 : -180 }}
                            animate={{ opacity: 1, rotate: 0 }}
                            exit={{ opacity: 0, rotate: isMenuOpen ? -180 : 180 }} // Animate out with reverse rotation
                            transition={{ duration: 0.3 }} // Duration for the animation
                            className="cursor-pointer text-gray-300"
                            onClick={handleMenuToggle}
                        >
                            {isMenuOpen ? (
                                <IoClose size={35} />
                            ) : (
                                <IoMenu size={35} />
                            )}
                        </motion.div>
                    </div>
                </div> 
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "70vw", transition: { duration: 0.5 } }}
                            exit={{ width: 0, transition: { duration: 0.3, delay: 0.1 } }}
                            className="fixed inset-0 bg-navbar-color bg-gradient-to-r from-red-950 to-custom-red flex w-[70vw] flex-col h-screen px-4 py-3 z-30"
                        >
                            <div className='my-[25px]'></div> 
                            <motion.div
                                initial={{ x: -100, opacity: 0 }}
                                animate={{ x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.3 } }}
                                exit={{ x: -100, opacity: 0, transition: { duration: 0.2 } }}
                                className="flex flex-col mt-[50px]"
                            >
                                <NavLink to="/" onClick={handleMenuToggle} className="text-white mb-[12px] text-md text-xl  mr-[15px]"> Home</NavLink>
                                <NavLink to="/productlist/All" onClick={handleMenuToggle} className="text-white  mb-[12px] text-md text-lg mr-[15px]"> Catalog</NavLink>

                                <div key={index} className='mb-4'>
                                    <button
                                        className="text-white text-md text-xl flex items-center w-full justify-between mr-[15px]"
                                        onClick={() => handleToggle(index)}
                                        type='button'
                                    >
                                        <span>Categories</span>
                                        <motion.div
                                            initial={{ rotate: 0 }}
                                            animate={{ rotate: openIndex === index ? 360 : 0 }}
                                            transition={{ duration: 0.5 }}
                                            className='text-red-50 text-xl mt'
                                        >
                                            {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                                        </motion.div>
                                    </button>
                                    <AnimatePresence>
                                        {openIndex === index && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className='mt-2 text-white flex flex-col my-[15px] space-y-3 px-4'
                                            >
                                                <div className="w-[50%] bg-red-100 h-[2px] rounded-2xl mt-[8px]"></div>
                                                <NavLink onClick={handleMenuToggle} to="/productlist/Active%20Wear">Active Wear</NavLink>
                                                <NavLink onClick={handleMenuToggle} to="/productlist/Sports%20Wear">Sports Wear</NavLink>
                                                <NavLink onClick={handleMenuToggle} to="/productlist/Fitness%20Wear">Fitness Wear</NavLink>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <div className="h-[2px] w-[85%] bg-red-50 mt-[-5px]"></div>

                                <NavLink to="/about" onClick={handleMenuToggle} className="text-white text-md mt-[15px] text-lg mr-[15px]"> About Us</NavLink>
                                <div className="my-[5px] "></div>
                                <NavLink to="/faqs" onClick={handleMenuToggle} className="text-white text-md text-lg mr-[15px]"> FAQ's</NavLink>
                                <div className="my-[5px] "></div>
                                <NavLink to="/customerSupport" onClick={handleMenuToggle} className="text-white text-md text-lg mr-[15px]">Customer Support</NavLink>
                                <div className="my-[5px] "></div>
                                <NavLink to="/privacyPolicy" onClick={handleMenuToggle} className="text-white text-md text-lg mr-[15px]">Privacy Policy</NavLink>
                                <div className="my-[5px] "></div>
                                <NavLink to="/termsOfService" onClick={handleMenuToggle} className="text-white text-md text-lg mr-[15px]">Terms Of Service</NavLink>
                                <div className="my-[5px] "></div>

                                <div className="h-[2px] w-[85%] bg-red-50  my-[8px]"></div>

                                {isLoggedIn ? (
                                    <div className="flex">
                                        <NavLink onClick={handleMenuToggle} to="/profile" className="flex items-center mt-[7px]"><IoPersonCircleOutline className="text-red-100 hover:text-red-600 text-[45px]" /><span className="font-medium underline ml-[2px] text-xl text-white">My Profile</span></NavLink>
                                    </div>
                                ) : (
                                    <>
                                        <NavLink to="/register" onClick={handleMenuToggle} className="text-white mt-[15px] text-md w-[130px] text-center py-[3px] hover:bg-red-950 bg-red-900 border border-white px-[8px] rounded-lg mr-[15px]">
                                            Start Shopping
                                        </NavLink>
                                        <NavLink to="/register" onClick={handleMenuToggle} className="text-white mt-[15px] text-md w-[130px] text-center py-[3px] hover:bg-red-950 bg-red-900 border border-white px-[8px] rounded-lg mr-[15px]">
                                            Start Shopping
                                        </NavLink>
                                    </>
                                )}
 

                            </motion.div>


                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </nav>
    );
};

export default Navbar;
*/
