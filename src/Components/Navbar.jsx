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


    // Text Fade animation  
    const texts = ["HURRY UP SHOW NOW !!", "FREE DELIVERY ON USD 200 AND ABOVE IN USA", "Buy Any 3 Products and Get "];
    const [index, setIndex] = useState(0);

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

                {/* Full navbar for smaller screens */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "70vw", transition: { duration: 0.5 } }}
                            exit={{ width: 0, transition: { duration: 0.3, delay: 0.1 } }}
                            className="fixed inset-0 bg-navbar-color bg-gradient-to-r from-red-950 to-custom-red flex w-[70vw] flex-col h-screen px-4 py-3 z-30"
                        >
                            <div className='my-[25px]'></div>
                            {/* Menu items */}
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

                                {/*                           
                                <NavLink to="/login" className="text-white text-md text- mr-[15px]">Login</NavLink>
                                <NavLink to="/register" className="text-white text-md text-lg mr-[15px]">Register</NavLink>
                                <NavLink to="/profile" className="text-white text-md text-lg mr-[15px]">Profile</NavLink> 
                                */}

                            </motion.div>


                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </nav>
    );
};

export default Navbar;
